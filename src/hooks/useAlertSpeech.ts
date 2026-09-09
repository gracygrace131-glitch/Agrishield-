import { useState, useCallback } from "react";
import { toast } from "sonner";
import { dashboardAlerts } from "../data/mockData";

export function useAlertSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
    setActiveIndex(null);
  }, []);

  const speakAll = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      toast.error("Voice not supported on this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    let idx = 0;

    const speakNext = () => {
      if (idx >= dashboardAlerts.length) {
        setSpeaking(false);
        setActiveIndex(null);
        toast.success("All alerts read aloud.");
        return;
      }
      setActiveIndex(idx);
      const alert = dashboardAlerts[idx];
      const text =
        (idx === 0 ? "Farm alerts for today. " : "") +
        `Alert ${idx + 1}: ${alert.priority}. ${alert.message}.`;
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.92;
      utter.pitch = 1.05;
      utter.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find((v) => v.lang.startsWith("en"));
      if (engVoice) utter.voice = engVoice;

      utter.onend = () => {
        idx++;
        speakNext();
      };
      utter.onerror = () => {
        setSpeaking(false);
        setActiveIndex(null);
      };

      window.speechSynthesis.speak(utter);
    };

    setSpeaking(true);
    speakNext();
  }, []);

  const speakOne = useCallback((index: number) => {
    if (!("speechSynthesis" in window)) {
      toast.error("Voice not supported on this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    setActiveIndex(index);
    setSpeaking(true);

    const alert = dashboardAlerts[index];
    const text = `${alert.priority} priority alert. ${alert.message}.`;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.92;
    utter.pitch = 1.05;
    utter.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const engVoice = voices.find((v) => v.lang.startsWith("en"));
    if (engVoice) utter.voice = engVoice;

    utter.onend = () => {
      setSpeaking(false);
      setActiveIndex(null);
    };
    utter.onerror = () => {
      setSpeaking(false);
      setActiveIndex(null);
    };

    window.speechSynthesis.speak(utter);
  }, []);

  return {
    speaking,
    activeIndex,
    speakAll,
    speakOne,
    stop,
  };
}
