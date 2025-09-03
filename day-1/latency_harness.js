import fs from "fs";
import path from "path";
import { createObjectCsvWriter } from "csv-writer";
import { fileURLToPath } from "url";
import "dotenv/config";
// import play from "play-sound";

// Configuration
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const TTS_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`;

// User inputs
const TEXT = "Hello world, this is a test.";

const NUM_TRIALS = 10;

// CSV output path
const CSV_PATH = path.resolve("output/tts_timing_results.csv");

const csvWriter = createObjectCsvWriter({
  path: CSV_PATH,
  header: [
    { id: "trial", title: "trial" },
    { id: "timestamp", title: "timestamp" },
    { id: "ttfb", title: "ttfb" },
    { id: "ttfs", title: "ttfs" },
  ],
});

async function runTrial(trial) {
  const start = process.hrtime.bigint();

  const res = await fetch(TTS_URL, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      accept: "audio/mpeg",
      "content-type": "application/json",
    },
    body: JSON.stringify({ text: TEXT, voice_settings: {} }),
  });

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

  // Save streamed MP3 to temp file
  const tmpFile = path.join(__dirname, `output/trial_${trial}.mp3`);

  const fileStream = fs.createWriteStream(tmpFile);
  const reader = res.body.getReader();

  let ttfb = null;
  let done = false;

  while (!done) {
    const { done: d, value } = await reader.read();
    if (d) {
      done = true;
    } else {
      if (ttfb === null) {
        const now = process.hrtime.bigint();
        ttfb = Number(now - start) / 1e9;
      }
      fileStream.write(value);
    }
  }
  fileStream.end();

  // Measure TTFS when system player starts
  // const player = play();
  const tPlayPromise = new Promise((resolve, reject) => {
    const playStart = process.hrtime.bigint();
    // const child = player.play(tmpFile, (err) => {
    //   if (err) reject(err);
    //   else resolve();
    // });

    // Approximate TTFS as when child process is spawned
    const ttfs = Number(playStart - start) / 1e9;
    resolve({ ttfb, ttfs });
  });

  const { ttfb: measuredTTFB, ttfs } = await tPlayPromise;

  return {
    trial,
    timestamp: Date.now(),
    ttfb: ttfb ?? measuredTTFB,
    ttfs,
  };
}

(async () => {
  const results = [];
  for (let i = 1; i <= NUM_TRIALS; i++) {
    const res = await runTrial(i);
    console.log(
      `Trial ${i}: TTFB=${res.ttfb.toFixed(3)}s, TTFS=${res.ttfs.toFixed(3)}s`
    );
    results.push(res);
  }
  await csvWriter.writeRecords(results);
  console.log(`✅ Results written to ${CSV_PATH}`);
})();
