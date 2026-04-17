export default function PhoneWidget({ isActive, anomalyScore, currentPayout }) {
  return (
    <div style={{
      width: '300px',
      height: '600px',
      backgroundColor: '#111',
      borderRadius: '32px',
      border: '8px solid #222',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      position: 'absolute',
      right: '30px',
      bottom: '30px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      zIndex: 20
    }}>
      {/* Top Bar */}
      <div style={{
        height: '40px',
        backgroundColor: '#000',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        fontSize: '12px',
        color: 'var(--text-muted)'
      }}>
        <span>11:42 AM</span>
        <div style={{ display: 'flex', gap: '5px' }}>
          <span>LTE</span>
          <div style={{ width: '16px', height: '8px', border: '1px solid #fff', borderRadius: '2px' }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>Lattice Shield</h2>
        
        <div style={{ 
          padding: '16px', 
          backgroundColor: isActive ? 'rgba(255, 0, 60, 0.1)' : 'rgba(0, 240, 255, 0.1)', 
          borderRadius: '12px',
          border: isActive ? '1px solid var(--neon-magenta)' : '1px solid rgba(0, 240, 255, 0.3)',
          transition: 'all 0.4s ease'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status</div>
          <div style={{ 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            color: isActive ? 'var(--neon-magenta)' : 'var(--neon-cyan)',
            marginTop: '4px'
          }}>
            {isActive ? 'DISRUPTION VERIFIED' : 'ACTIVE COVERAGE'}
          </div>
        </div>

        <div style={{ marginTop: '32px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Live Wallet Balance</div>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#fff',
            marginTop: '8px',
            fontFamily: 'monospace',
            textShadow: isActive ? '0 0 10px rgba(39, 255, 20, 0.5)' : 'none'
          }}>
            ₹{(1450 + currentPayout).toFixed(2)}
          </div>
          {isActive && (
            <div className="text-green" style={{ fontSize: '0.9rem', marginTop: '8px', animation: 'pulse 1.5s infinite' }}>
              + ₹1.50 / minute streaming
            </div>
          )}
        </div>

        <div style={{ marginTop: 'auto', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Local Edge Telemetry
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '8px 0', borderBottom: '1px solid #333' }}>
            <span>Network Consensus</span>
            <span style={{ color: isActive ? 'var(--neon-magenta)' : 'var(--neon-cyan)' }}>
              {isActive ? 'ACHIEVED' : 'STANDBY'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '8px 0', borderBottom: '1px solid #333' }}>
            <span>Anomaly Score</span>
            <span>{Math.floor(anomalyScore * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
