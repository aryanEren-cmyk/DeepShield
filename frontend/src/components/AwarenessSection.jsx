import React from 'react';

const scams = [
  {
    icon: '💼',
    title: 'Fake Job Offers',
    how: 'Scammers promise high-paying WFH jobs requiring a small registration fee',
    flags: [
      'Asks for registration or training fee',
      'Promises unrealistic salary (₹50,000+/month WFH)',
      'No proper interview process'
    ],
    stat: '2.3L Indians lost ₹1,200 Cr to job scams in 2024'
  },
  {
    icon: '🏦',
    title: 'KYC/Bank Phishing',
    how: 'Fake bank SMS asking to update KYC or your account will be blocked',
    flags: [
      'Urgent account suspension threat',
      'Link doesn\'t match official bank domain',
      'Asks for OTP or password'
    ],
    stat: 'Most common scam — affects 45% of victims'
  },
  {
    icon: '💰',
    title: 'UPI Payment Scams',
    how: 'Scammer sends a collect request claiming you won a prize or need to verify account',
    flags: [
      'You receive money requests, not send',
      'Entering PIN to receive money is a scam',
      'Lottery prizes require upfront payment'
    ],
    stat: '₹485 Cr lost to UPI fraud in 2023-24'
  },
  {
    icon: '👤',
    title: 'Impersonation Scams',
    how: 'Someone pretends to be your friend or relative in trouble needing urgent money',
    flags: [
      'Urgency and secrecy requests',
      'New number or different account',
      'Story doesn\'t add up on verification'
    ],
    stat: '30% of WhatsApp scams are impersonation'
  },
  {
    icon: '📱',
    title: 'OTP Fraud',
    how: 'Scammer calls pretending to be bank or TRAI and tricks you into sharing OTP',
    flags: [
      'No legitimate company asks for OTP',
      'Caller claims your number will be disconnected',
      'Requests remote access to your phone'
    ],
    stat: 'OTP fraud up 400% since 2022'
  },
  {
    icon: '🎁',
    title: 'Prize/Lottery Scams',
    how: 'You\'ve won KBC or lottery but need to pay tax or processing fee to claim prize',
    flags: [
      'You never entered any contest',
      'Requires advance payment to claim prize',
      'Asks for personal documents or Aadhaar'
    ],
    stat: 'Average victim loses ₹45,000'
  }
];

const AwarenessSection = ({ onScanNow }) => {
  return (
    <section className="awareness-section fade-in">
      <h3>🇮🇳 Common Scams in India</h3>
      <p className="awareness-subtitle">Know what to look for before you fall victim</p>
      
      <div className="scam-cards-grid">
        {scams.map((scam, index) => (
          <div key={index} className="scam-card">
            <div className="scam-card-icon">{scam.icon}</div>
            <h4 className="scam-card-title">{scam.title}</h4>
            <p className="scam-how">{scam.how}</p>
            <ul className="red-flags">
              {scam.flags.map((flag, idx) => (
                <li key={idx}>⚠️ {flag}</li>
              ))}
            </ul>
            <div className="scam-stats">{scam.stat}</div>
          </div>
        ))}
      </div>

      <div className="awareness-cta">
        <p><strong>Received a suspicious message?</strong></p>
        <p className="awareness-cta-sub">Paste it in DeepShield and know instantly if it's a scam</p>
        <button className="awareness-cta-btn" onClick={onScanNow}>
          Scan it Now →
        </button>
      </div>
    </section>
  );
};

export default AwarenessSection;
