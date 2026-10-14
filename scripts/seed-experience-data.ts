/**
 * Seed script for Experience module data (Certifications & Carousel Items).
 *
 * Usage:
 *   npx tsx scripts/seed-experience-data.ts
 *
 * Requires environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "❌ Missing environment variables: NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const mockCertifications = [
  {
    title: "IPMA",
    meta: "LEVEL D // 2024",
    url: "",
    order_index: 1,
  },
  {
    title: "SCRUM",
    meta: "PSM-1 // 2023",
    url: "",
    order_index: 2,
  },
  {
    title: "UX",
    meta: "CERTIFIED // 2022",
    url: "",
    order_index: 3,
  },
  {
    title: "R3F",
    meta: "PIPELINE // 2025",
    url: "",
    order_index: 4,
  },
];

const mockCarouselItems = [
  {
    title: "Facility overview",
    subtitle: "Aperture labs",
    image_path: "/images/portal-ending.jpg",
    order_index: 1,
  },
  {
    title: "Field diagnostics",
    subtitle: "Operator UI",
    image_path: "/images/portal-ending.jpg",
    order_index: 2,
  },
  {
    title: "Telemetry vault",
    subtitle: "Signal archive",
    image_path: "/images/portal-ending.jpg",
    order_index: 3,
  },
];

async function seed() {
  console.log("🌱 Seeding Experience module data...\n");

  // --- Seed Certifications ---
  console.log("📋 Clearing existing experience_certifications...");
  const { error: deleteCertsError } = await supabase
    .from("experience_certifications")
    .delete()
    .gt("id", 0);

  if (deleteCertsError) {
    console.error("  ⚠ Error clearing certifications:", deleteCertsError.message);
  }

  console.log("📥 Inserting mock certifications...");
  const { data: insertedCerts, error: insertCertsError } = await supabase
    .from("experience_certifications")
    .insert(mockCertifications)
    .select();

  if (insertCertsError) {
    console.error("  ❌ Error inserting certifications:", insertCertsError.message);
  } else {
    console.log(`  ✅ Inserted ${insertedCerts?.length ?? 0} certifications.`);
    insertedCerts?.forEach((c) =>
      console.log(`     - [${c.id}] ${c.title} — ${c.meta}`)
    );
  }

  // --- Seed Carousel Items ---
  console.log("\n📋 Clearing existing experience_carousel_items...");
  const { error: deleteCarouselError } = await supabase
    .from("experience_carousel_items")
    .delete()
    .gt("id", 0);

  if (deleteCarouselError) {
    console.error(
      "  ⚠ Error clearing carousel items:",
      deleteCarouselError.message
    );
  }

  console.log("📥 Inserting mock carousel items...");
  const { data: insertedItems, error: insertItemsError } = await supabase
    .from("experience_carousel_items")
    .insert(mockCarouselItems)
    .select();

  if (insertItemsError) {
    console.error(
      "  ❌ Error inserting carousel items:",
      insertItemsError.message
    );
  } else {
    console.log(
      `  ✅ Inserted ${insertedItems?.length ?? 0} carousel items.`
    );
    insertedItems?.forEach((i) =>
      console.log(`     - [${i.id}] ${i.title} — ${i.subtitle}`)
    );
  }

  console.log("\n🎉 Seed complete!");
}

seed().catch((err) => {
  console.error("Fatal error during seed:", err);
  process.exit(1);
});
