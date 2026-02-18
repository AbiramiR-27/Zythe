import { motion } from "framer-motion";
import { mockPredictions, mockLeaderboard } from "@/lib/data";
import { Trophy, CheckCircle, XCircle } from "lucide-react";

const Results = () => {
  const resolved = mockPredictions.filter((p) => p.resolved);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="mb-2 text-3xl font-bold">Results & Leaderboard</h1>
        <p className="mb-8 text-muted-foreground">Past predictions and top human predictors</p>

        {/* Resolved predictions */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">Resolved Predictions</h2>
          {resolved.length === 0 ? (
            <p className="text-muted-foreground">No predictions resolved yet.</p>
          ) : (
            <div className="space-y-3">
              {resolved.map((p) => (
                <div key={p.id} className="glass-card flex items-center justify-between rounded-xl p-4">
                  <div>
                    <p className="font-medium">{p.question}</p>
                    <p className="text-sm text-muted-foreground">{p.category}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5">
                    {p.outcome === "YES" ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span className="text-sm font-bold text-success">{p.outcome}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Leaderboard */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Trophy className="h-5 w-5 text-accent" /> Leaderboard
          </h2>
          <div className="space-y-3">
            {mockLeaderboard.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card flex items-center gap-4 rounded-xl p-4"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${
                  i === 0 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.correct}/{user.total} correct
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">{user.accuracy}%</p>
                  <p className="text-xs text-muted-foreground">accuracy</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Results;
