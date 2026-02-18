import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PredictionCard } from "@/components/PredictionCard";
import { mockPredictions } from "@/lib/data";

const Index = () => {
  const featured = mockPredictions.filter((p) => !p.resolved).slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(221_83%_53%/0.15),transparent_70%)]" />
        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <ShieldCheck className="h-4 w-4" /> Powered by World ID
            </div>
            <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-black tracking-tight text-hero-foreground md:text-6xl">
              Predictions by Humans,{" "}
              <span className="text-gradient">Verified by World ID</span>
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-lg text-hero-foreground/60">
              No bots. One human, one prediction. Make your call on the future — only real people allowed.
            </p>
            <Link to="/predictions">
              <Button size="lg" className="gap-2 text-base glow-primary animate-pulse-glow">
                Explore Predictions <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="container mx-auto mt-16 grid grid-cols-3 gap-4 px-4 md:max-w-lg"
        >
          {[
            { icon: Users, label: "Verified Humans", value: "1,247" },
            { icon: TrendingUp, label: "Predictions", value: "5" },
            { icon: ShieldCheck, label: "Sybil-Proof", value: "100%" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto mb-1 h-5 w-5 text-primary" />
              <div className="text-xl font-bold text-hero-foreground">{stat.value}</div>
              <div className="text-[11px] text-hero-foreground/50">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Predictions</h2>
          <Link to="/predictions" className="text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <PredictionCard key={p.id} prediction={p} index={i} />
          ))}
        </div>
      </section>

      {/* Hackathon badge */}
      <div className="fixed bottom-4 right-4 z-40 rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground shadow-lg">
        🏗️ Hackathon Demo
      </div>
    </div>
  );
};

export default Index;
