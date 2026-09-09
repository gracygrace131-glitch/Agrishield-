import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Sprout,
  Droplets,
  ShieldAlert,
  TrendingUp,
  CreditCard,
  Tractor,
  Sliders,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { landingStats, landingFeatures } from "../data/mockData";

export function LandingPage() {
  const iconMap: Record<string, any> = {
    sprout: Sprout,
    droplets: Droplets,
    "shield-alert": ShieldAlert,
    "trending-up": TrendingUp,
    "credit-card": CreditCard,
    tractor: Tractor,
  };

  const steps = [
    {
      step: "01",
      icon: Sliders,
      title: "Enter Farm Details",
      desc: "Input your land size, soil type, location, and available water sources.",
    },
    {
      step: "02",
      icon: Cpu,
      title: "AI Analysis",
      desc: "Our engine combines soil data, weather forecasts, and market prices to generate insights.",
    },
    {
      step: "03",
      icon: CheckCircle2,
      title: "Act on Recommendations",
      desc: "Receive crop advice, irrigation schedules, risk alerts, and profit projections.",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden text-foreground">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="https://hercules-cdn.com/file_BWos5c3JQPUv9Sw0Mz2iI66V"
              alt="AgriShield logo"
              className="w-9 h-9 rounded-lg object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <span
              className="font-bold text-xl tracking-tight font-display"
            >
              AgriShield
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors cursor-pointer">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors cursor-pointer">
              How It Works
            </a>
            <a href="#stats" className="hover:text-foreground transition-colors cursor-pointer">
              Impact
            </a>
          </div>

          <Link to="/dashboard">
            <Button size="sm" className="cursor-pointer gap-1.5 shadow-sm">
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1511802269876-bf873cc7b2c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/95 via-background/90 to-background" />
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl -z-10" />
        <div className="absolute top-32 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto text-center pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              AI-Powered Smart Farming
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-balance leading-tight mb-6 font-display"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Farm Smarter. <span className="text-primary">Earn More.</span> Risk Less.
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            AgriShield is the AI farming companion that helps small farmers reduce water usage,
            predict climate risks, maximize profits, and access affordable credit — all in one
            platform.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3.5 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/dashboard">
              <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 cursor-pointer shadow-lg shadow-primary/20 font-semibold gap-2">
                Start for Free <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base px-8 py-6 cursor-pointer font-medium">
                See All Features
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-14 px-4 sm:px-6 border-y border-border/60 bg-primary/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {landingStats.map((item, idx) => (
            <motion.div
              key={item.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-primary mb-1 font-display">
                {item.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-display">
              Everything a farmer needs
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              Six powerful AI modules working together as one unified decision engine for your farm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {landingFeatures.map((feat, idx) => {
              const IconComp = iconMap[feat.icon] || Sprout;
              return (
                <motion.div
                  key={feat.title}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-default"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center mb-4`}>
                    <IconComp className={`w-6 h-6 ${feat.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 font-display">{feat.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feat.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 bg-primary/5 border-y border-border/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-display">
              How AgriShield works
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              From field data to smart decisions in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, idx) => {
              const StepIcon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  className="text-center bg-card md:bg-transparent p-6 md:p-0 rounded-2xl border md:border-none border-border"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-md shadow-primary/20">
                    <StepIcon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="text-xs font-bold text-primary mb-2 tracking-widest uppercase">
                    Step {s.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 font-display">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            className="bg-primary rounded-3xl p-10 sm:p-12 text-primary-foreground shadow-xl shadow-primary/15"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-display">
              Ready to transform your farm?
            </h2>
            <p className="opacity-90 mb-8 text-base sm:text-lg max-w-md mx-auto">
              Join thousands of farmers already growing smarter, saving water, and cutting costs with AgriShield.
            </p>
            <Link to="/dashboard">
              <Button
                size="lg"
                variant="secondary"
                className="text-base px-8 py-6 cursor-pointer font-semibold gap-2 shadow-md"
              >
                Open Dashboard <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img
              src="https://hercules-cdn.com/file_BWos5c3JQPUv9Sw0Mz2iI66V"
              alt="AgriShield logo"
              className="w-7 h-7 rounded-lg object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <span className="font-semibold text-foreground font-display">AgriShield</span>
          </div>
          <p>© {new Date().getFullYear()} AgriShield. AI-Powered Smart Farming.</p>
        </div>
      </footer>
    </div>
  );
}
