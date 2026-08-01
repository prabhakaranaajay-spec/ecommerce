export const BRAND_INFO = {
  name: "The Chennai Silks",
  tagline: "A Legacy in Every Stitch • Est. 1962",
  founder: "Thiru. A. Kulandaivel Mudaliar",
  origins: "Village near Avinashi (1962) • First showroom Tirupur (1991) as Kumaran Silks • Renamed The Chennai Silks (2001)",
  guinnessRecord: {
    title: "Guinness World Record - Most Expensive Silk Saree",
    valuation: "$100,021 (₹41 Lakhs)",
    craftHours: "4,760 Hours of Master Craftsmanship",
    artwork: "Features 11 famous paintings by Raja Ravi Varma, including 'Galaxy of Musicians'",
    year: 2007
  },
  expansion: "₹50 Crore Ultra-Modern Garment Unit in Mannargudi, Tamil Nadu (Nov 2025)",
  exporters: "Trusted Exporters for Decathlon, Carrefour, and Hanes across US & Europe"
};

export const HERO_SLIDES = [
  {
    id: "hero-guinness",
    dressId: "dress-guinness",
    tag: "🏆 GUINNESS WORLD RECORD 2007",
    title: "Raja Ravi Varma $100,021 Silk Saree",
    subtitle: "The world's most expensive silk saree (₹41 Lakhs) featuring 11 iconic paintings by Raja Ravi Varma including 'Galaxy of Musicians'. 4,760 hours of artisan weaving.",
    price: 100021,
    originalPrice: 120000,
    image: "images/guinness.jpg",
    accentColor: "#D4AF37",
    category: "Guinness Record Heritage"
  },
  {
    id: "hero-kanchipuram",
    dressId: "dress-kanchipuram",
    tag: "BRIDAL HERITAGE 2026",
    title: "Royal Crimson Kanchipuram Silk Saree",
    subtitle: "Hand-woven pure Mulberry silk with heavy 24k gold zari temple borders, crafted by master weavers in South India.",
    price: 2850,
    originalPrice: 3200,
    image: "images/kanchipuram_red.jpg",
    accentColor: "#7209b7",
    category: "Bridal Silk"
  },
  {
    id: "hero-peacock",
    dressId: "dress-peacock",
    tag: "PEACOCK ROYALTY",
    title: "Peacock Blue Zari Silk Couture Gown",
    subtitle: "Modernized Indo-Western fusion silk gown featuring traditional Kanchipuram zari motifs and structured corset bodice.",
    price: 2100,
    originalPrice: 2500,
    image: "images/peacock_blue.jpg",
    accentColor: "#0F382C",
    category: "Evening Gowns"
  },
  {
    id: "hero-1",
    dressId: "dress-1",
    tag: "HAUTE COUTURE",
    title: "Midnight Silk Runway Gown",
    subtitle: "Hand-crafted pure Mulberry silk gown with dynamic flowing silhouette and gold embellishments.",
    price: 1850,
    originalPrice: 2200,
    image: "images/hero1.jpg",
    accentColor: "#D4AF37",
    category: "Evening Gowns"
  }
];

export const DRESSES_CATALOG = [
  {
    id: "dress-guinness",
    title: "Guinness World Record Raja Ravi Varma Saree",
    tag: "Guinness Record",
    category: "Bridal Silk",
    price: 100021,
    originalPrice: 120000,
    rating: 5.0,
    reviewsCount: 128,
    isNew: true,
    isFeatured: true,
    mainImage: "images/guinness.jpg",
    thumbnails: [
      "images/guinness.jpg",
      "images/kanchipuram_red.jpg",
      "images/peacock_blue.jpg"
    ],
    colors: [
      { name: "24K Gold & Multi-Hue Palette", hex: "#D4AF37" }
    ],
    sizes: ["Custom Fit", "S", "M", "L"],
    fabric: "100% Pure Mulberry Silk & 24K Gold Zari Threadwork with Mineral Dyes",
    care: "Preserved in Museum-Grade Glass Showcase. Professional White-Glove Concierge Handling.",
    description: "Certified by Guinness World Records as the most expensive saree in human history. Features faithful woven reproductions of 11 masterpiece paintings by Raja Ravi Varma, centered around 'Galaxy of Musicians'. Requiring 4,760 hours of precision hand-loom work.",
    stock: "Showroom Vault Piece (Bespoke Replica Available)",
    subCollections: [
      { id: "acc-g1", name: "24K Gold Zari Clutch", price: 1250, image: "images/guinness.jpg", type: "Accessory" },
      { id: "acc-g2", name: "Temple Antique Necklace Set", price: 3400, image: "images/kanchipuram_red.jpg", type: "Jewelry" }
    ]
  },
  {
    id: "dress-kanchipuram",
    title: "Royal Crimson Kanchipuram Silk Saree",
    tag: "Bridal Heritage",
    category: "Bridal Silk",
    price: 2850,
    originalPrice: 3200,
    rating: 4.95,
    reviewsCount: 84,
    isNew: true,
    isFeatured: true,
    mainImage: "images/kanchipuram_red.jpg",
    thumbnails: [
      "images/kanchipuram_red.jpg",
      "images/guinness.jpg",
      "images/hero3.jpg"
    ],
    colors: [
      { name: "Crimson Red & Gold", hex: "#800020" },
      { name: "Maroon Zari", hex: "#4A0E17" },
      { name: "Imperial Gold", hex: "#D4AF37" }
    ],
    sizes: ["Standard Saree (6.3m)", "Custom Fit"],
    fabric: "Authentic Silk Mark Certified Pure Kanchipuram Silk with Tested Zari",
    care: "Dry clean only. Roll in muslin cloth for preservation.",
    description: "The crown jewel of South Indian bridal traditions. Woven in Tirupur and Kanchipuram using ancient double-warp silk techniques.",
    stock: "In Stock (Ready to Ship)",
    subCollections: [
      { id: "acc-k1", name: "Kanchipuram Silk Blouse Fabric", price: 350, image: "images/kanchipuram_red.jpg", type: "Unstitched" },
      { id: "acc-k2", name: "Gold Temple Vanki (Armband)", price: 890, image: "images/guinness.jpg", type: "Jewelry" }
    ]
  },
  {
    id: "dress-peacock",
    title: "Peacock Blue Zari Silk Couture Gown",
    tag: "Fusion Couture",
    category: "Evening Gowns",
    price: 2100,
    originalPrice: 2500,
    rating: 4.9,
    reviewsCount: 61,
    isNew: true,
    isFeatured: true,
    mainImage: "images/peacock_blue.jpg",
    thumbnails: [
      "images/peacock_blue.jpg",
      "images/hero1.jpg",
      "images/card1.jpg"
    ],
    colors: [
      { name: "Peacock Blue", hex: "#005f73" },
      { name: "Royal Teal", hex: "#0A3641" },
      { name: "Champagne Gold", hex: "#D4AF37" }
    ],
    sizes: ["S", "M", "L", "XL", "Custom Fit"],
    fabric: "Heavy Kanchipuram Brocade Silk with Metallic Threadwork",
    care: "Dry clean only.",
    description: "A contemporary fusion of South Indian silk craftsmanship and European haute couture gown silhouettes.",
    stock: "In Stock",
    subCollections: [
      { id: "acc-p1", name: "Peacock Motif Silk Stole", price: 420, image: "images/peacock_blue.jpg", type: "Accessory" }
    ]
  },
  {
    id: "dress-1",
    title: "Midnight Silk Runway Gown",
    tag: "Haute Couture",
    category: "Evening Gowns",
    price: 1850,
    originalPrice: 2200,
    rating: 4.9,
    reviewsCount: 38,
    isNew: false,
    isFeatured: false,
    mainImage: "images/hero1.jpg",
    thumbnails: [
      "images/hero1.jpg",
      "images/card1.jpg",
      "images/hero2.jpg"
    ],
    colors: [
      { name: "Midnight Black", hex: "#0b0b0f" },
      { name: "Champagne Gold", hex: "#d4af37" }
    ],
    sizes: ["S", "M", "L", "XL", "Custom Fit"],
    fabric: "100% Pure Mulberry Silk & Zari Accents",
    care: "Dry clean only.",
    description: "Crafted for global galas and red-carpet events, combining soft silk drape with structured corsetry.",
    stock: "In Stock",
    subCollections: [
      { id: "acc-1", name: "Crystal Gala Clutch", price: 420, image: "images/card1.jpg", type: "Accessory" }
    ]
  },
  {
    id: "dress-2",
    title: "Emerald Empress Satin Gown",
    tag: "Royal Collection",
    category: "Evening Gowns",
    price: 2400,
    originalPrice: 2800,
    rating: 5.0,
    reviewsCount: 52,
    isNew: false,
    isFeatured: false,
    mainImage: "images/hero2.jpg",
    thumbnails: [
      "images/hero2.jpg",
      "images/hero1.jpg",
      "images/card1.jpg"
    ],
    colors: [
      { name: "Emerald Green", hex: "#0F382C" },
      { name: "Imperial Gold", hex: "#d4af37" }
    ],
    sizes: ["S", "M", "L", "XL", "Custom Fit"],
    fabric: "Heavyweight Italian Duchess Satin with Zari Brocade",
    care: "Dry clean only.",
    description: "Features structured hip box pleats and floor-sweeping cathedral train.",
    stock: "Made to Order",
    subCollections: []
  },
  {
    id: "dress-3",
    title: "Ethereal Blush Crystal Bridal Gown",
    tag: "Bridal Couture",
    category: "Bridal Silk",
    price: 3100,
    originalPrice: 3500,
    rating: 4.95,
    reviewsCount: 44,
    isNew: false,
    isFeatured: false,
    mainImage: "images/hero3.jpg",
    thumbnails: [
      "images/hero3.jpg",
      "images/hero1.jpg",
      "images/hero2.jpg"
    ],
    colors: [
      { name: "Blush Pink", hex: "#E8A598" },
      { name: "Ivory White", hex: "#FDFBF7" }
    ],
    sizes: ["S", "M", "L", "XL", "Custom Fit"],
    fabric: "Hand-pleated French Tulle & Pure Silk Organza",
    care: "Specialized dry clean.",
    description: "Multi-layered romantic tulle gown with hand-sewn crystal detailing.",
    stock: "In Stock",
    subCollections: []
  },
  {
    id: "dress-4",
    title: "Burgundy Velvet Sirene Dress",
    tag: "Cocktail Party",
    category: "Cocktail",
    price: 950,
    originalPrice: 1100,
    rating: 4.8,
    reviewsCount: 29,
    isNew: true,
    isFeatured: false,
    mainImage: "images/card1.jpg",
    thumbnails: [
      "images/card1.jpg",
      "images/hero1.jpg",
      "images/hero2.jpg"
    ],
    colors: [
      { name: "Royal Burgundy", hex: "#5c061c" },
      { name: "Midnight Navy", hex: "#0a192f" }
    ],
    sizes: ["S", "M", "L", "XL", "Custom Fit"],
    fabric: "Stretch Plush Velvet with Silk Satin Lining",
    care: "Dry clean.",
    description: "Flattering figure-hugging silhouette with off-the-shoulder draped collar.",
    stock: "In Stock",
    subCollections: []
  }
];

export const CATEGORIES = [
  "All Dresses",
  "Guinness Record Heritage",
  "Bridal Silk",
  "Evening Gowns",
  "Cocktail"
];
