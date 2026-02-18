import React, { createContext, useContext, useState, ReactNode } from "react";

type VerificationContextType = {
  isVerified: boolean;
  verify: () => void;
  userVotes: Record<string, "YES" | "NO">;
  castVote: (predictionId: string, vote: "YES" | "NO") => void;
};

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const VerificationProvider = ({ children }: { children: ReactNode }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, "YES" | "NO">>({});

  const verify = () => setIsVerified(true);
  const castVote = (predictionId: string, vote: "YES" | "NO") => {
    setUserVotes((prev) => ({ ...prev, [predictionId]: vote }));
  };

  return (
    <VerificationContext.Provider value={{ isVerified, verify, userVotes, castVote }}>
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => {
  const ctx = useContext(VerificationContext);
  if (!ctx) throw new Error("useVerification must be within VerificationProvider");
  return ctx;
};
