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
- **Pin-to-pin day plans** — every day shows where to go, how you get there
  (Bengaluru first leg with distance, then stop-to-stop legs), what to do
  morning/afternoon/evening, that day's cost, and where to stay.
- **Export PDF** — download a formatted PDF of the whole itinerary
  (English; amounts shown as Rs. for font compatibility).
- **About section** — what the planner is, its coverage (34 destinations,
  5 regions, 3 languages), and its no-sign-up, on-device privacy promise.
- **Google Maps everywhere** — every place opens in Google Maps, every travel
  leg in the day plan links to turn-by-turn directions, and every place links
  to live hotel search on Google.
- **Budget-based stays** — each place shows a stay budget per person per
  night for the trip's own budget tier. Prices and availability open live on
  Google: the planner never invents hotel names or rates.
- **Starting city** — trips no longer assume Bengaluru; pick Bengaluru,
  Mysuru, Mangaluru, Hubballi or Belagavi and the first travel leg follows it.
- **Pinned places guaranteed** — "Plan a trip around this place" now pins
  that place into the plan, so it can never be silently dropped.
- **Honest costs** — day costs are derived from the same breakdown as the
  dashboard total, so they reconcile (within rounding) instead of disagreeing.
- **Bengaluru deep dive** — 31 famous city places (Lalbagh, Cubbon Park,
  Bangalore Palace, Vidhana Soudha, ISKCON, Bannerghatta, Bull Temple,
  Madivala Lake, Sankey Tank, Hebbal Lake, Turahalli Forest, Big Banyan Tree,
  Gavi Gangadhareshwara, Banashankari, Government Museum, HAL Aerospace
  Museum, Chitrakala Parishath, Rangoli Metro Art Center, Brigade Road,
  MG Road, Church Street, Phoenix Marketcity, Orion Mall, Innovative Film
  City, Snow City, Fun World, Chinnaswamy Stadium and more), filterable by
  category, with a live Google map view.
- **How to get there, honestly** — each place names its metro station or bus
  corridor where that is well established, and links to live Google Maps
  transit directions from Majestic, which show the real, current bus numbers
  and train times. Printed bus numbers go stale fast, so the app never prints
  ones it cannot stand behind.
- **Real photos** — the Home hero opens with a Bangalore Palace photo, and
  the Bengaluru section has a photo strip plus card photos for 10 famous
  places (Palace, Lalbagh, Cubbon Park, Vidhana Soudha, ISKCON, Bannerghatta,
  Bull Temple, MG Road, Brigade Road, Big Banyan Tree). Every URL was
  checked to return a real image before shipping, and any photo that fails
  to load hides itself instead of showing a broken frame.
- **Top picks have photos** — the Home top-pick cards now show real photos
  for Hampi, Mysuru, Coorg, Kabini, Gokarna, Chikmagalur (plus Belur and
  Shravanabelagola as backups), and tapping one opens that place's full
  detail sheet.
- **Bus & train travel per place** — every one of the 34 destinations now
  carries bus guidance (KSRTC from Majestic) and train guidance (station or
  nearest railhead), shown in the place detail with live transit-direction
  links from Kempegowda Bus Station and KSR Bengaluru City station. No
  route or train numbers are printed — live numbers come from Google Maps.

## Scale: built for 10 lakh searches a day

There is no backend to overload. The whole app is a static site: the planner
runs in milliseconds inside the visitor's browser, there are no API calls per
search, no database, and no images to serve (all visuals are CSS gradients).
On Vercel/Netlify the files sit on a global CDN with immutable caching for
hashed assets (`vercel.json`), and the PDF engine loads only when Export PDF
is clicked. 10 lakh searches a day is about 12 a second on average — trivial
for a CDN — and traffic costs nothing per search because there is no server
work per visitor.
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
