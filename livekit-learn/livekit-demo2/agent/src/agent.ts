import {
  type JobContext,
  type JobProcess,
  WorkerOptions,
  cli,
  defineAgent,
  metrics,
  voice,
} from '@livekit/agents';
import * as livekit from '@livekit/agents-plugin-livekit';
import * as silero from '@livekit/agents-plugin-silero';
import { BackgroundVoiceCancellation } from '@livekit/noise-cancellation-node';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: '.env.local' });

class Assistant extends voice.Agent {
  constructor() {
    super({
      instructions: `You are a helpful assistant communicating via voice`,
    });
  }
}

export default defineAgent({
  prewarm: async (proc: JobProcess) => {
    proc.userData.vad = await silero.VAD.load();
  },
  entry: async (ctx: JobContext) => {
    const session = new voice.AgentSession({
      stt: 'deepgram/nova-3',
      llm: 'openai/gpt-4o-mini',
      tts: 'cartesia/sonic-2:9626c31c-bec5-4cca-baa8-f8ba9e84c8bc',
      turnDetection: new livekit.turnDetector.MultilingualModel(),
      vad: ctx.proc.userData.vad! as silero.VAD,
    });

    // Metrics collection, to measure pipeline performance
    const usageCollector = new metrics.UsageCollector();

    session.on(voice.AgentSessionEventTypes.MetricsCollected, (ev) => {
      llm_metrics_wrapper(ev.metrics);
      usageCollector.collect(ev.metrics);
    });

    session.on(voice.AgentSessionEventTypes.MetricsCollected, (ev) => {
      stt_metrics_wrapper(ev.metrics);
      usageCollector.collect(ev.metrics);
    });

    session.on(voice.AgentSessionEventTypes.MetricsCollected, (ev) => {
      eou_metrics_wrapper(ev.metrics);
      usageCollector.collect(ev.metrics);
    });

    session.on(voice.AgentSessionEventTypes.MetricsCollected, (ev) => {
      tts_metrics_wrapper(ev.metrics);
      usageCollector.collect(ev.metrics);
    });

    const logUsage = async () => {
      const summary = usageCollector.getSummary();
      console.log(`Usage: ${JSON.stringify(summary)}`);
    };

    ctx.addShutdownCallback(logUsage);

    await session.start({
      agent: new Assistant(),
      room: ctx.room,
      inputOptions: {
        // For telephony applications, use `TelephonyBackgroundVoiceCancellation` for best results
        noiseCancellation: BackgroundVoiceCancellation(),
      },
    });

    // Join the room and connect to the user
    await ctx.connect();

    const handle = session.generateReply({
      instructions: 'Greet the user and offer your assistance.',
    });
  },
});

cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));

async function llm_metrics_wrapper(metrics: any) {
  await on_llm_metrics_collected(metrics);
}

async function stt_metrics_wrapper(metrics: any) {
  await on_stt_metrics_collected(metrics);
}

async function eou_metrics_wrapper(metrics: any) {
  await on_eou_metrics_collected(metrics);
}

async function tts_metrics_wrapper(metrics: any) {
  await on_tts_metrics_collected(metrics);
}

async function on_llm_metrics_collected(metrics: metrics.LLMMetrics): Promise<void> {
  console.log('\n--- LLM Metrics ---');
  console.log(`Prompt Tokens: ${metrics.promptTokens}`);
  console.log(`Completion Tokens: ${metrics.completionTokens}`);
  console.log(`Tokens per second: ${metrics.tokensPerSecond?.toFixed(4)}`);
  console.log(`TTFT: ${metrics.ttft?.toFixed(4)}s`);
  console.log('------------------\n');
}

async function on_stt_metrics_collected(metrics: metrics.STTMetrics): Promise<void> {
  console.log('\n--- STT Metrics ---');
  console.log(`Duration: ${metrics.duration?.toFixed(4)}s`);
  console.log(`Audio Duration: ${metrics.audioDuration?.toFixed(4)}s`);
  console.log(`Streamed: ${metrics.streamed ? 'Yes' : 'No'}`);
  console.log('------------------\n');
}

async function on_eou_metrics_collected(metrics: any): Promise<void> {
  console.log('\n--- End of Utterance Metrics ---');
  console.log(`End of Utterance Delay: ${metrics?.end_of_utterance_delay?.toFixed(4)}s`);
  console.log(`Transcription Delay: ${metrics?.transcription_delay?.toFixed(4)}s`);
  console.log('------------------\n');
}

async function on_tts_metrics_collected(metrics: metrics.TTSMetrics): Promise<void> {
  console.log('\n--- TTS Metrics ---');
  console.log(`TTFB: ${metrics.ttfb?.toFixed(4)}s`);
  console.log(`Duration: ${metrics.duration?.toFixed(4)}s`);
  console.log(`Audio Duration: ${metrics.audioDuration?.toFixed(4)}s`);
  console.log(`Streamed: ${metrics.streamed ? 'Yes' : 'No'}`);
  console.log('------------------\n');
}
