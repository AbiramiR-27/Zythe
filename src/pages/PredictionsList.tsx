import { useState } from "react";
import { motion } from "framer-motion";
import { PredictionCard } from "@/components/PredictionCard";
import { mockPredictions, categories } from "@/lib/data";

const PredictionsList = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"deadline" | "popular">("deadline");

  const filtered = mockPredictions
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === "deadline") return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      return b.yesVotes + b.noVotes - (a.yesVotes + a.noVotes);
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="mb-2 text-3xl font-bold">All Predictions</h1>
        <p className="mb-6 text-muted-foreground">Browse and vote on human-verified predictions</p>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
          <div className="ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "deadline" | "popular")}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
            >
              <option value="deadline">Soonest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No predictions in this category yet.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <PredictionCard key={p.id} prediction={p} index={i} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PredictionsList;
