import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Smartphone, CheckCircle2, Zap, X } from "lucide-react";
import { PhoneSettings } from "../types";
import { countryOptions } from "../data/mockData";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { cn } from "../utils";

interface SettingsModalProps {
  open: boolean;
  settings: PhoneSettings;
  onSave: (newSettings: PhoneSettings) => void;
  onClose: () => void;
}

export function SettingsModal({
  open,
  settings,
  onSave,
  onClose,
}: SettingsModalProps) {
  const [formState, setFormState] = useState<PhoneSettings>(settings);

  useEffect(() => {
    setFormState(settings);
  }, [settings, open]);

  if (!open) return null;

  const cleanNum = formState.number.replace(/\D/g, "");
  const isValid = cleanNum.length >= 7;

  const handleSave = () => {
    onSave(formState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-xl z-10 text-card-foreground">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold font-display">Mobile Alert Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          Register your mobile number to receive automatic farm alert calls.
        </p>

        <div className="space-y-4 py-1">
          {/* Phone input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Registered Mobile Number
            </label>
            <div className="flex gap-2">
              <select
                value={formState.countryCode}
                onChange={(e) =>
                  setFormState({ ...formState, countryCode: e.target.value })
                }
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {countryOptions.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.code} {opt.label}
                  </option>
                ))}
              </select>
              <Input
                className="flex-1"
                placeholder="98765 43210"
                value={formState.number}
                maxLength={14}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    number: e.target.value.replace(/[^\d\s\-]/g, ""),
                  })
                }
              />
            </div>
            {formState.number && !isValid && (
              <p className="text-xs text-destructive">
                Please enter a valid phone number (at least 7 digits).
              </p>
            )}
            {isValid && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Number registered: {formState.countryCode} {formState.number}
              </p>
            )}
          </div>

          {/* Toggle Auto-call */}
          <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3.5 border border-border/50">
            <div>
              <p className="text-sm font-semibold">Enable Auto-Call</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Automatically call your number when alerts trigger
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formState.autoCallEnabled}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    autoCallEnabled: e.target.checked,
                  })
                }
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Auto call options */}
          <AnimatePresence>
            {formState.autoCallEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Call me when
                </label>

                <div
                  onClick={() =>
                    setFormState({
                      ...formState,
                      autoCallOnHigh: true,
                      autoCallOnAll: false,
                    })
                  }
                  className={cn(
                    "flex items-center gap-3 rounded-xl border-2 p-3 cursor-pointer transition-all",
                    formState.autoCallOnHigh && !formState.autoCallOnAll
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                      formState.autoCallOnHigh && !formState.autoCallOnAll
                        ? "border-primary"
                        : "border-muted-foreground"
                    )}
                  >
                    {formState.autoCallOnHigh && !formState.autoCallOnAll && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">High priority alerts only</p>
                    <p className="text-xs text-muted-foreground">
                      Calls only for critical/high risk events
                    </p>
                  </div>
                </div>

                <div
                  onClick={() =>
                    setFormState({
                      ...formState,
                      autoCallOnAll: true,
                      autoCallOnHigh: false,
                    })
                  }
                  className={cn(
                    "flex items-center gap-3 rounded-xl border-2 p-3 cursor-pointer transition-all",
                    formState.autoCallOnAll
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                      formState.autoCallOnAll
                        ? "border-primary"
                        : "border-muted-foreground"
                    )}
                  >
                    {formState.autoCallOnAll && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">All alerts</p>
                    <p className="text-xs text-muted-foreground">
                      Calls for every alert including info & good news
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {formState.autoCallEnabled && isValid && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Auto-call active — AgriShield will call{" "}
                <strong>
                  {formState.countryCode} {formState.number}
                </strong>{" "}
                on new {formState.autoCallOnAll ? "alerts" : "high priority alerts"}.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border mt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
