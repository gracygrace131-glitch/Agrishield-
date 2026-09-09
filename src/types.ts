export interface AlertItem {
  type: "warning" | "info" | "success";
  icon: string;
  message: string;
  color: string;
  bg: string;
  priority: string;
  priorityColor: string;
  callMessage: string;
}

export interface DashboardStat {
  label: string;
  value: string;
  sub: string;
  icon: string;
  color: string;
  bg: string;
}

export interface QuickAction {
  path: string;
  label: string;
  icon: string;
  desc: string;
  color: string;
}

export interface PhoneSettings {
  number: string;
  autoCallEnabled: boolean;
  autoCallOnHigh: boolean;
  autoCallOnAll: boolean;
  countryCode: string;
}

export interface CountryOption {
  code: string;
  label: string;
}

export interface CropRecommendation {
  name: string;
  suitability: number;
  waterReq: string;
  yield: string;
  profit: string;
  season: string;
  risk: "Low" | "Medium" | "High";
}

export interface IrrigationDaySchedule {
  day: string;
  date: string;
  weather: "sunny" | "cloudy" | "rain" | "hot";
  rainProb: number;
  tempHigh: number;
  irrigate: boolean;
  duration: number;
  reason: string;
}

export interface IrrigationDecision {
  decision: "wait" | "skip" | "irrigate";
  title: string;
  message: string;
  urgency: "none" | "moderate" | "critical";
  duration: string;
  waterVolume: string;
  soilStatus: string;
  soilMoistureAfter: string;
  nextCheck: string;
  schedule: IrrigationDaySchedule[];
  watterSaved: number;
  tips: string[];
}

export interface ClimateDayForecast {
  day: string;
  icon: string;
  tempHigh: number;
  tempLow: number;
  rainProb: number;
  riskLevel: "critical" | "high" | "medium" | "low";
  condition: string;
}

export interface ClimateAlert {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  icon: string;
  probability: number;
  timeframe: string;
  detail: string;
  impact: string;
  actions: string[];
}

export interface ClimateScenarioResult {
  overallRisk: "critical" | "high" | "medium" | "low";
  riskScore: number;
  emergencyMode: boolean;
  emergencyPlan: string[];
  alerts: ClimateAlert[];
  forecast: ClimateDayForecast[];
}

export interface CropPlanInput {
  id: string;
  crop: string;
  area: string;
}

export interface CropProfitResult {
  id: string;
  crop: string;
  area: number;
  seedCost: number;
  fertilizerCost: number;
  laborCost: number;
  waterCost: number;
  otherCost: number;
  totalCost: number;
  expectedYieldKg: number;
  pricePerKg: number;
  revenue: number;
  profit: number;
  roi: number;
  breakEvenPrice: number;
  marketTrend: "rising" | "stable" | "falling";
  riskLevel: string;
  verdict: "profitable" | "breakeven" | "loss";
  monthlyPrices: { month: string; price: number }[];
}

export interface LoanProgram {
  name: string;
  rate: string;
  maxAmount: string;
  type: string;
}

export interface CreditScoreResult {
  score: number;
  grade: "A+" | "A" | "B+" | "B" | "C" | "D";
  verdict: string;
  maxLoan: number;
  breakdown: {
    experience: number;
    cropYield: number;
    landHolding: number;
    repayment: number;
    diversification: number;
    bonus: number;
  };
  eligibleLoans: LoanProgram[];
}

export interface MachinerySpec {
  label: string;
  value: string;
}

export interface MachineryReview {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MachineryItem {
  id: string;
  name: string;
  brand?: string;
  owner: string;
  ownerPhone?: string;
  ownerVerified?: boolean;
  verified?: boolean;
  location: string;
  distanceKm: number;
  pricePerDay: number;
  pricePerHour: number;
  available: boolean;
  availableFrom?: string;
  rating: number;
  reviewCount?: number;
  reviewsCount?: number;
  category: "tractor" | "harvester" | "seed_drill" | "drill" | "sprayer" | "drone" | "pump" | "thresher" | string;
  savedVsBuy?: number;
  completedJobs?: number;
  specs: (MachinerySpec | string)[];
  features?: string[];
  reviews?: MachineryReview[];
  description?: string;
  image?: string;
  imageUrl?: string;
}

export interface SeedItem {
  id: string;
  name: string;
  variety: string;
  brand: string;
  category: "vegetable" | "cereal" | "oilseed" | "pulse" | "spice" | "cash" | "cash_crop" | string;
  cropType?: string;
  pricePerKg: number;
  price?: number;
  originalPrice?: number;
  packSizes?: number[];
  packSize?: string;
  discount?: number;
  rating: number;
  reviewCount?: number;
  season?: string[];
  germinationRate: number;
  maturityDays: number;
  yieldPerAcre?: string;
  droughtTolerant?: boolean;
  pestResistant?: boolean;
  certified: boolean;
  aiSuggested?: boolean;
  aiRecommended?: boolean;
  bestBuy?: boolean;
  stockLeft?: number;
  popularIn?: string;
  features?: string[];
  description?: string;
  image?: string;
  imageUrl?: string;
}

export interface CartItem {
  seedId: string;
  seedName: string;
  qty: number;
  pricePerKg: number;
  total: number;
}
