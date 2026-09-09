import { useState } from "react";
import { motion } from "motion/react";
import {
  Droplets,
  CloudRain,
  Sun,
  CloudSun,
  Flame,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Gauge,
  Sparkles,
  Info,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { calculateIrrigation } from "../data/calculators";
import { IrrigationDecision } from "../types";

export function SmartIrrigationPage() {
  const [form, setForm] = useState({
    crop: "",
    moisture: "",
    weather: "",
    land: "1",
    irrigationType: "drip",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IrrigationDecision | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    const moistureNum = parseInt(form.moisture, 10);
    const landNum = parseFloat(form.land) || 1;
    const decision = calculateIrrigation(
      moistureNum,
      form.weather,
      form.crop,
      landNum,
      form.irrigationType
    );
    setResult(decision);
    setLoading(false);
  };

  const isFormValid = Boolean(form.crop && form.moisture && form.weather);

  const weatherIcons: Record<string, any> = {
    sunny: Sun,
    cloudy: CloudSun,
    rain: CloudRain,
    hot: Flame,
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold font-display">Smart Irrigation</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          AI-powered irrigation decisions and a 7-day schedule based on your soil moisture, crop water
          demand, and weather forecasts to save up to 40% of water.
        </p>
      </motion.div>

      {/* Sensor Input Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              Field Sensor & Weather Readings
            </CardTitle>
            <CardDescription>
              Enter current soil conditions and upcoming forecast to calculate the optimal schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Crop type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Crop Type <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.crop}
                  onChange={(e) => setForm({ ...form, crop: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <option value="">Select crop</option>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice (Paddy)</option>
                  <option value="tomato">Tomato</option>
                  <option value="maize">Maize</option>
                  <option value="sugarcane">Sugarcane</option>
                  <option value="cotton">Cotton</option>
                </select>
              </div>

              {/* Soil Moisture */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Current Soil Moisture (%) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 38"
                  min="0"
                  max="100"
                  value={form.moisture}
                  onChange={(e) => setForm({ ...form, moisture: e.target.value })}
                />
              </div>

              {/* Weather forecast */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Weather Forecast (24–48h) <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.weather}
                  onChange={(e) => setForm({ ...form, weather: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <option value="">Select forecast</option>
                  <option value="sunny">Clear / Sunny</option>
                  <option value="cloudy">Partly Cloudy</option>
                  <option value="rain">Rain Expected (&gt;60% prob)</option>
                  <option value="hot">Hot & Dry (35°C+ heatwave)</option>
                </select>
              </div>

              {/* Land area */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Land Area (acres)</label>
                <Input
                  type="number"
                  placeholder="e.g. 2"
                  min="0.1"
                  step="0.1"
                  value={form.land}
                  onChange={(e) => setForm({ ...form, land: e.target.value })}
                />
              </div>

              {/* Irrigation system */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">Irrigation Method</label>
                <select
                  value={form.irrigationType}
                  onChange={(e) => setForm({ ...form, irrigationType: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <option value="drip">Drip Irrigation (90% efficiency — saves maximum water)</option>
                  <option value="sprinkler">Sprinkler System (75% efficiency)</option>
                  <option value="flood">Flood / Furrow Irrigation (50% efficiency)</option>
                </select>
              </div>
            </div>

            <Button
              className="w-full cursor-pointer h-11 text-base font-semibold gap-2"
              onClick={handleCalculate}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calculating Evapotranspiration & Moisture Budget…
                </>
              ) : (
                <>
                  <Droplets className="w-4 h-4" />
                  Generate Smart Irrigation Plan
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
          {/* Main Decision Banner */}
          <Card
            className={`border-2 overflow-hidden ${
              result.decision === "irrigate"
                ? "border-blue-400 bg-blue-50/40 dark:bg-blue-950/20"
                : result.decision === "skip"
                ? "border-amber-400 bg-amber-50/40 dark:bg-amber-950/20"
                : "border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        result.urgency === "critical"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                          : result.urgency === "moderate"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      }`}
                    >
                      {result.urgency} Urgency
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      Crop: <strong className="capitalize text-foreground">{result.crop}</strong>
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground mt-2">
                    {result.decision === "irrigate"
                      ? "Irrigate Your Field Today"
                      : result.decision === "skip"
                      ? "Hold Irrigation — Rain Expected"
                      : "Optimal Moisture — No Irrigation Needed"}
                  </h2>

                  <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed mt-1">
                    {result.reason}
                  </p>
                </div>

                {/* Liters / Water metric */}
                <div className="text-right sm:text-left rounded-2xl bg-card border border-border p-4 shadow-xs shrink-0 min-w-[160px]">
                  <p className="text-xs text-muted-foreground font-medium">Recommended Water</p>
                  <p className="text-2xl font-bold font-display text-primary">
                    {result.litersPerAcre > 0
                      ? `${result.litersPerAcre.toLocaleString()} L`
                      : "0 Liters"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    For {form.land || 1} acre ({form.irrigationType})
                  </p>
                </div>
              </div>

              {/* Timing Box */}
              <div className="mt-5 pt-4 border-t border-border/60 flex items-center gap-2 text-xs sm:text-sm text-foreground/90 font-medium">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>
                  <strong>Optimal Timing:</strong> {result.timing}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 7-Day Irrigation Schedule */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display">7-Day Irrigation Forecast</h3>
              <Badge variant="outline" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1 text-primary" /> Soil Moisture Projection
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {result.schedule.map((day, idx) => {
                const IconComp = weatherIcons[day.condition] || Sun;
                return (
                  <Card
                    key={day.date}
                    className={`text-center p-3 transition-all ${
                      idx === 0 ? "border-primary shadow-xs ring-1 ring-primary/20" : ""
                    }`}
                  >
                    <p className="text-xs font-bold text-foreground">{day.day}</p>
                    <p className="text-[10px] text-muted-foreground mb-2">{day.date}</p>

                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mx-auto mb-2">
                      <IconComp
                        className={`w-4 h-4 ${
                          day.condition === "rain"
                            ? "text-blue-500"
                            : day.condition === "hot"
                            ? "text-orange-500"
                            : "text-amber-500"
                        }`}
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="text-[11px] font-semibold text-foreground">
                        {day.projectedMoisture}%
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Rain: {day.rainProbability}%
                      </div>
                      <Badge
                        variant={
                          day.recommendedAction === "Irrigate"
                            ? "default"
                            : day.recommendedAction === "Skip"
                            ? "warning"
                            : "secondary"
                        }
                        className="text-[10px] px-1.5 py-0 mt-1"
                      >
                        {day.recommendedAction}
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Efficiency tip */}
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              <strong>Water Efficiency Tip:</strong> Switching to drip irrigation delivers water directly
              to root zones, preventing up to 40% surface evaporation. Irrigating between 5:00 AM and
              7:30 AM reduces wind drift and avoids fungal foliage rot.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
