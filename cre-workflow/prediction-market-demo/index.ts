
import axios from "axios";

/**
 * Main CRE workflow for automated market resolution.
 * Listens for SettlementRequested, fetches BTC/USD price from Gemini,
 * and calls onReport on the PredictionMarket contract.
 */
export async function main(event: any, context: any) {
  // Extract marketId from the event
  const marketId = event.data.marketId;

  // Fetch BTC/USD price from Gemini public API
  let outcome = "";
  try {
    const response = await axios.get("https://api.gemini.com/v1/pubticker/btcusd");
    outcome = response.data.last;
  } catch (error) {
    console.error("Failed to fetch price from Gemini:", error);
    throw new Error("Market resolution failed: Gemini API error");
  }

  // Call onReport on the contract
  // (Assume context has contract instance and signer set up by CRE framework)
  try {
    const tx = await context.contract.onReport(marketId, outcome);
    await tx.wait();
    console.log(`Market ${marketId} resolved with outcome: ${outcome}`);
  } catch (error) {
    console.error("Failed to call onReport:", error);
    throw new Error("Market resolution failed: onReport error");
  }
}
