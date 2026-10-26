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
}

export interface DayPlan {
  day: number;
  destination: Destination;
  morning: string;
  afternoon: string;
  evening: string;
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
): DayPlan[] {
  const plans: DayPlan[] = [];
  let day = 1;
  const slots = PACE_SLOTS[pace];
  for (const stop of stops) {
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
      plans.push({ day: day++, destination: stop.destination, morning, afternoon, evening });
    }
  }
  return plans;
}

export function generateItinerary(input: PlannerInput): Itinerary {
  const { interests, days, budget, pace, group, seed } = input;
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

  // Re-rank on the fly so region clustering actually applies.
  const pool = [...ranked];
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

  const dayPlans = buildDayPlans(stops, pace);

  // Cost model (indicative, per person): stay ~45%, food ~25%, activities ~15%,
  // plus intercity transport hops between stops.
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
