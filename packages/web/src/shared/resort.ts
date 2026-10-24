// Single source of truth for resort content — used by the web UI and the AI concierge.

export const RESORT = {
  name: "Lūana Kai",
  fullName: "Lūana Kai Resort & Villas",
  tagline: "Where the mountains meet the sea",
  location: "Hanalei Bay, Kauaʻi, Hawaiʻi",
  address: "5520 Kūhiō Highway, Hanalei, HI 96714",
  phone: "+1 (808) 555-0142",
  email: "aloha@luanakai.com",
  airport: "Līhuʻe Airport (LIH), about 55 minutes by car",
  checkIn: "4:00 PM",
  checkOut: "11:00 AM",
  instagram: "instagram.com/luanakai",
  facebook: "facebook.com/luanakairesort",
};

export type Room = {
  slug: string;
  name: string;
  category: "Room" | "Suite" | "Villa";
  short: string;
  description: string;
  image: string;
  gallery: string[];
  size: string;
  guests: number;
  bed: string;
  view: string;
  rate: number;
  amenities: string[];
};

export const ROOMS: Room[] = [
  {
    slug: "ocean-view-king",
    name: "Ocean View King",
    category: "Room",
    short: "Koa floors, linen and a lanai framing the bay.",
    description:
      "Our signature room opens through floor-to-ceiling sliders onto a private lanai over Hanalei Bay. Handwoven lauhala, koa wood floors and soft linen keep the palette quiet so the view can speak.",
    image: "/images/room-ocean.jpg",
    gallery: ["/images/room-ocean.jpg", "/images/about.jpg", "/images/gallery-beach.jpg"],
    size: "520 sq ft",
    guests: 2,
    bed: "1 King",
    view: "Partial ocean & mountain",
    rate: 895,
    amenities: ["Private lanai", "Rain shower", "Nespresso & local coffee", "Twice-daily housekeeping", "Reef-safe bath amenities", "55\" smart TV"],
  },
  {
    slug: "garden-hale-suite",
    name: "Garden Hale Suite",
    category: "Suite",
    short: "A secluded hideaway with an outdoor lava-stone shower.",
    description:
      "Tucked into our botanical gardens, each Garden Hale has a separate living room, deep soaking tub and an open-air lava-stone shower wrapped in monstera and plumeria. Ideal for honeymooners who want privacy.",
    image: "/images/room-garden.jpg",
    gallery: ["/images/room-garden.jpg", "/images/spa-hale.jpg", "/images/exp-waterfall.jpg"],
    size: "780 sq ft",
    guests: 3,
    bed: "1 King + daybed",
    view: "Tropical garden",
    rate: 1150,
    amenities: ["Outdoor lava-stone shower", "Soaking tub", "Separate living room", "Garden lanai with daybed", "Complimentary minibar (non-alcoholic)", "Yoga mats"],
  },
  {
    slug: "oceanfront-suite",
    name: "Oceanfront Suite",
    category: "Suite",
    short: "Step straight from the living room onto the sand.",
    description:
      "Ground-floor suites with walls that slide away entirely, turning the living room into a beach pavilion. A freestanding stone tub faces the water and our beach butlers set up your loungers at sunrise.",
    image: "/images/room-oceanfront.jpg",
    gallery: ["/images/room-oceanfront.jpg", "/images/gallery-beach.jpg", "/images/hero.jpg"],
    size: "1,050 sq ft",
    guests: 4,
    bed: "1 King + sofa bed",
    view: "Direct oceanfront",
    rate: 1650,
    amenities: ["Direct beach access", "Freestanding stone tub", "Beach butler", "Outdoor shower", "Wet bar", "Bose sound system"],
  },
  {
    slug: "pool-villa",
    name: "Private Pool Villa",
    category: "Villa",
    short: "Your own plunge pool, thatched pavilion and total privacy.",
    description:
      "One-bedroom villas behind timber screens, each with a dark-tiled plunge pool, a thatched sala with a daybed and an outdoor dining terrace. In-villa dining and private chef evenings can be arranged.",
    image: "/images/room-poolvilla.jpg",
    gallery: ["/images/room-poolvilla.jpg", "/images/dining-main.jpg", "/images/gallery-lobby.jpg"],
    size: "1,600 sq ft",
    guests: 4,
    bed: "1 King + 2 Twins on request",
    view: "Mountain & distant ocean",
    rate: 2400,
    amenities: ["Private plunge pool", "Thatched sala & daybed", "Outdoor dining terrace", "Villa host", "Daily breakfast in-villa", "Complimentary airport transfer"],
  },
  {
    slug: "cliffside-villa",
    name: "Cliffside Villa",
    category: "Villa",
    short: "Perched above the Pacific with a glass corner bedroom.",
    description:
      "Set on the headland, our Cliffside Villas wrap a canopy bed in glass on two sides — you wake to whales in winter and mist rolling off the cliffs. Includes a heated infinity spa tub on the deck.",
    image: "/images/room-cliff.jpg",
    gallery: ["/images/room-cliff.jpg", "/images/exp-napali.jpg", "/images/spa-yoga.jpg"],
    size: "1,850 sq ft",
    guests: 2,
    bed: "1 King canopy",
    view: "Panoramic ocean & cliffs",
    rate: 2950,
    amenities: ["Glass corner bedroom", "Heated infinity spa tub", "Telescope for whale watching", "Villa host", "Daily breakfast in-villa", "Complimentary airport transfer"],
  },
  {
    slug: "royal-estate",
    name: "Aliʻi Beach Estate",
    category: "Villa",
    short: "Three bedrooms, a 60-ft infinity pool and a private beach lawn.",
    description:
      "Our most exclusive residence: three en-suite bedrooms, a 60-foot infinity pool, a lawn running to a private stretch of sand, a chef's kitchen and a dedicated butler and chef. Perfect for families and celebrations.",
    image: "/images/room-estate.jpg",
    gallery: ["/images/room-estate.jpg", "/images/room-poolvilla.jpg", "/images/gallery-beach.jpg"],
    size: "5,200 sq ft",
    guests: 8,
    bed: "3 Kings + 2 Twins",
    view: "Private beachfront",
    rate: 7800,
    amenities: ["60-ft infinity pool", "Private beach lawn", "Personal butler & chef", "Chef's kitchen", "Media room", "Private SUV & driver on request"],
  },
];

export const DINING = [
  {
    slug: "kai-table",
    name: "Kai Table",
    type: "Beachfront fine dining",
    hours: "Dinner 5:30 – 9:30 PM nightly",
    description:
      "Candlelit tables on the sand and a tasting menu built around the day's catch from Kauaʻi fishermen and produce from our own māla (garden). Reservations recommended; resort casual attire.",
    image: "/images/dining-main.jpg",
    highlights: ["7-course tasting menu $195", "Wine pairing $120", "Vegetarian & gluten-free menus"],
  },
  {
    slug: "pa-ina",
    name: "Pāʻina",
    type: "All-day island kitchen",
    hours: "Breakfast 6:30 – 11 AM · Lunch 11:30 AM – 3 PM",
    description:
      "Relaxed open-air dining overlooking the pool: açaí and taro pancakes in the morning, poke bowls, kalua pork sliders and seared ahi at lunch.",
    image: "/images/dining-plate.jpg",
    highlights: ["Daily breakfast included for villa guests", "Keiki (kids) menu", "Poke bar"],
  },
  {
    slug: "sunset-lanai",
    name: "Sunset Lānai Bar",
    type: "Cocktails & small plates",
    hours: "3 – 11 PM · Live slack-key guitar Thu–Sun at sunset",
    description:
      "Koa-wood bar facing due west. Signature lilikoʻi mai tais, local craft beers, and small plates. The best seat for sunset over Bali Hai.",
    image: "/images/dining-bar.jpg",
    highlights: ["Happy hour 3 – 5 PM", "Signature: Lūana Mai Tai", "Live music Thu–Sun"],
  },
];

export const SPA = {
  name: "Hale Ola Spa",
  hours: "8 AM – 8 PM daily",
  description:
    "Six open-air treatment hale set in the rainforest garden beside a natural waterfall. Rituals draw on traditional lomilomi and native botanicals — noni, kukui nut, ʻawapuhi ginger and Hawaiian sea salt.",
  treatments: [
    { name: "Lomilomi Ritual", duration: "90 min", price: 295, description: "Traditional Hawaiian long-stroke massage using warm kukui nut oil." },
    { name: "Pōhaku Hot Stone", duration: "80 min", price: 275, description: "Smooth river stones warmed and placed along energy lines." },
    { name: "Coconut & Sea Salt Glow", duration: "60 min", price: 210, description: "Full body exfoliation with Hawaiian sea salt, followed by coconut wrap." },
    { name: "Couples Hale Journey", duration: "120 min", price: 690, description: "Side-by-side lomilomi, floral bath and champagne in a private hale." },
    { name: "Reef-to-Ridge Facial", duration: "60 min", price: 225, description: "Seaweed and noni facial designed for sun-kissed skin." },
  ],
  wellness: ["Sunrise yoga on the bay deck — daily 7 AM (complimentary)", "Sound bath — Tue & Fri 6 PM", "Fitness pavilion — 24 hours", "Outrigger canoe fitness — Wed & Sat"],
};

export const EXPERIENCES = [
  { slug: "surf", name: "Surf Hanalei", image: "/images/exp-surf.jpg", duration: "2 hrs", price: 185, description: "Private lessons with local watermen on the gentle inside breaks of Hanalei Bay. All levels; boards and rash guards included." },
  { slug: "napali", name: "Nā Pali Coast Sail", image: "/images/exp-napali.jpg", duration: "5 hrs", price: 325, description: "Catamaran sail along the cathedral cliffs, sea caves and waterfalls of Nā Pali, with snorkel stop and lunch on board (seasonal, Apr–Oct)." },
  { slug: "snorkel", name: "Reef & Honu Snorkel", image: "/images/exp-snorkel.jpg", duration: "3 hrs", price: 145, description: "Guided snorkel at Tunnels Reef to swim among green sea turtles and reef fish. Reef-safe sunscreen provided." },
  { slug: "luau", name: "Hōkū Lūʻau", image: "/images/exp-luau.jpg", duration: "3 hrs", price: 210, description: "Beach lūʻau under the stars every Tuesday & Saturday: imu-roasted kalua pig, hula and fire knife dance." },
  { slug: "waterfall", name: "Hidden Waterfall Hike", image: "/images/exp-waterfall.jpg", duration: "4 hrs", price: 165, description: "A guided rainforest trek to a private waterfall swimming hole, with Hawaiian plant lore from our cultural guide." },
];

export const OFFERS = [
  { slug: "honeymoon", name: "Honeymoon in Paradise", nights: "Minimum 5 nights", description: "Couples Hale Journey at the spa, private beach dinner, sparkling wine on arrival and daily breakfast.", perk: "Save 20%", image: "/images/room-garden.jpg" },
  { slug: "stay-longer", name: "Stay Longer", nights: "Minimum 7 nights", description: "Your 7th night is on us, plus a $300 resort credit per stay for dining, spa or experiences.", perk: "7th night free", image: "/images/gallery-beach.jpg" },
  { slug: "ohana", name: "ʻOhana Escape", nights: "Minimum 4 nights", description: "Kids under 12 eat free, a family surf lesson, and connecting rooms or villa upgrade when available.", perk: "Kids eat free", image: "/images/exp-surf.jpg" },
  { slug: "wellness", name: "Ola Wellness Retreat", nights: "Minimum 3 nights", description: "Daily spa treatment, private yoga session, nourishing menu at Pāʻina and a guided waterfall hike.", perk: "$450 spa credit", image: "/images/spa-yoga.jpg" },
];

export const TESTIMONIALS = [
  { quote: "Waking up in the Cliffside Villa with whales breaching below was something we'll never forget. The staff knew our names by the second morning.", name: "Amelia & James R.", from: "London, UK" },
  { quote: "The most quietly luxurious place we've stayed. Kai Table's tasting menu was the best meal of our trip to Hawaiʻi.", name: "Daniel K.", from: "San Francisco, CA" },
  { quote: "Our kids learned to surf, we learned to slow down. The ʻOhana package made the whole thing effortless.", name: "The Nakamura family", from: "Tokyo, Japan" },
];

export const POLICIES = [
  { q: "What are check-in and check-out times?", a: "Check-in from 4:00 PM, check-out by 11:00 AM. Early arrival and late departure are on request and subject to availability." },
  { q: "What is your cancellation policy?", a: "Free cancellation up to 30 days before arrival (60 days for villas and the Aliʻi Estate, and for stays over Dec 20 – Jan 5). Within that window the first two nights are charged." },
  { q: "Is there a resort fee?", a: "No resort fee. Rates include Wi-Fi, sunrise yoga, beach and pool service, valet parking and use of snorkel gear and paddleboards." },
  { q: "How do I get to the resort?", a: "Fly into Līhuʻe Airport (LIH), about a 55-minute scenic drive. We offer private transfers ($180 each way; complimentary for villa guests)." },
  { q: "Are children welcome?", a: "Yes — our Keiki Club runs daily 9 AM – 3 PM for ages 4–12 with Hawaiian crafts, tide pooling and lei making. Cribs are complimentary." },
  { q: "Are pets allowed?", a: "We welcome service animals. Pets are not permitted, to protect our native wildlife." },
];

export const GALLERY = [
  "/images/hero.jpg",
  "/images/gallery-lobby.jpg",
  "/images/room-poolvilla.jpg",
  "/images/exp-napali.jpg",
  "/images/dining-bar.jpg",
  "/images/gallery-beach.jpg",
  "/images/spa-hale.jpg",
  "/images/room-cliff.jpg",
  "/images/exp-luau.jpg",
  "/images/room-estate.jpg",
  "/images/exp-snorkel.jpg",
  "/images/dining-plate.jpg",
  "/images/spa-yoga.jpg",
  "/images/exp-waterfall.jpg",
  "/images/room-oceanfront.jpg",
  "/images/about.jpg",
];

export function getRoom(slug: string) {
  return ROOMS.find((r) => r.slug === slug);
}
