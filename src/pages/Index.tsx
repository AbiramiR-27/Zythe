import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Users, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PredictionCard } from "@/components/PredictionCard";
import { mockPredictions } from "@/lib/data";

const Index = () => {
  const featured = mockPredictions.filter((p) => !p.resolved).slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden py-28 md:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(221_83%_53%/0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(25_95%_53%/0.08),transparent_60%)]" />
        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary backdrop-blur-sm">
              <Zap className="h-4 w-4" /> Powered by World ID
            </div>
            <h1 className="mx-auto mb-6 max-w-4xl text-5xl font-black tracking-tight text-hero-foreground md:text-7xl lg:text-8xl">
              Predict the Future,{" "}
              <span className="text-gradient">Verified Human</span>
            </h1>
            <p className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-hero-foreground/50">
              No bots. No duplicates. One human, one prediction. Make your call on what comes next.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/predictions">
                <Button size="lg" className="gap-2 text-base glow-primary px-8 py-6 text-lg font-semibold">
                  Explore Predictions <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/create">
                <Button size="lg" variant="outline" className="gap-2 border-hero-foreground/20 text-hero-foreground/70 hover:bg-hero-foreground/10 px-8 py-6 text-lg">
                  Create One
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="container mx-auto mt-20 grid grid-cols-3 gap-6 px-4 md:max-w-xl"
        >
          {[
            { icon: Users, label: "Verified Humans", value: "1,247" },
            { icon: TrendingUp, label: "Predictions", value: "5" },
            { icon: ShieldCheck, label: "Sybil-Proof", value: "100%" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-hero-foreground">{stat.value}</div>
              <div className="text-xs text-hero-foreground/40">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">Featured Predictions</h2>
            <p className="mt-1 text-muted-foreground">The hottest questions right now</p>
          </div>
          <Link to="/predictions" className="text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <PredictionCard key={p.id} prediction={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
