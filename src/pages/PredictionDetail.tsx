import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockPredictions } from "@/lib/data";
import { CountdownTimer } from "@/components/CountdownTimer";
import { WorldIDButton } from "@/components/WorldIDButton";
import { useVerification } from "@/lib/verification";
import { useToast } from "@/hooks/use-toast";

const PredictionDetail = () => {
  const { id } = useParams();
  const prediction = mockPredictions.find((p) => p.id === id);
  const { isVerified, userVotes, castVote } = useVerification();
  const { toast } = useToast();

  if (!prediction) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Prediction not found.</p>
        <Link to="/predictions" className="mt-4 inline-block text-primary hover:underline">← Back</Link>
      </div>
    );
  }

  const total = prediction.yesVotes + prediction.noVotes;
  const yesPercent = total > 0 ? Math.round((prediction.yesVotes / total) * 100) : 50;
  const existingVote = userVotes[prediction.id];

  const handleVote = (vote: "YES" | "NO") => {
    if (!isVerified) {
      toast({ title: "Verification Required", description: "Please verify with World ID first.", variant: "destructive" });
      return;
    }
    castVote(prediction.id, vote);
    toast({ title: "Vote Recorded! ✅", description: `You predicted: ${vote}` });
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/predictions" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Predictions
        </Link>

        <div className="glass-card rounded-2xl p-6 md:p-8">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {prediction.category}
          </span>

          <h1 className="mb-6 text-2xl font-bold md:text-3xl">{prediction.question}</h1>

          {/* Countdown */}
          <div className="mb-6">
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {prediction.resolved ? "Final Result" : "Time Remaining"}
            </p>
            {prediction.resolved ? (
              <div className="text-2xl font-bold text-success">Outcome: {prediction.outcome}</div>
            ) : (
              <CountdownTimer deadline={prediction.deadline} />
            )}
          </div>

          {/* Vote bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm font-semibold mb-1">
              <span className="text-primary">YES — {prediction.yesVotes}</span>
              <span className="text-accent">NO — {prediction.noVotes}</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-accent/20">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${yesPercent}%` }} />
            </div>
          </div>
          <p className="mb-6 text-xs text-muted-foreground flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {total} human predictions
          </p>

          {/* Verification + Voting */}
          <div className="space-y-4">
            {!isVerified && (
              <div className="rounded-xl border-2 border-dashed border-border p-4 text-center">
                <p className="mb-3 text-sm text-muted-foreground">Verify with World ID to predict</p>
                <WorldIDButton />
              </div>
            )}

            {existingVote ? (
              <div className="rounded-xl bg-success/10 p-4 text-center">
                <p className="font-semibold text-success">You predicted: {existingVote}</p>
              </div>
            ) : (
              !prediction.resolved && (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    size="lg"
                    onClick={() => handleVote("YES")}
                    disabled={!isVerified}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Predict YES
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => handleVote("NO")}
                    disabled={!isVerified}
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    Predict NO
                  </Button>
                </div>
              )
            )}
          </div>

          {/* Participants */}
          <div className="mt-8 border-t border-border pt-6">
            <h3 className="mb-3 text-sm font-semibold">Recent Participants</h3>
            <div className="flex flex-wrap gap-2">
              {["Human#a3f2", "Human#8bc1", "Human#d4e9", "Human#71ab", "Human#c0f6"].map((p) => (
                <span key={p} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PredictionDetail;
