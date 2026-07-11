export type Template = {
  id?: string;
  slug: string;
  name: string;
  category: string;
  creator: {
    id?: string;
    profileId?: string | null;
    name: string;
    role: string;
    location: string;
    avatar: string;
    responseTime: string;
    verified: boolean;
    rating: number;
    completedProjects: number;
    deliveryTime: string;
    review: string;
  };
  price: number;
  popularity: number;
  isNew: boolean;
  tags: string[];
  tools: string[];
  summary: string;
  description: string;
  features: string[];
  pages: string[];
  gradient: string;
  bestFor?: string[];
  previewImageUrl?: string | null;
  livePreviewUrl?: string | null;
  status?: string;
  isFeatured?: boolean;
  createdAt?: string;
};

export { categories } from "./categories";

export const priceRanges = [
  { label: "Any price", value: "all" },
  { label: "Under $150", value: "under-150" },
  { label: "$150 - $300", value: "150-300" },
  { label: "$300+", value: "300-plus" },
];

export const templates: Template[] = [
  {
    slug: "modern-cafe-website",
    name: "Modern Cafe Website",
    category: "Cafes & Bakeries",
    creator: {
      name: "Maya Studio",
      role: "Brand and web designer",
      location: "Austin, TX",
      avatar: "MS",
      responseTime: "Usually replies in 2 hours",
      verified: true,
      rating: 4.9,
      completedProjects: 18,
      deliveryTime: "7-10 days",
      review: "Understood our neighborhood brand immediately.",
    },
    price: 149,
    popularity: 95,
    isNew: true,
    tags: ["Menu", "Reservations", "Mobile-first"],
    tools: ["Framer", "Figma"],
    summary: "Warm cafe menus, seasonal specials, and visit details.",
    description:
      "A warm, polished cafe website built for independent coffee shops that need menus, seasonal specials, location details, and a smooth mobile browsing experience.",
    features: [
      "Hero section with featured drink promotion",
      "Editable menu blocks for coffee, bakery, and lunch items",
      "Location, hours, and map-ready contact section",
      "Newsletter capture section for local promotions",
    ],
    pages: ["Home", "Menu", "About", "Visit", "Contact"],
    gradient: "linear-gradient(135deg, #e0f2fe 0%, #dbeafe 45%, #f5d0fe 100%)",
  },
  {
    slug: "premium-salon-booking-site",
    name: "Premium Salon Booking Site",
    category: "Beauty & Care",
    creator: {
      name: "Northline Creative",
      role: "Webflow partner agency",
      location: "Denver, CO",
      avatar: "NC",
      responseTime: "Usually replies same day",
      verified: true,
      rating: 4.8,
      completedProjects: 24,
      deliveryTime: "10-14 days",
      review: "The booking flow felt polished from day one.",
    },
    price: 249,
    popularity: 90,
    isNew: false,
    tags: ["Booking", "Services", "Gallery"],
    tools: ["Webflow", "Figma"],
    summary: "Elegant services, stylist profiles, and clear booking paths.",
    description:
      "A refined salon site for beauty teams that want to showcase services, stylists, testimonials, and appointment calls-to-action without feeling generic.",
    features: [
      "Service menu with pricing tiers",
      "Stylist profile sections",
      "Before-and-after gallery layout",
      "Booking call-to-action blocks throughout the site",
    ],
    pages: ["Home", "Services", "Team", "Gallery", "Contact"],
    gradient: "linear-gradient(135deg, #fce7f3 0%, #ede9fe 50%, #e0e7ff 100%)",
  },
  {
    slug: "fitness-gym-landing-page",
    name: "Fitness Gym Landing Page",
    category: "Fitness",
    creator: {
      name: "Lift Lab Design",
      role: "Fitness website specialist",
      location: "Miami, FL",
      avatar: "LL",
      responseTime: "Usually replies in 4 hours",
      verified: true,
      rating: 4.9,
      completedProjects: 16,
      deliveryTime: "5-7 days",
      review: "Turned our trial offer into a clear customer journey.",
    },
    price: 179,
    popularity: 88,
    isNew: true,
    tags: ["Memberships", "Classes", "Lead capture"],
    tools: ["Next.js", "Tailwind CSS"],
    summary: "Bold class schedules, memberships, and trial offers.",
    description:
      "A high-converting landing page for gyms, trainers, and boutique studios that need class highlights, membership offers, and trial signups.",
    features: [
      "Class schedule preview",
      "Membership comparison cards",
      "Trainer credibility section",
      "Trial signup form layout",
    ],
    pages: ["Landing", "Classes", "Memberships", "Trainers"],
    gradient: "linear-gradient(135deg, #dcfce7 0%, #cffafe 45%, #bfdbfe 100%)",
  },
  {
    slug: "real-estate-agent-website",
    name: "Real Estate Agent Website",
    category: "Real Estate",
    creator: {
      name: "Cedar Sites",
      role: "Local business web studio",
      location: "Portland, OR",
      avatar: "CS",
      responseTime: "Usually replies next business day",
      verified: true,
      rating: 4.9,
      completedProjects: 31,
      deliveryTime: "10-14 days",
      review: "Made our listings feel credible and easy to explore.",
    },
    price: 299,
    popularity: 83,
    isNew: false,
    tags: ["Listings", "Lead forms", "Neighborhoods"],
    tools: ["WordPress", "Elementor"],
    summary: "Property listings, neighborhood guides, and lead capture.",
    description:
      "A trustworthy real estate template for agents who need featured listings, neighborhood guides, seller lead capture, and client testimonials.",
    features: [
      "Featured property cards",
      "Neighborhood spotlight sections",
      "Buyer and seller lead forms",
      "Testimonial and credentials layout",
    ],
    pages: ["Home", "Listings", "Buyers", "Sellers", "Contact"],
    gradient: "linear-gradient(135deg, #fef3c7 0%, #d1fae5 50%, #bfdbfe 100%)",
  },
  {
    slug: "online-clothing-store",
    name: "Online Clothing Store",
    category: "Online Stores",
    creator: {
      name: "Pixel Haus",
      role: "Ecommerce design studio",
      location: "New York, NY",
      avatar: "PH",
      responseTime: "Usually replies in 1 hour",
      verified: true,
      rating: 5,
      completedProjects: 27,
      deliveryTime: "10-14 days",
      review: "Balanced editorial style with a simple path to checkout.",
    },
    price: 349,
    popularity: 97,
    isNew: false,
    tags: ["Shopify", "Lookbook", "Product grid"],
    tools: ["Shopify", "Figma"],
    summary: "Editorial product grids with a clear path to checkout.",
    description:
      "A modern Shopify storefront concept for apparel brands that want crisp product merchandising, editorial lookbooks, and strong conversion paths.",
    features: [
      "Collection landing pages",
      "Product detail layout with fit notes",
      "Lookbook and campaign sections",
      "Cart and checkout-ready structure",
    ],
    pages: ["Home", "Shop", "Collection", "Product", "Journal"],
    gradient: "linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 42%, #fce7f3 100%)",
  },
  {
    slug: "tutor-course-website",
    name: "Tutor Course Website",
    category: "Education",
    creator: {
      name: "Brightline Web",
      role: "Education website creator",
      location: "Chicago, IL",
      avatar: "BW",
      responseTime: "Usually replies same day",
      verified: true,
      rating: 4.8,
      completedProjects: 14,
      deliveryTime: "7-10 days",
      review: "Parents understood our programs without extra explanation.",
    },
    price: 129,
    popularity: 76,
    isNew: true,
    tags: ["Courses", "Testimonials", "Inquiry form"],
    tools: ["Framer", "Notion"],
    summary: "Course packages, learner results, and inquiry prompts.",
    description:
      "A clear, credible tutoring site for independent educators, exam coaches, and small learning centers that need to explain outcomes quickly.",
    features: [
      "Course package sections",
      "Student success stories",
      "FAQ layout for parents and learners",
      "Inquiry form and consultation CTA",
    ],
    pages: ["Home", "Programs", "Results", "FAQ", "Contact"],
    gradient: "linear-gradient(135deg, #fef9c3 0%, #ccfbf1 48%, #dbeafe 100%)",
  },
  {
    slug: "restaurant-menu-website",
    name: "Restaurant Menu Website",
    category: "Restaurants",
    creator: {
      name: "Tabletop Digital",
      role: "Restaurant web designer",
      location: "Nashville, TN",
      avatar: "TD",
      responseTime: "Usually replies in 3 hours",
      verified: true,
      rating: 4.9,
      completedProjects: 22,
      deliveryTime: "7-10 days",
      review: "Captured the feeling of our dining room online.",
    },
    price: 199,
    popularity: 92,
    isNew: false,
    tags: ["Menu", "Events", "Reservations"],
    tools: ["Webflow", "Figma"],
    summary: "Flexible menus, private events, and reservations.",
    description:
      "A polished restaurant website with flexible menu sections, private event promotion, chef notes, and reservation-ready calls-to-action.",
    features: [
      "Lunch, dinner, and drinks menu layouts",
      "Private events section",
      "Chef story and press quotes",
      "Reservation and location CTA blocks",
    ],
    pages: ["Home", "Menu", "Events", "Story", "Reservations"],
    gradient: "linear-gradient(135deg, #fee2e2 0%, #fed7aa 45%, #fef3c7 100%)",
  },
  {
    slug: "creative-agency-portfolio",
    name: "Creative Agency Portfolio",
    category: "Agencies & Services",
    creator: {
      name: "Orbit Works",
      role: "Independent creative studio",
      location: "Los Angeles, CA",
      avatar: "OW",
      responseTime: "Usually replies same day",
      verified: true,
      rating: 5,
      completedProjects: 19,
      deliveryTime: "10-14 days",
      review: "Made our case studies much easier to trust.",
    },
    price: 279,
    popularity: 86,
    isNew: true,
    tags: ["Case studies", "Services", "Lead form"],
    tools: ["Next.js", "Tailwind CSS"],
    summary: "Sharp case studies, services, and project inquiries.",
    description:
      "A sleek agency portfolio for studios, freelancers, and consultants who need sharp case studies and a clear path from proof to inquiry.",
    features: [
      "Case study grid and detail sections",
      "Service packages",
      "Client logos and outcomes",
      "Project inquiry form layout",
    ],
    pages: ["Home", "Work", "Services", "About", "Contact"],
    gradient: "linear-gradient(135deg, #ede9fe 0%, #dbeafe 45%, #cffafe 100%)",
  },
  {
    slug: "boutique-bakery-site",
    name: "Boutique Bakery Site",
    category: "Cafes & Bakeries",
    creator: {
      name: "Sweet Spot Studio",
      role: "Food brand designer",
      location: "Savannah, GA",
      avatar: "SS",
      responseTime: "Usually replies in 5 hours",
      verified: true,
      rating: 4.9,
      completedProjects: 13,
      deliveryTime: "7-10 days",
      review: "The site finally feels as warm as the shop.",
    },
    price: 159,
    popularity: 74,
    isNew: false,
    tags: ["Orders", "Catering", "Gallery"],
    tools: ["WordPress", "WooCommerce"],
    summary: "Daily bakes, custom orders, and catering requests.",
    description:
      "A friendly bakery site for local shops that want to highlight daily bakes, custom cakes, catering, and online order inquiries.",
    features: [
      "Daily specials block",
      "Custom order gallery",
      "Catering inquiry section",
      "Email signup for weekly menus",
    ],
    pages: ["Home", "Menu", "Custom Cakes", "Catering", "Contact"],
    gradient: "linear-gradient(135deg, #fae8ff 0%, #ffe4e6 46%, #fef3c7 100%)",
  },
  {
    slug: "dental-clinic-website",
    name: "Dental Clinic Website",
    category: "Beauty & Care",
    creator: {
      name: "Careframe Sites",
      role: "Service business specialist",
      location: "Seattle, WA",
      avatar: "CF",
      responseTime: "Usually replies next business day",
      verified: true,
      rating: 4.8,
      completedProjects: 29,
      deliveryTime: "10-14 days",
      review: "Patients could find the right next step quickly.",
    },
    price: 229,
    popularity: 71,
    isNew: true,
    tags: ["Appointments", "Services", "Trust signals"],
    tools: ["Webflow", "Figma"],
    summary: "Calm service pages with trust and appointment prompts.",
    description:
      "A calm service-business site for clinics and appointment-based teams that need to explain treatments, insurance, and booking options clearly.",
    features: [
      "Service overview cards",
      "Patient trust and review sections",
      "Insurance information layout",
      "Appointment request CTA",
    ],
    pages: ["Home", "Services", "New Patients", "Reviews", "Contact"],
    gradient: "linear-gradient(135deg, #dbeafe 0%, #ccfbf1 50%, #f0fdf4 100%)",
  },
  {
    slug: "local-cleaning-service",
    name: "Local Cleaning Service",
    category: "Agencies & Services",
    creator: {
      name: "Service Grid",
      role: "Small business template maker",
      location: "Charlotte, NC",
      avatar: "SG",
      responseTime: "Usually replies in 6 hours",
      verified: true,
      rating: 4.8,
      completedProjects: 21,
      deliveryTime: "5-7 days",
      review: "Our quote requests became much more specific.",
    },
    price: 119,
    popularity: 80,
    isNew: false,
    tags: ["Quotes", "Service areas", "Reviews"],
    tools: ["Framer", "Figma"],
    summary: "Local services, reviews, plans, and quote requests.",
    description:
      "A practical service website for home cleaning, maintenance, and local operators who need quote requests and proof of reliability.",
    features: [
      "Quote request CTA sections",
      "Service area list",
      "Recurring plan cards",
      "Review and guarantee blocks",
    ],
    pages: ["Home", "Services", "Pricing", "Reviews", "Contact"],
    gradient: "linear-gradient(135deg, #f8fafc 0%, #dbeafe 50%, #ddd6fe 100%)",
  },
  {
    slug: "pet-grooming-studio",
    name: "Pet Grooming Studio",
    category: "Beauty & Care",
    creator: {
      name: "Neighborhood Web Co.",
      role: "Local service designer",
      location: "Phoenix, AZ",
      avatar: "NW",
      responseTime: "Usually replies same day",
      verified: true,
      rating: 4.9,
      completedProjects: 17,
      deliveryTime: "7-10 days",
      review: "New clients understood our packages before calling.",
    },
    price: 139,
    popularity: 78,
    isNew: false,
    tags: ["Booking", "Packages", "Photos"],
    tools: ["Squarespace", "Figma"],
    summary: "Friendly packages, galleries, policies, and booking.",
    description:
      "A cheerful appointment website for grooming studios with package pricing, policies, photo galleries, and booking prompts.",
    features: [
      "Package comparison section",
      "Photo gallery blocks",
      "Policy and FAQ sections",
      "Booking CTA for new clients",
    ],
    pages: ["Home", "Packages", "Gallery", "Policies", "Contact"],
    gradient: "linear-gradient(135deg, #dcfce7 0%, #fef9c3 45%, #e0e7ff 100%)",
  },
];

export function getTemplate(slug: string) {
  return templates.find((template) => template.slug === slug);
}
