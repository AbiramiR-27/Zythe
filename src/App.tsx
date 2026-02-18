import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VerificationProvider } from "@/lib/verification";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Index from "./pages/Index";
import PredictionsList from "./pages/PredictionsList";
import PredictionDetail from "./pages/PredictionDetail";
import Results from "./pages/Results";
import CreatePrediction from "./pages/CreatePrediction";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <VerificationProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/predictions" element={<PredictionsList />} />
                <Route path="/predictions/:id" element={<PredictionDetail />} />
                <Route path="/results" element={<Results />} />
                <Route path="/create" element={<CreatePrediction />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </VerificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
