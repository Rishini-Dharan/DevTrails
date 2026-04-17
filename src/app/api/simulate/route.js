import { NextResponse } from 'next/server';

// Simulates the full trigger evaluation → fraud detection → payout pipeline
export async function POST(request) {
  const body = await request.json();
  const { trigger, city, zone, severity } = body;

  // Step 1: Validate trigger
  const pipeline = [];
  const startTime = Date.now();

  pipeline.push({
    step: 1,
    name: 'Data Ingestion',
    status: 'completed',
    duration: 12,
    detail: `Received ${trigger} event for ${zone}, ${city}`,
  });

  // Step 2: Normalize
  pipeline.push({
    step: 2,
    name: 'Normalization',
    status: 'completed',
    duration: 8,
    detail: `Zone-level aggregation complete. Severity: ${severity || 'high'}`,
  });

  // Step 3: Threshold check
  const thresholdBreached = true;
  pipeline.push({
    step: 3,
    name: 'Threshold Engine',
    status: 'completed',
    duration: 3,
    detail: thresholdBreached ? `Threshold BREACHED — trigger ${trigger} confirmed` : 'Below threshold — no action',
    alert: thresholdBreached,
  });

  // Step 4: Geo-fence
  const affectedWorkers = Math.floor(Math.random() * 200 + 80);
  pipeline.push({
    step: 4,
    name: 'Geo-Fence Match',
    status: 'completed',
    duration: 15,
    detail: `${affectedWorkers} active policies found in ${zone}`,
  });

  // Step 5: Fraud detection per worker sample
  const fraudResults = {
    clean: Math.floor(affectedWorkers * 0.92),
    review: Math.floor(affectedWorkers * 0.05),
    rejected: Math.floor(affectedWorkers * 0.03),
  };
  pipeline.push({
    step: 5,
    name: 'Fraud Detection',
    status: 'completed',
    duration: 2800,
    detail: `Isolation Forest scored ${affectedWorkers} claims. Clean: ${fraudResults.clean}, Review: ${fraudResults.review}, Rejected: ${fraudResults.rejected}`,
  });

  // Step 6: Payout calculation
  const avgPayout = Math.floor(Math.random() * 400 + 400);
  const totalPayout = avgPayout * fraudResults.clean;
  pipeline.push({
    step: 6,
    name: 'Payout Calculation',
    status: 'completed',
    duration: 45,
    detail: `Avg payout: ₹${avgPayout} | Total: ₹${totalPayout.toLocaleString()} across ${fraudResults.clean} workers`,
  });

  // Step 7: Disburse
  pipeline.push({
    step: 7,
    name: 'UPI Disbursement',
    status: 'completed',
    duration: 1200,
    detail: `${fraudResults.clean} payouts queued via Razorpay UPI sandbox`,
  });

  const totalDuration = pipeline.reduce((s, p) => s + p.duration, 0);

  return NextResponse.json({
    eventId: `EVT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    trigger,
    city,
    zone,
    pipeline,
    summary: {
      totalDuration: `${(totalDuration / 1000).toFixed(1)}s`,
      affectedWorkers,
      approvedPayouts: fraudResults.clean,
      rejectedPayouts: fraudResults.rejected,
      manualReview: fraudResults.review,
      totalPayoutAmount: totalPayout,
      avgPayoutPerWorker: avgPayout,
    },
    timestamp: new Date().toISOString(),
  });
}
