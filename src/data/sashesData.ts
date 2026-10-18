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

export interface SashProductConfig {
  id: string;
  slug: string;
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

// 1. SATIN SASHES
export const satinSashData: SashProductConfig = {
  id: "sash-satin-001",
  slug: "satinsashes",
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
  currency: { symbol: "₹", code: "INR" },
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

// 2. VELVET SASHES
export const velvetSashData: SashProductConfig = {
  id: "sash-velvet-002",
  slug: "velvetsashes",
  sku: "SC-VEL-02",
  title: "Royal Ceremonial Plush Velvet Sash",
  category: "Luxury Regalia & Honor Stoles",
  breadcrumbs: ["Home", "Sashes & Stoles", "Velvet Sashes"],
  tagline: "Handcrafted from 380 GSM plush royal micro-velvet, featuring deep tactile pile, contoured neck drape, and regal metallic gold embroidery with optional lace and tassels.",
  rating: 4.95,
  reviewCount: 198,
  inStock: true,
  stockCount: 850,
  minOrderQuantity: 1,
  currency: { symbol: "₹", code: "INR" },
  variants: {
    withoutLace: {
      id: "without_lace",
      name: "Without Lace",
      tagline: "Classic Tailored Edge with Metallic Gold Piping",
      actualPrice: 1099,
      discountedPrice: 699,
      images: [
        "/images/sashes/velvet-no-lace-1.jpg",
        "/images/sashes/velvet-with-lace-1.jpg",
        "/images/sashes/satin-lace-detail.jpg"
      ],
      features: [
        "Heavyweight crushed/matte micro-velvet pile",
        "Clean gold zari cord border binding",
        "Sumptuous drape that stays in place naturally",
        "Favorite for University Deans, Chancellors & Honor Societies"
      ]
    },
    withLace: {
      id: "with_lace",
      name: "With Royal Gold Lace & Tassels",
      tagline: "Artisanal Scalloped Lace with Matching Hanging Gold Tassels",
      actualPrice: 1599,
      discountedPrice: 999,
      popularBadge: "Signature Masterpiece",
      images: [
        "/images/sashes/velvet-with-lace-1.jpg",
        "/images/sashes/velvet-no-lace-1.jpg",
        "/images/sashes/satin-lace-detail.jpg"
      ],
      features: [
        "Dense ornate golden metallic scalloped lace trim",
        "Hand-tied decorative gold bullion tassels at pointed ends",
        "Opulent velvet texture with lustrous gold contrast",
        "Favored for Valedictorians, Pageant Queens & Dignitaries"
      ]
    }
  },
  bulkTiers: [
    { minQty: 1, maxQty: 9, discountPercent: 0, label: "Retail (1-9 pcs)" },
    { minQty: 10, maxQty: 49, discountPercent: 12, label: "Tier 1: 10+ pcs (12% extra off)" },
    { minQty: 50, maxQty: 199, discountPercent: 20, label: "Tier 2: 50+ pcs (20% extra off)" },
    { minQty: 200, discountPercent: 28, label: "Wholesale: 200+ pcs (28% extra off)" }
  ],
  colors: [
    { id: "burgundy", name: "Imperial Burgundy Crimson", hex: "#580816", borderHex: "#dfad2d" },
    { id: "navy", name: "Royal Midnight Navy", hex: "#0f224a", borderHex: "#dfad2d" },
    { id: "emerald", name: "Imperial Emerald Green", hex: "#0c3822", borderHex: "#dfad2d" },
    { id: "black", name: "Midnight Obsidian Black", hex: "#111111", borderHex: "#c19b38" },
    { id: "gold", name: "Regal Royal Gold", hex: "#c59b27", borderHex: "#111111" }
  ],
  dimensions: {
    length: "74 inches (extended ceremonial length)",
    width: "5.0 inches (12.7 cm broad regalia width)",
    cutStyle: "Tailored pointed chevron tips with weighted corner tassels"
  },
  fabricDetails: {
    material: "100% High-Density Regal Micro-Velvet with Satin Backing",
    finish: "Deep dimensional plush pile with soft light-absorbent texture",
    weight: "380 GSM (Extra heavyweight regalia drape)",
    origin: "Handmade by Master Regalia Tailors in India"
  },
  features: [
    "Ultra-dense 380 GSM plush velvet with silky inner satin lining",
    "High-contrast metallic gold zari thread embroidery",
    "Optional artisanal scalloped lace and bullion corner tassels",
    "Non-slip ergonomic contour over graduation gowns",
    "Protective velvet garment sleeve included"
  ],
  specifications: [
    { label: "Material Composition", value: "Heavyweight Royal Micro-Velvet with Satin Inner" },
    { label: "Fabric Weight", value: "380 GSM Ultra-Heavy Regalia" },
    { label: "Dimensions", value: "74\" Length x 5.0\" Width (188cm x 12.7cm)" },
    { label: "Border Finish Options", value: "Zari Cord Piping OR Gold Scalloped Lace with Tassels" },
    { label: "Lining", value: "Full Anti-Friction Satin Backing" },
    { label: "Embroidery Compatibility", value: "Dense Gold Zari Thread, 3D Raised Bullion & Crests" },
    { label: "Origin & Craftsmanship", value: "Handmade in New Delhi, India" },
    { label: "Care Instructions", value: "Professional Dry Clean Only" }
  ],
  faqs: [
    {
      question: "Why choose Velvet Sashes over Satin?",
      answer: "Velvet sashes deliver a much heavier, more opulent, and regal presence. With a 380 GSM pile, they absorb and reflect stage lighting with rich depth, ensuring zero slipping on smooth graduation gowns."
    },
    {
      question: "Do the tassels come included with the 'With Lace' option?",
      answer: "Yes! The 'With Royal Gold Lace' edition includes hand-tied gold bullion tassels at both chevron tips for the ultimate presidential regalia look."
    },
    {
      question: "Can we embroider institutional crests on velvet?",
      answer: "Yes, our high-density embroidery machines create ultra-crisp 3D raised embroidery and crests that sit beautifully on the plush velvet surface."
    }
  ]
};

// 3. DOUBLE LAYER HEAVY FABRIC
export const doubleLayerSashData: SashProductConfig = {
  id: "sash-double-003",
  slug: "doublelayer",
  sku: "SC-DL-03",
  title: "Double-Layer Structural Heavy Fabric Sash",
  category: "Academic Regalia & Convocation Stoles",
  breadcrumbs: ["Home", "Sashes & Stoles", "Double Layer Heavy Fabric"],
  tagline: "Dual-faced 350 GSM structural twill fabric with contrast ivory & midnight layers, engineered for non-wrinkle stage presence and presidential ceremonies.",
  rating: 4.92,
  reviewCount: 142,
  inStock: true,
  stockCount: 1100,
  minOrderQuantity: 1,
  currency: { symbol: "₹", code: "INR" },
  variants: {
    withoutLace: {
      id: "without_lace",
      name: "Without Lace",
      tagline: "Architectural Contrast Double-Layer Hem",
      actualPrice: 899,
      discountedPrice: 549,
      images: [
        "/images/sashes/double-layer-with-lace-1.jpg",
        "/images/sashes/single-layer-no-lace-1.jpg",
        "/hero-sash.jpg"
      ],
      features: [
        "Crisp double-ply reinforced construction",
        "Two-tone contrast border reveal",
        "Zero wrinkle memory, stays flat in photos",
        "Engineered for high-wind outdoor convocations"
      ]
    },
    withLace: {
      id: "with_lace",
      name: "With Golden Lace Border",
      tagline: "Dual Contrast Layer Accented with Golden Lace",
      actualPrice: 1399,
      discountedPrice: 849,
      popularBadge: "Convocation Choice",
      images: [
        "/images/sashes/double-layer-with-lace-1.jpg",
        "/images/sashes/satin-lace-detail.jpg",
        "/images/sashes/single-layer-no-lace-1.jpg"
      ],
      features: [
        "Double-ply structural backing with metallic lace frame",
        "Two-tone contrast accent stripe along neckline",
        "Heavyweight crisp drape with reinforced V-neck collar",
        "The standard for Medical, Law & Doctoral regalia"
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
    { id: "ivory-black", name: "Ivory Cream & Obsidian Black", hex: "#f5f2eb", borderHex: "#111111" },
    { id: "white-navy", name: "Pristine White & Royal Navy", hex: "#ffffff", borderHex: "#0f224a" },
    { id: "maroon-gold", name: "Imperial Crimson & Gold", hex: "#62101e", borderHex: "#dfad2d" },
    { id: "black-gold", name: "Midnight Black & Regal Gold", hex: "#111111", borderHex: "#dfad2d" },
    { id: "emerald-white", name: "Emerald Green & Pearl White", hex: "#0a4427", borderHex: "#ffffff" }
  ],
  dimensions: {
    length: "72 inches (standard adult length)",
    width: "4.75 inches (12 cm tailored width)",
    cutStyle: "Chevron pointed tips with reinforced interlining"
  },
  fabricDetails: {
    material: "Dual-Ply Heavyweight Woven Polyester Twill with Interlining",
    finish: "Smooth matte architectural finish with structured hand-feel",
    weight: "350 GSM (Double-layer bonded structure)",
    origin: "Handcrafted in India"
  },
  features: [
    "Bonded double-layer architecture prevents curling and shifting",
    "Two-tone contrast trim design available for department colors",
    "Compatible with both heavy embroidery and sharp screen/DTF print",
    "Reinforced curved neck band for all-day comfort",
    "Machine washable on gentle cold cycle"
  ],
  specifications: [
    { label: "Material Composition", value: "Dual-Layer Bonded Heavyweight Twill Fabric" },
    { label: "Fabric Weight", value: "350 GSM Combined Weight" },
    { label: "Dimensions", value: "72\" Length x 4.75\" Width (182cm x 12cm)" },
    { label: "Construction", value: "Fused Interlining with Contrast Binding" },
    { label: "Neck Design", value: "Contoured Comfort V-Neck" },
    { label: "Origin & Craftsmanship", value: "Handcrafted in New Delhi, India" },
    { label: "Care Instructions", value: "Dry Clean or Gentle Machine Wash Cold" }
  ],
  faqs: [
    {
      question: "What makes 'Double Layer' different from single layer?",
      answer: "Double layer sashes fuse two layers of heavy woven fabric with an internal stiffening canvas. This provides a formal, suit-like architectural drape that remains completely flat and sharp during long ceremonies and windy outdoor photo sessions."
    },
    {
      question: "Can we have two different colors on the front and back?",
      answer: "Yes! Double layer sashes can feature contrast dual colors—such as ivory on front with navy on back or contrast border piping representing school faculty colors."
    }
  ]
};

// 4. SINGLE LAYER HEAVY FABRIC
export const singleLayerSashData: SashProductConfig = {
  id: "sash-single-004",
  slug: "singlelayer",
  sku: "SC-SL-04",
  title: "Single-Layer Heavyweight Tailored Sash",
  category: "Graduation Milestones & Corporate Pageants",
  breadcrumbs: ["Home", "Sashes & Stoles", "Single Layer Heavy Fabric"],
  tagline: "Precision-cut 280 GSM wrinkle-free heavy matte weave with sharp chevron V-tips, offering clean professional durability and exceptional bulk value.",
  rating: 4.88,
  reviewCount: 312,
  inStock: true,
  stockCount: 2200,
  minOrderQuantity: 1,
  currency: { symbol: "₹", code: "INR" },
  variants: {
    withoutLace: {
      id: "without_lace",
      name: "Without Lace",
      tagline: "Sharp Minimalist Edge with Bound Border",
      actualPrice: 649,
      discountedPrice: 399,
      popularBadge: "Best Value",
      images: [
        "/images/sashes/single-layer-no-lace-1.jpg",
        "/images/sashes/double-layer-with-lace-1.jpg",
        "/images/sashes/satin-no-lace-1.jpg"
      ],
      features: [
        "Lightweight yet crisp 280 GSM single layer",
        "Clean edge binding with high-strength thread",
        "Great for large cohorts, high schools & corporate events",
        "Most cost-effective customized regalia option"
      ]
    },
    withLace: {
      id: "with_lace",
      name: "With Fine Metallic Lace",
      tagline: "Delicate Golden Lace Accent on Tailored Matte Fabric",
      actualPrice: 999,
      discountedPrice: 599,
      images: [
        "/images/sashes/double-layer-with-lace-1.jpg",
        "/images/sashes/single-layer-no-lace-1.jpg",
        "/images/sashes/satin-lace-detail.jpg"
      ],
      features: [
        "Slimline metallic gold lace border",
        "Elevated ceremonial look at accessible bulk rates",
        "Quick production and fast turnaround",
        "Crisp pointed chevron ends"
      ]
    }
  },
  bulkTiers: [
    { minQty: 1, maxQty: 9, discountPercent: 0, label: "Retail (1-9 pcs)" },
    { minQty: 10, maxQty: 49, discountPercent: 12, label: "Tier 1: 10+ pcs (12% extra off)" },
    { minQty: 50, maxQty: 199, discountPercent: 20, label: "Tier 2: 50+ pcs (20% extra off)" },
    { minQty: 200, discountPercent: 30, label: "Wholesale: 200+ pcs (30% extra off)" }
  ],
  colors: [
    { id: "white", name: "Pristine Snow White", hex: "#ffffff", borderHex: "#111111" },
    { id: "black", name: "Midnight Obsidian Black", hex: "#111111", borderHex: "#c19b38" },
    { id: "navy", name: "Royal Navy Blue", hex: "#0b224e", borderHex: "#dfad2d" },
    { id: "emerald", name: "Emerald Forest Green", hex: "#0a4427", borderHex: "#dfad2d" },
    { id: "red", name: "Ceremonial Scarlet Red", hex: "#990000", borderHex: "#dfad2d" }
  ],
  dimensions: {
    length: "70 inches (standard length)",
    width: "4.25 inches (10.8 cm standard width)",
    cutStyle: "Sharp pointed chevron V-ends with clean edge-stitch"
  },
  fabricDetails: {
    material: "280 GSM Matte Poly-Cotton Blend Fabric",
    finish: "Smooth matte texture with anti-fray sealed edges",
    weight: "280 GSM (Durable single layer)",
    origin: "Handcrafted in India"
  },
  features: [
    "Durable 280 GSM matte weave that doesn't crease or wrinkle easily",
    "Economical solution for bulk graduation cohorts (100 - 10,000+ units)",
    "Available with tailored bound piping or golden lace trim",
    "Clean chevron ends with locked hem stitching",
    "Fast 24-48 hr bulk production dispatch"
  ],
  specifications: [
    { label: "Material Composition", value: "280 GSM Heavy Matte Poly-Cotton Weave" },
    { label: "Fabric Weight", value: "280 GSM" },
    { label: "Dimensions", value: "70\" Length x 4.25\" Width (178cm x 10.8cm)" },
    { label: "Edge Finish", value: "Lock-Stitch Border Binding OR Gold Lace" },
    { label: "Customization", value: "Screen Print, DTF, Embroidery, Vinyl" },
    { label: "Origin & Craftsmanship", value: "Manufactured in New Delhi, India" },
    { label: "Care Instructions", value: "Hand or Machine Wash Cold, Low Iron" }
  ],
  faqs: [
    {
      question: "Is Single Layer Heavy Fabric strong enough for ceremonies?",
      answer: "Yes, at 280 GSM, our heavy fabric is much thicker than typical cheap ribbon sashes. It has a substantial matte hand-feel that drapes nicely and looks very clean on camera."
    },
    {
      question: "What is the turnaround time for bulk orders?",
      answer: "Because single layer fabric is streamlined to tailor, orders of 500-2,000 units can be produced and dispatched in as few as 3-4 business days."
    }
  ]
};

// Catalog dictionary
export const sashesCatalog: Record<string, SashProductConfig> = {
  satinsashes: satinSashData,
  velvetsashes: velvetSashData,
  doublelayer: doubleLayerSashData,
  singlelayer: singleLayerSashData,
};
