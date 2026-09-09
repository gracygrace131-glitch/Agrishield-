import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Phone,
  PhoneOff,
  Loader2,
  Smartphone,
  ThermometerSun,
  Droplets,
  CircleCheck,
  AlertTriangle,
} from "lucide-react";
import { dashboardAlerts } from "../data/mockData";
import { Button } from "./ui/Button";

interface CallModalProps {
  alertIndex: number | null;
  state: "ringing" | "dialing" | "active" | "ended" | null;
  phoneNumber: string;
  autoMode: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onEnd: () => void;
}

export function CallModal({
  alertIndex,
  state,
  phoneNumber,
  autoMode,
  onAccept,
  onDecline,
  onEnd,
}: CallModalProps) {
  const [durationSec, setDurationSec] = useState(0);

  useEffect(() => {
    if (state !== "active") {
      setDurationSec(0);
      return;
    }
    const timer = setInterval(() => setDurationSec((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [state]);

  if (alertIndex === null || !state) return null;
  const alert = dashboardAlerts[alertIndex] || dashboardAlerts[0];

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const gradientBg =
    alert.type === "warning"
      ? "from-amber-900 via-amber-800 to-orange-900"
      : alert.type === "info"
      ? "from-blue-900 via-blue-800 to-cyan-900"
      : "from-emerald-900 via-green-800 to-teal-900";

  const maskedPhone =
    phoneNumber.length > 4
      ? phoneNumber.slice(0, -4).replace(/\d/g, "•") + phoneNumber.slice(-4)
      : phoneNumber;

  const PriorityIcon =
    alert.type === "warning"
      ? ThermometerSun
      : alert.type === "info"
      ? Droplets
      : CircleCheck;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

        <motion.div
          className={`relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b ${gradientBg}`}
          initial={{ scale: 0.85, y: 60 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.85, y: 60 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          {/* Animated soundwave ring effect during ringing or dialing */}
          {(state === "ringing" || state === "dialing") && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ top: "80px" }}
            >
              {[1, 2, 3].map((pulse) => (
                <motion.div
                  key={pulse}
                  className="absolute rounded-full border-2 border-white/20"
                  initial={{ width: 80, height: 80, opacity: 0.6 }}
                  animate={{
                    width: 80 + pulse * 55,
                    height: 80 + pulse * 55,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: pulse * 0.4,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}

          <div className="px-8 pt-12 pb-10 flex flex-col items-center gap-4 text-white relative">
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-widest opacity-70 font-medium">
                {state === "dialing"
                  ? "Dialing your number…"
                  : state === "ringing"
                  ? "Incoming Farm Alert Call"
                  : state === "active"
                  ? "Connected"
                  : "Call Ended"}
              </p>
              {state === "dialing" && (
                <Loader2 className="w-3 h-3 animate-spin opacity-70" />
              )}
            </div>

            {/* Circular Logo/Avatar */}
            <motion.div
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl ${
                alert.type === "warning"
                  ? "bg-amber-400/30 ring-4 ring-amber-400/40"
                  : alert.type === "info"
                  ? "bg-blue-400/30 ring-4 ring-blue-400/40"
                  : "bg-emerald-400/30 ring-4 ring-emerald-400/40"
              }`}
              animate={
                state === "ringing" || state === "dialing"
                  ? { scale: [1, 1.06, 1] }
                  : {}
              }
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <img
                src="https://hercules-cdn.com/file_BWos5c3JQPUv9Sw0Mz2iI66V"
                alt="AgriShield"
                className="w-14 h-14 object-contain drop-shadow"
                onError={(e) => {
                  // graceful fallback icon
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </motion.div>

            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">AgriShield AI</h2>
              {autoMode && phoneNumber ? (
                <p className="text-sm opacity-80 mt-0.5 flex items-center justify-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  {maskedPhone}
                </p>
              ) : (
                <p className="text-sm opacity-70 mt-0.5">Farm Alert System</p>
              )}
            </div>

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm text-sm font-medium ${
                alert.type === "warning"
                  ? "bg-amber-500/30 text-amber-100"
                  : alert.type === "info"
                  ? "bg-blue-500/30 text-blue-100"
                  : "bg-emerald-500/30 text-emerald-100"
              }`}
            >
              <PriorityIcon className="w-3.5 h-3.5" />
              {alert.priority} Priority Alert
            </div>

            {state !== "ended" && (
              <p className="text-center text-sm opacity-80 leading-relaxed px-2">
                &ldquo;{alert.message}&rdquo;
              </p>
            )}

            {state === "active" && (
              <motion.p
                className="text-lg font-mono font-semibold opacity-90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {formatDuration(durationSec)}
              </motion.p>
            )}

            {state === "dialing" && phoneNumber && (
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                <Phone className="w-3.5 h-3.5 opacity-70" />
                <span className="text-sm font-mono tracking-widest opacity-90">
                  {maskedPhone}
                </span>
                <motion.span
                  className="w-1.5 h-4 bg-white/80 rounded-full"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </div>
            )}

            {state === "ended" && (
              <div className="flex flex-col items-center gap-1">
                <PhoneOff className="w-8 h-8 text-red-400" />
                <p className="text-sm opacity-70">
                  Call ended · {formatDuration(durationSec)}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center gap-8 mt-4 w-full">
              {state === "ringing" && (
                <>
                  <div className="flex flex-col items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={onDecline}
                      className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center shadow-lg cursor-pointer transition-colors"
                      title="Decline"
                    >
                      <PhoneOff className="w-7 h-7 text-white" />
                    </motion.button>
                    <span className="text-xs opacity-70">Decline</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={onAccept}
                      className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center shadow-lg cursor-pointer transition-colors"
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      title="Accept"
                    >
                      <Phone className="w-7 h-7 text-white" />
                    </motion.button>
                    <span className="text-xs opacity-70">Accept</span>
                  </div>
                </>
              )}

              {(state === "dialing" || state === "active") && (
                <div className="flex flex-col items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={onEnd}
                    className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center shadow-lg cursor-pointer transition-colors"
                    title={state === "dialing" ? "Cancel" : "End Call"}
                  >
                    <PhoneOff className="w-7 h-7 text-white" />
                  </motion.button>
                  <span className="text-xs opacity-70">
                    {state === "dialing" ? "Cancel" : "End Call"}
                  </span>
                </div>
              )}

              {state === "ended" && (
                <Button
                  variant="secondary"
                  className="rounded-full px-6 cursor-pointer bg-white/20 hover:bg-white/30 text-white border-0"
                  onClick={onEnd}
                >
                  Close
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
