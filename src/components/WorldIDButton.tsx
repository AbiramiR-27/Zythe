import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Fingerprint, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerification } from "@/lib/verification";

export const WorldIDButton = ({ compact = false }: { compact?: boolean }) => {
  const { isVerified, verify } = useVerification();
  const [showModal, setShowModal] = useState(false);

  if (isVerified) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-sm font-semibold text-success">
        <ShieldCheck className="h-4 w-4" />
        {!compact && "Verified Human"}
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="gap-2 bg-foreground text-background hover:bg-foreground/90"
      >
        <Fingerprint className="h-4 w-4" />
        {compact ? "Verify" : "Verify with World ID"}
      </Button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-foreground">
                  <Fingerprint className="h-8 w-8 text-background" />
                </div>
                <h3 className="mb-2 text-lg font-bold">Prove You're Human</h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  Scan with World App to verify your unique humanity. One person, one prediction.
                </p>

                <Button
                  className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => {
                    verify();
                    setShowModal(false);
                  }}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Simulate Verification (Demo)
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  In production, this connects to World ID's proof-of-personhood protocol.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
