# Karnataka Yatra AI — AI Travel Planner for Karnataka

An AI-powered travel planner that creates **personalized Karnataka itineraries**
based on a traveller's **interests, available time, budget, and preferred type
of experience**.

Built for the **Travel & Tourism** hackathon track.

## What it does

- **Smart planner** — pick interests (heritage, nature, beaches, adventure,
  wildlife, food, spiritual, city life), trip length (2–7 days), budget tier
  (budget / moderate / luxury), pace (relaxed / balanced / packed) and group
  type (solo / couple / family / friends).
- **Scoring + routing engine** (`src/lib/planner.ts`) — every destination is
  scored on interest match and rating, then clustered by region so the route is
  geographically sensible instead of zig-zagging across the state. Days are
  filled greedily to match the trip length.
- **Day-by-day itinerary** — morning / afternoon / evening activities for
  every day, drawn from each place's real highlights.
- **Honest cost estimate** — total split into stay, food, transport and
  activities, scaled by budget tier and group size.
- **Regenerate + copy** — reshuffle close calls for a fresh plan, or copy the
  whole plan as text to share.
- **Destination explorer** — 34 famous places across Karnataka (Mysuru, Hampi, Coorg, Gokarna,
  Chikmagalur, Badami, Udupi, Kabini, Jog Falls, Dandeli, Murudeshwar,
  Belur–Halebidu, Bandipur, Vijayapura, Sakleshpur, Bengaluru, Shravanabelagola,
  Srirangapatna, Nandi Hills, Chitradurga, Bidar, Sringeri, Dharmasthala, Karwar and more) with tags,
  best season and per-day costs, filterable by interest. Tap any place for full details — what to do,
  how to reach, and tips — or plan a trip around it.

## How the "AI" works

There is no API key and no server: the planning engine runs entirely in the
browser. It is a transparent, deterministic recommendation system — weighted
interest scoring, region clustering to minimise travel, day-budget filling and
a tiered cost model — so every plan is explainable and reproducible. That
keeps the demo fast, free and fully offline-capable.

## Run it locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

The app is a static Vite build (`dist/`), so it deploys in one click on
[Vercel](https://vercel.com/new) (import this repo, framework preset: Vite)
or Netlify. No environment variables needed.

## Tech

React 19 · Vite · TypeScript · Tailwind CSS 4 · lucide-react

## Disclaimer

Costs are indicative planning estimates, not live prices. Verify safari,
stay and transport bookings before travelling.
