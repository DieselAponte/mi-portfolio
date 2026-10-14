/**
 * Seed script for Trayectory module data (Technologies, Topics, NivelPublicacion).
 *
 * Usage:
 *   npx tsx scripts/seed-trayectory-data.ts
 *
 * Requires environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing environment variables: NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const predefinedTopics = [
  "Software Architecture", "Cloud Computing", "Cybersecurity", "Data Science", 
  "IoT & Embedded Systems", "Networking & Telecom", "Machine Learning", 
  "DevOps & CI/CD", "UI/UX Design", "Database Engineering"
].map(name => ({ name, is_predefined: true }));

const predefinedTechnologies = [
  // Desarrollo
  ...["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "Docker", "Tailwind CSS", "GraphQL", "Redis", "Supabase"]
    .map(name => ({ name, sector: "Desarrollo", is_predefined: true })),
  // Ciberseguridad
  ...["Wireshark", "Nmap", "Burp Suite", "Metasploit", "OWASP ZAP", "Snort", "Kali Linux", "Hashicorp Vault", "OpenSSL", "Splunk"]
    .map(name => ({ name, sector: "Ciberseguridad", is_predefined: true })),
  // Big Data / Data Science
  ...["Python", "Pandas", "Apache Spark", "TensorFlow", "Jupyter", "Airflow", "Kafka", "Tableau", "Scikit-learn", "Hadoop"]
    .map(name => ({ name, sector: "Big Data / Data Science", is_predefined: true })),
];

async function seed() {
  console.log("🌱 Seeding Trayectory module data...\n");

  // 1. CLEAR EXISTING DATA
  console.log("📋 Clearing existing data (cascade will handle details)...");
  await supabase.from("nivel_publicacion").delete().gt("id", 0);
  await supabase.from("technologies").delete().gt("id", 0);
  await supabase.from("topics").delete().gt("id", 0);

  // 2. SEED TOPICS
  console.log("📥 Inserting predefined topics...");
  const { data: topics, error: topicsErr } = await supabase.from("topics").insert(predefinedTopics).select();
  if (topicsErr) console.error("❌ Error topics:", topicsErr.message);

  // 3. SEED TECHNOLOGIES
  console.log("📥 Inserting predefined technologies...");
  const { data: techs, error: techsErr } = await supabase.from("technologies").insert(predefinedTechnologies).select();
  if (techsErr) console.error("❌ Error technologies:", techsErr.message);

  // 4. MOCK PUBLICATIONS
  console.log("📥 Inserting mock publications...");

  // --- EDUCATION ---
  const { data: eduPub } = await supabase.from("nivel_publicacion").insert({
    title: "Academic Path",
    description: "A structured foundation in algorithms, data structures, and human-centered systems. The focus stayed on building reliable, scalable architecture with a bias toward real-world implementation.",
    type: "EDUCATION",
    order_index: 1,
  }).select().single();

  if (eduPub) {
    await supabase.from("education_details").insert({
      publicacion_id: eduPub.id,
      institution: "Aperture Education Initiative",
      obtained_date: "2020 - 2024",
      skills_learned: ["Algorithmic Thinking", "Software Architecture", "Database Design", "Low-level Systems"]
    });
    // Add topics/tech
    const someTopics = topics?.slice(0, 2) || [];
    if (someTopics.length > 0) {
      await supabase.from("nivel_publicacion_topics").insert(someTopics.map(t => ({ publicacion_id: eduPub.id, topic_id: t.id })));
    }
  }

  // --- PROJECT ---
  const { data: projPub } = await supabase.from("nivel_publicacion").insert({
    title: "Interface Orchestration",
    description: "A complete overhaul of the primary terminal interface, optimizing rendering cycles and state synchronization across multiple subsystems.",
    type: "PROJECT",
    order_index: 2,
  }).select().single();

  if (projPub) {
    await supabase.from("project_details").insert({
      publicacion_id: projPub.id,
      why_i_built_this: "To improve latency and reduce rendering bottlenecks in the main console.",
      how_it_works: "Implemented a custom virtual DOM diffing algorithm and moved heavy computation to WebWorkers.",
      what_i_learned: ["Advanced state management", "WebWorker integration", "Performance profiling"],
      url_repository: "https://github.com/example/interface-orchestration",
      status: "En desarrollo"
    });
    const someTechs = techs?.slice(0, 3) || [];
    if (someTechs.length > 0) {
      await supabase.from("nivel_publicacion_technologies").insert(someTechs.map(t => ({ publicacion_id: projPub.id, technology_id: t.id })));
    }
  }

  // --- EXPERIENCE ---
  const { data: expPub } = await supabase.from("nivel_publicacion").insert({
    title: "Core Systems Engineer",
    description: "Lead development of the central processing unit interfaces and auxiliary monitoring systems.",
    type: "EXPERIENCE",
    order_index: 3,
  }).select().single();

  if (expPub) {
    await supabase.from("professional_exp_details").insert({
      publicacion_id: expPub.id,
      company: "Aperture Science"
    });
    await supabase.from("publication_responsibilities").insert([
      { publicacion_id: expPub.id, content: "Architect scalable frontend solutions", order_index: 1 },
      { publicacion_id: expPub.id, content: "Maintain legacy systems", order_index: 2 },
      { publicacion_id: expPub.id, content: "Optimize CI/CD pipelines", order_index: 3 }
    ]);
    await supabase.from("publication_achievements").insert([
      { publicacion_id: expPub.id, content: "Reduced bundle size by 40%", order_index: 1 },
      { publicacion_id: expPub.id, content: "Improved test coverage to 95%", order_index: 2 },
      { publicacion_id: expPub.id, content: "Deployed 3 major features", order_index: 3 }
    ]);
    const someTechs = techs?.slice(3, 7) || [];
    if (someTechs.length > 0) {
      await supabase.from("nivel_publicacion_technologies").insert(someTechs.map(t => ({ publicacion_id: expPub.id, technology_id: t.id })));
    }
  }

  console.log("\n🎉 Seed complete!");
}

seed().catch((err) => {
  console.error("Fatal error during seed:", err);
  process.exit(1);
});
