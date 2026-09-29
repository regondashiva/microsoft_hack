export {};

async function runQuery(query: string, label: string) {
  console.log(`\n========================================`);
  console.log(`TEST: ${label}`);
  console.log(`QUERY: "${query}"`);
  console.log(`========================================`);

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch("http://localhost:3000/api/strategist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 503 && attempt < 3) {
          console.warn(`[Attempt ${attempt}] Temporary 503, retrying in 1.5s...`);
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }
        console.error(`HTTP ERROR ${res.status}:`, data);
        return false;
      }

      console.log("SUCCESS:", data.success);
      console.log("SUMMARY:\n", data.strategy?.summary);
      console.log("\nRECOMMENDATIONS:");
      data.strategy?.recommendations?.forEach((r: { title: string; description: string }, i: number) => {
        console.log(`  ${i + 1}. [${r.title}] ${r.description}`);
      });
      console.log("\nREASONING:\n", data.strategy?.reasoning);
      console.log("\nMEMORY USED:\n", data.strategy?.memoryUsed);
      console.log("\nCAVEATS:\n", data.strategy?.caveats);
      return true;
    } catch (err) {
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, 1500));
        continue;
      }
      console.error("FAILED TO FETCH:", err);
      return false;
    }
  }
  return false;
}

async function main() {
  // Query 1: LinkedIn campaigns
  await runQuery(
    "What worked in our previous LinkedIn campaigns?",
    "QUERY 1 — LinkedIn Campaign Performance Context"
  );

  // Query 2: Instagram campaigns
  await runQuery(
    "What worked in our Instagram campaigns?",
    "QUERY 2 — Instagram Campaign Performance Context"
  );

  // Query 3: What should we test next
  await runQuery(
    "What should we test next based on previous campaigns?",
    "QUERY 3 — Cross-Campaign Intelligence & Grounded Testing"
  );

  // Query 4: Tone and brand voice
  await runQuery(
    "What tone should Northstar use?",
    "QUERY 4 — Tone Query (Brand Memory Primary, No Campaign Metrics Domination)"
  );

  // Query 5: 2027 Revenue forecast
  await runQuery(
    "Give me a 2027 revenue forecast.",
    "QUERY 5 — Revenue/Financial Query (Strict Refusal of Fabricated Metrics)"
  );
}

main();
