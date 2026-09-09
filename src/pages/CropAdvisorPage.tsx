import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Sprout,
  Loader2,
  Droplets,
  TrendingUp,
  ShieldCheck,
  Calendar,
  AlertCircle,
  ArrowRight,
  Info,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { cropsDataset } from "../data/mockData";
import { CropRecommendation } from "../types";

export function CropAdvisorPage() {
  const [form, setForm] = useState({
    land: "",
    soil: "",
    water: "",
    location: "",
    previous: "",
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CropRecommendation[] | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const soilKey = form.soil || "default";
    const recommended = cropsDataset[soilKey] ?? cropsDataset.default;
    setResults(recommended);
    setLoading(false);
  };

  const isFormValid = Boolean(form.land && form.soil && form.water);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold font-display">AI Crop Advisor</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Enter your farm details and get AI-powered crop recommendations tailored to your soil,
          water availability, and seasonal market price forecasts.
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
              <Sprout className="w-4 h-4 text-emerald-600" />
              Farm Profile & Conditions
            </CardTitle>
            <CardDescription>
              Provide your land specifications to generate optimal crop matches
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Land size */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Land Size (acres) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 2.5"
                  min="0.1"
                  step="0.1"
                  value={form.land}
                  onChange={(e) => setForm({ ...form, land: e.target.value })}
                />
              </div>

              {/* Soil type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Soil Type <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.soil}
                  onChange={(e) => setForm({ ...form, soil: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <option value="">Select soil type</option>
                  <option value="loam">Loam (Balanced & fertile)</option>
                  <option value="clay">Clay (High water retention)</option>
                  <option value="sandy">Sandy (Free draining, light)</option>
                  <option value="silt">Silt (Fine, moisture rich)</option>
                  <option value="default">Not sure / Mixed</option>
                </select>
              </div>

              {/* Water availability */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Water Availability <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.water}
                  onChange={(e) => setForm({ ...form, water: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <option value="">Select availability</option>
                  <option value="abundant">Abundant (Canal / River connected)</option>
                  <option value="moderate">Moderate (Borewell / Ground well)</option>
                  <option value="limited">Limited (Monsoon rain dependent)</option>
                  <option value="scarce">Scarce (Arid / Water transport)</option>
                </select>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Location / Region
                </label>
                <Input
                  placeholder="e.g. Nashik, Maharashtra"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>

              {/* Previous Crop */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  Previous Crop (for rotation benefits)
                </label>
                <Input
                  placeholder="e.g. Wheat, Rice, Cotton"
                  value={form.previous}
                  onChange={(e) => setForm({ ...form, previous: e.target.value })}
                />
              </div>
            </div>

            <Button
              className="w-full cursor-pointer h-11 text-base font-semibold gap-2"
              onClick={handleAnalyze}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running Agronomic AI Models…
                </>
              ) : (
                <>
                  <Sprout className="w-4 h-4" />
                  Analyze My Farm & Recommend Crops
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Section */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display">
              Recommended Crops ({results.length})
            </h2>
            <Badge variant="success">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Soil Match Verified
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.map((crop, idx) => (
              <motion.div
                key={crop.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:border-primary/50 transition-all shadow-xs">
                  <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          #{idx + 1} Best Match
                        </span>
                        <Badge
                          variant={
                            crop.risk === "Low"
                              ? "success"
                              : crop.risk === "Medium"
                              ? "warning"
                              : "destructive"
                          }
                          className="text-[11px]"
                        >
                          {crop.risk} Risk
                        </Badge>
                      </div>

                      <h3 className="text-2xl font-extrabold font-display text-foreground">
                        {crop.name}
                      </h3>

                      {/* Suitability score bar */}
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-muted-foreground">Suitability Score</span>
                          <span className="text-primary font-bold">{crop.suitability}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${crop.suitability}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                          />
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-border/60 text-xs">
                        <div>
                          <p className="text-muted-foreground">Expected Yield</p>
                          <p className="font-semibold text-foreground mt-0.5">{crop.yield}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Est. Profit</p>
                          <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {crop.profit}
                          </p>
                        </div>
                        <div className="mt-2">
                          <p className="text-muted-foreground">Water Req.</p>
                          <p className="font-semibold text-foreground mt-0.5 flex items-center gap-1">
                            <Droplets className="w-3 h-3 text-blue-500" />
                            {crop.waterReq}
                          </p>
                        </div>
                        <div className="mt-2">
                          <p className="text-muted-foreground">Season</p>
                          <p className="font-semibold text-foreground mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-amber-500" />
                            {crop.season}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="pt-2 flex flex-col gap-2">
                      <Link to="/profit-predictor" className="w-full">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full cursor-pointer text-xs justify-between"
                        >
                          <span className="flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                            Forecast Profit
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Link to="/irrigation" className="w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full cursor-pointer text-xs justify-between"
                        >
                          <span className="flex items-center gap-1.5">
                            <Droplets className="w-3.5 h-3.5 text-blue-600" />
                            Irrigation Plan
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border/50 text-xs text-muted-foreground flex items-start gap-2.5">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p>
              Recommendations factor in soil micronutrients, historical mandi pricing trends, and
              climate resistance. You can directly test profit models or view certified seeds for
              these varieties in the Seeds Shop.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
