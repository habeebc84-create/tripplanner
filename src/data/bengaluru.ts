/**
 * Bengaluru deep layer: 31 famous, frequently visited places across the city.
 * Transport notes name metro stations and bus corridors only where they are
 * well established; live bus numbers and train times change, so every place
 * links to live Google Maps transit directions instead of printed numbers
 * that would quickly go wrong.
 */
export type BengaluruCategory =
  | 'parks'
  | 'temples'
  | 'museums'
  | 'shopping'
  | 'entertainment';

export interface BengaluruPlace {
  id: string;
  name: string;
  category: BengaluruCategory;
  area: string;
  description: string;
  bestTime: string;
  entryFee: string;
  howToGo: string;
  /** Verified BMTC bus numbers from Kempegowda Bus Station (Majestic). Absent where no Majestic-origin number could be verified. */
  bus?: string;
  /** Caution shown in the detail sheet (e.g. a reported closure). */
  alert?: string;
  highlights: string[];
  /** Verified real photo URL (open web). Absent when no reliable photo was found. */
  image?: string;
}

export const BENGALURU_PLACES: BengaluruPlace[] = [
  // Core famous places
  {
    id: 'lalbagh',
    name: 'Lalbagh Botanical Garden',
    category: 'parks',
    area: 'Basavanagudi',
    description:
      '240-acre botanical garden begun by Hyder Ali and completed by Tipu Sultan, famous for its glass house, lotus pond and centuries-old trees.',
    bestTime: 'Early morning, Nov–Feb',
    entryFee: 'Small fee (indicative)',
    howToGo: 'Lalbagh metro station (Green Line), then a short walk. BMTC buses from Majestic towards Basavanagudi.',
    bus: '2, 12, 18, 25A, 25B, 25E, 215H to Lalbagh Main or West Gate',
    highlights: ['Glass House flower shows', 'Lotus pond and lake', 'Rare trees and bonsai garden'],
    image: 'https://d2rdhxfof4qmbb.cloudfront.net/wp-content/uploads/2024/01/COVER-5.jpg',
  },
  {
    id: 'cubbon-park',
    name: 'Cubbon Park',
    category: 'parks',
    area: 'Central Bengaluru',
    description:
      '300 acres of green lungs in the city centre, dotted with statues, the State Central Library and the High Court at its edges.',
    bestTime: 'Morning walks, all year',
    entryFee: 'Free',
    howToGo: 'Cubbon Park metro station (Purple Line) at the park edge.',
    highlights: ['Morning jogs and cycling', 'State Central Library', 'Toy train for children'],
    image: 'https://www.karnatakatourism.org/wp-content/uploads/2021/09/Cubbon-Park.jpg',
  },
  {
    id: 'bangalore-palace',
    name: 'Bangalore Palace',
    category: 'museums',
    area: 'Palace Grounds',
    description:
      'Tudor-style palace of the Wadiyars with wooden interiors, paintings and sprawling grounds that also host concerts and events.',
    bestTime: 'Morning, weekdays are quieter',
    entryFee: 'Paid entry (indicative)',
    howToGo: 'BMTC buses from Majestic towards Palace Grounds / Mekhri Circle. Autos from anywhere central.',
    bus: '402, 402A, 279E, 287L, 288G, 288H, 277 via Palace Guttahalli or Palace Grounds',
    highlights: ['Durbar Hall and wooden carvings', 'Palace grounds and gardens', 'Audio guide tour'],
    image: 'https://pub-0f3ca40c378b41b2b74bb464f98f62e2.r2.dev/locations/bangalore-palace/1787808805751-27811341995_6e10abef04_k.jpg',
  },
  {
    id: 'vidhana-soudha',
    name: 'Vidhana Soudha',
    category: 'museums',
    area: 'Ambedkar Veedhi',
    description:
      'The seat of Karnataka’s legislature — a grand neo-Dravidian granite building, beautifully lit on Sunday evenings and public holidays.',
    bestTime: 'Sunday evening illumination',
    entryFee: 'View from outside',
    howToGo: 'Dr. B. R. Ambedkar Station, Vidhana Soudha (Purple Line) right outside.',
    highlights: ['Evening illumination', 'Cubbon Park next door', 'High Court and Attara Kacheri nearby'],
    image: 'https://officechai.com/wp-content/uploads/2017/04/Vidhana_Souda__Bangalore-1024x638.jpg',
  },
  {
    id: 'iskcon',
    name: 'ISKCON Temple, Rajajinagar',
    category: 'temples',
    area: 'Rajajinagar',
    description:
      'One of the largest ISKCON temples in the world, on a hillock with ornate shrines, a cultural complex and a popular prasadam hall.',
    bestTime: 'Evening aarti',
    entryFee: 'Free (donations welcome)',
    howToGo: 'BMTC buses from Majestic towards Rajajinagar. Autos from anywhere in the city.',
    bus: '78E, 275E, 78A to the ISKCON stop',
    highlights: ['Evening aarti and kirtan', 'Shrine complex and museum', 'Prasadam dining hall'],
    image: 'https://cdn.abhibus.com/2024/06/Iskcon-Temple-Bangalore-696x385.jpg',
  },
  {
    id: 'bannerghatta',
    name: 'Bannerghatta National Park',
    category: 'parks',
    area: 'Bannerghatta Road',
    description:
      'Zoo, safari and butterfly park 22 km south of the city — lions, tigers and bears on safari, plus a rescue centre.',
    bestTime: 'Morning safari, Nov–Mar',
    entryFee: 'Paid entry (indicative)',
    howToGo: 'BMTC buses from Majestic / Shivajinagar along Bannerghatta Road. Book safari slots ahead.',
    bus: '365, J365, V365 from Majestic to Bannerghatta National Park',
    highlights: ['Lion and tiger safari', 'Butterfly park', 'Zoo and rescue centre'],
    image: 'https://www.citybit.in/wp-content/uploads/2024/05/Bannerghatta-Biological-Park-safari-1024x576.jpg',
  },
  {
    id: 'bull-temple',
    name: 'Bull Temple (Dodda Basavana Gudi)',
    category: 'temples',
    area: 'Basavanagudi',
    description:
      '16th-century temple housing one of the largest monolithic Nandi statues in the world, beside Bugle Rock Park.',
    bestTime: 'Morning or evening',
    entryFee: 'Free',
    howToGo: 'BMTC buses from Majestic towards Basavanagudi (Gandhi Bazaar). Walk from Bugle Rock Park.',
    bus: '36, 43, 45G, 215C from Majestic',
    highlights: ['Monolithic Nandi statue', 'Bugle Rock Park next door', 'Kadalekai Parishe groundnut fair (Nov–Dec)'],
    image: 'https://publictv.in/wp-content/uploads/2020/08/bull-temple-basavanagudi-bengluru.jpg',
  },
  {
    id: 'tipu-palace',
    name: "Tipu Sultan's Summer Palace",
    category: 'museums',
    area: 'KR Market',
    description:
      'Teak-pillared Indo-Islamic palace of Tipu Sultan in the old city, with frescoes and a small museum on the Mysore wars.',
    bestTime: 'Morning',
    entryFee: 'Small fee (indicative)',
    howToGo: 'BMTC buses to KR Market, then a short walk into the old city lanes.',
    bus: '15-E, 15-G, 210-A, 210-B, 210-E, 210-J, 210-KA stop near KR Market',
    highlights: ['Teak pillars and frescoes', 'Museum on Tipu Sultan', 'Bangalore Fort ruins nearby'],
  },
  // Parks & nature
  {
    id: 'madivala-lake',
    name: 'Madivala Lake',
    category: 'parks',
    area: 'BTM Layout',
    description:
      'A large restored lake in BTM Layout, popular for morning walks, birdwatching and evening breezes.',
    bestTime: 'Sunrise or sunset',
    entryFee: 'Free',
    howToGo: 'BMTC buses towards BTM Layout from Majestic / Shivajinagar.',
    bus: '25 (BTM Layout to Majestic)',
    highlights: ['Lakeside walking track', 'Birdwatching', 'Sunset views'],
  },
  {
    id: 'sankey-tank',
    name: 'Sankey Tank',
    category: 'parks',
    area: 'Sadashivanagar',
    description:
      'A peaceful man-made lake in an old residential quarter, ringed by a walking path and trees.',
    bestTime: 'Early morning',
    entryFee: 'Free',
    howToGo: 'BMTC buses towards Sadashivanagar / Malleshwaram from Majestic.',
    bus: '104 (Sadashivanagar to Kempegowda Bus Station)',
    highlights: ['Lakeside walk', 'Birdlife', 'Quiet picnic lawns'],
  },
  {
    id: 'hebbal-lake',
    name: 'Hebbal Lake',
    category: 'parks',
    area: 'Hebbal',
    description:
      'A large lake in north Bengaluru, a favourite of birdwatchers, especially in winter when migratory birds arrive.',
    bestTime: 'Winter mornings for birds',
    entryFee: 'Free',
    howToGo: 'BMTC buses towards Hebbal from Majestic. Autos from Hebbal junction.',
    bus: '279E, 402, 402A, 288G to Hebbal',
    highlights: ['Migratory birds in winter', 'Lakeside promenade', 'Photography'],
  },
  {
    id: 'turahalli-forest',
    name: 'Turahalli Forest',
    category: 'parks',
    area: 'Kanakapura Road',
    description:
      'One of the last patches of dry deciduous forest inside the city — rocky trails, raptors and a favourite of cyclists.',
    bestTime: 'Early morning, Nov–Feb',
    entryFee: 'Free',
    howToGo: 'Off Kanakapura Road; auto or taxi from Banashankari. No direct metro.',
    highlights: ['Forest trails and rock viewpoints', 'Cycling routes', 'Birds of prey'],
  },
  {
    id: 'big-banyan-tree',
    name: 'Big Banyan Tree (Dodda Alada Mara)',
    category: 'parks',
    area: 'Mysuru Road',
    description:
      'A 400-year-old banyan whose canopy spreads over three acres — a single tree that looks like a small forest.',
    bestTime: 'Morning',
    entryFee: 'Free',
    howToGo: 'Mysuru Road buses from Majestic towards Ramanagara; alight at the Dodda Alada Mara stop.',
    bus: '227, 227P towards Ramohalli and Hunnigere',
    highlights: ['Three-acre canopy', 'Picnic lawns', 'Photography'],
    image: 'https://www.explorebees.com/uploads/Dodda%20Alada%20Mara%20or%20Big%20Banyan%20Tree.jpg',
  },
  {
    id: 'ulsoor-lake',
    name: 'Ulsoor Lake',
    category: 'parks',
    area: 'Ulsoor',
    description:
      'A historic lake in east Bengaluru with boating, a walking track and island views.',
    bestTime: 'Evening boating',
    entryFee: 'Free (boating paid)',
    howToGo: 'BMTC buses from Majestic / Shivajinagar towards Ulsoor.',
    bus: '131, 131D, 320B, 315Q, 380M, 317L, 315W, 138D to Halasuru and Ulsoor',
    highlights: ['Boating', 'Lakeside walk', 'Island views'],
  },
  // Temples & religious
  {
    id: 'gavi-gangadhareshwara',
    name: 'Gavi Gangadhareshwara Temple',
    category: 'temples',
    area: 'Gavipuram',
    description:
      'A 9th-century rock-cut cave temple famous for the Makara Sankranti phenomenon, when sunlight falls directly on the Shiva linga.',
    bestTime: 'Makara Sankranti (Jan)',
    entryFee: 'Free',
    howToGo: 'BMTC buses from Majestic towards Gavipuram / Basavanagudi.',
    bus: '35, 36 from Majestic',
    highlights: ['Rock-cut cave shrine', 'Sankranti sun-ray phenomenon', 'Monolithic stone discs'],
  },
  {
    id: 'banashankari-temple',
    name: 'Banashankari Temple',
    category: 'temples',
    area: 'Banashankari',
    description:
      'A much-loved Amma temple in south Bengaluru, busy on Tuesdays and Fridays, with a distinctive Dravidian tower.',
    bestTime: 'Tuesday / Friday mornings',
    entryFee: 'Free',
    howToGo: 'Banashankari metro station (Green Line), then a short walk.',
    bus: '12, 12E, 43 to Banashankari',
    highlights: ['Amma shrine', 'Festival crowds', 'Temple tank'],
  },
  {
    id: 'kadalekai-parishe',
    name: 'Kadalekai Parishe Grounds',
    category: 'temples',
    area: 'Basavanagudi',
    description:
      'The fairgrounds of Bengaluru’s famous groundnut fair, held every November–December near the Bull Temple, with stalls, food and folk performances.',
    bestTime: 'Nov–Dec fair season',
    entryFee: 'Free',
    howToGo: 'BMTC buses from Majestic towards Basavanagudi (Gandhi Bazaar).',
    highlights: ['Groundnut fair stalls', 'Street food', 'Folk performances'],
  },
  // Museums, science & culture
  {
    id: 'government-museum',
    name: 'Government Museum',
    category: 'museums',
    area: 'Kasturba Road',
    description:
      'One of India’s oldest museums (1865), with archaeology, geology and art galleries next to Cubbon Park.',
    bestTime: 'Weekday mornings',
    entryFee: 'Small fee (indicative)',
    howToGo: 'Cubbon Park metro station (Purple Line), then a short walk on Kasturba Road.',
    highlights: ['Archaeology galleries', 'Neolithic and Hoysala artefacts', 'Venkatappa Art Gallery next door'],
  },
  {
    id: 'hal-museum',
    name: 'HAL Aerospace Museum',
    category: 'museums',
    area: 'Old Airport Road',
    description:
      'India’s first aerospace museum — real aircraft, engines, a flight simulator and the story of HAL’s aviation history.',
    bestTime: 'Morning',
    entryFee: 'Small fee (indicative)',
    howToGo: 'BMTC buses along Old Airport Road from Majestic / Shivajinagar.',
    bus: '333J, J13 from Majestic to HAL Airport',
    highlights: ['Real aircraft on display', 'Flight simulator', 'Engine and rocket hall'],
  },
  {
    id: 'chitrakala-parishath',
    name: 'Karnataka Chitrakala Parishath',
    category: 'museums',
    area: 'Kumara Krupa Road',
    description:
      'Bengaluru’s art hub — galleries of traditional and contemporary art, a folk-art museum and open-air exhibitions.',
    bestTime: 'Afternoon exhibitions',
    entryFee: 'Small fee (indicative)',
    howToGo: 'BMTC buses from Majestic towards Kumara Krupa Road / Shivananda Circle.',
    highlights: ['Art galleries', 'Folk-art museum', 'Open-air exhibitions'],
  },
  {
    id: 'rangoli-metro-art',
    name: 'Rangoli Metro Art Center',
    category: 'museums',
    area: 'MG Road',
    description:
      'A public art boulevard at MG Road metro station — galleries, a children’s play area and open-air performances.',
    bestTime: 'Evening',
    entryFee: 'Free',
    howToGo: 'MG Road metro station (Purple Line) — the centre is at the station itself.',
    highlights: ['Art galleries', 'Open-air performances', 'Children’s play area'],
  },
  {
    id: 'planetarium',
    name: 'Jawaharlal Nehru Planetarium',
    category: 'museums',
    area: 'High Grounds',
    description:
      'Bengaluru’s sky theatre with shows on the universe, plus a science park and exhibitions for young astronomers.',
    bestTime: 'Show timings (check ahead)',
    entryFee: 'Small fee (indicative)',
    howToGo: 'BMTC buses from Majestic towards High Grounds. Autos from Cubbon Park area.',
    highlights: ['Sky theatre shows', 'Science park', 'Astronomy exhibitions'],
  },
  // Shopping, markets & urban
  {
    id: 'brigade-road',
    name: 'Brigade Road',
    category: 'shopping',
    area: 'Central Bengaluru',
    description:
      'The city’s classic shopping and café street — brands, bookshops, pubs and street food, busiest in the evening.',
    bestTime: 'Evening',
    entryFee: 'Free to stroll',
    howToGo: 'Walk from MG Road metro station (Purple Line).',
    bus: '131, 131D, 320B, 315Q, 380M, 138D via Brigade Road Junction',
    highlights: ['Shopping and bookshops', 'Cafés and pubs', 'Street food'],
    image: 'https://www.olafarge.fr/wp-content/uploads/2025/04/9003-Bangalore-Brigade-Rd-T.jpg',
  },
  {
    id: 'mg-road',
    name: 'MG Road',
    category: 'shopping',
    area: 'Central Bengaluru',
    description:
      'Mahatma Gandhi Road — the city’s grand boulevard of shops, theatres, restaurants and the metro line running above it.',
    bestTime: 'Evening',
    entryFee: 'Free to stroll',
    howToGo: 'MG Road metro station (Purple Line) right on the boulevard.',
    bus: '131, 131D, 320B, 315Q, 380M, 138D via MG Road',
    highlights: ['Boulevard shopping', 'Theatres and restaurants', 'Metro art centre'],
    image: 'https://sowers.in/wp-content/uploads/2017/10/MG-Road-Bangalore.jpg',
  },
  {
    id: 'church-street',
    name: 'Church Street',
    category: 'shopping',
    area: 'Central Bengaluru',
    description:
      'A short, lively pedestrian-friendly street off Brigade Road, packed with cafés, bookshops, pubs and live music.',
    bestTime: 'Evening',
    entryFee: 'Free to stroll',
    howToGo: 'Walk from MG Road or Cubbon Park metro stations (Purple Line).',
    highlights: ['Cafés and live music', 'Bookshops', 'Street art'],
  },
  {
    id: 'phoenix-marketcity',
    name: 'Phoenix Marketcity',
    category: 'shopping',
    area: 'Whitefield',
    description:
      'One of Bengaluru’s largest malls — hundreds of stores, a multiplex, food courts and event spaces in Whitefield.',
    bestTime: 'Afternoon / evening',
    entryFee: 'Free entry',
    howToGo: 'Whitefield (Kadugodi) metro station (Purple Line), then an auto. Buses towards Whitefield from Majestic.',
    highlights: ['Shopping and brands', 'Multiplex and food court', 'Events and exhibitions'],
  },
  {
    id: 'orion-mall',
    name: 'Orion Mall',
    category: 'shopping',
    area: 'Brigade Gateway, Rajajinagar',
    description:
      'A large mall at Brigade Gateway with shopping, a multiplex, a lake view and family entertainment zones.',
    bestTime: 'Afternoon / evening',
    entryFee: 'Free entry',
    howToGo: 'BMTC buses towards Brigade Gateway / Rajajinagar from Majestic. Autos from Yeshwanthpur side.',
    bus: '82-A, 250-P, 258-CC from Majestic',
    highlights: ['Shopping and multiplex', 'Lake view', 'Family entertainment'],
  },
  // Entertainment & others
  {
    id: 'innovative-film-city',
    name: 'Innovative Film City',
    category: 'entertainment',
    area: 'Mysuru Road, Bidadi',
    description:
      'A film-themed amusement park on Mysuru Road — rides, a wax museum, mini-golf, go-karting and studio tours.',
    bestTime: 'Full day trip',
    entryFee: 'Paid entry (indicative)',
    howToGo: 'Mysuru Road buses from Majestic towards Bidadi. Taxis and autos for groups.',
    bus: '226N, 226Q from Majestic to Bidadi',
    alert: 'One listing reports Innovative Film City permanently closed, so check before visiting.',
    highlights: ['Rides and attractions', 'Wax museum', 'Go-karting and mini-golf'],
  },
  {
    id: 'snow-city',
    name: 'Snow City',
    category: 'entertainment',
    area: 'Jayamahal Road',
    description:
      'An indoor snow park with real snow, slides, snowball fights and winter gear — Bengaluru’s coldest room.',
    bestTime: 'Afternoon',
    entryFee: 'Paid entry (indicative)',
    howToGo: 'BMTC buses towards Jayamahal Road from Majestic. Autos from central Bengaluru.',
    bus: '111, 111-C, 114-B, 114-C to the TV Tower stop',
    highlights: ['Real snow play area', 'Snow slides', 'Snowball zone'],
  },
  {
    id: 'fun-world',
    name: 'Fun World',
    category: 'entertainment',
    area: 'Palace Grounds',
    description:
      'A family amusement park inside the Palace Grounds, with rides, a water park section and carnival games.',
    bestTime: 'Afternoon',
    entryFee: 'Paid entry (indicative)',
    howToGo: 'BMTC buses from Majestic towards Palace Grounds / Mekhri Circle.',
    bus: '111, 111-C, 114-B to Palace Grounds',
    highlights: ['Rides for all ages', 'Water play section', 'Carnival games'],
  },
  {
    id: 'chinnaswamy-stadium',
    name: 'M. Chinnaswamy Stadium',
    category: 'entertainment',
    area: 'MG Road',
    description:
      'Bengaluru’s iconic cricket stadium — home of RCB and Karnataka cricket, famous for its electric IPL atmosphere.',
    bestTime: 'Match days',
    entryFee: 'Ticketed (match days)',
    howToGo: 'Walk from MG Road or Cubbon Park metro stations (Purple Line).',
    highlights: ['IPL and international matches', 'Stadium tours (when offered)', 'MG Road food walk after the match'],
  },
];
