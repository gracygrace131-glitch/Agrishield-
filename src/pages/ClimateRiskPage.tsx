import { useState } from "react";
import { motion } from "motion/react";
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  CloudRain,
  Sun,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckSquare,
  Square,
  ThermometerSun,
  Calendar,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { climateScenarios } from "../data/calculators";
import { ClimateScenarioResult } from "../types";

export function ClimateRiskPage() {
  const [form, setForm] = useState({
    location: "",
    crop: "",
    season: "",
    scenario: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClimateScenarioResult | null>(null);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const handleRunRiskAnalysis = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1600));
    const scenarioFn = climateScenarios[form.scenario] ?? climateScenarios.normal;
    const computed = scenarioFn(form.crop);
    setResult(computed);
    setCompletedActions(new Set());
    setLoading(false);
  };

  const toggleAction = (actionText: string) => {
    setCompletedActions((prev) => {
      const next = new Set(prev);
      if (next.has(actionText)) {
        next.delete(actionText);
      } else {
        next.add(actionText);
      }
      return next;
    });
  };

  const isFormValid = Boolean(form.location && form.crop && form.scenario);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold font-display">Climate Risk Engine</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Detect heat waves, droughts, storms, and pest threats up to 7 days in advance with
          personalized crop protection protocols.
        </p>
      </motion.div>

      {/* Input Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Risk Assessment Parameters
            </CardTitle>
            <CardDescription>
              Select farm location and crop conditions to scan climate models
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Location / District <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. Nashik, Maharashtra"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>

              {/* Crop */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Current Crop <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.crop}
                  onChange={(e) => setForm({ ...form, crop: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <option value="">Select crop</option>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="tomato">Tomato</option>
                  <option value="maize">Maize</option>
                  <option value="cotton">Cotton</option>
                  <option value="sugarcane">Sugarcane</option>
                </select>
              </div>

              {/* Season */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Season</label>
                <select
                  value={form.season}
                  onChange={(e) => setForm({ ...form, season: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <option value="">Select season</option>
                  <option value="kharif">Kharif (Monsoon June–Oct)</option>
                  <option value="rabi">Rabi (Winter Nov–April)</option>
                  <option value="summer">Summer (Zaid March–June)</option>
                </select>
              </div>

              {/* Weather Scenario */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  7-Day Weather Scenario <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.scenario}
                  onChange={(e) => setForm({ ...form, scenario: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <option value="">Select weather pattern</option>
                  <option value="normal">Normal / Favorable Climate</option>
                  <option value="hot">Heat Wave Expected (38°C–44°C)</option>
                  <option value="rain">Heavy Storm / Unseasonal Rainfall</option>
                  <option value="drought">Extended Drought / High Evaporation</option>
                </select>
              </div>
            </div>

            <Button
              className="w-full cursor-pointer h-11 text-base font-semibold gap-2"
              onClick={handleRunRiskAnalysis}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running Weather Hazard & Pest Vulnerability Models…
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  Evaluate Climate Risk & Protection Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overall Risk Score Card */}
          <Card
            className={`border-2 ${
              result.overallRisk === "critical"
                ? "border-red-400 bg-red-50/40 dark:bg-red-950/20"
                : result.overallRisk === "high"
                ? "border-amber-400 bg-amber-50/40 dark:bg-amber-950/20"
                : result.overallRisk === "medium"
                ? "border-yellow-400 bg-yellow-50/40 dark:bg-yellow-950/20"
                : "border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        result.overallRisk === "critical"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                          : result.overallRisk === "high"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      }`}
                    >
                      {result.overallRisk} Risk Level
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Target Crop: <strong className="capitalize text-foreground">{form.crop}</strong>
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground mt-2">
                    Climate Vulnerability Score: {result.riskScore} / 100
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                    {result.emergencyMode
                      ? "Critical hazard conditions detected. Follow the proactive defense measures below to avoid yield depletion."
                      : "Favorable conditions. Minor vigilance advised for temperature spikes and pest incubation."}
                  </p>
                </div>

                {/* Gauge bar */}
                <div className="min-w-[140px] text-right sm:text-left">
                  <div className="text-xs text-muted-foreground font-medium mb-1">Risk Gauge</div>
                  <div className="h-3 w-full sm:w-36 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        result.riskScore > 70
                          ? "bg-red-500"
                          : result.riskScore > 40
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${result.riskScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {result.riskScore > 70
                      ? "High Threat"
                      : result.riskScore > 40
                      ? "Moderate Threat"
                      : "Low Threat"}
                  </p>
                </div>
              </div>

              {/* Emergency Mode Checklist */}
              {result.emergencyMode && result.emergencyPlan.length > 0 && (
                <div className="mt-5 pt-4 border-t border-border/60">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-4 h-4" /> Emergency Protection Protocol
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.emergencyPlan.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs bg-background/80 p-2.5 rounded-lg border border-border"
                      >
                        <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-foreground font-medium">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Alert Cards with interactive checklist */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-display">
              Identified Threat Events ({result.alerts.length})
            </h3>

            {result.alerts.map((alert) => (
              <Card key={alert.id} className="overflow-hidden border border-border">
                <CardHeader className="pb-3 bg-muted/30">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          alert.severity === "critical"
                            ? "destructive"
                            : alert.severity === "high"
                            ? "warning"
                            : "secondary"
                        }
                      >
                        {alert.severity}
                      </Badge>
                      <CardTitle className="text-base">{alert.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {alert.timeframe}
                      </span>
                      <span className="font-semibold text-foreground">
                        {alert.probability}% Probability
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                        Condition Detail
                      </p>
                      <p className="mt-1 text-foreground leading-relaxed">{alert.detail}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                        Estimated Crop Impact
                      </p>
                      <p className="mt-1 text-foreground leading-relaxed">{alert.impact}</p>
                    </div>
                  </div>

                  {/* Action items */}
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-xs font-bold text-foreground mb-2 flex items-center justify-between">
                      <span>Proactive Safeguards (Check as you complete):</span>
                      <span className="text-primary text-[11px] font-normal">
                        {alert.actions.filter((a) => completedActions.has(a)).length} /{" "}
                        {alert.actions.length} Completed
                      </span>
                    </p>
                    <div className="space-y-2">
                      {alert.actions.map((act) => {
                        const isDone = completedActions.has(act);
                        return (
                          <div
                            key={act}
                            onClick={() => toggleAction(act)}
                            className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                              isDone
                                ? "bg-emerald-50/60 border-emerald-300 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-300 line-through opacity-80"
                                : "bg-card border-border hover:border-primary/40 text-foreground"
                            }`}
                          >
                            {isDone ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <Square className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                            )}
                            <span className="leading-snug">{act}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 7-Day Forecast Table */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold font-display">7-Day Risk & Weather Timeline</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {result.forecast.map((f, idx) => (
                <Card key={idx} className="p-3 text-center">
                  <p className="text-xs font-bold text-foreground">{f.day}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {f.tempHigh}° / {f.tempLow}°C
                  </p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">
                    Rain: {f.rainProb}%
                  </p>
                  <Badge
                    variant={
                      f.riskLevel === "critical"
                        ? "destructive"
                        : f.riskLevel === "high"
                        ? "warning"
                        : "secondary"
                    }
                    className="text-[9px] px-1 py-0 mt-2 block"
                  >
                    {f.riskLevel}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
