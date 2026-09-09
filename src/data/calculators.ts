import {
  IrrigationDecision,
  IrrigationDaySchedule,
  ClimateScenarioResult,
  CropPlanInput,
  CropProfitResult,
  CreditScoreResult,
  LoanProgram,
} from "../types";
import { cropCostDetails } from "./mockData";

export const monthsList = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// --- 1. IRRIGATION ALGORITHM ---

export function getIrrigationSchedule(
  moisture: number,
  weather: string,
  crop: string
): IrrigationDaySchedule[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const now = new Date();
  const cropThresholdMap: Record<string, number> = {
    wheat: 35,
    rice: 55,
    tomato: 45,
    maize: 40,
    sugarcane: 60,
    cotton: 38,
  };
  const threshold = cropThresholdMap[crop.toLowerCase()] ?? 40;

  return days.map((dayName, index) => {
    const d = new Date(now);
    d.setDate(now.getDate() + index);
    const dateStr = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

    const projectedMoisture =
      moisture + index * (weather === "rain" ? 8 : weather === "hot" ? -6 : -3);

    const rainProb =
      weather === "rain"
        ? index < 2 ? 80 : 40
        : weather === "hot"
        ? 5
        : weather === "cloudy"
        ? 35
        : 10;

    const condition: "sunny" | "cloudy" | "rain" | "hot" =
      rainProb > 60
        ? "rain"
        : weather === "hot"
        ? "hot"
        : index % 3 === 0
        ? "cloudy"
        : "sunny";

    const temp = weather === "hot" ? 40 + (index % 3) : 28 + (index % 5);
    const needIrrigate = projectedMoisture < threshold && rainProb < 50;

    let reason = "Moisture adequate";
    if (rainProb > 60) reason = "Rain expected — skip";
    else if (projectedMoisture < threshold - 15) reason = "Critical moisture — irrigate";
    else if (needIrrigate) reason = "Below threshold — irrigate";

    return {
      day: dayName,
      date: dateStr,
      weather: condition,
      rainProb,
      tempHigh: temp,
      irrigate: needIrrigate,
      duration: needIrrigate ? (projectedMoisture < threshold - 15 ? 45 : 25) : 0,
      reason,
    };
  });
}

export function calculateIrrigation(
  moisture: number,
  weather: string,
  crop: string,
  landAcres: number,
  irrigationType: string
): IrrigationDecision {
  const schedule = getIrrigationSchedule(moisture, weather, crop);
  const today = schedule[0];

  let decision: "wait" | "skip" | "irrigate" = "wait";
  let urgency: "none" | "moderate" | "critical" = "none";
  let title = "";
  let message = "";
  let duration = "0 min";
  let waterVolume = "0 L";

  const multiplierMap: Record<string, number> = {
    drip: 2,
    sprinkler: 8,
    flood: 20,
    micro: 4,
  };
  const multiplier = multiplierMap[irrigationType] ?? 8;

  if (weather === "rain") {
    decision = "skip";
    urgency = "none";
    title = "Skip Irrigation — Rain Incoming";
    message = `Rain probability is ${today.rainProb}% today. Irrigating now would waste water and risk waterlogging. Your soil will naturally replenish.`;
    duration = "0 min";
    waterVolume = "0 L";
  } else if (moisture < 25) {
    decision = "irrigate";
    urgency = "critical";
    title = "Irrigate Immediately — Critical";
    message = `Soil moisture is at ${moisture}%, far below the critical threshold. Your crops are under severe stress. Immediate irrigation is required.`;
    duration = "50 min";
    waterVolume = `${Math.round(50 * multiplier * landAcres)} L`;
  } else if (moisture < 40) {
    decision = "irrigate";
    urgency = "moderate";
    title = "Irrigate Today";
    message = `Soil moisture at ${moisture}% is below the optimal range for ${crop}. A moderate irrigation session is recommended.`;
    duration = "25–30 min";
    waterVolume = `${Math.round(28 * multiplier * landAcres)} L`;
  } else {
    decision = "wait";
    urgency = "none";
    title = "No Irrigation Needed";
    message = `Soil moisture is at ${moisture}%, within the optimal range. Save water and monitor for the next 2 days.`;
    duration = "—";
    waterVolume = "—";
  }

  const daysIrrigated = schedule.filter((s) => s.irrigate).length;
  const totalDays = schedule.length;
  const waterSavedPercent = Math.round(((totalDays - daysIrrigated) / totalDays) * 100);

  const tipsMap: Record<string, string[]> = {
    wheat: [
      "Water at tillering and grain-filling stages for best yield",
      "Avoid waterlogging — wheat roots are shallow",
    ],
    rice: [
      "Maintain 2–5cm standing water during vegetative phase",
      "Drain field 10 days before harvest",
    ],
    tomato: [
      "Consistent moisture prevents blossom end rot",
      "Drip irrigation reduces fungal disease risk by 40%",
    ],
    maize: [
      "Critical water need at tasseling and silking stages",
      "Do not let soil dry below 40% at knee-high stage",
    ],
    sugarcane: [
      "Requires 150–200cm water annually",
      "Reduce irrigation 30 days before harvest to increase sugar content",
    ],
    cotton: [
      "Water stress at flowering causes boll drop",
      "Stop irrigation 4–6 weeks before harvest",
    ],
  };

  const cropTips =
    tipsMap[crop.toLowerCase()] ?? [
      "Monitor soil moisture daily during vegetative and flowering phases",
      "Irrigate during early morning or late evening to minimize evaporation losses",
    ];

  return {
    decision,
    title,
    message,
    urgency,
    duration,
    waterVolume,
    soilStatus:
      moisture < 25
        ? "Critical"
        : moisture < 40
        ? "Below Optimal"
        : moisture < 60
        ? "Optimal"
        : "Saturated",
    soilMoistureAfter: moisture < 40 ? `~${Math.min(moisture + 20, 65)}%` : `${moisture}%`,
    nextCheck: decision === "skip" ? "48 hrs after rain" : decision === "irrigate" ? "6–12 hours" : "48 hours",
    schedule,
    watterSaved: waterSavedPercent,
    tips: cropTips,
  };
}

// --- 2. CLIMATE RISK ALGORITHM ---

export const climateScenarios: Record<string, (crop: string) => ClimateScenarioResult> = {
  hot: (crop) => ({
    overallRisk: "critical",
    riskScore: 84,
    emergencyMode: true,
    emergencyPlan: [
      `Increase irrigation frequency by 30–40% over the next 72 hours`,
      `Apply organic mulch (5–8cm layer) around ${crop} root zone to retain moisture`,
      `Erect shade nets (30–50% shade) for vulnerable young plants`,
      `Spray kaolin clay solution on leaves to reflect excess heat`,
      `Harvest any mature ${crop} immediately before heat damage occurs`,
      `Document crop stress with photos — required for insurance claims`,
    ],
    alerts: [
      {
        id: "heat1",
        icon: "thermometer-sun",
        title: "Extreme Heat Wave",
        severity: "critical",
        probability: 92,
        timeframe: "Next 3 days",
        detail: `Temperatures expected to reach 44–47°C. Prolonged heat stress will cause wilting, pollen sterility, and fruit drop in ${crop}.`,
        impact: "Up to 40% yield loss if unprotected. Critical stage if crop is in flowering.",
        actions: [
          "Irrigate at dawn and dusk daily",
          "Apply shade netting immediately",
          "Foliar spray with 1% potassium solution to improve heat tolerance",
        ],
      },
      {
        id: "pest1",
        icon: "shield-alert",
        title: "Spider Mite & Aphid Outbreak",
        severity: "high",
        probability: 74,
        timeframe: "3–5 days",
        detail: "Hot, dry, dusty conditions are ideal for rapid spider mite and aphid population explosions. Check undersides of leaves.",
        impact: "Leaf curling, yellowing, and sap loss. 15–25% yield impact if unchecked.",
        actions: [
          "Inspect crop every 2 days",
          "Apply neem oil spray (5ml/L water)",
          "Release predatory mites as biological control",
        ],
      },
      {
        id: "soil1",
        icon: "droplets",
        title: "Rapid Soil Moisture Depletion",
        severity: "high",
        probability: 88,
        timeframe: "Ongoing",
        detail: "Evapotranspiration rates will spike to 8–12mm/day during the heat wave, draining soil moisture 3x faster than normal.",
        impact: "Soil may reach wilting point within 36–48 hours without intervention.",
        actions: [
          "Switch to micro-drip if available",
          "Apply mulch to reduce evaporation",
          "Monitor soil moisture every 6 hours",
        ],
      },
    ],
    forecast: [
      { day: "Today", icon: "sun", tempHigh: 44, tempLow: 31, rainProb: 3, riskLevel: "critical", condition: "Extreme Heat" },
      { day: "Tue", icon: "sun", tempHigh: 46, tempLow: 33, rainProb: 0, riskLevel: "critical", condition: "Severe Heat" },
      { day: "Wed", icon: "sun", tempHigh: 47, tempLow: 34, rainProb: 5, riskLevel: "critical", condition: "Peak Heat" },
      { day: "Thu", icon: "sun", tempHigh: 43, tempLow: 30, rainProb: 8, riskLevel: "high", condition: "Very Hot" },
      { day: "Fri", icon: "sun", tempHigh: 40, tempLow: 28, rainProb: 12, riskLevel: "high", condition: "Hot" },
      { day: "Sat", icon: "sun", tempHigh: 38, tempLow: 26, rainProb: 15, riskLevel: "medium", condition: "Moderating" },
      { day: "Sun", icon: "sun", tempHigh: 36, tempLow: 25, rainProb: 20, riskLevel: "medium", condition: "Warm" },
    ],
  }),

  rain: (crop) => ({
    overallRisk: "high",
    riskScore: 72,
    emergencyMode: true,
    emergencyPlan: [
      `Dig drainage trenches along field perimeter to prevent waterlogging around ${crop}`,
      `Clear existing field outlets and remove any debris blocking water flow`,
      `Elevate seed storage bags and fertilizer sacks above ground level`,
      `Pause all pesticide and fertilizer spraying — rain will wash it away`,
      `Inspect field within 12 hours post-rain to identify trapped water`,
      `Apply fungicide spray as soon as weather clears to prevent fungal rot`,
    ],
    alerts: [
      {
        id: "rain1",
        icon: "cloud-rain",
        title: "Heavy Rainfall & Flash Waterlogging",
        severity: "critical",
        probability: 88,
        timeframe: "Next 48 hours",
        detail: `80–120mm rainfall expected in 48 hours. Standing water for >24 hours suffocates ${crop} roots and causes root rot.`,
        impact: "Severe root asphyxiation, nutrient leaching, fungal disease outbreak.",
        actions: [
          "Open all field drainage gates now",
          "Create furrows between crop beds",
          "Do not irrigate — turn off automated pumps",
        ],
      },
      {
        id: "disease1",
        icon: "shield-alert",
        title: "Fungal Blight & Downy Mildew Risk",
        severity: "high",
        probability: 79,
        timeframe: "Post-rain (day 3–7)",
        detail: "Persistent high humidity (>85%) combined with wet foliage creates perfect conditions for fungal spore germination.",
        impact: "Rapid foliage blight, black spots, stem rot. Can destroy harvest within 5–7 days.",
        actions: [
          "Spray Mancozeb (2g/L) or Copper Oxychloride",
          "Ensure good plant spacing for airflow",
          "Remove and destroy infected leaves immediately",
        ],
      },
      {
        id: "wind1",
        icon: "wind",
        title: "Squall & Crop Lodging Risk",
        severity: "medium",
        probability: 60,
        timeframe: "Tue–Wed",
        detail: "Wind gusts up to 55 km/h during heavy rainfall may cause mature or tall crops to flatten (lodge).",
        impact: "Harvesting difficulty, rotting of flattened ears/pods, 15–20% yield loss.",
        actions: [
          "Stake tall plants or bundle rows loosely",
          "Drain standing water quickly after storm",
        ],
      },
    ],
    forecast: [
      { day: "Today", icon: "cloud-rain", tempHigh: 27, tempLow: 21, rainProb: 85, riskLevel: "high", condition: "Heavy Rain" },
      { day: "Tue", icon: "cloud-rain", tempHigh: 25, tempLow: 20, rainProb: 95, riskLevel: "critical", condition: "Storm / Flood" },
      { day: "Wed", icon: "cloud-rain", tempHigh: 26, tempLow: 20, rainProb: 75, riskLevel: "high", condition: "Moderate Rain" },
      { day: "Thu", icon: "cloud-rain", tempHigh: 28, tempLow: 22, rainProb: 40, riskLevel: "medium", condition: "Scattered Showers" },
      { day: "Fri", icon: "sun", tempHigh: 30, tempLow: 22, rainProb: 20, riskLevel: "medium", condition: "Clearing Up" },
      { day: "Sat", icon: "sun", tempHigh: 31, tempLow: 22, rainProb: 15, riskLevel: "low", condition: "Partly Cloudy" },
      { day: "Sun", icon: "sun", tempHigh: 32, tempLow: 23, rainProb: 10, riskLevel: "low", condition: "Clear" },
    ],
  }),

  drought: (crop) => ({
    overallRisk: "critical",
    riskScore: 89,
    emergencyMode: true,
    emergencyPlan: [
      `Switch immediately to alternate-day deficit irrigation for ${crop}`,
      `Apply heavy mulch (straw, husk, or plastic) to cut soil evaporation by 60%`,
      `Prune non-essential leaves and side shoots to reduce transpiration`,
      `Prioritize watering during critical phenological stages (flowering/grain fill)`,
      `Notify local agricultural officer and register for drought relief scheme`,
      `Plan early harvest if grain maturity is >80% to avoid complete loss`,
    ],
    alerts: [
      {
        id: "drought1",
        icon: "sun",
        title: "Extended Meteorological Drought",
        severity: "critical",
        probability: 95,
        timeframe: "Next 14–21 days",
        detail: `No significant rainfall forecasted for the next 3 weeks. Ground water table dropping by 0.3m/week. Severe water deficit for ${crop}.`,
        impact: "Severe yield loss (50–80%), stunted vegetative growth, premature drying.",
        actions: [
          "Adopt drip or furrow irrigation immediately",
          "Apply anti-transpirant spray (PMA or kaolin)",
          "Stop fertilizer application to avoid root burning",
        ],
      },
      {
        id: "soil2",
        icon: "droplets",
        title: "Soil Moisture Below Permanent Wilting Point",
        severity: "critical",
        probability: 91,
        timeframe: "Within 4 days",
        detail: "Topsoil moisture projected to drop below 12% across the entire root profile.",
        impact: "Irreversible root damage, leaf scorch, crop failure.",
        actions: [
          "Concentrate available water on high-value patches",
          "Dig deep trenches to capture subsoil moisture",
        ],
      },
    ],
    forecast: [
      { day: "Today", icon: "sun", tempHigh: 39, tempLow: 27, rainProb: 0, riskLevel: "high", condition: "Dry & Hot" },
      { day: "Tue", icon: "sun", tempHigh: 40, tempLow: 28, rainProb: 0, riskLevel: "critical", condition: "Severe Dry" },
      { day: "Wed", icon: "sun", tempHigh: 41, tempLow: 28, rainProb: 2, riskLevel: "critical", condition: "Severe Dry" },
      { day: "Thu", icon: "sun", tempHigh: 41, tempLow: 29, rainProb: 0, riskLevel: "critical", condition: "Heat & Dry" },
      { day: "Fri", icon: "sun", tempHigh: 40, tempLow: 28, rainProb: 5, riskLevel: "high", condition: "Dry" },
      { day: "Sat", icon: "sun", tempHigh: 39, tempLow: 27, rainProb: 0, riskLevel: "high", condition: "Dry" },
      { day: "Sun", icon: "sun", tempHigh: 38, tempLow: 26, rainProb: 5, riskLevel: "high", condition: "Dry" },
    ],
  }),

  normal: (crop) => ({
    overallRisk: "low",
    riskScore: 24,
    emergencyMode: false,
    emergencyPlan: [],
    alerts: [
      {
        id: "wind_norm",
        icon: "wind",
        title: "Moderate Afternoon Breezes",
        severity: "low",
        probability: 35,
        timeframe: "Wed–Thu",
        detail: "Wind gusts of 20–30 km/h expected mid-week. Low impact on established crops but may affect tall varieties.",
        impact: `Minor lodging risk for tall crops like ${crop}. Overall low concern.`,
        actions: [
          "Stake tall or recently transplanted plants",
          "Avoid spraying pesticides on windy days",
          "Check irrigation lines for wind displacement",
        ],
      },
    ],
    forecast: [
      { day: "Today", icon: "sun", tempHigh: 30, tempLow: 20, rainProb: 10, riskLevel: "low", condition: "Sunny" },
      { day: "Tue", icon: "sun", tempHigh: 31, tempLow: 21, rainProb: 8, riskLevel: "low", condition: "Clear" },
      { day: "Wed", icon: "droplets", tempHigh: 29, tempLow: 20, rainProb: 25, riskLevel: "low", condition: "Partly Cloudy" },
      { day: "Thu", icon: "wind", tempHigh: 28, tempLow: 19, rainProb: 20, riskLevel: "low", condition: "Windy" },
      { day: "Fri", icon: "sun", tempHigh: 30, tempLow: 20, rainProb: 12, riskLevel: "low", condition: "Sunny" },
      { day: "Sat", icon: "sun", tempHigh: 31, tempLow: 21, rainProb: 10, riskLevel: "low", condition: "Clear" },
      { day: "Sun", icon: "sun", tempHigh: 32, tempLow: 22, rainProb: 8, riskLevel: "low", condition: "Clear" },
    ],
  }),
};

// --- 3. PROFIT PREDICTOR ALGORITHM ---

export function calculateCropProfit(
  item: CropPlanInput,
  waterCostPerAcre: number,
  riskLevel: string
): CropProfitResult {
  const details = cropCostDetails[item.crop.toLowerCase()] ?? cropCostDetails.wheat;
  const acres = parseFloat(item.area) || 1;
  const riskDiscount = riskLevel === "High" ? 0.8 : riskLevel === "Medium" ? 0.9 : 1.0;

  const seedCost = Math.round(details.seed * acres);
  const fertilizerCost = Math.round(details.fert * acres);
  const laborCost = Math.round(details.labor * acres);
  const waterCost = Math.round(waterCostPerAcre * acres);
  const otherCost = Math.round(details.other * acres);
  const totalCost = seedCost + fertilizerCost + laborCost + waterCost + otherCost;

  const expectedYieldKg = Math.round(details.yieldPerAcre * acres * riskDiscount);
  const revenue = Math.round(expectedYieldKg * details.pricePerKg);
  const profit = revenue - totalCost;
  const roi = Math.round((profit / totalCost) * 100);
  const breakEvenPrice = Math.round((totalCost / expectedYieldKg) * 100) / 100;

  const verdict: "profitable" | "breakeven" | "loss" =
    profit > 5000 ? "profitable" : profit > -3000 ? "breakeven" : "loss";

  const monthlyPrices = monthsList.map((month, idx) => ({
    month,
    price: details.months[idx] ?? details.pricePerKg,
  }));

  return {
    id: item.id,
    crop: item.crop,
    area: acres,
    seedCost,
    fertilizerCost,
    laborCost,
    waterCost,
    otherCost,
    totalCost,
    expectedYieldKg,
    pricePerKg: details.pricePerKg,
    revenue,
    profit,
    roi,
    breakEvenPrice,
    marketTrend: details.trend,
    riskLevel,
    verdict,
    monthlyPrices,
  };
}

// --- 4. FARMER CREDIT SCORE ALGORITHM ---

export function calculateCreditScore(
  experienceYears: number,
  cropYieldConsistency: string,
  landHoldingAcres: number,
  repaymentHistory: string,
  cropDiversificationCount: number,
  hasCropInsurance: boolean,
  hasAgriTraining: boolean
): CreditScoreResult {
  const expScore = Math.min(experienceYears * 12, 120);
  const yieldScore =
    cropYieldConsistency === "high" ? 120 : cropYieldConsistency === "medium" ? 80 : 40;
  const landScore = Math.min(landHoldingAcres * 20, 100);
  const repayScore =
    repaymentHistory === "excellent"
      ? 150
      : repaymentHistory === "good"
      ? 100
      : repaymentHistory === "fair"
      ? 50
      : repaymentHistory === "poor"
      ? 10
      : 30;
  const divScore = Math.min(cropDiversificationCount * 20, 80);
  const bonusScore = (hasCropInsurance ? 40 : 0) + (hasAgriTraining ? 30 : 0);

  const totalScore = Math.min(
    300 + expScore + yieldScore + landScore + repayScore + divScore + bonusScore,
    900
  );

  const grade: "A+" | "A" | "B+" | "B" | "C" | "D" =
    totalScore >= 820
      ? "A+"
      : totalScore >= 750
      ? "A"
      : totalScore >= 680
      ? "B+"
      : totalScore >= 600
      ? "B"
      : totalScore >= 450
      ? "C"
      : "D";

  const maxLoan =
    grade === "A+"
      ? 1000000
      : grade === "A"
      ? 700000
      : grade === "B+"
      ? 400000
      : grade === "B"
      ? 200000
      : grade === "C"
      ? 75000
      : 25000;

  const eligibleLoans: LoanProgram[] =
    grade === "A+" || grade === "A"
      ? [
          { name: "State Bank of India", rate: "4% p.a.", maxAmount: "₹10,00,000", type: "Kisan Credit Card" },
          { name: "NABARD Scheme", rate: "3.5% p.a.", maxAmount: "₹15,00,000", type: "Agricultural Term Loan" },
          { name: "Co-operative Bank", rate: "5% p.a.", maxAmount: "₹5,00,000", type: "Short-term Crop Loan" },
        ]
      : grade === "B+" || grade === "B"
      ? [
          { name: "Regional Rural Bank", rate: "7–8% p.a.", maxAmount: "₹3,00,000", type: "Crop Loan" },
          { name: "Microfinance Co-op", rate: "9% p.a.", maxAmount: "₹1,00,000", type: "Small Farmer Loan" },
        ]
      : [
          { name: "Local Farmer Co-op", rate: "12–15% p.a.", maxAmount: "₹50,000", type: "Microfinance" },
        ];

  const verdict =
    grade === "A+"
      ? "Excellent — All premium low-interest agricultural loans unlocked"
      : grade === "A"
      ? "Very Good — Most commercial & subsidized loans accessible"
      : grade === "B+"
      ? "Good — Standard agricultural credit and KCC accessible"
      : grade === "B"
      ? "Fair — Basic microfinance and group loans available"
      : grade === "C"
      ? "Subprime — Limited credit access, collateral required"
      : "High Risk — Consider building credit with local self-help groups";

  return {
    score: totalScore,
    grade,
    verdict,
    maxLoan,
    breakdown: {
      experience: expScore,
      cropYield: yieldScore,
      landHolding: landScore,
      repayment: repayScore,
      diversification: divScore,
      bonus: bonusScore,
    },
    eligibleLoans,
  };
}
