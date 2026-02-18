export type Prediction = {
  id: string;
  question: string;
  category: "Crypto" | "Politics" | "Sports" | "Entertainment";
  deadline: string;
  resolved: boolean;
  outcome?: "YES" | "NO";
  yesVotes: number;
  noVotes: number;
  createdAt: string;
};

export type LeaderboardEntry = {
  id: string;
  name: string;
  accuracy: number;
  correct: number;
  total: number;
};

export type UserProfile = {
  id: string;
  name: string;
  verified: boolean;
  verifiedAt?: string;
  totalPredictions: number;
  correctPredictions: number;
  accuracy: number;
  predictions: { predictionId: string; vote: "YES" | "NO"; correct?: boolean }[];
};

export const mockPredictions: Prediction[] = [
  {
    id: "1",
    question: "Will Bitcoin reach $100,000 by end of 2026?",
    category: "Crypto",
    deadline: "2026-12-31T23:59:59Z",
    resolved: false,
    yesVotes: 234,
    noVotes: 156,
    createdAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "2",
    question: "Will Arsenal win the Premier League?",
    category: "Sports",
    deadline: "2026-05-25T23:59:59Z",
    resolved: false,
    yesVotes: 89,
    noVotes: 67,
    createdAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "3",
    question: "Will a Democrat win the 2028 US Presidential Election?",
    category: "Politics",
    deadline: "2028-11-05T23:59:59Z",
    resolved: false,
    yesVotes: 412,
    noVotes: 387,
    createdAt: "2025-01-20T00:00:00Z",
  },
  {
    id: "4",
    question: "Will Oppenheimer win Best Picture Oscar?",
    category: "Entertainment",
    deadline: "2026-03-10T23:59:59Z",
    resolved: true,
    outcome: "YES",
    yesVotes: 523,
    noVotes: 198,
    createdAt: "2024-12-01T00:00:00Z",
  },
  {
    id: "5",
    question: "Will ETH reach $4000 by March 30?",
    category: "Crypto",
    deadline: "2026-03-30T23:59:59Z",
    resolved: false,
    yesVotes: 567,
    noVotes: 423,
    createdAt: "2025-02-10T00:00:00Z",
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { id: "u1", name: "TruthSeeker#9012", accuracy: 92, correct: 22, total: 24 },
  { id: "u2", name: "HumanPredictor#1234", accuracy: 89, correct: 42, total: 47 },
  { id: "u3", name: "CryptoWhale#5678", accuracy: 76, correct: 38, total: 50 },
];

export const mockUser: UserProfile = {
  id: "demo-user",
  name: "DemoHuman#4242",
  verified: false,
  totalPredictions: 5,
  correctPredictions: 3,
  accuracy: 60,
  predictions: [
    { predictionId: "1", vote: "YES" },
    { predictionId: "2", vote: "NO" },
    { predictionId: "4", vote: "YES", correct: true },
  ],
};

export const categories = ["All", "Crypto", "Politics", "Sports", "Entertainment"] as const;
