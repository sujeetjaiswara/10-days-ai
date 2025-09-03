import { createClient } from "@deepgram/sdk";
import { createObjectCsvWriter } from "csv-writer";
import "dotenv/config";
import fs from "fs";
import path from "path";
import play from "play-sound";
import { fileURLToPath } from "url";

const text = `Thank you for your patience while we reviewed your account history; I've applied a loyalty discount of $45.75 to your next billing cycle. You can verify this adjustment by logging into your account with reference code CS-92140.`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
const deepgram = createClient(deepgramApiKey);
const CSV_FILE = path.resolve("output/latency_log.csv");

// CSV logger setup
const csvWriter = createObjectCsvWriter({
  path: CSV_FILE,
  header: [
    { id: "trial", title: "trial" },
    { id: "timestamp", title: "timestamp" },
    { id: "ttfb", title: "ttfb" },
    { id: "ttfs", title: "ttfs" },
  ],
});

async function runTrial(trial) {
  const start = process.hrtime.bigint();

  const response = await deepgram.speak.request(
    { text },
    { model: "aura-2-thalia-en" }
  );

  const stream = await response.getStream();
  if (!stream) throw new Error("No audio stream received from Deepgram");

  const outputFile = path.join(__dirname, `output/trial_${trial}.mp3`);
  const fileStream = fs.createWriteStream(outputFile);

  let ttfb = null;

  // Read chunks manually
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    if (ttfb === null) {
      const now = process.hrtime.bigint();
      ttfb = Number(now - start) / 1e9;
    }

    fileStream.write(Buffer.from(value));
  }
  fileStream.end();

  // Measure TTFS when playback process starts
  const player = play();
  const ttfsPromise = new Promise((resolve, reject) => {
    const playStart = process.hrtime.bigint();
    player.play(outputFile, (err) => {
      if (err) reject(err);
    });
    const ttfs = Number(playStart - start) / 1e9;
    resolve(ttfs);
  });

  const ttfs = await ttfsPromise;

  return {
    trial,
    timestamp: Date.now(),
    ttfb,
    ttfs,
  };
}

(async () => {
  const NUM_TRIALS = 2; // change to 10 if you want
  const results = [];

  for (let i = 1; i <= NUM_TRIALS; i++) {
    const res = await runTrial(i);
    console.log(
      `Trial ${i}: TTFB=${res.ttfb.toFixed(3)}s, TTFS=${res.ttfs.toFixed(3)}s`
    );
    results.push(res);
  }

  await csvWriter.writeRecords(results);
  console.log(`✅ Results written to ${CSV_FILE}`);
})();
