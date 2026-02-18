import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";

const CreatePrediction = () => {
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("Crypto");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !deadline) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    toast({ title: "Prediction Created! 🎉", description: "Your prediction is now live (demo mode)." });
    setQuestion("");
    setDeadline("");
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 text-3xl font-bold">Create Prediction</h1>
        <p className="mb-8 text-muted-foreground">Add a new prediction for humans to vote on</p>

        <form onSubmit={handleSubmit} className="glass-card space-y-5 rounded-2xl p-6">
          <div>
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              placeholder="Will Bitcoin reach $100,000 by end of 2026?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-1.5 resize-none"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option>Crypto</option>
              <option>Politics</option>
              <option>Sports</option>
              <option>Entertainment</option>
            </select>
          </div>

          <div>
            <Label htmlFor="deadline">Deadline</Label>
            <div className="relative mt-1.5">
              <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">Create Prediction</Button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePrediction;
