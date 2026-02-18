import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Prediction } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

const categoryColors: Record<string, string> = {
  Crypto: "bg-primary/10 text-primary",
  Politics: "bg-destructive/10 text-destructive",
  Sports: "bg-success/10 text-success",
  Entertainment: "bg-accent/10 text-accent",
};

export const PredictionCard = ({ prediction, index = 0 }: { prediction: Prediction; index?: number }) => {
  const total = prediction.yesVotes + prediction.noVotes;
  const yesPercent = total > 0 ? Math.round((prediction.yesVotes / total) * 100) : 50;
  const deadline = new Date(prediction.deadline);
  const isExpired = deadline < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link to={`/predictions/${prediction.id}`} className="block">
        <div className="group glass-card rounded-xl p-5 transition-all hover:shadow-xl hover:-translate-y-1">
          <div className="mb-3 flex items-center justify-between">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryColors[prediction.category]}`}>
              {prediction.category}
            </span>
            {prediction.resolved && (
              <Badge variant="secondary" className="text-xs">
                Resolved: {prediction.outcome}
              </Badge>
            )}
          </div>

          <h3 className="mb-3 text-base font-semibold leading-snug group-hover:text-primary transition-colors">
            {prediction.question}
          </h3>

          {/* Vote bar */}
          <div className="mb-3 overflow-hidden rounded-full bg-muted h-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all"
              style={{ width: `${yesPercent}%` }}
            />
          </div>
          <div className="mb-3 flex justify-between text-xs text-muted-foreground">
            <span>YES {yesPercent}%</span>
            <span>NO {100 - yesPercent}%</span>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {total} predictions
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {isExpired ? "Ended" : deadline.toLocaleDateString()}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
