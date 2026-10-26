export type Interest =
  | 'heritage'
  | 'nature'
  | 'beaches'
  | 'adventure'
  | 'wildlife'
  | 'food'
  | 'spiritual'
  | 'city';

export type BudgetTier = 'budget' | 'moderate' | 'luxury';
export type Pace = 'relaxed' | 'balanced' | 'packed';
export type Group = 'solo' | 'couple' | 'family' | 'friends';

export interface Destination {
  id: string;
  name: string;
  tagline: string;
  region: string;
  tags: Interest[];
  /** Minimum recommended days in this place. */
  days: number;
  /** Indicative per-person cost per day in INR, by budget tier. */
  costPerDay: Record<BudgetTier, number>;
  highlights: string[];
  bestTime: string;
  distanceFromBengaluruKm: number;
  rating: number;
  gradient: string;
}

export const INTEREST_LABELS: Record<Interest, string> = {
  heritage: 'Heritage',
  nature: 'Nature',
  beaches: 'Beaches',
  adventure: 'Adventure',
  wildlife: 'Wildlife',
  food: 'Food',
  spiritual: 'Spiritual',
  city: 'City Life',
};

export const DESTINATIONS: Destination[] = [
  {
    id: 'mysuru',
    name: 'Mysuru',
    tagline: 'Palaces, silk, sandalwood and the Chamundi Hills',
    region: 'South Karnataka',
    tags: ['heritage', 'food', 'city', 'spiritual'],
    days: 2,
    costPerDay: { budget: 1800, moderate: 3200, luxury: 6500 },
    highlights: [
      'Mysore Palace and its Sunday night illumination',
      'Chamundeshwari Temple atop Chamundi Hills',
      'Devaraja Market walk and Mysore Pak tasting',
      'Brindavan Gardens musical fountain in the evening',
    ],
    bestTime: 'Oct – Feb',
    distanceFromBengaluruKm: 145,
    rating: 4.8,
    gradient: 'from-amber-500 to-rose-600',
  },
  {
    id: 'hampi',
    name: 'Hampi',
    tagline: 'A UNESCO boulder-strewn Vijayanagara wonderland',
    region: 'North Karnataka',
    tags: ['heritage', 'adventure', 'spiritual'],
    days: 2,
    costPerDay: { budget: 1400, moderate: 2600, luxury: 5200 },
    highlights: [
      'Virupaksha Temple and Hampi Bazaar at sunrise',
      'Vittala Temple and its musical stone pillars',
      'Sunset from Matanga Hill over the Tungabhadra',
      'Coracle ride and bouldering around Sanapur Lake',
    ],
    bestTime: 'Oct – Feb',
    distanceFromBengaluruKm: 340,
    rating: 4.9,
    gradient: 'from-orange-500 to-amber-700',
  },
  {
    id: 'coorg',
    name: 'Coorg (Madikeri)',
    tagline: 'Coffee estates, misty hills and waterfalls',
    region: 'Malnad',
    tags: ['nature', 'adventure', 'food'],
    days: 2,
    costPerDay: { budget: 1700, moderate: 3400, luxury: 7000 },
    highlights: [
      'Coffee plantation walk and estate tasting',
      'Abbey Falls and Raja’s Seat sunset point',
      'Dubare Elephant Camp and Cauvery river rafting',
      'Coorgi pork curry and kadambuttu dinner',
    ],
    bestTime: 'Oct – Mar',
    distanceFromBengaluruKm: 265,
    rating: 4.8,
    gradient: 'from-emerald-600 to-teal-800',
  },
  {
    id: 'gokarna',
    name: 'Gokarna',
    tagline: 'Laid-back beaches, cliff walks and temple town calm',
    region: 'Coast',
    tags: ['beaches', 'spiritual', 'nature'],
    days: 2,
    costPerDay: { budget: 1300, moderate: 2600, luxury: 5500 },
    highlights: [
      'Beach trek: Kudle → Om → Half Moon → Paradise',
      'Mahabaleshwara Temple in the old town',
      'Sunset yoga and seafood shacks at Kudle Beach',
      'Kayaking and dolphin spotting in the morning',
    ],
    bestTime: 'Oct – Mar',
    distanceFromBengaluruKm: 480,
    rating: 4.7,
    gradient: 'from-sky-500 to-indigo-600',
  },
  {
    id: 'chikmagalur',
    name: 'Chikmagalur',
    tagline: 'Mullayanagiri sunrises and India’s coffee heartland',
    region: 'Malnad',
    tags: ['nature', 'adventure', 'food'],
    days: 2,
    costPerDay: { budget: 1600, moderate: 3200, luxury: 6800 },
    highlights: [
      'Sunrise trek to Mullayanagiri, Karnataka’s highest peak',
      'Coffee estate stay and filter-coffee brewing session',
      'Baba Budangiri and Hebbe Falls day trip',
      'Stargazing from a homestay in the hills',
    ],
    bestTime: 'Sep – Mar',
    distanceFromBengaluruKm: 245,
    rating: 4.7,
    gradient: 'from-lime-600 to-emerald-800',
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    tagline: 'Breweries, gardens, tech and legendary dosa',
    region: 'South Karnataka',
    tags: ['city', 'food', 'heritage'],
    days: 1,
    costPerDay: { budget: 2000, moderate: 3800, luxury: 7500 },
    highlights: [
      'Lalbagh Botanical Garden and Cubbon Park',
      'Bangalore Palace and Vidhana Soudha photo stop',
      'Food crawl: VV Puram chaat street in the evening',
      'Brewpub evening on Church Street / Indiranagar',
    ],
    bestTime: 'Year-round',
    distanceFromBengaluruKm: 0,
    rating: 4.5,
    gradient: 'from-violet-600 to-purple-800',
  },
  {
    id: 'badami',
    name: 'Badami & Aihole',
    tagline: 'Chalukyan cave temples carved into red sandstone',
    region: 'North Karnataka',
    tags: ['heritage', 'spiritual'],
    days: 1,
    costPerDay: { budget: 1300, moderate: 2400, luxury: 4800 },
    highlights: [
      'Badami cave temples and Bhutanatha temple at dusk',
      'Aihole, the cradle of temple architecture',
      'Pattadakal UNESCO temples on the Malaprabha',
      'Agastya Lake coracle ride',
    ],
    bestTime: 'Oct – Feb',
    distanceFromBengaluruKm: 450,
    rating: 4.6,
    gradient: 'from-red-600 to-orange-700',
  },
  {
    id: 'udupi',
    name: 'Udupi & Mangaluru',
    tagline: 'Temple town flavours and a working harbour coast',
    region: 'Coast',
    tags: ['food', 'beaches', 'spiritual'],
    days: 2,
    costPerDay: { budget: 1500, moderate: 2800, luxury: 5600 },
    highlights: [
      'Sri Krishna Matha and Car Street in Udupi',
      'Malpe Beach and St. Mary’s Island boat trip',
      'Mangalorean fish thali and Mangalore buns',
      'Tannirbhavi Beach sunset and lighthouse walk',
    ],
    bestTime: 'Oct – Mar',
    distanceFromBengaluruKm: 400,
    rating: 4.6,
    gradient: 'from-cyan-600 to-blue-800',
  },
  {
    id: 'kabini',
    name: 'Kabini & Nagarhole',
    tagline: 'Leopards, elephants and misty backwaters',
    region: 'South Karnataka',
    tags: ['wildlife', 'nature'],
    days: 2,
    costPerDay: { budget: 2200, moderate: 4500, luxury: 9500 },
    highlights: [
      'Morning jeep safari in Nagarhole Tiger Reserve',
      'Evening boat safari on the Kabini backwaters',
      'Birdwatching and riverside sundowners',
      'Jungle lodge stay with naturalist-guided walks',
    ],
    bestTime: 'Oct – May',
    distanceFromBengaluruKm: 220,
    rating: 4.8,
    gradient: 'from-green-700 to-emerald-900',
  },
  {
    id: 'jog',
    name: 'Jog Falls & Shivamogga',
    tagline: 'India’s second-highest plunge waterfall',
    region: 'Malnad',
    tags: ['nature', 'adventure'],
    days: 1,
    costPerDay: { budget: 1400, moderate: 2600, luxury: 5000 },
    highlights: [
      'Jog Falls viewpoints in full monsoon flow',
      'Trek to the base of the falls (season permitting)',
      'Sharavathi Valley viewpoints and river drive',
      'Keladi and Ikkeri heritage stop on the way back',
    ],
    bestTime: 'Jul – Nov',
    distanceFromBengaluruKm: 380,
    rating: 4.5,
    gradient: 'from-teal-600 to-cyan-800',
  },
  {
    id: 'dandeli',
    name: 'Dandeli',
    tagline: 'White-water rafting in the Kali river valley',
    region: 'North Karnataka',
    tags: ['adventure', 'nature', 'wildlife'],
    days: 2,
    costPerDay: { budget: 1800, moderate: 3400, luxury: 6200 },
    highlights: [
      'White-water rafting on the Kali river',
      'Kayaking, coracle rides and ziplining',
      'Jungle safari in Dandeli Wildlife Sanctuary',
      'Syntheri Rocks and Sykes Point viewpoints',
    ],
    bestTime: 'Oct – May',
    distanceFromBengaluruKm: 460,
    rating: 4.6,
    gradient: 'from-emerald-700 to-green-900',
  },
  {
    id: 'murudeshwar',
    name: 'Murudeshwar',
    tagline: 'A giant Shiva statue rising over the Arabian Sea',
    region: 'Coast',
    tags: ['spiritual', 'beaches'],
    days: 1,
    costPerDay: { budget: 1300, moderate: 2500, luxury: 5000 },
    highlights: [
      'Murudeshwar Temple and the 123-ft Shiva statue',
      'Raja Gopura lift to the sea-facing viewpoint',
      'Netrani Island scuba diving (season permitting)',
      'Beachside seafood dinner at sunset',
    ],
    bestTime: 'Oct – Mar',
    distanceFromBengaluruKm: 510,
    rating: 4.5,
    gradient: 'from-blue-600 to-indigo-800',
  },
  {
    id: 'belur',
    name: 'Belur & Halebidu',
    tagline: 'Hoysala soapstone temples of impossible detail',
    region: 'Central Karnataka',
    tags: ['heritage', 'spiritual'],
    days: 1,
    costPerDay: { budget: 1400, moderate: 2600, luxury: 5000 },
    highlights: [
      'Chennakeshava Temple carvings at Belur',
      'Hoysaleshwara Temple at Halebidu',
      'Yagachi Dam picnic stop between the two towns',
      'Local guide stories of Hoysala sculptors',
    ],
    bestTime: 'Oct – Feb',
    distanceFromBengaluruKm: 220,
    rating: 4.7,
    gradient: 'from-stone-600 to-amber-800',
  },
  {
    id: 'bandipur',
    name: 'Bandipur',
    tagline: 'Tiger country on the road to Ooty',
    region: 'South Karnataka',
    tags: ['wildlife', 'nature'],
    days: 1,
    costPerDay: { budget: 1900, moderate: 3800, luxury: 8000 },
    highlights: [
      'Morning safari in Bandipur Tiger Reserve',
      'Gopalaswamy Betta hill temple at dawn',
      'Himavad Gopalaswamy mist viewpoint',
      'Evening safari and forest lodge dinner',
    ],
    bestTime: 'Oct – May',
    distanceFromBengaluruKm: 215,
    rating: 4.6,
    gradient: 'from-yellow-700 to-green-900',
  },
  {
    id: 'bijapur',
    name: 'Vijayapura (Bijapur)',
    tagline: 'Gol Gumbaz and the whispering gallery',
    region: 'North Karnataka',
    tags: ['heritage', 'city'],
    days: 1,
    costPerDay: { budget: 1200, moderate: 2300, luxury: 4600 },
    highlights: [
      'Gol Gumbaz and its whispering gallery',
      'Ibrahim Rauza, the Taj of the Deccan',
      'Bara Kaman and the old city walls',
      'Jolada rotti and local North Karnataka meals',
    ],
    bestTime: 'Oct – Feb',
    distanceFromBengaluruKm: 520,
    rating: 4.4,
    gradient: 'from-slate-600 to-stone-800',
  },
  {
    id: 'sakleshpur',
    name: 'Sakleshpur',
    tagline: 'Green railway bridges and the Manjarabad Fort star',
    region: 'Malnad',
    tags: ['nature', 'adventure'],
    days: 1,
    costPerDay: { budget: 1500, moderate: 3000, luxury: 6000 },
    highlights: [
      'Manjarabad Fort star-shaped viewpoint',
      'Bisle Ghat viewpoint and rainforest drive',
      'Homestay trek through cardamom estates',
      'Jenukal Gudda sunrise hike',
    ],
    bestTime: 'Sep – Mar',
    distanceFromBengaluruKm: 220,
    rating: 4.5,
    gradient: 'from-green-600 to-teal-800',
  },
];

export const BUDGET_LABELS: Record<BudgetTier, string> = {
  budget: 'Budget',
  moderate: 'Moderate',
  luxury: 'Luxury',
};

export const PACE_LABELS: Record<Pace, string> = {
  relaxed: 'Relaxed',
  balanced: 'Balanced',
  packed: 'Packed',
};

export const GROUP_SIZE: Record<Group, number> = {
  solo: 1,
  couple: 2,
  family: 4,
  friends: 3,
};
