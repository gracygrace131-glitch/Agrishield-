import { useState } from "react";
import { motion } from "motion/react";
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Share2,
  Loader2,
  Award,
  Sparkles,
  Building2,
  Percent,
  Wallet,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { calculateCreditScore } from "../data/calculators";
import { CreditScoreResult } from "../types";

export function CreditScorePage() {
  const [form, setForm] = useState({
    name: "",
    years: "",
    yield: "",
    land: "",
    repayment: "",
    crops: "2",
    insurance: "no",
    training: "no",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreditScoreResult | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const score = calculateCreditScore(
      parseInt(form.years, 10) || 0,
      form.yield,
      parseFloat(form.land) || 0,
      form.repayment,
      parseInt(form.crops, 10) || 1,
      form.insurance === "yes",
      form.training === "yes"
    );
    setResult(score);
    setLoading(false);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Credit report verification link copied to clipboard! Share with your lender.");
  };

  const isFormValid = Boolean(form.years && form.yield && form.land && form.repayment);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold font-display">Farmer Credit Score</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Build an alternative credit profile from your farming experience, harvest yield consistency,
          land ownership, and climate discipline to unlock low-interest microloans.
        </p>
      </motion.div>

      {/* Input Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              Farming History & Credit Profile
            </CardTitle>
            <CardDescription>
              Your data is encrypted and evaluated against NABARD and cooperative lending benchmarks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Farmer Full Name (for credit badge)
                </label>
                <Input
                  placeholder="e.g. Ramesh Kumar"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Years Farming */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Years of Active Farming <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 8"
                  min="0"
                  value={form.years}
                  onChange={(e) => setForm({ ...form, years: e.target.value })}
                />
              </div>

              {/* Average Yield */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Average Harvest Yield <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.yield}
                  onChange={(e) => setForm({ ...form, yield: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <option value="">Select average yield range</option>
                  <option value="high">High (Consistently above district average)</option>
                  <option value="medium">Medium (Matches district average)</option>
                  <option value="low">Low (Below district average)</option>
                </select>
              </div>

              {/* Land Owned */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Land Holding (acres) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 3.5"
                  min="0.1"
                  step="0.1"
                  value={form.land}
                  onChange={(e) => setForm({ ...form, land: e.target.value })}
                />
              </div>

              {/* Repayment history */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Loan Repayment Record <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.repayment}
                  onChange={(e) => setForm({ ...form, repayment: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <option value="">Select repayment history</option>
                  <option value="excellent">Excellent (Repaid all previous dues on time)</option>
                  <option value="good">Good (1–2 delayed payments, fully settled)</option>
                  <option value="fair">Fair (Restructured or delayed season loan)</option>
                  <option value="none">First Time Borrower (No formal history)</option>
                  <option value="poor">Poor (Existing unresolved defaults)</option>
                </select>
              </div>

              {/* Crops grown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Number of Different Crops Grown (Diversification)
                </label>
                <select
                  value={form.crops}
                  onChange={(e) => setForm({ ...form, crops: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <option value="1">1 crop (Monoculture)</option>
                  <option value="2">2 crops (Rotation)</option>
                  <option value="3">3+ crops (High diversification)</option>
                </select>
              </div>

              {/* Insurance */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Do you have active Crop Insurance (PMFBY)?
                </label>
                <select
                  value={form.insurance}
                  onChange={(e) => setForm({ ...form, insurance: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes (Bonus credit score points)</option>
                </select>
              </div>

              {/* Training */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  FPO Member or KVK Agricultural Training?
                </label>
                <select
                  value={form.training}
                  onChange={(e) => setForm({ ...form, training: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes (Certified / FPO Registered)</option>
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
                  Evaluating Creditworthiness & Eligible Loans…
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Calculate Credit Score & Pre-Approved Loans
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
          {/* Digital Credit Card Display */}
          <div className="flex justify-center">
            <motion.div
              className="w-full max-w-md h-56 rounded-3xl p-6 relative overflow-hidden shadow-2xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white flex flex-col justify-between border border-emerald-500/30"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Background ambient accents */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-400/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl" />

              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <span className="font-bold tracking-wider text-sm uppercase opacity-90 font-display">
                    AgriShield Credit Pass
                  </span>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold border border-white/20">
                  Grade {result.grade}
                </div>
              </div>

              <div className="my-auto relative z-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-emerald-300">
                    {result.score}
                  </span>
                  <span className="text-xs opacity-70">/ 850</span>
                </div>
                <p className="text-xs text-emerald-200/90 mt-0.5">{result.verdict}</p>
              </div>

              <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/15 text-xs">
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">Farmer</p>
                  <p className="font-semibold">{form.name || "Verified Farmer"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider opacity-60">
                    Pre-Approved Credit Line
                  </p>
                  <p className="font-bold text-sm text-emerald-300">
                    ₹{result.maxLoan.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="cursor-pointer gap-2"
            >
              <Share2 className="w-3.5 h-3.5" /> Share Report With Bank / Micro-Lender
            </Button>
          </div>

          {/* Breakdown Bars */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Score Component Breakdown</CardTitle>
              <CardDescription>
                Detailed audit factors that contributed to your overall rating
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Farming Experience</span>
                    <span className="font-semibold text-foreground">
                      {result.breakdown.experience} pts
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(result.breakdown.experience / 160) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Harvest Yield Consistency</span>
                    <span className="font-semibold text-foreground">
                      {result.breakdown.cropYield} pts
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(result.breakdown.cropYield / 180) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Land Holding</span>
                    <span className="font-semibold text-foreground">
                      {result.breakdown.landHolding} pts
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(result.breakdown.landHolding / 140) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Repayment Record</span>
                    <span className="font-semibold text-foreground">
                      {result.breakdown.repayment} pts
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(result.breakdown.repayment / 220) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Crop Diversification</span>
                    <span className="font-semibold text-foreground">
                      {result.breakdown.diversification} pts
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(result.breakdown.diversification / 90) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resilience Bonus (Insurance / FPO)</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      +{result.breakdown.bonus} pts
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(result.breakdown.bonus / 60) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eligible Microloans */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold font-display">Pre-Approved Microloan Schemes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.eligibleLoans.map((loan) => (
                <Card key={loan.name} className="flex flex-col justify-between">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="text-[10px] mb-1.5">
                          {loan.type}
                        </Badge>
                        <h4 className="font-bold text-sm font-display text-foreground leading-snug">
                          {loan.name}
                        </h4>
                      </div>
                      <Building2 className="w-4 h-4 text-primary shrink-0" />
                    </div>

                    <div className="space-y-1 text-xs pt-2 border-t border-border/60">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Interest Rate:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {loan.rate}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Max Pre-Approved:</span>
                        <span className="font-bold text-foreground">{loan.maxAmount}</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full cursor-pointer text-xs mt-2"
                      onClick={() =>
                        toast.success(`Application initiated for ${loan.name}. Lending partner contacted!`)
                      }
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
