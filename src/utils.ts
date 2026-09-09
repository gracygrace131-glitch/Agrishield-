import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates an incoming telephone ring tone using the Web Audio API
 */
export function playIncomingRingtone(audioCtx: AudioContext): () => void {
  let isPlaying = true;
  const pattern = [0.4, 0.15, 0.4, 0.8];
  const frequencies = [880, 1100];

  const playTone = (time: number, duration: number) => {
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.18, time + 0.02);
      gain.gain.setValueAtTime(0.18, time + duration - 0.02);
      gain.gain.linearRampToValueAtTime(0, time + duration);

      osc.frequency.setValueAtTime(frequencies[0], time);
      osc.frequency.setValueAtTime(frequencies[1], time + duration * 0.5);

      osc.start(time);
      osc.stop(time + duration + 0.05);
    } catch {
      // Audio context might be closing
    }
  };

  const scheduleRing = () => {
    if (!isPlaying) return;
    const now = audioCtx.currentTime;
    playTone(now, pattern[0]);
    playTone(now + pattern[0] + pattern[1], pattern[2]);
    const totalCycle = pattern[0] + pattern[1] + pattern[2] + pattern[3];
    setTimeout(scheduleRing, totalCycle * 1000);
  };

  scheduleRing();

  return () => {
    isPlaying = false;
  };
}

/**
 * Generates an outgoing dialing tone (DTMF/North American standard 440+480Hz)
 */
export function playDialingTone(audioCtx: AudioContext): () => void {
  let isPlaying = true;

  const playBeep = (time: number, duration: number) => {
    try {
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      gain.gain.setValueAtTime(0.08, time);
      gain.gain.setValueAtTime(0, time + duration);

      osc1.frequency.value = 440;
      osc2.frequency.value = 480;

      osc1.start(time);
      osc1.stop(time + duration + 0.01);
      osc2.start(time);
      osc2.stop(time + duration + 0.01);
    } catch {
      // Ignore audioContext closed
    }
  };

  const loop = () => {
    if (!isPlaying) return;
    const now = audioCtx.currentTime;
    playBeep(now, 0.5);
    setTimeout(loop, 1000);
  };

  loop();

  return () => {
    isPlaying = false;
  };
}
