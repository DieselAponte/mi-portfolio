/**
 * Seed script for Home module data (Services & Cases of Study).
 *
 * Usage:
 *   npx tsx scripts/seed-home-data.ts
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

const mockServices = [
  {
    title: "Full-Stack Development",
    description:
      "From interface craft to backend systems, I design and ship web products that stay reliable at scale.",
    highlights: [
      "TypeScript",
      "React",
      "Next.js",
      "Node",
      "Docker",
      "PostgreSQL",
      "Supabase",
    ],
    order_index: 1,
  },
  {
    title: "UI/UX Frontend",
    description:
      "Interfaces with clarity and motion. I build responsive systems that feel clean, fast, and intentional.",
    highlights: ["Figma", "Design Systems", "Accessibility", "Motion"],
    order_index: 2,
  },
  {
    title: "Optimization",
    description:
      "Performance audits, architectural tuning, and data-driven refinements to keep apps lean and future-ready.",
    highlights: ["Scalability", "Caching", "Telemetry", "CI/CD"],
    order_index: 3,
  },
];

const mockCasesOfStudy = [
  {
    title: "Web Ecommerce",
    description:
      "Scalable commerce platform with realtime inventory, modular UI, and a focused conversion flow.",
    tags: ["TypeScript", "Next.js", "Stripe", "Docker", "Tailwind"],
    order_index: 1,
  },
  {
    title: "Mobile App",
    description:
      "Cross-platform experience built with reusable components, offline caching, and analytics.",
    tags: ["React", "Expo", "Zod", "Supabase"],
    order_index: 2,
  },
  {
    title: "Desktop App",
    description:
      "Internal tooling suite with role-based workflows, audit trails, and operational dashboards.",
    tags: ["Electron", "Node", "PostgreSQL", "CI/CD"],
    order_index: 3,
  },
];

async function seed() {
  console.log("🌱 Seeding Home module data...\n");

  // --- Seed Services ---
  console.log("📋 Clearing existing home_services...");
  const { error: deleteServicesError } = await supabase
    .from("home_services")
    .delete()
    .gt("id", 0); // Delete all rows

  if (deleteServicesError) {
    console.error("  ⚠ Error clearing services:", deleteServicesError.message);
  }

  console.log("📥 Inserting mock services...");
  const { data: insertedServices, error: insertServicesError } = await supabase
    .from("home_services")
    .insert(mockServices)
    .select();

  if (insertServicesError) {
    console.error("  ❌ Error inserting services:", insertServicesError.message);
  } else {
    console.log(`  ✅ Inserted ${insertedServices?.length ?? 0} services.`);
    insertedServices?.forEach((s) =>
      console.log(`     - [${s.id}] ${s.title}`)
    );
  }

  // --- Seed Cases of Study ---
  console.log("\n📋 Clearing existing home_cases_of_study...");
  const { error: deleteCasesError } = await supabase
    .from("home_cases_of_study")
    .delete()
    .gt("id", 0);

  if (deleteCasesError) {
    console.error(
      "  ⚠ Error clearing cases of study:",
      deleteCasesError.message
    );
  }

  console.log("📥 Inserting mock cases of study...");
  const { data: insertedCases, error: insertCasesError } = await supabase
    .from("home_cases_of_study")
    .insert(mockCasesOfStudy)
    .select();

  if (insertCasesError) {
    console.error(
      "  ❌ Error inserting cases of study:",
      insertCasesError.message
    );
  } else {
    console.log(
      `  ✅ Inserted ${insertedCases?.length ?? 0} cases of study.`
    );
    insertedCases?.forEach((c) => console.log(`     - [${c.id}] ${c.title}`));
  }

  console.log("\n🎉 Seed complete!");
}

seed().catch((err) => {
  console.error("Fatal error during seed:", err);
  process.exit(1);
});
