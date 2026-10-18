export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  borderHex: string;
}

export interface VariantDetails {
  id: 'without_lace' | 'with_lace';
  name: string;
  tagline: string;
  actualPrice: number;
  discountedPrice: number;
  images: string[];
  features: string[];
  popularBadge?: string;
}

export interface BulkTier {
  minQty: number;
  maxQty?: number;
  discountPercent: number;
  label: string;
}

export interface SatinSashProductConfig {
  id: string;
  sku: string;
  title: string;
  category: string;
  breadcrumbs: string[];
  tagline: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  minOrderQuantity: number;
  currency: {
    symbol: string;
    code: string;
  };
  variants: {
    withoutLace: VariantDetails;
    withLace: VariantDetails;
  };
  bulkTiers: BulkTier[];
  colors: ProductColor[];
  dimensions: {
    length: string;
    width: string;
    cutStyle: string;
  };
  fabricDetails: {
    material: string;
    finish: string;
    weight: string;
    origin: string;
  };
  features: string[];
  specifications: Array<{ label: string; value: string }>;
  faqs: Array<{ question: string; answer: string }>;
}

export const defaultSatinSashData: SatinSashProductConfig = {
  id: "sash-satin-001",
  sku: "SC-SAT-01",
  title: "Imperial Double-Faced Satin Sash",
  category: "Ceremonial Sashes & Stoles",
  breadcrumbs: ["Home", "Sashes & Stoles", "Satin Sashes"],
  tagline: "Handcrafted ultra-glossy bridal-grade satin sash, tailored with precision hems or ornate golden royal lace border.",
  rating: 4.9,
  reviewCount: 284,
  inStock: true,
  stockCount: 1500,
  minOrderQuantity: 1,
  currency: {
    symbol: "₹",
    code: "INR"
  },
  variants: {
    withoutLace: {
      id: "without_lace",
      name: "Without Lace",
      tagline: "Classic Tailored Hem with Metallic Gold Piping",
      actualPrice: 799,
      discountedPrice: 499,
      images: [
        "/images/sashes/satin-no-lace-1.jpg",
        "/hero-sash.jpg",
        "/images/sashes/satin-lace-detail.jpg"
      ],
      features: [
        "Clean, minimalistic tailored edge",
        "Sleek metallic gold border piping",
        "Lightweight & drape-friendly",
        "Ideal for school & college graduations"
      ]
    },
    withLace: {
      id: "with_lace",
      name: "With Royal Lace",
      tagline: "Ornate Scalloped Metallic Golden Lace Border",
      actualPrice: 1199,
      discountedPrice: 749,
      popularBadge: "Most Popular",
      images: [
        "/images/sashes/satin-with-lace-1.jpg",
        "/images/sashes/satin-lace-detail.jpg",
        "/hero-sash.jpg",
        "/images/sashes/satin-no-lace-1.jpg"
      ],
      features: [
        "Intricate artisanal scalloped golden lace border",
        "Royal ceremonial aesthetic",
        "Reinforced backing for luxury weight and drape",
        "Favored for Valedictorians, Pageants & VIP Honorees"
      ]
    }
  },
  bulkTiers: [
    { minQty: 1, maxQty: 9, discountPercent: 0, label: "Retail (1-9 pcs)" },
    { minQty: 10, maxQty: 49, discountPercent: 10, label: "Tier 1: 10+ pcs (10% extra off)" },
    { minQty: 50, maxQty: 199, discountPercent: 18, label: "Tier 2: 50+ pcs (18% extra off)" },
    { minQty: 200, discountPercent: 25, label: "Wholesale: 200+ pcs (25% extra off)" }
  ],
  colors: [
    { id: "black", name: "Midnight Black", hex: "#111111", borderHex: "#c19b38" },
    { id: "royal-blue", name: "Royal Navy Blue", hex: "#0b224e", borderHex: "#dfad2d" },
    { id: "maroon", name: "Imperial Maroon", hex: "#62101e", borderHex: "#dfad2d" },
    { id: "gold", name: "Regal Champagne Gold", hex: "#d4af37", borderHex: "#111111" },
    { id: "emerald", name: "Emerald Forest Green", hex: "#0a4427", borderHex: "#dfad2d" },
    { id: "white", name: "Pearl Pristine White", hex: "#fcfcfc", borderHex: "#c19b38" }
  ],
  dimensions: {
    length: "72 inches (standard adult length)",
    width: "4.5 inches (11.5 cm standard width)",
    cutStyle: "Chevron V-point tips with reinforced stitching"
  },
  fabricDetails: {
    material: "100% Bridal-Grade High-Density Polyester Satin",
    finish: "Double-faced silk luster with anti-crease memory",
    weight: "220 GSM (Heavyweight luxury drape)",
    origin: "Handcrafted in India"
  },
  features: [
    "100% High-grade double-faced satin with rich silky sheen",
    "Choice between tailored hem or hand-stitched golden lace",
    "Custom embroidery & foil print compatible",
    "Fade-resistant vibrant dye colors",
    "Reinforced neckline for non-slip contoured shoulder fit",
    "Packaged in protective dust-proof satin sleeve"
  ],
  specifications: [
    { label: "Material Composition", value: "Double-Layer Premium Silk-Touch Satin" },
    { label: "Fabric Weight", value: "220 GSM Heavy Drape" },
    { label: "Dimensions", value: "72\" Length x 4.5\" Width (182cm x 11.5cm)" },
    { label: "Border Finish Options", value: "Classic Hemmed Piping OR Golden Scalloped Lace" },
    { label: "Shoulder Fitting", value: "Contoured V-Neck Collar with Anti-Slip Lining" },
    { label: "Embroidery Compatibility", value: "Gold Zari, Silver Thread, DTF, Vinyl & Foil" },
    { label: "Origin & Craftsmanship", value: "Handmade by Artisans in New Delhi, India" },
    { label: "Care Instructions", value: "Dry Clean Only / Steam Iron on Reverse Low Heat" }
  ],
  faqs: [
    {
      question: "What is the difference between 'With Lace' and 'Without Lace'?",
      answer: "The 'Without Lace' option comes with sleek, tailored hemmed borders accented by gold satin piping for a modern, minimalist look. The 'With Lace' edition features intricate hand-stitched metallic golden scalloped lace along both edges, providing an ultra-ceremonial, royal finish."
    },
    {
      question: "Can I add my college crest or custom valedictorian text?",
      answer: "Yes! Click 'Launch Customizer Studio' or submit an enquiry. We can embroider or foil-print names, logos, graduation year, ranks, and custom slogans on both sides."
    },
    {
      question: "Do you offer bulk discounts for universities and institutions?",
      answer: "Absolutely. We provide tiered bulk pricing starting from 10 units up to 10,000+ units with institutional invoice billing and complimentary sample approvals."
    },
    {
      question: "How long does production and delivery take?",
      answer: "Plain and standard sashes dispatch in 24-48 hours. Custom embroidered orders typically dispatch within 3-5 business days with express air shipping across India & worldwide."
    }
  ]
};
