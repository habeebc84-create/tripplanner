import {
  DESTINATIONS,
  GROUP_SIZE,
  type BudgetTier,
  type Destination,
  type Group,
  type Interest,
  type Pace,
} from '../data/destinations';

export interface PlannerInput {
  interests: Interest[];
  days: number;
  budget: BudgetTier;
  pace: Pace;
  group: Group;
  /** A small seed so "Regenerate" produces a different-but-valid plan. */
  seed: number;
  /** City the trip starts from (default Bengaluru). */
  startCity: string;
  /** Destination that must appear in the plan (from "Plan around this place"). */
  pinned?: Destination;
}

export interface DayPlan {
  day: number;
  destination: Destination;
  morning: string;
  afternoon: string;
  evening: string;
  /** Where the day starts travelling from (null when staying in place). */
  travelFrom: string | null;
  /** Known road distance in km for the Bengaluru first leg (null otherwise). */
  travelKm: number | null;
  /** Indicative cost for this day, for the whole group. */
  dayCost: number;
}

export interface CostBreakdown {
  stay: number;
  food: number;
  transport: number;
  activities: number;
  total: number;
}

export interface Itinerary {
  stops: { destination: Destination; days: number }[];
  dayPlans: DayPlan[];
  cost: CostBreakdown;
  matchScore: number;
  tips: string[];
}

const PACE_SLOTS: Record<Pace, number> = {
  relaxed: 2,
  balanced: 3,
  packed: 4,
};

function scoreDestination(
  d: Destination,
  interests: Interest[],
  pickedRegions: Set<string>,
  seed: number,
): number {
  let score = d.rating;
  for (const tag of d.tags) {
    if (interests.includes(tag)) score += 3;
  }
  // Prefer clustering nearby places so the trip is not a zig-zag across the state.
  if (pickedRegions.has(d.region)) score += 2;
  // A tiny deterministic nudge so regenerating shuffles close calls.
  score += ((d.id.length * 7 + seed) % 10) / 50;
  return score;
}

const GENERIC_EVENINGS = [
  'Local market stroll and street-food dinner',
  'Sunset viewpoint and café stop',
  'Evening walk through the old town',
  'Homestay dinner and local stories',
];

function buildDayPlans(
  stops: { destination: Destination; days: number }[],
  pace: Pace,
  budget: BudgetTier,
  travellers: number,
  startCity: string,
  transportPerDay: number,
): DayPlan[] {
  const plans: DayPlan[] = [];
  let day = 1;
  const slots = PACE_SLOTS[pace];
  for (let si = 0; si < stops.length; si++) {
    const stop = stops[si];
    const highlights = [...stop.destination.highlights];
    for (let i = 0; i < stop.days; i++) {
      const morning = highlights.shift() ?? `Slow morning in ${stop.destination.name}`;
      const afternoon =
        highlights.shift() ?? `Explore ${stop.destination.name} at your own pace`;
      const evening =
        slots >= 3
          ? (highlights.shift() ??
            GENERIC_EVENINGS[(day + stop.destination.id.length) % GENERIC_EVENINGS.length])
          : GENERIC_EVENINGS[(day + stop.destination.id.length) % GENERIC_EVENINGS.length];
      // Pin-to-pin leg: only the first day of a stop involves travel.
      const travelFrom =
        i === 0 ? (si === 0 ? startCity : stops[si - 1].destination.name) : null;
      const travelKm =
        i === 0 && si === 0 && startCity === 'Bengaluru'
          ? stop.destination.distanceFromBengaluruKm
          : null;
      plans.push({
        day: day++,
        destination: stop.destination,
        morning,
        afternoon,
        evening,
        travelFrom,
        travelKm,
        // Consistent with the dashboard breakdown: 85% of the daily rate
        // (stay+food+activities) plus this day's share of transport, so the
        // day costs reconcile with the estimated total (within rounding).
        dayCost: Math.round(
          stop.destination.costPerDay[budget] * 0.85 * travellers + transportPerDay,
        ),
      });
    }
  }
  return plans;
}

export function generateItinerary(input: PlannerInput): Itinerary {
  const { interests, days, budget, pace, group, seed, startCity, pinned } = input;
  const travellers = GROUP_SIZE[group];

  // Rank destinations by interest match, then greedily fill the day budget,
  // favouring places in regions already on the route.
  const ranked = [...DESTINATIONS].sort(
    (a, b) =>
      scoreDestination(b, interests, new Set(), seed) -
      scoreDestination(a, interests, new Set(), seed),
  );

  const stops: { destination: Destination; days: number }[] = [];
  const pickedRegions = new Set<string>();
  let remaining = days;

  // A pinned place is guaranteed first, so "Plan around this place" can
  // never silently drop the place the traveller asked for.
  if (pinned) {
    const useDays = Math.min(pinned.days, remaining);
    stops.push({ destination: pinned, days: useDays });
    pickedRegions.add(pinned.region);
    remaining -= useDays;
  }

  // Re-rank on the fly so region clustering actually applies.
  const pool = ranked.filter((d) => d.id !== pinned?.id);
  while (remaining > 0 && pool.length > 0) {
    pool.sort(
      (a, b) =>
        scoreDestination(b, interests, pickedRegions, seed) -
        scoreDestination(a, interests, pickedRegions, seed),
    );
    const pick = pool.shift()!;
    const useDays = Math.min(pick.days, remaining);
    stops.push({ destination: pick, days: useDays });
    pickedRegions.add(pick.region);
    remaining -= useDays;
  }

  // Cost model (indicative, per person): stay ~45%, food ~25%, activities ~15%,
  // plus intercity transport hops between stops. The breakdown is the source
  // of truth; day costs are derived from it so everything adds up.
  let stay = 0;
  let food = 0;
  let activities = 0;
  for (const stop of stops) {
    const perDay = stop.destination.costPerDay[budget];
    stay += perDay * 0.45 * stop.days;
    food += perDay * 0.25 * stop.days;
    activities += perDay * 0.15 * stop.days;
  }
  const hops = Math.max(stops.length - 1, 0);
  const transportPerPerson =
    budget === 'luxury' ? 2200 : budget === 'moderate' ? 1300 : 800;
  const transport = (hops + 1) * transportPerPerson;
  const stayTotal = Math.round(stay * travellers);
  const foodTotal = Math.round(food * travellers);
  const transportTotal = Math.round(transport * travellers);
  const activitiesTotal = Math.round(activities * travellers);
  const cost: CostBreakdown = {
    stay: stayTotal,
    food: foodTotal,
    transport: transportTotal,
    activities: activitiesTotal,
    // Kept as the sum of the parts so the breakdown always adds up.
    total: stayTotal + foodTotal + transportTotal + activitiesTotal,
  };

  const totalDays = stops.reduce((sum, s) => sum + s.days, 0) || 1;
  const dayPlans = buildDayPlans(
    stops,
    pace,
    budget,
    travellers,
    startCity,
    transportTotal / totalDays,
  );

  const matchedTags = new Set<string>();
  for (const stop of stops) {
    for (const tag of stop.destination.tags) {
      if (interests.includes(tag)) matchedTags.add(tag);
    }
  }
  const matchScore =
    interests.length === 0
      ? 82
      : Math.round((matchedTags.size / interests.length) * 100);

  const tips: string[] = [];
  if (stops.some((s) => s.destination.region === 'Coast')) {
    tips.push('Carry light rain gear on the coast — showers can arrive unannounced.');
  }
  if (stops.some((s) => s.destination.tags.includes('wildlife'))) {
    tips.push('Book safaris weeks ahead; morning slots fill first in peak season.');
  }
  if (budget === 'budget') {
    tips.push('KSRTC buses and homestays keep this plan inside a budget tier.');
  }
  if (pace === 'packed') {
    tips.push('Packed pace means early starts — keep one evening free for rest.');
  }
  if (stops.some((s) => s.destination.tags.includes('heritage'))) {
    tips.push('Hire a local guide at heritage sites; the carvings tell better stories that way.');
  }

  return { stops, dayPlans, cost: { ...cost, total: cost.total }, matchScore, tips };
}

export function formatINR(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}
