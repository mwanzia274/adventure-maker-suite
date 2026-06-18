import masai from "@/assets/dest-masai.jpg";
import kilimanjaro from "@/assets/dest-kilimanjaro.jpg";
import elephants from "@/assets/gallery-elephants.jpg";
import lion from "@/assets/gallery-lion.jpg";
import maasai from "@/assets/gallery-maasai.jpg";
import balloon from "@/assets/gallery-balloon.jpg";
import zanzibar from "@/assets/dest-zanzibar.jpg";
import hero from "@/assets/hero-savanna.jpg";

export type Safari = {
  slug: string;
  title: string;
  duration: string;
  days: number;
  category: "Day Trip" | "Short Safari" | "Classic Safari" | "Hiking" | "Beach" | "City Experience";
  group: string;
  location: string;
  price: string;
  img: string;
  desc: string;
  long: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary: { day: string; title: string; text: string }[];
};

export const safaris: Safari[] = [
  {
    slug: "masai-mara-classic",
    title: "Masai Mara Classic",
    duration: "4 Days",
    days: 4,
    category: "Classic Safari",
    group: "2–6 guests",
    location: "Masai Mara, Kenya",
    price: "from $1,290",
    img: masai,
    desc: "Lion prides on the plains, leopards in the fig trees, and unforgettable sunset game drives across the Mara.",
    long: "Four days in the heart of Kenya's most iconic reserve. Game drives at dawn and dusk, a visit to a Maasai manyatta, and nights at a comfortable tented camp on the edge of the reserve.",
    highlights: ["Daily game drives", "Tented camp on the Mara", "Maasai village visit", "Airport transfers"],
    includes: ["Private 4×4 with pop-up roof", "Professional driver-guide", "All park fees", "Full board accommodation", "Bottled water in vehicle"],
    excludes: ["International flights", "Visas & travel insurance", "Tips & personal expenses", "Optional balloon safari"],
    itinerary: [
      { day: "Day 1", title: "Nairobi → Masai Mara", text: "Pick-up from your Nairobi hotel and scenic drive through the Great Rift Valley to the Mara. Afternoon game drive en route to camp." },
      { day: "Day 2", title: "Full day in the Mara", text: "Sunrise and sunset game drives chasing the Big Five. Picnic lunch in the bush." },
      { day: "Day 3", title: "Mara River & culture", text: "Morning at the Mara River looking for hippos and crocodiles. Afternoon visit to a Maasai village." },
      { day: "Day 4", title: "Mara → Nairobi", text: "Final morning drive, brunch at camp, and return to Nairobi by mid-afternoon." },
    ],
  },
  {
    slug: "amboseli-kili-views",
    title: "Amboseli & Kilimanjaro Views",
    duration: "3 Days",
    days: 3,
    category: "Short Safari",
    group: "2–6 guests",
    location: "Amboseli, Kenya",
    price: "from $890",
    img: kilimanjaro,
    desc: "Big elephant herds on a dry-lake bed, framed by Kilimanjaro's snow-capped peak just across the border.",
    long: "Amboseli is Kenya's elephant kingdom — and the only place on earth to photograph tuskers strolling beneath Mount Kilimanjaro. Three relaxed days of game drives and golden-hour photography.",
    highlights: ["Famous Amboseli elephants", "Mt Kilimanjaro backdrop", "Observation hill sundowner", "Eco-lodge stay"],
    includes: ["Private 4×4 safari vehicle", "Driver-guide", "All park fees", "Full board lodge", "Bottled water"],
    excludes: ["Flights", "Travel insurance", "Tips", "Personal expenses"],
    itinerary: [
      { day: "Day 1", title: "Nairobi → Amboseli", text: "Morning drive to Amboseli National Park with lunch at the lodge and an afternoon game drive." },
      { day: "Day 2", title: "Full day Amboseli", text: "Sunrise game drive with Kilimanjaro views, visit to Observation Hill, and a Maasai cultural walk." },
      { day: "Day 3", title: "Amboseli → Nairobi", text: "Final morning game drive, then return to Nairobi." },
    ],
  },
  {
    slug: "tsavo-east-west",
    title: "Tsavo East & West Wilderness",
    duration: "4 Days",
    days: 4,
    category: "Classic Safari",
    group: "2–6 guests",
    location: "Tsavo, Kenya",
    price: "from $1,150",
    img: lion,
    desc: "Red-dust elephants, lava flows and the legendary man-eaters' homeland — Kenya's biggest wild canvas.",
    long: "Tsavo is Kenya's largest park complex — raw, vast and beautifully empty. Track red elephants in Tsavo East and explore the Mzima Springs and lava flows of Tsavo West.",
    highlights: ["Red elephants of Tsavo", "Mzima Springs", "Shetani lava flows", "Sundowner at Aruba dam"],
    includes: ["Private 4×4", "Driver-guide", "Park fees", "Full board lodge", "Water"],
    excludes: ["Flights", "Insurance", "Tips", "Personal expenses"],
    itinerary: [
      { day: "Day 1", title: "Nairobi → Tsavo East", text: "Drive to Tsavo East with an afternoon game drive towards Aruba dam." },
      { day: "Day 2", title: "Tsavo East full day", text: "Full day game drive through the Yatta plateau and Galana river area." },
      { day: "Day 3", title: "Tsavo West", text: "Transfer to Tsavo West. Visit Mzima Springs and the Shetani lava flows." },
      { day: "Day 4", title: "Tsavo → Nairobi", text: "Final game drive and return drive to Nairobi." },
    ],
  },
  {
    slug: "lake-nakuru-flamingos",
    title: "Lake Nakuru Flamingo Safari",
    duration: "2 Days",
    days: 2,
    category: "Short Safari",
    group: "2–6 guests",
    location: "Lake Nakuru, Kenya",
    price: "from $620",
    img: balloon,
    desc: "Pink-rimmed soda lake, white rhino, Rothschild giraffe and a postcard view from Baboon Cliff.",
    long: "A short, punchy break from Nairobi. Lake Nakuru is one of the best places in Kenya for white and black rhino, and the lake's flamingo flocks are world-famous.",
    highlights: ["White & black rhino", "Flamingo flocks", "Baboon Cliff viewpoint", "Rothschild giraffe"],
    includes: ["Private 4×4", "Driver-guide", "Park fees", "Full board lodge", "Water"],
    excludes: ["Flights", "Insurance", "Tips", "Personal expenses"],
    itinerary: [
      { day: "Day 1", title: "Nairobi → Nakuru", text: "Drive through the Great Rift Valley with stops at viewpoints. Afternoon game drive in the park." },
      { day: "Day 2", title: "Nakuru → Nairobi", text: "Morning game drive looking for rhino and the famous flamingos, then return to Nairobi." },
    ],
  },
  {
    slug: "samburu-wilderness",
    title: "Samburu Wilderness",
    duration: "3 Days",
    days: 3,
    category: "Short Safari",
    group: "2–6 guests",
    location: "Samburu, Kenya",
    price: "from $1,090",
    img: maasai,
    desc: "Northern Kenya's arid drama — Grevy's zebra, reticulated giraffe, gerenuk and Samburu warriors.",
    long: "Cross the equator into the wild north for the so-called 'Samburu Five' — species you'll only find in this corner of Kenya. Optional cultural visit with a Samburu community.",
    highlights: ["Samburu Special Five", "Ewaso Nyiro river drives", "Samburu cultural visit", "Riverside lodge"],
    includes: ["Private 4×4", "Driver-guide", "Park fees", "Full board lodge", "Water"],
    excludes: ["Flights", "Insurance", "Tips", "Personal expenses"],
    itinerary: [
      { day: "Day 1", title: "Nairobi → Samburu", text: "Long scenic drive north crossing the equator. Afternoon game drive along the Ewaso Nyiro river." },
      { day: "Day 2", title: "Full day Samburu", text: "Morning and afternoon game drives. Optional Samburu village visit." },
      { day: "Day 3", title: "Samburu → Nairobi", text: "Final game drive and return to Nairobi." },
    ],
  },
  {
    slug: "big-five-grand-circuit",
    title: "Big Five Grand Circuit",
    duration: "8 Days",
    days: 8,
    category: "Classic Safari",
    group: "2–6 guests",
    location: "Amboseli · Nakuru · Mara, Kenya",
    price: "from $2,890",
    img: hero,
    desc: "The headline tour — Amboseli elephants, Nakuru rhinos and four nights of Big Five action in the Masai Mara.",
    long: "Eight unhurried days through Kenya's most rewarding parks. We combine Amboseli, Lake Nakuru and the Masai Mara in one seamless private safari with comfortable mid-range or luxury camps.",
    highlights: ["3 iconic parks", "All Big Five", "Optional balloon safari", "Maasai cultural visit"],
    includes: ["Private 4×4", "Driver-guide", "All park fees", "Full board accommodation", "Internal transfers"],
    excludes: ["Flights", "Insurance", "Tips", "Optional balloon ride"],
    itinerary: [
      { day: "Day 1", title: "Nairobi → Amboseli", text: "Drive to Amboseli with an afternoon game drive under Kilimanjaro." },
      { day: "Day 2", title: "Amboseli", text: "Full day in Amboseli with elephant herds and Observation Hill." },
      { day: "Day 3", title: "Amboseli → Nakuru", text: "Cross-country drive via Nairobi to Lake Nakuru. Evening game drive." },
      { day: "Day 4", title: "Nakuru → Masai Mara", text: "Morning rhino search, then onward to the Mara via the Rift Valley." },
      { day: "Day 5", title: "Mara full day", text: "Sunrise game drive in the reserve. Optional balloon safari." },
      { day: "Day 6", title: "Mara full day", text: "Explore the Mara Triangle and the Mara river crossings." },
      { day: "Day 7", title: "Mara cultural day", text: "Morning game drive, afternoon Maasai village visit, sundowner on the plains." },
      { day: "Day 8", title: "Mara → Nairobi", text: "Final morning drive and return to Nairobi." },
    ],
  },
  {
    slug: "diani-coastal-escape",
    title: "Diani Beach Coastal Escape",
    duration: "5 Days",
    days: 5,
    category: "Beach",
    group: "2–8 guests",
    location: "Diani, Kenya Coast",
    price: "from $980",
    img: zanzibar,
    desc: "White-sand bliss south of Mombasa — dhow sails, snorkelling at Kisite-Mpunguti and Swahili nights.",
    long: "After the dust, the ocean. Five gentle days on Kenya's south coast — beachfront resort, a Wasini Island dhow trip with snorkelling, and a Swahili cooking experience in Mombasa.",
    highlights: ["Beachfront resort", "Wasini dhow & snorkelling", "Old Town Mombasa", "Swahili cuisine"],
    includes: ["Airport transfers", "Beachfront accommodation", "Wasini Island day trip", "Mombasa city tour"],
    excludes: ["Flights", "Insurance", "Lunches in town", "Personal expenses"],
    itinerary: [
      { day: "Day 1", title: "Arrive Diani", text: "Fly Nairobi → Mombasa, transfer to your Diani beach resort. Sunset on the sand." },
      { day: "Day 2", title: "Beach day", text: "Free day on the beach. Optional kitesurf or massage." },
      { day: "Day 3", title: "Wasini & Kisite", text: "Full-day dhow trip to Wasini Island with snorkelling at Kisite-Mpunguti Marine Park." },
      { day: "Day 4", title: "Old Town Mombasa", text: "Half-day tour of Fort Jesus and Old Town with Swahili lunch." },
      { day: "Day 5", title: "Diani → home", text: "Final morning swim and transfer to Mombasa airport." },
    ],
  },
  {
    slug: "mt-kenya-trek",
    title: "Mount Kenya Sirimon Trek",
    duration: "5 Days",
    days: 5,
    category: "Hiking",
    group: "2–10 climbers",
    location: "Mount Kenya",
    price: "from $1,490",
    img: elephants,
    desc: "Africa's second-highest peak — Point Lenana via the gentlest route, glacial tarns and zebra on the way up.",
    long: "A five-day trek up the scenic Sirimon route with descent via Chogoria. Reach Point Lenana (4,985m) with experienced KWS-licensed guides and full mountain crew.",
    highlights: ["Sirimon up, Chogoria down", "Point Lenana summit", "Mountain huts", "KWS-licensed guides"],
    includes: ["Licensed mountain guide", "Cook & porters", "All park & camping fees", "Full mountain meals", "Transfers from Nairobi"],
    excludes: ["Personal trekking gear", "Tips for crew", "Insurance with high-altitude cover"],
    itinerary: [
      { day: "Day 1", title: "Nairobi → Old Moses (3,300m)", text: "Drive to Sirimon gate and trek to Old Moses camp." },
      { day: "Day 2", title: "Old Moses → Shipton's (4,200m)", text: "Long acclimatisation day through Mackinder's valley." },
      { day: "Day 3", title: "Summit day", text: "Pre-dawn climb to Point Lenana for sunrise, then descend to Mintos camp." },
      { day: "Day 4", title: "Mintos → Chogoria gate", text: "Long descent through the gorges of the Chogoria route." },
      { day: "Day 5", title: "Chogoria → Nairobi", text: "Transfer back to Nairobi." },
    ],
  },
];

export function getSafari(slug: string) {
  return safaris.find((s) => s.slug === slug);
}