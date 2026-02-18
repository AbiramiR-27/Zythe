import { motion } from "framer-motion";
import { ShieldCheck, Target, TrendingUp, Activity } from "lucide-react";
import { mockUser, mockPredictions } from "@/lib/data";
import { WorldIDButton } from "@/components/WorldIDButton";
import { useVerification } from "@/lib/verification";

const Profile = () => {
  const { isVerified } = useVerification();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="glass-card rounded-2xl p-6 md:p-8">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{mockUser.name}</h1>
              <p className="text-sm text-muted-foreground">Human Predictor</p>
            </div>
            <WorldIDButton compact />
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-3 gap-4">
            {[
              { icon: Target, label: "Predictions", value: mockUser.totalPredictions },
              { icon: TrendingUp, label: "Correct", value: mockUser.correctPredictions },
              { icon: Activity, label: "Accuracy", value: `${mockUser.accuracy}%` },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-muted p-4 text-center">
                <stat.icon className="mx-auto mb-1 h-5 w-5 text-primary" />
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Verification status */}
          <div className="mb-8 rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className={`h-6 w-6 ${isVerified ? "text-success" : "text-muted-foreground"}`} />
              <div>
                <p className="font-semibold">{isVerified ? "World ID Verified" : "Not Verified"}</p>
                <p className="text-sm text-muted-foreground">
                  {isVerified ? "Your humanity is verified" : "Verify to start predicting"}
                </p>
              </div>
            </div>
          </div>

          {/* Prediction history */}
          <h2 className="mb-4 text-lg font-semibold">Prediction History</h2>
          <div className="space-y-3">
            {mockUser.predictions.map((p) => {
              const pred = mockPredictions.find((mp) => mp.id === p.predictionId);
              if (!pred) return null;
              return (
                <div key={p.predictionId} className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <div className="flex-1 pr-4">
                    <p className="text-sm font-medium">{pred.question}</p>
                    <p className="text-xs text-muted-foreground">{pred.category}</p>
                  </div>
                  <div className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    p.vote === "YES" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                  }`}>
                    {p.vote}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
