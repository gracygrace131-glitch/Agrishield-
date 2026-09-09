import {
  AlertItem,
  DashboardStat,
  QuickAction,
  PhoneSettings,
  CountryOption,
  CropRecommendation,
  IrrigationDecision,
  IrrigationDaySchedule,
  ClimateScenarioResult,
  CropPlanInput,
  CropProfitResult,
  CreditScoreResult,
  MachineryItem,
  SeedItem,
} from "../types";

export const defaultPhoneSettings: PhoneSettings = {
  number: "",
  autoCallEnabled: false,
  autoCallOnHigh: true,
  autoCallOnAll: false,
  countryCode: "+91",
};

export const countryOptions: CountryOption[] = [
  { code: "+91", label: "🇮🇳 India" },
  { code: "+1", label: "🇺🇸 USA" },
  { code: "+44", label: "🇬🇧 UK" },
  { code: "+61", label: "🇦🇺 AUS" },
  { code: "+971", label: "🇦🇪 UAE" },
];

export const landingStats = [
  { value: "40%", label: "Water Saved" },
  { value: "2.8x", label: "Higher Yield" },
  { value: "60%", label: "Cost Reduction" },
  { value: "50K+", label: "Farmers Helped" },
];

export const landingFeatures = [
  {
    icon: "sprout",
    title: "AI Crop Advisor",
    description: "Enter your land, soil type, and water availability. AI recommends the best crops with yield and profit estimates.",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: "droplets",
    title: "Smart Irrigation",
    description: "Combines soil moisture data with weather forecasts to give you exact irrigation schedules and prevent wastage.",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: "shield-alert",
    title: "Climate Risk Engine",
    description: "Detects heat waves, droughts, heavy rain and pest outbreaks early — with personalized crop protection plans.",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    icon: "trending-up",
    title: "Profit Predictor",
    description: "Before planting, see expected yield, costs, revenue and net profit — so every decision is data-driven.",
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: "credit-card",
    title: "Farmer Credit Score",
    description: "Build a risk profile from crop history, yield data and land info to unlock low-cost financing from lenders.",
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-950/30",
  },
  {
    icon: "tractor",
    title: "Shared Machinery",
    description: "Book tractors, harvesters, drones and sprayers collectively with nearby farmers to cut costs dramatically.",
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/30",
  },
];

export const dashboardAlerts: AlertItem[] = [
  {
    type: "warning",
    icon: "thermometer-sun",
    message: "Heat wave expected in 3 days — consider extra irrigation",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    priority: "High",
    priorityColor: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
    callMessage: "Attention farmer! High priority weather alert. A heat wave is expected in 3 days. Please consider scheduling extra irrigation for your crops to avoid heat stress and yield loss.",
  },
  {
    type: "info",
    icon: "droplets",
    message: "Soil moisture at 38% — optimal range for wheat",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    priority: "Info",
    priorityColor: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800",
    callMessage: "Farm update. Your soil moisture level is currently at 38 percent, which is in the optimal range for wheat. No immediate action required. Keep monitoring.",
  },
  {
    type: "success",
    icon: "circle-check",
    message: "Tomato crop on track — harvest in ~12 days",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    priority: "Good",
    priorityColor: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800",
    callMessage: "Good news from AgriShield! Your tomato crop is on track and progressing well. Estimated harvest in approximately 12 days. Prepare your storage and market contacts.",
  },
];

export const dashboardStats: DashboardStat[] = [
  {
    label: "Active Crops",
    value: "3",
    sub: "Wheat, Tomato, Rice",
    icon: "wheat",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    label: "Water Saved",
    value: "1,240 L",
    sub: "This season",
    icon: "droplets",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    label: "Expected Profit",
    value: "₹52,000",
    sub: "Next harvest",
    icon: "trending-up",
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    label: "Risk Level",
    value: "Medium",
    sub: "Climate risk index",
    icon: "triangle-alert",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
];

export const quickActions: QuickAction[] = [
  {
    path: "/crop-advisor",
    label: "Crop Advisor",
    icon: "sprout",
    desc: "Get AI crop recommendations",
    color: "bg-emerald-500",
  },
  {
    path: "/irrigation",
    label: "Smart Irrigation",
    icon: "droplets",
    desc: "Optimize water usage",
    color: "bg-blue-500",
  },
  {
    path: "/climate-risk",
    label: "Climate Risk",
    icon: "shield-alert",
    desc: "Predict weather threats",
    color: "bg-amber-500",
  },
  {
    path: "/profit-predictor",
    label: "Profit Predictor",
    icon: "trending-up",
    desc: "Forecast your earnings",
    color: "bg-purple-500",
  },
  {
    path: "/credit-score",
    label: "Credit Score",
    icon: "credit-card",
    desc: "Your farmer risk profile",
    color: "bg-rose-500",
  },
  {
    path: "/machinery",
    label: "Machinery",
    icon: "tractor",
    desc: "Book shared equipment",
    color: "bg-orange-500",
  },
  {
    path: "/seeds-shop",
    label: "Seeds Shop",
    icon: "shopping-bag",
    desc: "Buy certified seeds cheap",
    color: "bg-lime-600",
  },
];

export const cropsDataset: Record<string, CropRecommendation[]> = {loam:[{name:`Tomato`,suitability:95,waterReq:`Medium`,yield:`4.2 t/acre`,profit:`₹38,000`,season:`Kharif`,risk:`Low`},{name:`Wheat`,suitability:88,waterReq:`Low`,yield:`3.1 t/acre`,profit:`₹24,000`,season:`Rabi`,risk:`Low`},{name:`Maize`,suitability:82,waterReq:`Medium`,yield:`5.5 t/acre`,profit:`₹21,000`,season:`Kharif`,risk:`Medium`}],clay:[{name:`Rice`,suitability:94,waterReq:`High`,yield:`3.8 t/acre`,profit:`₹30,000`,season:`Kharif`,risk:`Low`},{name:`Sugarcane`,suitability:86,waterReq:`High`,yield:`40 t/acre`,profit:`₹56,000`,season:`Annual`,risk:`Medium`},{name:`Groundnut`,suitability:72,waterReq:`Low`,yield:`1.8 t/acre`,profit:`₹28,000`,season:`Kharif`,risk:`Low`}],sandy:[{name:`Groundnut`,suitability:92,waterReq:`Low`,yield:`2.1 t/acre`,profit:`₹33,000`,season:`Kharif`,risk:`Low`},{name:`Watermelon`,suitability:88,waterReq:`Medium`,yield:`12 t/acre`,profit:`₹44,000`,season:`Summer`,risk:`Low`},{name:`Millet`,suitability:80,waterReq:`Very Low`,yield:`1.5 t/acre`,profit:`₹15,000`,season:`Kharif`,risk:`Low`}],default:[{name:`Tomato`,suitability:89,waterReq:`Medium`,yield:`3.9 t/acre`,profit:`₹35,000`,season:`Kharif`,risk:`Low`},{name:`Onion`,suitability:83,waterReq:`Medium`,yield:`8 t/acre`,profit:`₹40,000`,season:`Rabi`,risk:`Medium`},{name:`Chickpea`,suitability:77,waterReq:`Low`,yield:`1.4 t/acre`,profit:`₹18,000`,season:`Rabi`,risk:`Low`}]};

export const cropCostDetails: Record<string, any> = {tomato:{yieldPerAcre:4200,pricePerKg:12,seed:4e3,fert:8e3,labor:12e3,other:2e3,trend:`rising`,months:[9,11,14,18,16,12,10,8,7,9,11,13]},wheat:{yieldPerAcre:3100,pricePerKg:22,seed:3e3,fert:6e3,labor:8e3,other:1500,trend:`stable`,months:[21,22,22,23,24,24,22,21,20,21,22,22]},rice:{yieldPerAcre:3800,pricePerKg:20,seed:2500,fert:7e3,labor:1e4,other:1800,trend:`stable`,months:[19,20,20,21,22,21,20,19,18,19,20,20]},maize:{yieldPerAcre:5500,pricePerKg:14,seed:2e3,fert:5e3,labor:7e3,other:1200,trend:`rising`,months:[12,13,14,15,16,15,14,13,12,12,13,13]},onion:{yieldPerAcre:8e3,pricePerKg:8,seed:3500,fert:6e3,labor:9e3,other:2e3,trend:`falling`,months:[14,12,10,8,6,5,6,7,8,9,10,12]},cotton:{yieldPerAcre:1800,pricePerKg:65,seed:5e3,fert:1e4,labor:15e3,other:3e3,trend:`rising`,months:[60,62,65,68,70,72,68,65,62,60,62,64]},groundnut:{yieldPerAcre:2100,pricePerKg:45,seed:4500,fert:5e3,labor:8e3,other:1500,trend:`stable`,months:[43,44,45,46,47,47,45,44,43,43,44,45]},soybean:{yieldPerAcre:1600,pricePerKg:38,seed:3e3,fert:5500,labor:6e3,other:1200,trend:`rising`,months:[34,35,36,37,38,40,41,40,38,37,36,35]}};

export const machineryCatalog: MachineryItem[] = [{id:`1`,name:`Mahindra 575 DI Tractor`,brand:`Mahindra`,owner:`Ravi Sharma`,ownerPhone:`+91 98765 43210`,ownerVerified:!0,location:`Ludhiana, Punjab`,distanceKm:2.3,pricePerDay:1800,pricePerHour:280,available:!0,rating:4.8,reviewCount:34,category:`tractor`,savedVsBuy:68e4,completedJobs:87,specs:[{label:`Engine`,value:`47 HP`},{label:`Fuel`,value:`Diesel`},{label:`Drive`,value:`2WD / 4WD`},{label:`PTO`,value:`540 RPM`}],features:[`GPS Tracker`,`AC Cabin`,`Power Steering`,`Implements included`],reviews:[{author:`Suresh K.`,rating:5,comment:`Excellent condition. Ravi ji was very helpful.`,date:`Mar 2025`},{author:`Priya D.`,rating:4,comment:`Good machine, on-time delivery.`,date:`Feb 2025`}]},{id:`2`,name:`John Deere W70 Harvester`,brand:`John Deere`,owner:`Suresh Patel`,ownerPhone:`+91 99887 76655`,ownerVerified:!0,location:`Anand, Gujarat`,distanceKm:4.1,pricePerDay:4500,pricePerHour:650,available:!0,rating:4.9,reviewCount:52,category:`harvester`,savedVsBuy:22e5,completedJobs:143,specs:[{label:`Cut Width`,value:`3.66 m`},{label:`Grain Tank`,value:`3000 L`},{label:`Engine`,value:`74 HP`},{label:`Fuel`,value:`Diesel`}],features:[`Yield Monitor`,`GPS Auto-steer`,`Chaff Spreader`,`Night Light Kit`],reviews:[{author:`Mukesh R.`,rating:5,comment:`Best harvester in the area. Completed 10 acres in one day!`,date:`Apr 2025`},{author:`Amit S.`,rating:5,comment:`Zero breakdowns. Highly recommend.`,date:`Jan 2025`}]},{id:`3`,name:`Pneumatic Seed Drill (24-row)`,brand:`Fieldking`,owner:`Mukesh Singh`,ownerPhone:`+91 97654 32109`,ownerVerified:!1,location:`Amritsar, Punjab`,distanceKm:1.8,pricePerDay:900,pricePerHour:140,available:!1,availableFrom:`Jun 15, 2025`,rating:4.6,reviewCount:18,category:`drill`,savedVsBuy:28e4,completedJobs:45,specs:[{label:`Rows`,value:`24`},{label:`Spacing`,value:`15–25 cm`},{label:`Tank`,value:`400 L`},{label:`Width`,value:`3.6 m`}],features:[`Zero-till capable`,`Seed + Fertilizer`,`Depth adjustment`,`Tractor-mountable`],reviews:[{author:`Harjit S.`,rating:5,comment:`Saved 40% on seed cost with precision placement.`,date:`Nov 2024`}]},{id:`4`,name:`Boom Sprayer (36m)`,brand:`Indo Farm`,owner:`Priya Devi`,ownerPhone:`+91 96543 21098`,ownerVerified:!0,location:`Nashik, Maharashtra`,distanceKm:3.5,pricePerDay:1200,pricePerHour:190,available:!0,rating:4.7,reviewCount:29,category:`sprayer`,savedVsBuy:38e4,completedJobs:72,specs:[{label:`Boom Width`,value:`36 m`},{label:`Tank`,value:`1000 L`},{label:`Nozzle Spacing`,value:`50 cm`},{label:`Pump`,value:`150 L/min`}],features:[`Anti-drip nozzles`,`GPS boom control`,`Flow meters`,`Pesticide-certified`],reviews:[{author:`Kiran M.`,rating:5,comment:`Covered 12 acres/hr. No chemical wastage.`,date:`Mar 2025`},{author:`Dinesh P.`,rating:4,comment:`Well-maintained. Good for large fields.`,date:`Feb 2025`}]},{id:`5`,name:`DJI Agras T40 Drone`,brand:`DJI`,owner:`AgriCo-op Pune`,ownerPhone:`+91 95432 10987`,ownerVerified:!0,location:`Pune, Maharashtra`,distanceKm:5.2,pricePerDay:2800,pricePerHour:420,available:!0,rating:4.9,reviewCount:67,category:`drone`,savedVsBuy:95e4,completedJobs:201,specs:[{label:`Payload`,value:`40 kg`},{label:`Spray Width`,value:`9 m`},{label:`Speed`,value:`10 m/s`},{label:`Coverage`,value:`40 acres/hr`}],features:[`AI Obstacle avoidance`,`DGCA licensed`,`Night spray`,`Prescription map upload`],reviews:[{author:`Sanjay R.`,rating:5,comment:`Precision spraying saved 30% on chemicals.`,date:`Apr 2025`},{author:`Geeta B.`,rating:5,comment:`Drone operator was professional. Outstanding service.`,date:`Mar 2025`}]},{id:`6`,name:`Rotavator / Tiller (8-ft)`,brand:`Shaktiman`,owner:`Vikram Rao`,ownerPhone:`+91 94321 09876`,ownerVerified:!0,location:`Nagpur, Maharashtra`,distanceKm:2.7,pricePerDay:700,pricePerHour:110,available:!0,rating:4.5,reviewCount:41,category:`tractor`,savedVsBuy:12e4,completedJobs:115,specs:[{label:`Working Width`,value:`8 ft`},{label:`Blades`,value:`54`},{label:`PTO Required`,value:`50–65 HP`},{label:`Depth`,value:`15–20 cm`}],features:[`Side shift`,`Heavy-duty flanges`,`Gear-driven`,`For all soil types`],reviews:[{author:`Rajiv N.`,rating:4,comment:`Good condition. Ready on time.`,date:`Jan 2025`}]},{id:`7`,name:`Diesel Water Pump (5 HP)`,brand:`Kirloskar`,owner:`Ramesh Kumar`,ownerPhone:`+91 93210 98765`,ownerVerified:!0,location:`Coimbatore, TN`,distanceKm:1.2,pricePerDay:400,pricePerHour:60,available:!0,rating:4.4,reviewCount:22,category:`pump`,savedVsBuy:45e3,completedJobs:93,specs:[{label:`Power`,value:`5 HP`},{label:`Flow Rate`,value:`900 L/min`},{label:`Head`,value:`25 m`},{label:`Fuel`,value:`Diesel`}],features:[`Self-priming`,`Portable`,`For irrigation / flood control`,`Spare hose included`],reviews:[{author:`Murugan S.`,rating:5,comment:`Helped save my crop during drought. Quick booking!`,date:`Apr 2025`}]},{id:`8`,name:`Paddy Thresher (Multi-crop)`,brand:`VST Tillers`,owner:`FPO Thanjavur`,ownerPhone:`+91 92109 87654`,ownerVerified:!0,location:`Thanjavur, TN`,distanceKm:3.8,pricePerDay:1500,pricePerHour:230,available:!1,availableFrom:`Jul 1, 2025`,rating:4.7,reviewCount:33,category:`thresher`,savedVsBuy:55e4,completedJobs:58,specs:[{label:`Capacity`,value:`500 kg/hr`},{label:`Crops`,value:`Paddy, Wheat, Maize`},{label:`Engine`,value:`8 HP`},{label:`Drive`,value:`Belt-driven`}],features:[`Low grain loss`,`Portable trailer`,`Easy cleaning`,`High separation efficiency`],reviews:[{author:`Selvi A.`,rating:5,comment:`Excellent output. Grain loss was very minimal.`,date:`Dec 2024`}]}];

export const seedsCatalog: SeedItem[] = [{id:`1`,name:`Hybrid Tomato Seeds`,variety:`Arka Rakshak F1`,brand:`IARI`,category:`vegetable`,cropType:`tomato`,pricePerKg:1200,originalPrice:1800,packSizes:[.1,.25,.5,1],rating:4.8,reviewCount:312,season:[`Rabi`,`Kharif`],germinationRate:92,maturityDays:75,yieldPerAcre:`20–25 tonnes`,droughtTolerant:!1,certified:!0,popularIn:`Maharashtra, Karnataka`,features:[`Disease-resistant`,`High shelf life`,`Uniform fruit size`,`Export quality`],aiSuggested:!0,bestBuy:!0,stockLeft:18,description:`IARI's top-performing hybrid tomato. Disease-resistant with exceptional yield potential and long shelf-life ideal for both local and export markets.`},{id:`2`,name:`PM Wheat Seeds`,variety:`HD-2967`,brand:`NSCL`,category:`cereal`,cropType:`wheat`,pricePerKg:45,originalPrice:55,packSizes:[5,10,25,50],rating:4.9,reviewCount:884,season:[`Rabi`],germinationRate:95,maturityDays:120,yieldPerAcre:`20–22 quintals`,droughtTolerant:!1,certified:!0,popularIn:`Punjab, Haryana, UP`,features:[`High protein content`,`Rust resistant`,`Uniform ripening`,`Govt. recommended`],aiSuggested:!0,bestBuy:!1,description:`India's most widely grown wheat variety. Govt-certified, rust-resistant, and consistently high-yielding across major wheat belts.`},{id:`3`,name:`Kharif Maize Seeds`,variety:`Pioneer 3396`,brand:`Pioneer (Corteva)`,category:`cereal`,cropType:`maize`,pricePerKg:320,originalPrice:400,packSizes:[1,2,5,10],rating:4.7,reviewCount:213,season:[`Kharif`],germinationRate:93,maturityDays:95,yieldPerAcre:`30–35 quintals`,droughtTolerant:!0,certified:!0,popularIn:`Rajasthan, MP, Bihar`,features:[`Drought tolerant`,`Early maturity`,`High starch`,`Pest resistant`],aiSuggested:!1,bestBuy:!1,description:`Pioneer's high-yield hybrid maize with drought tolerance — ideal for rain-fed areas and water-scarce regions.`},{id:`4`,name:`Desi Onion Seeds`,variety:`Bhima Raj`,brand:`NHRDF`,category:`vegetable`,cropType:`onion`,pricePerKg:2800,originalPrice:3200,packSizes:[.1,.25,.5],rating:4.6,reviewCount:167,season:[`Rabi`,`Late Kharif`],germinationRate:88,maturityDays:110,yieldPerAcre:`12–15 tonnes`,droughtTolerant:!1,certified:!0,popularIn:`Nashik, Rajasthan`,features:[`High dry matter`,`Good storability`,`Deep red color`,`Disease tolerant`],aiSuggested:!1,bestBuy:!1,stockLeft:5,description:`National Horticulture Research and Development Foundation's premium onion variety with excellent storability and market acceptance.`},{id:`5`,name:`Soybean Seeds`,variety:`JS-335`,brand:`JNKVV`,category:`oilseed`,cropType:`soybean`,pricePerKg:65,originalPrice:75,packSizes:[5,10,20,50],rating:4.7,reviewCount:428,season:[`Kharif`],germinationRate:90,maturityDays:92,yieldPerAcre:`12–14 quintals`,droughtTolerant:!0,certified:!0,popularIn:`MP, Maharashtra, Rajasthan`,features:[`High protein (42%)`,`Broad adaptability`,`Early maturing`,`Pod shattering resistant`],aiSuggested:!0,bestBuy:!0,description:`JS-335 dominates the soybean belt. Drought-tolerant, early-maturing, and consistently profitable with strong market demand.`},{id:`6`,name:`Groundnut Seeds`,variety:`TAG-24`,brand:`ICRISAT`,category:`oilseed`,cropType:`groundnut`,pricePerKg:120,originalPrice:140,packSizes:[5,10,25],rating:4.5,reviewCount:195,season:[`Kharif`,`Summer`],germinationRate:87,maturityDays:110,yieldPerAcre:`10–12 quintals`,droughtTolerant:!0,certified:!0,popularIn:`Gujarat, AP, Karnataka`,features:[`High oil content (50%)`,`Large pods`,`Good shelling %`,`Aflatoxin tolerant`],aiSuggested:!1,bestBuy:!1,description:`ICRISAT's flagship groundnut variety — high oil content and consistent performance across dry regions.`},{id:`7`,name:`Green Moong Dal Seeds`,variety:`PDM-139`,brand:`IARI`,category:`pulse`,cropType:`moong`,pricePerKg:90,originalPrice:105,packSizes:[2,5,10,20],rating:4.6,reviewCount:247,season:[`Kharif`,`Spring`],germinationRate:91,maturityDays:60,yieldPerAcre:`5–7 quintals`,droughtTolerant:!0,certified:!0,popularIn:`UP, Rajasthan, Bihar`,features:[`Short duration (60 days)`,`Mung bean yellow mosaic resistant`,`Determinate growth`,`Fits intercropping`],aiSuggested:!1,bestBuy:!0,description:`Short-duration moong that fits into tight cropping windows. Excellent for intercropping with sugarcane or cotton.`},{id:`8`,name:`Chilli Seeds`,variety:`Pusa Sadabahar`,brand:`IARI`,category:`spice`,cropType:`chilli`,pricePerKg:3500,originalPrice:4200,packSizes:[.05,.1,.25,.5],rating:4.8,reviewCount:183,season:[`Kharif`,`Rabi`],germinationRate:86,maturityDays:135,yieldPerAcre:`8–10 tonnes (green)`,droughtTolerant:!1,certified:!0,popularIn:`AP, Telangana, Karnataka`,features:[`Perennial fruiting`,`High pungency (6500 SHU)`,`Thrips tolerant`,`Dual purpose`],aiSuggested:!1,bestBuy:!1,description:`IARI's perennial chilli for near-continuous harvest. High pungency and excellent market premiums in both green and dry form.`},{id:`9`,name:`Bt Cotton Seeds`,variety:`Bollgard-II`,brand:`Mahyco Monsanto`,category:`cash`,cropType:`cotton`,pricePerKg:850,originalPrice:950,packSizes:[.45,.9,1.8],rating:4.6,reviewCount:521,season:[`Kharif`],germinationRate:90,maturityDays:160,yieldPerAcre:`10–12 quintals`,droughtTolerant:!1,certified:!0,popularIn:`Gujarat, Maharashtra, Telangana`,features:[`Bollworm resistant`,`High lint quality`,`Long staple`,`Govt. approved Bt`],aiSuggested:!1,bestBuy:!1,description:`India's most popular Bt cotton hybrid — protects against American bollworm and produces long-staple premium quality lint.`},{id:`10`,name:`Paddy Seeds`,variety:`Pusa Basmati-1121`,brand:`IARI`,category:`cereal`,cropType:`rice`,pricePerKg:110,originalPrice:130,packSizes:[5,10,25,50],rating:4.9,reviewCount:703,season:[`Kharif`],germinationRate:92,maturityDays:145,yieldPerAcre:`12–14 quintals`,droughtTolerant:!1,certified:!0,popularIn:`Punjab, Haryana, UP`,features:[`Exceptionally long grain`,`Premium export price`,`Aromatic`,`Blast tolerant`],aiSuggested:!0,bestBuy:!1,stockLeft:12,description:`The world-renowned basmati. Commands the highest export price per tonne and is the gold standard for premium rice cultivation.`}];

export const machineryDataset = machineryCatalog;
export const seedsDataset = seedsCatalog;


