import { useMemo, useState } from 'react';
import {
  BedDouble,
  CalendarDays,
  Car,
  Clock,
  Compass,
  Copy,
  Landmark,
  MapPin,
  Mountain,
  Music,
  Sparkles,
  Star,
  Sun,
  Ticket,
  Users,
  UtensilsCrossed,
  Wallet,
  Waves,
  Shuffle,
  Check,
} from 'lucide-react';
import {
  BUDGET_LABELS,
  DESTINATIONS,
  GROUP_SIZE,
  INTEREST_LABELS,
  PACE_LABELS,
  type BudgetTier,
  type Group,
  type Interest,
  type Pace,
} from './data/destinations';
import { formatINR, generateItinerary } from './lib/planner';

const INTEREST_ICONS: Record<Interest, typeof Landmark> = {
  heritage: Landmark,
  nature: Mountain,
  beaches: Waves,
  adventure: Compass,
  wildlife: Sun,
  food: UtensilsCrossed,
  spiritual: Star,
  city: Music,
};

const GROUP_LABELS: Record<Group, string> = {
  solo: 'Solo',
  couple: 'Couple',
  family: 'Family',
  friends: 'Friends',
};

export default function App() {
  const [interests, setInterests] = useState<Interest[]>(['heritage', 'nature']);
  const [days, setDays] = useState(4);
  const [budget, setBudget] = useState<BudgetTier>('moderate');
  const [pace, setPace] = useState<Pace>('balanced');
  const [group, setGroup] = useState<Group>('couple');
  const [seed, setSeed] = useState(1);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<Interest | 'all'>('all');

  const itinerary = useMemo(
    () =>
      generateItinerary({ interests, days, budget, pace, group, seed }),
    [interests, days, budget, pace, group, seed],
  );

  const toggleInterest = (tag: Interest) =>
    setInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  const planText = useMemo(() => {
    const lines = [
      `Karnataka trip — ${days} days, ${BUDGET_LABELS[budget]}, ${PACE_LABELS[pace].toLowerCase()} pace`,
      `Stops: ${itinerary.stops.map((s) => `${s.destination.name} (${s.days}d)`).join(' → ')}`,
      `Estimated total: ${formatINR(itinerary.cost.total)} for ${GROUP_SIZE[group]} traveller(s)`,
      '',
      ...itinerary.dayPlans.map(
        (d) =>
          `Day ${d.day} — ${d.destination.name}: Morning: ${d.morning}; Afternoon: ${d.afternoon}; Evening: ${d.evening}.`,
      ),
    ];
    return lines.join('\n');
  }, [itinerary, days, budget, pace, group]);

  const copyPlan = async () => {
    try {
      await navigator.clipboard.writeText(planText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const filteredDestinations =
    filter === 'all'
      ? DESTINATIONS
      : DESTINATIONS.filter((d) => d.tags.includes(filter));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-[#faf7f2]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#top" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white">
              <Compass size={20} />
            </span>
            <span className="text-lg font-bold tracking-tight">
              Karnataka Yatra <span className="text-orange-600">AI</span>
            </span>
          </a>
          <nav className="hidden gap-6 text-sm font-medium text-stone-600 sm:flex">
            <a href="#planner" className="hover:text-orange-600">Planner</a>
            <a href="#destinations" className="hover:text-orange-600">Destinations</a>
            <a href="#how" className="hover:text-orange-600">How it works</a>
          </nav>
          <a
            href="#planner"
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Plan my trip
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="mx-auto max-w-6xl px-4 pt-12 pb-10 sm:pt-16">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold tracking-wide text-orange-700 uppercase">
          <Sparkles size={14} /> AI Travel Planner for Karnataka
        </p>
        <h1 className="max-w-3xl text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
          Your Karnataka trip, planned around{' '}
          <span className="text-orange-600">what you love.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-stone-600">
          Pick your interests, days and budget — the planner scores 16
          destinations, clusters nearby places into a sensible route, and builds
          a day-by-day itinerary with an honest cost estimate.
        </p>
        <div className="mt-6 flex flex-wrap gap-6 text-sm text-stone-600">
          <span className="flex items-center gap-2">
            <MapPin size={16} className="text-orange-600" /> 16 destinations
          </span>
          <span className="flex items-center gap-2">
            <CalendarDays size={16} className="text-orange-600" /> 1–7 day trips
          </span>
          <span className="flex items-center gap-2">
            <Wallet size={16} className="text-orange-600" /> Budget to luxury
          </span>
        </div>
      </section>

      {/* Planner */}
      <section id="planner" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-14">
        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-2xl font-bold">Build your itinerary</h2>
          <p className="mt-1 text-sm text-stone-500">
            Everything runs instantly in your browser — no sign-up, no waiting.
          </p>

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold">What do you love?</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(INTEREST_LABELS) as Interest[]).map((tag) => {
                const Icon = INTEREST_ICONS[tag];
                const active = interests.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleInterest(tag)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                      active
                        ? 'border-orange-600 bg-orange-600 text-white'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-orange-400'
                    }`}
                  >
                    <Icon size={15} /> {INTEREST_LABELS[tag]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <CalendarDays size={15} /> Trip length: {days} days
              </label>
              <input
                type="range"
                min={2}
                max={7}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-orange-600"
              />
              <div className="flex justify-between text-xs text-stone-500">
                <span>2 days</span>
                <span>7 days</span>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Budget</p>
              <div className="flex gap-1 rounded-full bg-stone-100 p-1">
                {(Object.keys(BUDGET_LABELS) as BudgetTier[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setBudget(t)}
                    className={`flex-1 rounded-full px-2 py-1.5 text-xs font-semibold ${
                      budget === t ? 'bg-stone-900 text-white' : 'text-stone-600'
                    }`}
                  >
                    {BUDGET_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Pace</p>
              <div className="flex gap-1 rounded-full bg-stone-100 p-1">
                {(Object.keys(PACE_LABELS) as Pace[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPace(p)}
                    className={`flex-1 rounded-full px-2 py-1.5 text-xs font-semibold ${
                      pace === p ? 'bg-stone-900 text-white' : 'text-stone-600'
                    }`}
                  >
                    {PACE_LABELS[p]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Users size={15} /> Travelling as
              </p>
              <div className="flex gap-1 rounded-full bg-stone-100 p-1">
                {(Object.keys(GROUP_LABELS) as Group[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGroup(g)}
                    className={`flex-1 rounded-full px-2 py-1.5 text-xs font-semibold ${
                      group === g ? 'bg-stone-900 text-white' : 'text-stone-600'
                    }`}
                  >
                    {GROUP_LABELS[g]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setGenerated(true)}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 px-6 py-3.5 text-base font-bold text-white hover:bg-orange-700 sm:w-auto"
          >
            <Sparkles size={18} /> Generate my itinerary
          </button>

          {generated && (
            <div className="mt-8 border-t border-stone-200 pt-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">Your {days}-day Karnataka plan</h3>
                  <p className="mt-1 text-sm text-stone-500">
                    {itinerary.matchScore}% match with your interests ·{' '}
                    {itinerary.stops.map((s) => s.destination.name).join(' → ')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSeed((s) => s + 1)}
                    className="flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold hover:border-orange-400"
                  >
                    <Shuffle size={15} /> Regenerate
                  </button>
                  <button
                    onClick={copyPlan}
                    className="flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white"
                  >
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                    {copied ? 'Copied!' : 'Copy plan'}
                  </button>
                </div>
              </div>

              {/* Cost strip */}
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                <div className="rounded-2xl bg-orange-50 p-4">
                  <p className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase">
                    <Wallet size={14} /> Estimated total
                  </p>
                  <p className="mt-1 text-2xl font-extrabold">
                    {formatINR(itinerary.cost.total)}
                  </p>
                  <p className="text-xs text-stone-500">
                    for {GROUP_SIZE[group]} traveller(s) · indicative
                  </p>
                </div>
                {[
                  { icon: BedDouble, label: 'Stay', value: itinerary.cost.stay },
                  { icon: UtensilsCrossed, label: 'Food', value: itinerary.cost.food },
                  { icon: Car, label: 'Transport', value: itinerary.cost.transport },
                  { icon: Ticket, label: 'Activities', value: itinerary.cost.activities },
                ].map((row) => (
                  <div key={row.label} className="rounded-2xl bg-stone-50 p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase">
                      <row.icon size={14} /> {row.label}
                    </p>
                    <p className="mt-1 text-xl font-bold">{formatINR(row.value)}</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-200">
                      <div
                        className="h-full bg-orange-500"
                        style={{
                          width: `${Math.max(4, (row.value / itinerary.cost.total) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Day timeline */}
              <ol className="mt-7 space-y-4">
                {itinerary.dayPlans.map((d) => (
                  <li key={d.day} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">
                        {d.day}
                      </span>
                      <span className="w-px flex-1 bg-stone-200" />
                    </div>
                    <div className="flex-1 rounded-2xl border border-stone-200 p-4">
                      <p className="font-bold">
                        Day {d.day} · {d.destination.name}
                        <span className="ml-2 text-xs font-medium text-stone-500">
                          {d.destination.region} · best {d.destination.bestTime}
                        </span>
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-stone-600">
                        <li className="flex gap-2">
                          <Sun size={15} className="mt-0.5 shrink-0 text-amber-500" />
                          <span><b>Morning:</b> {d.morning}</span>
                        </li>
                        <li className="flex gap-2">
                          <Clock size={15} className="mt-0.5 shrink-0 text-sky-600" />
                          <span><b>Afternoon:</b> {d.afternoon}</span>
                        </li>
                        <li className="flex gap-2">
                          <Star size={15} className="mt-0.5 shrink-0 text-violet-600" />
                          <span><b>Evening:</b> {d.evening}</span>
                        </li>
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>

              {itinerary.tips.length > 0 && (
                <div className="mt-6 rounded-2xl bg-amber-50 p-4">
                  <p className="text-sm font-bold">Smart tips for this route</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-600">
                    {itinerary.tips.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Destinations */}
      <section id="destinations" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-14">
        <h2 className="text-2xl font-bold">Explore Karnataka</h2>
        <p className="mt-1 text-sm text-stone-500">
          Every place the planner can route you through, with honest per-day costs.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              filter === 'all'
                ? 'border-stone-900 bg-stone-900 text-white'
                : 'border-stone-300 bg-white'
            }`}
          >
            All
          </button>
          {(Object.keys(INTEREST_LABELS) as Interest[]).map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                filter === tag
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-300 bg-white'
              }`}
            >
              {INTEREST_LABELS[tag]}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDestinations.map((d) => (
            <article
              key={d.id}
              className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"
            >
              <div className={`bg-gradient-to-br ${d.gradient} px-5 py-6 text-white`}>
                <p className="text-xs font-bold tracking-wide uppercase opacity-80">
                  {d.region}
                </p>
                <h3 className="mt-1 text-2xl font-extrabold">{d.name}</h3>
                <p className="mt-1 text-sm opacity-90">{d.tagline}</p>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-1.5">
                  {d.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700"
                    >
                      {INTEREST_LABELS[t]}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-stone-600">
                  <span className="flex items-center gap-1.5">
                    <Star size={15} className="text-amber-500" /> {d.rating.toFixed(1)}
                  </span>
                  <span>{d.days} day{d.days > 1 ? 's' : ''} recommended</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-stone-600">
                  <span>Best: {d.bestTime}</span>
                  <span className="font-semibold text-stone-900">
                    from {formatINR(d.costPerDay.moderate)}/day
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16">
        <h2 className="text-2xl font-bold">How the planner thinks</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: '1. You tell it what you love',
              text: 'Interests, trip length, budget tier, pace and group size become the constraints for the plan.',
            },
            {
              title: '2. It scores and routes',
              text: 'Each destination is scored on interest match and rating, then clustered by region so the route is geographically sensible instead of zig-zagging across the state.',
            },
            {
              title: '3. You get a day-wise plan',
              text: 'Days are split across stops with morning, afternoon and evening activities, plus a cost breakdown split into stay, food, transport and activities.',
            },
          ].map((step) => (
            <div key={step.title} className="rounded-3xl border border-stone-200 bg-white p-5">
              <h3 className="font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-stone-600">{step.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-stone-400">
          Costs are indicative estimates for planning, not live prices. Verify
          safari, stay and transport bookings before you travel.
        </p>
      </section>

      <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
        Karnataka Yatra AI — built for the Travel & Tourism hackathon track.
      </footer>
    </div>
  );
}
