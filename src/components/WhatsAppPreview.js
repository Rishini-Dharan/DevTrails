'use client';

export default function WhatsAppPreview({ workerName, amount, reason, time }) {
  return (
    <div style={{
      width: '320px',
      background: '#0b141a',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* WhatsApp header */}
      <div style={{
        background: '#1f2c34',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'var(--gradient-hero)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.875rem', fontWeight: 700,
        }}>⚡</div>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e9edef' }}>Lattice Protocol</div>
          <div style={{ fontSize: '0.6875rem', color: '#8696a0' }}>Verified Business</div>
        </div>
        <span style={{
          marginLeft: 'auto', fontSize: '0.625rem',
          color: '#25D366', fontWeight: 600, 
          background: 'rgba(37, 211, 102, 0.15)',
          padding: '2px 8px', borderRadius: '4px',
        }}>✓ VERIFIED</span>
      </div>

      {/* Chat background */}
      <div style={{
        background: '#0b141a',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        padding: '16px',
        minHeight: '200px',
      }}>
        {/* Incoming message */}
        <div style={{
          maxWidth: '85%',
          background: '#1f2c34',
          borderRadius: '0 8px 8px 8px',
          padding: '8px 12px',
          marginBottom: '8px',
        }}>
          <div style={{ fontSize: '0.8125rem', color: '#e9edef', lineHeight: 1.5 }}>
            <div style={{ fontWeight: 700, color: '#25D366', marginBottom: '4px' }}>
              💰 Payout Received!
            </div>
            <div style={{ marginBottom: '6px' }}>
              Hi {workerName || 'Ramesh'},
            </div>
            <div style={{
              fontSize: '1.5rem', fontWeight: 800,
              color: '#25D366', margin: '8px 0',
            }}>
              ₹{amount || 975} credited
            </div>
            <div style={{ marginBottom: '6px' }}>
              <strong>Reason:</strong> {reason || 'Heavy rainfall in your zone'}
            </div>
            <div style={{ color: '#8696a0', fontSize: '0.75rem' }}>
              Your income was protected automatically. Zero forms filed.
            </div>
          </div>
          <div style={{
            textAlign: 'right', fontSize: '0.6875rem',
            color: '#8696a0', marginTop: '4px',
          }}>
            {time || '7:45 PM'} ✓✓
          </div>
        </div>

        {/* Receipt card */}
        <div style={{
          maxWidth: '85%',
          background: '#1f2c34',
          borderRadius: '0 8px 8px 8px',
          overflow: 'hidden',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Payout Receipt
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', margin: '4px 0' }}>
              ₹{amount || 975}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
              Lattice Protocol · {new Date().toLocaleDateString('en-IN')}
            </div>
          </div>
          <div style={{ padding: '10px 14px', fontSize: '0.75rem', color: '#8696a0' }}>
            Share this receipt with your rider group 👆
          </div>
        </div>
      </div>
    </div>
  );
}
