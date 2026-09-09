import { useState } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  Plus,
  Trash2,
  Loader2,
  TrendingDown,
  Minus,
  CheckCircle2,
  DollarSign,
  PieChart as PieIcon,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { calculateCropProfit } from "../data/calculators";
import { CropProfitResult, CropPlanInput } from "../types";

export function ProfitPredictorPage() {
  const [plans, setPlans] = useState<CropPlanInput[]>([
    { id: "1", crop: "tomato", area: "2" },
    { id: "2", crop: "wheat", area: "2" },
  ]);

  const [waterBudget, setWaterBudget] = useState("5000");
  const [climateRisk, setClimateRisk] = useState("Low");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CropProfitResult[] | null>(null);
  const [activeCropId, setActiveCropId] = useState<string>("1");

  const handleAddCrop = () => {
    if (plans.length < 4) {
      setPlans([...plans, { id: String(Date.now()), crop: "", area: "1" }]);
    }
  };

  const handleRemoveCrop = (id: string) => {
    if (plans.length > 1) {
      setPlans(plans.filter((p) => p.id !== id));
    }
  };

  const handleUpdatePlan = (id: string, field: "crop" | "area", val: string) => {
    setPlans(plans.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
  };

  const handleCalculate = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    const budgetNum = parseInt(waterBudget, 10) || 5000;
    const computed = plans
      .filter((p) => p.crop && p.area)
      .map((p) => calculateCropProfit(p, budgetNum, climateRisk));

    setResults(computed);
    if (computed.length > 0) {
      setActiveCropId(computed[0].id);
    }
    setLoading(false);
  };

  const isValid = plans.some((p) => p.crop && p.area);
  const activeResult = results?.find((r) => r.id === activeCropId) ?? results?.[0];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold font-display">Profit Predictor</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Compare up to 4 crops side-by-side. Know your input costs, projected yields, revenue, ROI,
          and break-even mandi prices before planting.
        </p>
      </motion.div>

      {/* Input Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  Crop Portfolio Planner
                </CardTitle>
                <CardDescription>
                  Configure your crop acreage and optional budget constraints
                </CardDescription>
              </div>
              {plans.length < 4 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddCrop}
                  className="cursor-pointer gap-1 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Crop
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {plans.map((p, idx) => (
                <div key={p.id} className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                  <div className="text-xs font-semibold text-muted-foreground w-14 shrink-0">
                    Crop {idx + 1}:
                  </div>
                  <div className="flex-1 min-w-[140px]">
                    <select
                      value={p.crop}
                      onChange={(e) => handleUpdatePlan(p.id, "crop", e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                    >
                      <option value="">Select crop</option>
                      <option value="tomato">Tomato</option>
                      <option value="wheat">Wheat</option>
                      <option value="rice">Rice (Paddy)</option>
                      <option value="maize">Maize</option>
                      <option value="onion">Onion</option>
                      <option value="cotton">Cotton</option>
                      <option value="groundnut">Groundnut</option>
                      <option value="soybean">Soybean</option>
                    </select>
                  </div>

                  <div className="w-28 shrink-0">
                    <Input
                      type="number"
                      placeholder="Acres"
                      min="0.1"
                      step="0.5"
                      value={p.area}
                      onChange={(e) => handleUpdatePlan(p.id, "area", e.target.value)}
                    />
                  </div>

                  {plans.length > 1 && (
                    <button
                      onClick={() => handleRemoveCrop(p.id)}
                      className="p-2 text-muted-foreground hover:text-destructive cursor-pointer rounded-lg hover:bg-muted"
                      title="Remove crop"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border/60">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Irrigation Water Budget (Liters / season)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 5000"
                  value={waterBudget}
                  onChange={(e) => setWaterBudget(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Assumed Climate Risk
                </label>
                <select
                  value={climateRisk}
                  onChange={(e) => setClimateRisk(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <option value="Low">Low / Favorable Weather</option>
                  <option value="Medium">Medium (Moderate heat / dry spell)</option>
                  <option value="High">High (Risk of drought / heat stress)</option>
                </select>
              </div>
            </div>

            <Button
              className="w-full cursor-pointer h-11 text-base font-semibold gap-2"
              onClick={handleCalculate}
              disabled={!isValid || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calculating Mandi Yields & Input Cost Models…
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Calculate Profit & Compare ROI
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Section */}
      {results && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Side by side comparison cards */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold font-display">Comparative Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {results.map((item) => {
                const isSelected = item.id === activeCropId;
                return (
                  <Card
                    key={item.id}
                    onClick={() => setActiveCropId(item.id)}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary shadow-md ring-2 ring-primary/20"
                        : "hover:border-primary/40"
                    }`}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold capitalize text-base font-display">
                          {item.crop}
                        </span>
                        <Badge
                          variant={item.roi > 50 ? "success" : item.roi > 20 ? "default" : "warning"}
                          className="text-[11px]"
                        >
                          {item.roi}% ROI
                        </Badge>
                      </div>

                      <div>
                        <p className="text-[11px] text-muted-foreground">Estimated Net Profit</p>
                        <p
                          className={`text-2xl font-bold font-display ${
                            item.profit >= 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-destructive"
                          }`}
                        >
                          ₹{item.profit.toLocaleString()}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/60">
                        <div>
                          <p className="text-[10px] text-muted-foreground">Revenue</p>
                          <p className="font-semibold text-foreground">
                            ₹{item.revenue.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">Total Cost</p>
                          <p className="font-semibold text-foreground">
                            ₹{item.totalCost.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-[11px] flex items-center justify-between text-muted-foreground pt-1">
                        <span>Break-even: ₹{item.breakEvenPrice}/kg</span>
                        <span className="flex items-center gap-1 font-medium capitalize">
                          {item.marketTrend === "rising" && (
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                          )}
                          {item.marketTrend === "falling" && (
                            <TrendingDown className="w-3 h-3 text-red-500" />
                          )}
                          {item.marketTrend === "stable" && (
                            <Minus className="w-3 h-3 text-amber-500" />
                          )}
                          {item.marketTrend}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Deep dive for active crop */}
          {activeResult && (
            <Card>
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="capitalize text-lg flex items-center gap-2">
                      <span>{activeResult.crop}</span> Deep Dive ({activeResult.area} Acres)
                    </CardTitle>
                    <CardDescription>
                      Full cost breakdown, harvest projections, and 12-month market price trends
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Trend: <strong className="ml-1 capitalize">{activeResult.marketTrend}</strong>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-6">
                {/* Cost Breakdown Grid */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Input Cost Breakdown
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-muted/40 border border-border">
                      <p className="text-[11px] text-muted-foreground">Seeds</p>
                      <p className="font-bold text-sm text-foreground mt-0.5">
                        ₹{activeResult.seedCost.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/40 border border-border">
                      <p className="text-[11px] text-muted-foreground">Fertilizer</p>
                      <p className="font-bold text-sm text-foreground mt-0.5">
                        ₹{activeResult.fertilizerCost.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/40 border border-border">
                      <p className="text-[11px] text-muted-foreground">Labor</p>
                      <p className="font-bold text-sm text-foreground mt-0.5">
                        ₹{activeResult.laborCost.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/40 border border-border">
                      <p className="text-[11px] text-muted-foreground">Water & Fuel</p>
                      <p className="font-bold text-sm text-foreground mt-0.5">
                        ₹{activeResult.waterCost.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/40 border border-border col-span-2 sm:col-span-1">
                      <p className="text-[11px] text-muted-foreground">Other / Misc</p>
                      <p className="font-bold text-sm text-foreground mt-0.5">
                        ₹{activeResult.otherCost.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Monthly Price Trends Chart */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    12-Month Market Price Trend (₹ / kg)
                  </h3>
                  <div className="h-56 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={activeResult.monthlyPrices}
                        margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
                        <XAxis
                          dataKey="month"
                          stroke="var(--color-muted-foreground)"
                          fontSize={11}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="var(--color-muted-foreground)"
                          fontSize={11}
                          tickLine={false}
                          unit="₹"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--color-card)",
                            borderColor: "var(--color-border)",
                            borderRadius: "0.75rem",
                            fontSize: "12px",
                          }}
                          formatter={(val: any) => [`₹${val} / kg`, "Price"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="var(--color-primary)"
                          strokeWidth={2.5}
                          dot={{ fill: "var(--color-primary)", r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
