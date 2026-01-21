import React from 'react'
import '../Dashboard/Dashboard.css'

const PlanPage = () => {
    return (
        <div className="dashboard-content">
            <div className="breadcrumbs">
                WEBSITES / PLAN
            </div>

            <div className="settings-container">
                <div className="limit-banner">
                    <div className="banner-icon">i</div>
                    <span>Limit reached (3). Upgrade to create more!</span>
                </div>

                <div className="upgrade-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="upgrade-title">Upgrade Your Widget Capacity</h2>
                    <p className="upgrade-subtitle">Scale your engagement with more active toasts.</p>
                    <div className="current-limit-badge">Current Limit: 3 Toasts</div>
                </div>

                <div className="pricing-grid">
                    {/* Starter Boost */}
                    <div className="pricing-card" style={{ borderTop: '4px solid #3b82f6' }}>
                        <h3 className="plan-name">Starter Boost</h3>
                        <p className="plan-desc">Great for small campaigns.</p>
                        <div className="plan-price">₹399<span className="period">/one-time</span></div>

                        <ul className="plan-features">
                            <li><span className="check">✓</span> Add <strong>1</strong> Active Toast</li>
                            <li><span className="check">✓</span> Lifetime Access</li>
                        </ul>

                        <button className="plan-btn" style={{ marginTop: 'auto', color: '#3b82f6', borderColor: '#3b82f6' }}>Buy +1 Toast</button>
                    </div>

                    {/* Growth Pack */}
                    <div className="pricing-card popular" style={{ borderTop: '4px solid #2563eb', transform: 'scale(1.05)', zIndex: 1 }}>
                        <span className="popular-tag">POPULAR</span>
                        <h3 className="plan-name">Growth Pack</h3>
                        <p className="plan-desc">Perfect for engaged sites.</p>
                        <div className="plan-price">₹699<span className="period">/one-time</span></div>

                        <ul className="plan-features">
                            <li><span className="check">✓</span> Add <strong>2</strong> Active Toasts</li>
                            <li><span className="check">✓</span> Prioritized Support</li>
                        </ul>

                        <button className="plan-btn primary" style={{ marginTop: 'auto' }}>Buy +2 Toasts</button>
                    </div>

                    {/* Power Scale */}
                    <div className="pricing-card" style={{ borderTop: '4px solid #a855f7' }}>
                        <h3 className="plan-name">Power Scale</h3>
                        <p className="plan-desc">Maximum engagement.</p>
                        <div className="plan-price">₹999<span className="period">/one-time</span></div>

                        <ul className="plan-features">
                            <li><span className="check">✓</span> Add <strong>3</strong> Active Toasts</li>
                            <li><span className="check">✓</span> Premium Styling</li>
                        </ul>

                        <button className="plan-btn" style={{ marginTop: 'auto', color: '#a855f7', borderColor: '#a855f7' }}>Buy +3 Toasts</button>
                    </div>
                </div>

                <div className="text-center" style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', marginTop: '1rem' }}>
                    Need a custom plan? <a href="#" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Contact Support</a>
                </div>
            </div>
        </div>
    )
}

export default PlanPage
