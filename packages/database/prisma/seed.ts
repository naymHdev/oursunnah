/**
 * Database Seed — Admin account + 20 demo products
 *
 * Run: pnpm --filter @our-sunnah/database seed
 */

import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" }),
});

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@oursunnah.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Admin@123";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? "Super Admin";
const DEMO_IMAGE_URL = "https://via.placeholder.com/500x500?text=OurSunnah";

// Category IDs from the existing categories (assumes categories are already seeded)
const CATEGORIES = {
  mensApparel: "cat_mens_apparel",
  mensFootwear: "cat_mens_footwear",
  mensBeardCare: "cat_mens_beard_care",
  mensPrayerCaps: "cat_mens_prayer_caps",
  womensAbayas: "cat_womens_abayas",
  womensHijab: "cat_womens_hijab",
  womensHenna: "cat_womens_henna",
  womensJewelry: "cat_womens_jewelry",
  kidsApparel: "cat_kids_apparel",
  homeQuran: "cat_home_quran",
  homeFragrance: "cat_home_fragrance",
  hajjUmrah: "cat_col_hajj",
  giftSets: "cat_col_gifts",
};

const PRODUCTS = [
  // Men's Apparel
  {
    name: "Premium White Thobe",
    slug: "premium-white-thobe",
    shortDescription: "Classic white cotton thobe for daily wear",
    description:
      "A beautifully crafted white thobe made from 100% premium cotton. Perfect for daily wear and prayers. Features traditional design with modern comfort.",
    price: 89.99,
    compareAtPrice: 120.0,
    stock: 45,
    brand: "Al-Sunnah",
    categoryIds: [CATEGORIES.mensApparel],
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Kurta with Embroidery",
    slug: "kurta-with-embroidery",
    shortDescription: "South Asian style kurta with traditional embroidery",
    description:
      "Elegant kurta featuring beautiful hand-embroidered patterns. Made from breathable fabric, perfect for formal occasions and daily wear.",
    price: 79.99,
    stock: 32,
    brand: "Islamic Wear Co",
    categoryIds: [CATEGORIES.mensApparel],
    isFeatured: false,
    isActive: true,
  },

  // Men's Footwear
  {
    name: "Comfortable Leather Sandals",
    slug: "leather-sandals-mens",
    shortDescription: "Genuine leather sandals in traditional style",
    description:
      "Premium leather sandals handcrafted for comfort and durability. The perfect Sunnah-inspired footwear for daily use and prayer.",
    price: 54.99,
    compareAtPrice: 75.0,
    stock: 60,
    brand: "Sunnah Steps",
    categoryIds: [CATEGORIES.mensFootwear],
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Black Formal Shoes",
    slug: "black-formal-shoes-mens",
    shortDescription: "Elegant black shoes for formal occasions",
    description:
      "Sophisticated black formal shoes perfect for weddings and special Islamic events. Premium leather with elegant design.",
    price: 99.99,
    stock: 25,
    categoryIds: [CATEGORIES.mensFootwear],
    isFeatured: false,
    isActive: true,
  },

  // Men's Grooming
  {
    name: "Beard Oil - Oud Blend",
    slug: "beard-oil-oud",
    shortDescription: "Premium oud-infused beard oil for grooming",
    description:
      "Luxurious beard oil with oud, argan, and jojoba oils. Promotes healthy beard growth while adding a sophisticated fragrance.",
    price: 34.99,
    compareAtPrice: 49.99,
    stock: 80,
    brand: "Beard & Atar",
    categoryIds: [CATEGORIES.mensBeardCare],
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Traditional Miswak Sticks (Pack of 5)",
    slug: "miswak-sticks-pack",
    shortDescription: "Natural miswak for Islamic dental care",
    description:
      "Pack of 5 authentic miswak sticks sourced from high-quality trees. Essential for Sunnah-based oral hygiene.",
    price: 16.99,
    stock: 120,
    brand: "Natural Smile",
    categoryIds: [CATEGORIES.mensBeardCare],
    isFeatured: false,
    isActive: true,
  },

  // Men's Prayer
  {
    name: "Embroidered Prayer Cap - Navy",
    slug: "prayer-cap-navy",
    shortDescription: "Comfortable embroidered prayer cap",
    description:
      "Lightweight and comfortable prayer cap with beautiful embroidery. Perfect for daily prayers and spiritual occasions.",
    price: 19.99,
    stock: 75,
    brand: "Prayer Essentials",
    categoryIds: [CATEGORIES.mensPrayerCaps],
    isFeatured: false,
    isActive: true,
  },

  // Women's Apparel
  {
    name: "Classic Black Abaya",
    slug: "classic-black-abaya",
    shortDescription: "Timeless black abaya in premium fabric",
    description:
      "Elegant black abaya crafted from soft, breathable fabric. Features traditional cut with modern comfort for everyday wear.",
    price: 74.99,
    compareAtPrice: 95.0,
    stock: 55,
    brand: "Modest Fashion",
    categoryIds: [CATEGORIES.womensAbayas],
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Embroidered Colored Abaya - Olive",
    slug: "abaya-olive-embroidered",
    shortDescription: "Beautifully embroidered olive-colored abaya",
    description:
      "Luxurious colored abaya in olive green with intricate embroidery details. Perfect for special occasions while maintaining modesty.",
    price: 99.99,
    compareAtPrice: 140.0,
    stock: 30,
    brand: "Luxury Modest",
    categoryIds: [CATEGORIES.womensAbayas],
    isFeatured: true,
    isActive: true,
  },

  // Women's Hijab
  {
    name: "Premium Silk Hijab - Rose Gold",
    slug: "silk-hijab-rose-gold",
    shortDescription: "Luxurious silk hijab in rose gold",
    description:
      "Premium quality silk hijab in beautiful rose gold color. Drapes beautifully and provides elegance for any occasion.",
    price: 44.99,
    compareAtPrice: 65.0,
    stock: 40,
    brand: "Silk & Grace",
    categoryIds: [CATEGORIES.womensHijab],
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Cotton Jersey Hijab - Charcoal",
    slug: "jersey-hijab-charcoal",
    shortDescription: "Comfortable jersey hijab for everyday wear",
    description:
      "Stretchy jersey hijab in charcoal color. Perfect for everyday wear due to its comfort and easy styling.",
    price: 18.99,
    stock: 100,
    brand: "Comfort Wear",
    categoryIds: [CATEGORIES.womensHijab],
    isFeatured: false,
    isActive: true,
  },

  // Women's Beauty
  {
    name: "Natural Henna Powder - Premium Grade",
    slug: "henna-powder-premium",
    shortDescription: "100% natural premium henna for beautiful color",
    description:
      "Pure, organic henna powder sourced from top henna plants. Provides rich, natural color for traditional henna application.",
    price: 24.99,
    stock: 65,
    brand: "Henna Heritage",
    categoryIds: [CATEGORIES.womensHenna],
    isFeatured: false,
    isActive: true,
  },
  {
    name: "Women's Islamic Jewelry Set - Gold",
    slug: "jewelry-set-gold",
    shortDescription: "Elegant modest jewelry set in gold tone",
    description:
      "Beautiful collection of modest Islamic jewelry in elegant gold tone. Includes necklace, earrings, and bracelets.",
    price: 89.99,
    compareAtPrice: 130.0,
    stock: 35,
    brand: "Elegance Jewelry",
    categoryIds: [CATEGORIES.womensJewelry],
    isFeatured: true,
    isActive: true,
  },

  // Kids
  {
    name: "Kids Thobe - White",
    slug: "kids-thobe-white",
    shortDescription: "Comfortable white thobe for boys",
    description:
      "Children's thobe in pure white cotton. Designed for comfort and traditional Islamic dress for young boys.",
    price: 39.99,
    stock: 50,
    brand: "Little Sunnah",
    categoryIds: [CATEGORIES.kidsApparel],
    isFeatured: false,
    isActive: true,
  },
  {
    name: "Girls Abaya - Black",
    slug: "girls-abaya-black",
    shortDescription: "Modest black abaya for girls",
    description:
      "Beautifully designed black abaya for young girls. Teaches modesty from a young age with comfortable, breathable fabric.",
    price: 44.99,
    stock: 45,
    brand: "Little Sunnah",
    categoryIds: [CATEGORIES.kidsApparel],
    isFeatured: false,
    isActive: true,
  },

  // Home & Spiritual
  {
    name: "Leather-Bound Quran with Stand",
    slug: "quran-leather-bound-stand",
    shortDescription: "Premium Quran with elegant stand",
    description:
      "Beautiful leather-bound Quran with wooden stand for display and prayer. Perfect for home and spiritual practice.",
    price: 79.99,
    compareAtPrice: 120.0,
    stock: 20,
    brand: "Quranic Arts",
    categoryIds: [CATEGORIES.homeQuran],
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Oud Bakhoor - Premium Blend",
    slug: "oud-bakhoor-premium",
    shortDescription: "Luxurious oud-based home fragrance",
    description:
      "Premium quality oud bakhoor blend for home fragrance. Creates a spiritual atmosphere with traditional Islamic aroma.",
    price: 59.99,
    compareAtPrice: 85.0,
    stock: 55,
    brand: "Atar & Oud",
    categoryIds: [CATEGORIES.homeFragrance],
    isFeatured: true,
    isActive: true,
  },

  // Collections
  {
    name: "Hajj Essentials Package",
    slug: "hajj-essentials-package",
    shortDescription: "Complete package for Hajj and Umrah",
    description:
      "Comprehensive package containing essential items for Hajj and Umrah pilgrimage. Includes prayer essentials, modest wear, and spiritual items.",
    price: 199.99,
    compareAtPrice: 280.0,
    stock: 15,
    brand: "Pilgrimage Pro",
    categoryIds: [CATEGORIES.hajjUmrah],
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Sunnah Living Gift Set",
    slug: "sunnah-living-gift-set",
    shortDescription: "Curated gift set celebrating Islamic lifestyle",
    description:
      "Beautiful gift set combining prayer essentials, grooming products, and home items. Perfect for any Islamic occasion.",
    price: 149.99,
    compareAtPrice: 220.0,
    stock: 25,
    brand: "Gift Collections",
    categoryIds: [CATEGORIES.giftSets],
    isFeatured: true,
    isActive: true,
  },
];

async function seedAdmin() {
  console.log("🌱  Seeding SUPER_ADMIN account…\n");

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      role: "SUPER_ADMIN",
      password: hashedPassword,
    },
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "SUPER_ADMIN",
      emailVerified: true,
    },
  });

  console.log("✅  SUPER_ADMIN seeded:");
  console.log(`    Name  : ${admin.name}`);
  console.log(`    Email : ${admin.email}`);
  console.log(`    Role  : ${admin.role}\n`);
}

async function seedProducts() {
  console.log("🌱  Seeding 20 demo products…\n");

  for (const productData of PRODUCTS) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        name: productData.name,
        slug: productData.slug,
        shortDescription: productData.shortDescription,
        description: productData.description,
        sku: productData.slug.toUpperCase().slice(0, 12),
        brand: productData.brand,
        price: productData.price.toString(),
        compareAtPrice: productData.compareAtPrice?.toString(),
        stock: productData.stock,
        isActive: productData.isActive,
        isFeatured: productData.isFeatured,
        images: {
          create: [
            {
              url: DEMO_IMAGE_URL,
              publicId: productData.slug,
              position: 0,
            },
          ],
        },
        categories: {
          connect: productData.categoryIds.map((categoryId) => ({
            id: categoryId,
          })),
        },
      },
    });

    console.log(`✅  ${product.name}`);
  }

  console.log(`\n🎉  ${PRODUCTS.length} products seeded successfully!`);
}

async function main() {
  try {
    await seedAdmin();
    await seedProducts();
    console.log("\n✨  Database seeding complete!");
  } catch (e) {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  }
}

main().finally(() => prisma.$disconnect());
