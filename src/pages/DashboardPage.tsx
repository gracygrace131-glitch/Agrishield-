import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Wheat,
  Droplets,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Phone,
  PhoneCall,
  Smartphone,
  Sliders,
  Volume2,
  Square,
  ThermometerSun,
  CircleCheck,
  ArrowRight,
  Sprout,
  ShieldAlert,
  CreditCard,
  Tractor,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { CallModal } from "../components/CallModal";
import { SettingsModal } from "../components/SettingsModal";
import {
  dashboardAlerts,
  dashboardStats,
  quickActions,
  defaultPhoneSettings,
} from "../data/mockData";
import { PhoneSettings } from "../types";
import { playIncomingRingtone, playDialingTone } from "../utils";
import { useAlertSpeech } from "../hooks/useAlertSpeech";

export function DashboardPage() {
  const { speaking, activeIndex, speakAll, speakOne, stop } = useAlertSpeech();

  const [phoneSettings, setPhoneSettings] = useState<PhoneSettings>(() => {
    try {
      const saved = localStorage.getItem("agrishield_phone_settings");
      return saved ? JSON.parse(saved) : defaultPhoneSettings;
    } catch {
      return defaultPhoneSettings;
    }
  });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [callAlertIndex, setCallAlertIndex] = useState<number | null>(null);
  const [callState, setCallState] = useState<"ringing" | "dialing" | "active" | "ended" | null>(null);
  const [isAutoCallMode, setIsAutoCallMode] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopToneRef = useRef<(() => void) | null>(null);

  const cleanupAudio = useCallback(() => {
    stopToneRef.current?.();
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
  }, []);

  // Incoming call simulation (ringtone -> pick up -> voice reads alert)
  const triggerIncomingCall = useCallback((index: number) => {
    setCallAlertIndex(index);
    setIsAutoCallMode(false);
    setCallState("ringing");
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      stopToneRef.current = playIncomingRingtone(ctx);
    } catch {
      // AudioContext unavailable
    }
  }, []);

  // Outgoing auto-call simulation (dial tone -> connected -> voice reads alert)
  const triggerAutoCall = useCallback((index: number) => {
    if (!phoneSettings.number) {
      toast.error("No registered number. Please add your mobile number in settings.");
      setSettingsOpen(true);
      return;
    }
    setCallAlertIndex(index);
    setIsAutoCallMode(true);
    setCallState("dialing");
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      stopToneRef.current = playDialingTone(ctx);
    } catch {}

    setTimeout(() => {
      stopToneRef.current?.();
      setCallState("active");
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(
        `Hello farmer. This is AgriShield AI calling your registered number. ${dashboardAlerts[index].callMessage}`
      );
      utter.rate = 0.88;
      utter.pitch = 1;
      utter.volume = 1;
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find((v) => v.lang.startsWith("en"));
      if (engVoice) utter.voice = engVoice;
      utter.onend = () => setCallState("ended");
      window.speechSynthesis.speak(utter);
    }, 3000);
  }, [phoneSettings.number]);

  // Farmer accepts incoming call
  const handleAcceptCall = useCallback(() => {
    cleanupAudio();
    setCallState("active");
    if (callAlertIndex === null || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(
      `Hello farmer. This is AgriShield AI. ${dashboardAlerts[callAlertIndex].callMessage}`
    );
    utter.rate = 0.88;
    utter.pitch = 1;
    utter.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const engVoice = voices.find((v) => v.lang.startsWith("en"));
    if (engVoice) utter.voice = engVoice;
    utter.onend = () => setCallState("ended");
    window.speechSynthesis.speak(utter);
  }, [callAlertIndex, cleanupAudio]);

  const handleDeclineCall = useCallback(() => {
    cleanupAudio();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setCallState(null);
    setCallAlertIndex(null);
    toast.info("Call declined.");
  }, [cleanupAudio]);

  const handleEndCall = useCallback(() => {
    cleanupAudio();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setCallState(null);
    setCallAlertIndex(null);
  }, [cleanupAudio]);

  const handleSaveSettings = (newSettings: PhoneSettings) => {
    setPhoneSettings(newSettings);
    localStorage.setItem("agrishield_phone_settings", JSON.stringify(newSettings));
    if (newSettings.autoCallEnabled && newSettings.number) {
      toast.success(`Auto-call enabled for ${newSettings.countryCode} ${newSettings.number}`);
    } else {
      toast.success("Phone settings saved.");
    }
  };

  // Auto-call simulation on high alert on first mount if configured
  useEffect(() => {
    if (
      !phoneSettings.autoCallEnabled ||
      !phoneSettings.number ||
      !(phoneSettings.autoCallOnAll || (phoneSettings.autoCallOnHigh && dashboardAlerts[0].type === "warning"))
    ) {
      return;
    }
    const timer = setTimeout(() => {
      toast.info(`Auto-calling ${phoneSettings.countryCode} ${phoneSettings.number} for high priority alert…`, {
        duration: 3000,
      });
      triggerAutoCall(0);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      cleanupAudio();
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [cleanupAudio]);

  const statIconMap: Record<string, any> = {
    wheat: Wheat,
    droplets: Droplets,
    "trending-up": TrendingUp,
    "triangle-alert": AlertTriangle,
  };

  const actionIconMap: Record<string, any> = {
    sprout: Sprout,
    droplets: Droplets,
    "shield-alert": ShieldAlert,
    "trending-up": TrendingUp,
    "credit-card": CreditCard,
    tractor: Tractor,
    "shopping-bag": ShoppingBag,
  };

  const alertIconMap: Record<string, any> = {
    "thermometer-sun": ThermometerSun,
    droplets: Droplets,
    "circle-check": CircleCheck,
  };

  const fullPhone = phoneSettings.number ? `${phoneSettings.countryCode} ${phoneSettings.number}` : "";

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Call Modal */}
      {callAlertIndex !== null && (
        <CallModal
          alertIndex={callAlertIndex}
          state={callState}
          phoneNumber={fullPhone}
          autoMode={isAutoCallMode}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
          onEnd={handleEndCall}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        settings={phoneSettings}
        onSave={handleSaveSettings}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">
            Good morning, Farmer 🌾
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Here's your live farm overview, soil moisture, and priority alerts for today.
          </p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 py-1.5 px-3">
          <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Live Sensor Feed
        </Badge>
      </motion.div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, idx) => {
          const IconComp = statIconMap[stat.icon] || Wheat;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <Card>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold font-display">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                      <IconComp className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Active Auto-Call Banner if configured */}
      <AnimatePresence>
        {phoneSettings.autoCallEnabled && phoneSettings.number && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
              <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                Auto-Call System Active
              </p>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-400 truncate">
                Calling <strong>{phoneSettings.countryCode} {phoneSettings.number}</strong> on{" "}
                {phoneSettings.autoCallOnAll ? "all alerts" : "high priority alerts"}
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="cursor-pointer text-xs shrink-0 h-8 gap-1"
              onClick={() => setSettingsOpen(true)}
            >
              <Sliders className="w-3.5 h-3.5" /> Edit
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Alerts Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <CardTitle className="text-base flex items-center gap-2">
                  Live Farm Alerts
                </CardTitle>
                {speaking && (
                  <motion.span
                    className="flex items-center gap-1.5 text-xs text-primary font-normal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className="flex items-end gap-0.5 h-3">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1 bg-primary rounded-full"
                          animate={{ height: ["4px", "12px", "4px"] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </span>
                    Speaking…
                  </motion.span>
                )}
              </div>

              {/* Action Buttons Header */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 cursor-pointer gap-1.5 text-xs"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  {phoneSettings.number ? "My Number" : "Add Number"}
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 cursor-pointer gap-1.5 text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                  onClick={() => triggerAutoCall(0)}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Auto Call
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 cursor-pointer gap-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                  onClick={() => triggerIncomingCall(0)}
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Alert
                </Button>

                {speaking ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 cursor-pointer text-xs text-red-600 border border-red-200 gap-1.5"
                    onClick={stop}
                  >
                    <Square className="w-3 h-3 fill-current" /> Stop
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="h-8 cursor-pointer text-xs gap-1.5"
                    onClick={speakAll}
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Read All
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4 divide-y divide-border/50">
            {dashboardAlerts.map((alert, idx) => {
              const IconComp = alertIconMap[alert.icon] || ThermometerSun;
              const isCurrentlySpeaking = speaking && activeIndex === idx;

              return (
                <div
                  key={alert.message}
                  className={`py-3.5 flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row transition-colors rounded-xl px-2.5 ${
                    isCurrentlySpeaking ? "bg-primary/5 ring-1 ring-primary/20" : ""
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-9 h-9 rounded-xl ${alert.bg} flex items-center justify-center shrink-0 mt-0.5 sm:mt-0`}>
                      <IconComp className={`w-4 h-4 ${alert.color}`} />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-md font-semibold border ${alert.priorityColor}`}>
                          {alert.priority}
                        </span>
                        <p className="text-sm font-medium text-foreground">{alert.message}</p>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 italic">
                        Voice script: &ldquo;{alert.callMessage}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Individual Alert Controls */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2.5 text-xs cursor-pointer gap-1"
                      onClick={() => triggerIncomingCall(idx)}
                      title="Simulate incoming call to phone"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      Call
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs cursor-pointer gap-1 text-muted-foreground hover:text-foreground"
                      onClick={() => speakOne(idx)}
                      title="Read alert aloud"
                    >
                      <Volume2 className="w-3 h-3" />
                      Listen
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold font-display">Farming Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {quickActions.map((action, idx) => {
            const IconComp = actionIconMap[action.icon] || Sprout;
            return (
              <motion.div
                key={action.path}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                <Link to={action.path} className="block h-full">
                  <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                    <CardContent className="p-4 flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-xl ${action.color} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors font-display">
                            {action.label}
                          </h3>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {action.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
