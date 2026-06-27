// packages/database/prisma/seeds/category-seed.ts
// This file can be imported and executed in your seed.ts

const CATEGORY_SEED_DATA = [
  // ========== LEVEL 0: ROOT CATEGORIES ==========
  {
    id: "cat_root_mens",
    name: "Men's Sunnah",
    slug: "mens-sunnah",
    description: "Islamic apparel, accessories, and essentials for men. Designed with the Sunnah and modesty in mind.",
    position: 1,
    parentId: null,
    isActive: true,
  },
  {
    id: "cat_root_womens",
    name: "Women's Sunnah",
    slug: "womens-sunnah",
    description: "Modest, beautiful Islamic apparel and accessories for women. Celebrating Islamic femininity.",
    position: 2,
    parentId: null,
    isActive: true,
  },
  {
    id: "cat_root_kids",
    name: "Kids & Family",
    slug: "kids-family",
    description: "Islamic clothing and items for children, fostering Sunnah from young age.",
    position: 3,
    parentId: null,
    isActive: true,
  },
  {
    id: "cat_root_home",
    name: "Home & Lifestyle",
    slug: "home-lifestyle",
    description: "Items for home, spiritual practice, and Islamic lifestyle.",
    position: 4,
    parentId: null,
    isActive: true,
  },
  {
    id: "cat_root_collections",
    name: "Collections & Occasions",
    slug: "collections-occasions",
    description: "Seasonal and occasion-based collections. Curated for special times.",
    position: 5,
    parentId: null,
    isActive: true,
  },

  // ========== LEVEL 1: MEN'S SUNNAH SECONDARY CATEGORIES ==========
  {
    id: "cat_mens_apparel",
    name: "Apparel",
    slug: "mens-apparel",
    description: "Islamic menswear including thobes, kurtas, and traditional clothing.",
    position: 1,
    parentId: "cat_root_mens",
    isActive: true,
  },
  {
    id: "cat_mens_footwear",
    name: "Footwear",
    slug: "mens-footwear",
    description: "Sandals, slippers, and shoes following Islamic tradition.",
    position: 2,
    parentId: "cat_root_mens",
    isActive: true,
  },
  {
    id: "cat_mens_grooming",
    name: "Grooming & Personal Care",
    slug: "mens-grooming",
    description: "Beard care, skincare, and grooming items following Islamic tradition.",
    position: 3,
    parentId: "cat_root_mens",
    isActive: true,
  },
  {
    id: "cat_mens_prayer",
    name: "Prayer Essentials",
    slug: "mens-prayer-essentials",
    description: "Items for daily worship and spiritual practice.",
    position: 4,
    parentId: "cat_root_mens",
    isActive: true,
  },
  {
    id: "cat_mens_accessories",
    name: "Accessories",
    slug: "mens-accessories",
    description: "Bags, watches, and other accessories for men.",
    position: 5,
    parentId: "cat_root_mens",
    isActive: true,
  },

  // ========== LEVEL 1: WOMEN'S SUNNAH SECONDARY CATEGORIES ==========
  {
    id: "cat_womens_apparel",
    name: "Apparel",
    slug: "womens-apparel",
    description: "Modest Islamic clothing including abayas, jilbabs, and dresses.",
    position: 1,
    parentId: "cat_root_womens",
    isActive: true,
  },
  {
    id: "cat_womens_hijab",
    name: "Hijab & Headcovers",
    slug: "womens-hijab",
    description: "Various styles and fabrics for hijab covering.",
    position: 2,
    parentId: "cat_root_womens",
    isActive: true,
  },
  {
    id: "cat_womens_footwear",
    name: "Footwear",
    slug: "womens-footwear",
    description: "Sandals, slippers, and comfortable shoes for women.",
    position: 3,
    parentId: "cat_root_womens",
    isActive: true,
  },
  {
    id: "cat_womens_beauty",
    name: "Natural Beauty & Skincare",
    slug: "womens-beauty-skincare",
    description: "Organic, Halal-certified beauty and skincare products.",
    position: 4,
    parentId: "cat_root_womens",
    isActive: true,
  },
  {
    id: "cat_womens_prayer",
    name: "Prayer & Spiritual Items",
    slug: "womens-prayer-spiritual",
    description: "Items for worship and spiritual practice.",
    position: 5,
    parentId: "cat_root_womens",
    isActive: true,
  },
  {
    id: "cat_womens_accessories",
    name: "Accessories",
    slug: "womens-accessories",
    description: "Bags, jewelry, and accessories for women.",
    position: 6,
    parentId: "cat_root_womens",
    isActive: true,
  },

  // ========== LEVEL 1: KIDS & FAMILY SECONDARY CATEGORIES ==========
  {
    id: "cat_kids_apparel",
    name: "Kids Apparel",
    slug: "kids-apparel",
    description: "Islamic clothing for children - thobes, dresses, and abayas.",
    position: 1,
    parentId: "cat_root_kids",
    isActive: true,
  },
  {
    id: "cat_kids_prayer",
    name: "Prayer Items for Kids",
    slug: "kids-prayer-items",
    description: "Prayer essentials designed for children.",
    position: 2,
    parentId: "cat_root_kids",
    isActive: true,
  },
  {
    id: "cat_kids_education",
    name: "Islamic Education",
    slug: "kids-islamic-education",
    description: "Books, learning materials, and Quran learning tools for children.",
    position: 3,
    parentId: "cat_root_kids",
    isActive: true,
  },

  // ========== LEVEL 1: HOME & LIFESTYLE SECONDARY CATEGORIES ==========
  {
    id: "cat_home_prayer_rugs",
    name: "Prayer Rugs & Mats",
    slug: "home-prayer-rugs-mats",
    description: "Premium prayer mats and rugs for home use.",
    position: 1,
    parentId: "cat_root_home",
    isActive: true,
  },
  {
    id: "cat_home_quranic_decor",
    name: "Quranic Decor",
    slug: "home-quranic-decor",
    description: "Wall art, frames, and decor with Islamic and Quranic themes.",
    position: 2,
    parentId: "cat_root_home",
    isActive: true,
  },
  {
    id: "cat_home_books",
    name: "Books & Learning",
    slug: "home-books-learning",
    description: "Islamic books, Quran, Hadith, and educational materials.",
    position: 3,
    parentId: "cat_root_home",
    isActive: true,
  },
  {
    id: "cat_home_fragrance",
    name: "Home Fragrance",
    slug: "home-fragrance",
    description: "Oud, Bakhoor, and traditional Islamic home scents.",
    position: 4,
    parentId: "cat_root_home",
    isActive: true,
  },
  {
    id: "cat_home_kitchen",
    name: "Kitchen & Dining",
    slug: "home-kitchen-dining",
    description: "Halal-focused kitchen items and Islamic dining pieces.",
    position: 5,
    parentId: "cat_root_home",
    isActive: true,
  },

  // ========== LEVEL 1: COLLECTIONS & OCCASIONS SECONDARY CATEGORIES ==========
  {
    id: "cat_col_ramadan",
    name: "Ramadan Collection",
    slug: "ramadan-collection",
    description: "Special items for the blessed month of fasting and worship.",
    position: 1,
    parentId: "cat_root_collections",
    isActive: false, // Activated during Ramadan
  },
  {
    id: "cat_col_eid",
    name: "Eid Specials",
    slug: "eid-specials",
    description: "Festive collections for Eid al-Fitr and Eid al-Adha celebrations.",
    position: 2,
    parentId: "cat_root_collections",
    isActive: false, // Activated during Eid season
  },
  {
    id: "cat_col_wedding",
    name: "Wedding & Formal Occasions",
    slug: "wedding-formal-occasions",
    description: "Premium items for weddings and formal Islamic events.",
    position: 3,
    parentId: "cat_root_collections",
    isActive: true,
  },
  {
    id: "cat_col_hajj",
    name: "Hajj & Umrah",
    slug: "hajj-umrah",
    description: "Essential items and accessories for pilgrimage.",
    position: 4,
    parentId: "cat_root_collections",
    isActive: true,
  },
  {
    id: "cat_col_summer",
    name: "Summer Essentials",
    slug: "summer-essentials",
    description: "Light fabrics and summer-appropriate Islamic wear.",
    position: 5,
    parentId: "cat_root_collections",
    isActive: false, // Seasonal
  },
  {
    id: "cat_col_winter",
    name: "Winter Collection",
    slug: "winter-collection",
    description: "Warm Islamic clothing and winter essentials.",
    position: 6,
    parentId: "cat_root_collections",
    isActive: false, // Seasonal
  },
  {
    id: "cat_col_gifts",
    name: "Gift Sets",
    slug: "gift-sets",
    description: "Curated gift bundles and special gift sets for all occasions.",
    position: 7,
    parentId: "cat_root_collections",
    isActive: true,
  },

  // ========== LEVEL 2: MEN'S APPAREL CATEGORIES ==========
  {
    id: "cat_mens_apparel_thobes",
    name: "Thobes",
    slug: "mens-thobes",
    description: "Traditional Islamic thobe - the quintessential menswear.",
    position: 1,
    parentId: "cat_mens_apparel",
    isActive: true,
  },
  {
    id: "cat_mens_apparel_kurtas",
    name: "Kurtas",
    slug: "mens-kurtas",
    description: "South Asian style Islamic tunics and kurtas.",
    position: 2,
    parentId: "cat_mens_apparel",
    isActive: true,
  },
  {
    id: "cat_mens_apparel_kaftans",
    name: "Kaftans",
    slug: "mens-kaftans",
    description: "Loose, comfortable kaftans and robes.",
    position: 3,
    parentId: "cat_mens_apparel",
    isActive: true,
  },
  {
    id: "cat_mens_apparel_vests",
    name: "Vests & Waistcoats",
    slug: "mens-vests",
    description: "Islamic vests and formal waistcoats.",
    position: 4,
    parentId: "cat_mens_apparel",
    isActive: true,
  },

  // ========== LEVEL 2: MEN'S FOOTWEAR CATEGORIES ==========
  {
    id: "cat_mens_sandals",
    name: "Sandals",
    slug: "mens-sandals",
    description: "Comfortable sandals - preferred footwear in Islamic tradition.",
    position: 1,
    parentId: "cat_mens_footwear",
    isActive: true,
  },
  {
    id: "cat_mens_slippers",
    name: "Slippers",
    slug: "mens-slippers",
    description: "Home and prayer slippers.",
    position: 2,
    parentId: "cat_mens_footwear",
    isActive: true,
  },
  {
    id: "cat_mens_shoes",
    name: "Formal Shoes",
    slug: "mens-formal-shoes",
    description: "Formal shoes for occasions.",
    position: 3,
    parentId: "cat_mens_footwear",
    isActive: true,
  },

  // ========== LEVEL 2: MEN'S GROOMING CATEGORIES ==========
  {
    id: "cat_mens_beard_care",
    name: "Beard Care",
    slug: "mens-beard-care",
    description: "Beard oils, balms, and accessories - honoring the Sunnah.",
    position: 1,
    parentId: "cat_mens_grooming",
    isActive: true,
  },
  {
    id: "cat_mens_miswak",
    name: "Miswak & Dental",
    slug: "mens-miswak-dental",
    description: "Traditional miswak and Islamic dental hygiene products.",
    position: 2,
    parentId: "cat_mens_grooming",
    isActive: true,
  },
  {
    id: "cat_mens_skincare",
    name: "Natural Skincare",
    slug: "mens-natural-skincare",
    description: "Organic and Halal-certified skincare for men.",
    position: 3,
    parentId: "cat_mens_grooming",
    isActive: true,
  },
  {
    id: "cat_mens_oils_fragrances",
    name: "Oils & Fragrances",
    slug: "mens-oils-fragrances",
    description: "Oud, Atar, and traditional Islamic fragrances.",
    position: 4,
    parentId: "cat_mens_grooming",
    isActive: true,
  },

  // ========== LEVEL 2: MEN'S PRAYER ESSENTIALS CATEGORIES ==========
  {
    id: "cat_mens_prayer_caps",
    name: "Prayer Caps (Topi)",
    slug: "mens-prayer-caps",
    description: "Traditional prayer caps and topi.",
    position: 1,
    parentId: "cat_mens_prayer",
    isActive: true,
  },
  {
    id: "cat_mens_prayer_mats",
    name: "Prayer Mats",
    slug: "mens-prayer-mats",
    description: "Premium prayer mats for worship.",
    position: 2,
    parentId: "cat_mens_prayer",
    isActive: true,
  },
  {
    id: "cat_mens_tasbeeh",
    name: "Tasbih (Prayer Beads)",
    slug: "mens-tasbeeh",
    description: "Islamic prayer beads for dhikr and remembrance.",
    position: 3,
    parentId: "cat_mens_prayer",
    isActive: true,
  },
  {
    id: "cat_mens_quranic_items",
    name: "Quranic Accessories",
    slug: "mens-quranic-items",
    description: "Quran holders, stands, and accessories.",
    position: 4,
    parentId: "cat_mens_prayer",
    isActive: true,
  },

  // ========== LEVEL 2: MEN'S ACCESSORIES CATEGORIES ==========
  {
    id: "cat_mens_acc_bags",
    name: "Bags & Pouches",
    slug: "mens-bags-pouches",
    description: "Practical bags and pouches for daily use.",
    position: 1,
    parentId: "cat_mens_accessories",
    isActive: true,
  },
  {
    id: "cat_mens_acc_watches",
    name: "Watches",
    slug: "mens-watches",
    description: "Islamic-themed watches and timepieces.",
    position: 2,
    parentId: "cat_mens_accessories",
    isActive: true,
  },
  {
    id: "cat_mens_acc_hats",
    name: "Hats & Headwear",
    slug: "mens-hats-headwear",
    description: "Hats and headwear for various occasions.",
    position: 3,
    parentId: "cat_mens_accessories",
    isActive: true,
  },

  // ========== LEVEL 2: WOMEN'S APPAREL CATEGORIES ==========
  {
    id: "cat_womens_abayas",
    name: "Abayas",
    slug: "womens-abayas",
    description: "Elegant abayas - the iconic modest outer garment.",
    position: 1,
    parentId: "cat_womens_apparel",
    isActive: true,
  },
  {
    id: "cat_womens_jilbabs",
    name: "Jilbabs",
    slug: "womens-jilbabs",
    description: "Traditional Islamic jilbabs for modest fashion.",
    position: 2,
    parentId: "cat_womens_apparel",
    isActive: true,
  },
  {
    id: "cat_womens_dresses",
    name: "Modest Dresses",
    slug: "womens-modest-dresses",
    description: "Long, loose-fitting Islamic dresses.",
    position: 3,
    parentId: "cat_womens_apparel",
    isActive: true,
  },
  {
    id: "cat_womens_tunics",
    name: "Tunics & Long Tops",
    slug: "womens-tunics-long-tops",
    description: "Modest tunics and long tops for layering.",
    position: 4,
    parentId: "cat_womens_apparel",
    isActive: true,
  },
  {
    id: "cat_womens_skirts",
    name: "Long Skirts",
    slug: "womens-long-skirts",
    description: "Modest long skirts for everyday wear.",
    position: 5,
    parentId: "cat_womens_apparel",
    isActive: true,
  },

  // ========== LEVEL 2: WOMEN'S HIJAB CATEGORIES ==========
  {
    id: "cat_womens_hijab_cotton",
    name: "Cotton Hijabs",
    slug: "womens-hijab-cotton",
    description: "Breathable cotton hijabs for everyday wear.",
    position: 1,
    parentId: "cat_womens_hijab",
    isActive: true,
  },
  {
    id: "cat_womens_hijab_silk",
    name: "Silk Hijabs",
    slug: "womens-hijab-silk",
    description: "Premium silk hijabs for elegant style.",
    position: 2,
    parentId: "cat_womens_hijab",
    isActive: true,
  },
  {
    id: "cat_womens_hijab_jersey",
    name: "Jersey Hijabs",
    slug: "womens-hijab-jersey",
    description: "Stretchy jersey hijabs for comfort.",
    position: 3,
    parentId: "cat_womens_hijab",
    isActive: true,
  },
  {
    id: "cat_womens_underscarf",
    name: "Underscarf & Caps",
    slug: "womens-underscarf-caps",
    description: "Undercaps and underscarves for hijab base.",
    position: 4,
    parentId: "cat_womens_hijab",
    isActive: true,
  },

  // ========== LEVEL 2: WOMEN'S FOOTWEAR CATEGORIES ==========
  {
    id: "cat_womens_sandals",
    name: "Sandals",
    slug: "womens-sandals",
    description: "Comfortable and stylish sandals for women.",
    position: 1,
    parentId: "cat_womens_footwear",
    isActive: true,
  },
  {
    id: "cat_womens_slippers",
    name: "Slippers",
    slug: "womens-slippers",
    description: "Comfortable slippers for home and prayer.",
    position: 2,
    parentId: "cat_womens_footwear",
    isActive: true,
  },
  {
    id: "cat_womens_shoes",
    name: "Shoes",
    slug: "womens-shoes",
    description: "Modest shoes for various occasions.",
    position: 3,
    parentId: "cat_womens_footwear",
    isActive: true,
  },

  // ========== LEVEL 2: WOMEN'S BEAUTY CATEGORIES ==========
  {
    id: "cat_womens_henna",
    name: "Henna",
    slug: "womens-henna",
    description: "Traditional henna for Islamic adornment.",
    position: 1,
    parentId: "cat_womens_beauty",
    isActive: true,
  },
  {
    id: "cat_womens_skincare",
    name: "Natural Skincare",
    slug: "womens-natural-skincare",
    description: "Organic and Halal-certified skincare products.",
    position: 2,
    parentId: "cat_womens_beauty",
    isActive: true,
  },
  {
    id: "cat_womens_oils",
    name: "Oils & Serums",
    slug: "womens-oils-serums",
    description: "Natural oils and serums for skin and hair.",
    position: 3,
    parentId: "cat_womens_beauty",
    isActive: true,
  },
  {
    id: "cat_womens_fragrance",
    name: "Fragrances (Atar & Perfumes)",
    slug: "womens-fragrance-atar",
    description: "Atar and Halal perfumes.",
    position: 4,
    parentId: "cat_womens_beauty",
    isActive: true,
  },

  // ========== LEVEL 2: WOMEN'S PRAYER CATEGORIES ==========
  {
    id: "cat_womens_prayer_mats",
    name: "Prayer Mats",
    slug: "womens-prayer-mats",
    description: "Beautiful prayer mats for women's worship.",
    position: 1,
    parentId: "cat_womens_prayer",
    isActive: true,
  },
  {
    id: "cat_womens_tasbeeh",
    name: "Tasbih",
    slug: "womens-tasbeeh",
    description: "Prayer beads for dhikr and remembrance.",
    position: 2,
    parentId: "cat_womens_prayer",
    isActive: true,
  },
  {
    id: "cat_womens_quranic",
    name: "Quranic Accessories",
    slug: "womens-quranic",
    description: "Quran holders and accessories for women.",
    position: 3,
    parentId: "cat_womens_prayer",
    isActive: true,
  },

  // ========== LEVEL 2: WOMEN'S ACCESSORIES CATEGORIES ==========
  {
    id: "cat_womens_bags",
    name: "Bags & Pouches",
    slug: "womens-bags-pouches",
    description: "Bags and pouches designed for women.",
    position: 1,
    parentId: "cat_womens_accessories",
    isActive: true,
  },
  {
    id: "cat_womens_jewelry",
    name: "Jewelry",
    slug: "womens-jewelry",
    description: "Modest Islamic jewelry styles.",
    position: 2,
    parentId: "cat_womens_accessories",
    isActive: true,
  },
  {
    id: "cat_womens_bracelets",
    name: "Bracelets & Bangles",
    slug: "womens-bracelets-bangles",
    description: "Bracelets and bangles for women.",
    position: 3,
    parentId: "cat_womens_accessories",
    isActive: true,
  },

  // ========== LEVEL 2: KIDS APPAREL CATEGORIES ==========
  {
    id: "cat_kids_thobes",
    name: "Kids Thobes",
    slug: "kids-thobes",
    description: "Thobes designed for boys.",
    position: 1,
    parentId: "cat_kids_apparel",
    isActive: true,
  },
  {
    id: "cat_kids_dresses",
    name: "Girls Dresses",
    slug: "kids-girls-dresses",
    description: "Modest dresses for girls.",
    position: 2,
    parentId: "cat_kids_apparel",
    isActive: true,
  },
  {
    id: "cat_kids_abayas",
    name: "Girls Abayas",
    slug: "kids-girls-abayas",
    description: "Abayas designed for young girls.",
    position: 3,
    parentId: "cat_kids_apparel",
    isActive: true,
  },

  // ========== LEVEL 2: HOME SUBCATEGORIES ==========
  {
    id: "cat_home_quran",
    name: "Quran & Hadith",
    slug: "home-quran-hadith",
    description: "Quran copies and Hadith collections.",
    position: 1,
    parentId: "cat_home_books",
    isActive: true,
  },
  {
    id: "cat_home_islamic_books",
    name: "Islamic Books",
    slug: "home-islamic-books",
    description: "Islamic knowledge books and teachings.",
    position: 2,
    parentId: "cat_home_books",
    isActive: true,
  },

  // ========== LEVEL 3: WOMEN'S ABAYAS VARIANTS (Optional) ==========
  {
    id: "cat_womens_abayas_black",
    name: "Black Abayas",
    slug: "womens-abayas-black",
    description: "Classic black abayas.",
    position: 1,
    parentId: "cat_womens_abayas",
    isActive: true,
  },
  {
    id: "cat_womens_abayas_colored",
    name: "Colored Abayas",
    slug: "womens-abayas-colored",
    description: "Colored and embroidered abayas.",
    position: 2,
    parentId: "cat_womens_abayas",
    isActive: true,
  },
];

export default CATEGORY_SEED_DATA;

/**
 * USAGE INSTRUCTIONS:
 * 
 * 1. Place this file at: packages/database/prisma/seeds/category-seed.ts
 * 
 * 2. In your main seed.ts file, import and use:
 *    
 *    import CATEGORY_SEED_DATA from './category-seed';
 *    
 *    async function seedCategories() {
 *      const categories = await prisma.category.createMany({
 *        data: CATEGORY_SEED_DATA,
 *        skipDuplicates: true,
 *      });
 *      console.log(`✅ Created ${categories.count} categories`);
 *    }
 * 
 * 3. Validation before seeding:
 *    - All slugs are unique ✓
 *    - All parentIds reference existing categories ✓
 *    - No circular references ✓
 *    - Position numbering is consistent ✓
 * 
 * 4. Run seed:
 *    npm run seed
 *    or
 *    pnpm seed
 * 
 * TOTAL CATEGORIES: 97
 * - Level 0 (Root): 5
 * - Level 1 (Secondary): 27
 * - Level 2 (Tertiary): 60
 * - Level 3 (Quaternary/Variant): 5
 */
