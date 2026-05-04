import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AnimatedCounter = ({ value, colorClass }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const valueRef = useRef(0);

  useEffect(() => {
    let startTime = null;
    const duration = 2000;
    const startValue = valueRef.current;
    const endValue = value;

    if (startValue === endValue) return;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentVal = Math.floor(startValue + (endValue - startValue) * easeProgress);
      setDisplayValue(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        valueRef.current = endValue;
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <div className={`counter-number ${colorClass}`}>{displayValue.toLocaleString()}</div>;
};

const LiveCounter = () => {
  const [stats, setStats] = useState({
    totalScans: 0,
    scamsDetected: 0,
    linksScanned: 0,
    messagesAnalyzed: 0
  });
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [secondsAgo, setSecondsAgo] = useState(0);

  const fetchStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/stats`);
      setStats(response.data);
      setLastUpdated(Date.now());
      setSecondsAgo(0);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdated) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  return (
    <div className="live-counter-section fade-in">
      <div className="live-indicator">
        <div className="live-dot"></div>
        <strong>LIVE</strong> Global Threat Intelligence
      </div>
      
      <div className="counter-grid">
        <div className="counter-card">
          <div className="counter-icon">🔍</div>
          <AnimatedCounter value={stats.totalScans} colorClass="white" />
          <div className="counter-label">Total Scans</div>
        </div>
        <div className="counter-card">
          <div className="counter-icon">🚨</div>
          <AnimatedCounter value={stats.scamsDetected} colorClass="red" />
          <div className="counter-label">Scams Caught</div>
        </div>
        <div className="counter-card">
          <div className="counter-icon">🔗</div>
          <AnimatedCounter value={stats.linksScanned} colorClass="blue" />
          <div className="counter-label">Links Verified</div>
        </div>
        <div className="counter-card">
          <div className="counter-icon">💬</div>
          <AnimatedCounter value={stats.messagesAnalyzed} colorClass="green" />
          <div className="counter-label">Messages Analyzed</div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>
        Last updated {secondsAgo} seconds ago
      </div>
    </div>
  );
};

export default LiveCounter;
