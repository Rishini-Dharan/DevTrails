export default class LatticeSimulationEngine {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.numNodes = 250;
    this.chaosMode = false;
    this.nodes = [];
    this.totalPayouts = 0;
    
    // Anomaly epicenter (fixed or mouse position in advanced versions)
    this.chaosEpicenter = { x: width / 2, y: height / 2, radius: 250 };

    this.initNodes();
  }

  setBounds(w, h) {
    this.width = w;
    this.height = h;
    this.chaosEpicenter = { x: w / 2, y: h / 2, radius: Math.min(w, h) * 0.35 };
  }

  setChaosMode(isChaos) {
    this.chaosMode = isChaos;
  }

  initNodes() {
    this.nodes = [];
    for (let i = 0; i < this.numNodes; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        baseSpeed: Math.random() * 1.5 + 0.5,
        anomalyScore: 0,
        inConsensus: false
      });
    }
  }

  // Calculate distance
  dist(a, b) {
    return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2);
  }

  tick() {
    let anomaliesCount = 0;
    
    // Physics and Anomaly calculation
    for (let i = 0; i < this.numNodes; i++) {
      let n = this.nodes[i];

      // Move node
      n.x += n.vx;
      n.y += n.vy;

      // Bounce off walls
      if (n.x < 0 || n.x > this.width) n.vx *= -1;
      if (n.y < 0 || n.y > this.height) n.vy *= -1;

      // Check if inside Chaos Epicenter when active
      if (this.chaosMode) {
        const d = this.dist(n, this.chaosEpicenter);
        if (d < this.chaosEpicenter.radius) {
          // Node detects chaos (Edge AI simulating friction)
          n.anomalyScore = Math.min(1.0, n.anomalyScore + 0.05);
          // Friction causes slowdown
          n.vx *= 0.95;
          n.vy *= 0.95;
        } else {
          n.anomalyScore = Math.max(0, n.anomalyScore - 0.02);
          // Regain speed
          const speed = Math.sqrt(n.vx*n.vx + n.vy*n.vy);
          if(speed < n.baseSpeed && speed > 0) {
            n.vx = (n.vx / speed) * n.baseSpeed;
            n.vy = (n.vy / speed) * n.baseSpeed;
          }
        }
      } else {
        // Cooldown
        n.anomalyScore = Math.max(0, n.anomalyScore - 0.05);
        const speed = Math.sqrt(n.vx*n.vx + n.vy*n.vy);
        if(speed < n.baseSpeed && speed > 0) {
          n.vx = (n.vx / speed) * n.baseSpeed;
          n.vy = (n.vy / speed) * n.baseSpeed;
        }
      }

      n.inConsensus = false;
    }

    // Consensus Resolution O(N^2) - Optimized for 250 nodes
    let consensusLinks = [];
    const consensusRadius = 120;
    
    for (let i = 0; i < this.numNodes; i++) {
      let nA = this.nodes[i];
      if (nA.anomalyScore > 0.6) anomaliesCount++;
      
      for (let j = i + 1; j < this.numNodes; j++) {
        let nB = this.nodes[j];
        
        // Drawing regular lines between nominal close nodes
        const d = this.dist(nA, nB);
        if (d < consensusRadius) {
          // Are they both anomalous? CONCENSUS!
          if (nA.anomalyScore > 0.7 && nB.anomalyScore > 0.7) {
            nA.inConsensus = true;
            nB.inConsensus = true;
            consensusLinks.push({ a: nA, b: nB, type: 'consensus', dist: d });
          } else if (d < consensusRadius * 0.5) {
            // Nominal proximity mesh
            consensusLinks.push({ a: nA, b: nB, type: 'nominal', dist: d });
          }
        }
      }
    }

    // Payout logic: Every pair in consensus generates micro-payout fluid stream
    let activePayoutsThisTick = 0;
    if (anomaliesCount >= 10) { // Swarm quorum met
      activePayoutsThisTick = anomaliesCount * 1.5; // Rs 1.5 per second
      this.totalPayouts += (activePayoutsThisTick / 60); // scaled for 60fps
    }

    return {
      nodes: this.numNodes,
      anomalies: anomaliesCount,
      payouts: Math.floor(this.totalPayouts),
      links: consensusLinks
    };
  }

  render(ctx) {
    // Draw Chaos Zone Warning
    if (this.chaosMode) {
      ctx.beginPath();
      ctx.arc(this.chaosEpicenter.x, this.chaosEpicenter.y, this.chaosEpicenter.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 0, 60, 0.05)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 0, 60, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 15]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = 'rgba(255, 0, 60, 0.8)';
      ctx.font = '14px monospace';
      ctx.fillText('ANOMALY ZONE DETECTED', this.chaosEpicenter.x - 80, this.chaosEpicenter.y - this.chaosEpicenter.radius - 10);
    }

    // Run tick to get links directly to save a loop cycle
    const { links } = this.tick(this.chaosMode);

    // Draw Links
    for (let link of links) {
      ctx.beginPath();
      ctx.moveTo(link.a.x, link.a.y);
      ctx.lineTo(link.b.x, link.b.y);
      if (link.type === 'consensus') {
        ctx.strokeStyle = `rgba(255, 0, 60, ${1 - Math.pow(link.dist/120, 2)})`; // Magenta glow
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 - (link.dist/60)*0.1})`; // Faint cyan link
        ctx.lineWidth = 0.5;
      }
      ctx.stroke();
    }

    // Draw Nodes
    for (let n of this.nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
      
      if (n.anomalyScore > 0.5) {
        ctx.fillStyle = '#ff003c';
        // Draw consensus pulse ring
        if (n.inConsensus) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 8 + Math.random() * 4, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 0, 60, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = '#00f0ff';
      }
      
      ctx.fill();
    }
  }
}
