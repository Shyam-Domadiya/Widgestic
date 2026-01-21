import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AnalyticsChart from '../../components/AnalyticsChart'
import './Dashboard.css'

const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
)

// Helper for API calls
const apiCall = async (endpoint, method = 'GET', body = null) => {
    const userId = localStorage.getItem('widgetic_user_id');
    if (!userId) {
        window.location.href = '/'; // Redirect to login
        throw new Error('User not authenticated');
    }

    const headers = {
        'Content-Type': 'application/json',
        'x-user-id': userId
    };
    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    const res = await fetch(`http://localhost:5000/api/${endpoint}`, config);
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'API Error');
    }
    return res.json();
};

const Dashboard = () => {
    // ... state ...
    const [activeTab, setActiveTab] = useState('Installation')
    const [manageTab, setManageTab] = useState('Content & Appearance')
    const [selectedToast, setSelectedToast] = useState(null)
    const [showCreateToast, setShowCreateToast] = useState(false)
    const [toasts, setToasts] = useState([])
    const [chartData, setChartData] = useState([])
    const [settings, setSettings] = useState({
        timeBetweenToasts: 3,
        toastDisplayTime: 5,
        position: 'bottom-right',
        backgroundColor: '#ffffff',
        typography: 'Inter, sans-serif',
        interactiveDismissal: true,
        brandedSignature: true
    })

    const [toastForm, setToastForm] = useState({
        designation: '',
        headline: '',
        narrative: '',
        cta: '',
        url: '',
        type: 'Notification',
        recurrence: '0',
        startDelay: 0,
        autoDismissTime: 0
    })

    const [showDailyLogs, setShowDailyLogs] = useState(false)
    const navigate = useNavigate()

    const location = window.location;
    const isAnalyticsPage = location.pathname === '/analytics';

    // Fetch Initial Data & Stats
    useEffect(() => {
        const fetchData = async () => {
            try {
                const toastData = await apiCall('toasts');
                setToasts(toastData);

                const settingsData = await apiCall('settings');
                if (settingsData) setSettings(settingsData);
            } catch (err) {
                console.error('Fetch error:', err);
            }
        };
        fetchData();
    }, []);

    // Fetch Stats when on Analytics Page
    useEffect(() => {
        if (isAnalyticsPage) {
            fetchStats();
        }
    }, [isAnalyticsPage]);

    const fetchStats = async () => {
        try {
            const data = await apiCall('analytics/dashboard?days=7', 'GET');
            setChartData(data);
        } catch (err) {
            console.error("Failed to fetch analytics stats:", err);
        }
    };

    const handleCreateClick = () => {
        if (toasts.length >= 3) {
            navigate('/plan')
        } else {
            handleAbort() // Reset form state
            setShowCreateToast(true)
        }
    }



    const handleManageClick = (toast) => {
        setSelectedToast(toast)
        // Ensure all fields have at least default values if missing in the toast object
        setToastForm({
            designation: '',
            headline: '',
            narrative: '',
            cta: '',
            url: '',
            type: 'Notification',
            recurrence: 0,
            startDelay: 0,
            autoDismissTime: 0,
            accentColor: '#3b82f6',
            backgroundColor: '#ffffff',
            position: 'bottom-right',
            ...toast
        })
        setManageTab('Content & Appearance')
    }

    const handleSyncChanges = async () => {
        try {
            const toastPromise = apiCall(`toasts/${selectedToast._id}`, 'PUT', toastForm);
            const settingsPromise = apiCall('settings', 'PUT', settings);

            const [updatedToast] = await Promise.all([toastPromise, settingsPromise]);

            setToasts(toasts.map(t => t._id === selectedToast._id ? updatedToast : t));
            alert('Changes & Global Settings Synchronized!');
        } catch (err) {
            alert('Failed to sync changes: ' + err.message);
        }
    }

    const copySnippet = () => {
        const snippet = document.getElementById('code-snippet').innerText
        navigator.clipboard.writeText(snippet)
        alert('Snippet copied!')
    }

    const handleInputChange = (e) => {
        const { name, value, type } = e.target
        let finalValue = value

        if (type === 'number') {
            finalValue = value === '' ? 0 : parseInt(value, 10)
        }

        setToastForm(prev => ({ ...prev, [name]: finalValue }))
    }

    const handleSettingsChange = (e) => {
        const { name, value, type, checked } = e.target
        let finalValue = type === 'checkbox' ? checked : value

        if (type === 'number') {
            finalValue = value === '' ? 0 : parseInt(value, 10)
        }

        setSettings(prev => ({ ...prev, [name]: finalValue }))
    }

    const handleUpdateGlobal = async () => {
        try {
            await apiCall('settings', 'PUT', settings);
            alert("Global Ecosystem Updated Successfully!");
        } catch (err) {
            alert('Failed to update settings: ' + err.message);
        }
    }

    const handleAbort = () => {
        setShowCreateToast(false)
        setToastForm({
            designation: '',
            headline: '',
            narrative: '',
            cta: '',
            url: '',
            type: 'Notification',
            recurrence: '0',
            startDelay: 0,
            autoDismissTime: 0
        })
    }

    const handleActivate = async () => {
        try {
            const newToastData = {
                ...toastForm,
                status: 'ACTIVE',
                views: 0
            };
            const createdToast = await apiCall('toasts', 'POST', newToastData);
            setToasts([...toasts, createdToast]);
            handleAbort();
        } catch (err) {
            if (err.message === 'Limit reached') {
                navigate('/plan');
            } else {
                alert('Failed to activate toast: ' + err.message);
            }
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this toast?')) return;
        try {
            await apiCall(`toasts/${id}`, 'DELETE');
            setToasts(toasts.filter(t => t._id !== id));
        } catch (err) {
            alert('Failed to delete: ' + err.message);
        }
    }

    const handleToggleStatus = async (toast) => {
        const newStatus = toast.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        try {
            const updatedToast = await apiCall(`toasts/${toast._id}`, 'PUT', { status: newStatus });
            setToasts(toasts.map(t => t._id === toast._id ? updatedToast : t));
        } catch (err) {
            alert('Failed to toggle status: ' + err.message);
        }
    }

    // ... existing code ...
    // ... existing code ...


    return (
        <div className="dashboard-content">
            <div className="breadcrumbs">
                WEBSITES / {isAnalyticsPage ? 'ANALYTICS' : 'DASHBOARD'}{showDailyLogs ? ' / DAILY BREAKDOWN' : ''} {selectedToast && `/ ${selectedToast.designation || selectedToast._id}`}
            </div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="page-title" style={{ marginBottom: 0 }}>
                    {selectedToast ? 'Manage Widget' : (isAnalyticsPage ? (showDailyLogs ? 'Daily Records' : 'Performance Insights') : "test's Website")}
                </h1>
                {isAnalyticsPage && !showDailyLogs && (
                    <button className="daily-logs-btn" onClick={() => setShowDailyLogs(true)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                            <line x1="9" y1="21" x2="9" y2="9"></line>
                        </svg>
                        Daily Logs
                    </button>
                )}
                {isAnalyticsPage && showDailyLogs && (
                    <button className="back-overview-btn" onClick={() => setShowDailyLogs(false)}>
                        &larr; BACK TO OVERVIEW
                    </button>
                )}
            </div>

            {isAnalyticsPage ? (
                showDailyLogs ? (
                    // DAILY LOGS VIEW
                    <div className="daily-logs-card fade-in">
                        <div className="date-pill">
                            {(new Date()).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                        </div>

                        <div className="logs-table">
                            <div className="logs-header">
                                <span className="col-identity">TOAST IDENTITY</span>
                                <span className="col-metric">IMPRESSIONS</span>
                                <span className="col-metric">INTERACTIONS</span>
                                <span className="col-metric">DISMISSALS</span>
                                <span className="col-metric">CTR</span>
                            </div>
                            {toasts.map((toast, index) => {
                                const views = toast.views || 0;
                                const clicks = toast.clicks || 0;
                                const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) + '%' : '0.0%';

                                return (
                                    <div key={toast._id} className="log-row">
                                        {index === 0 && <div className="log-indicator"></div>}
                                        <div className="col-identity">
                                            <div className="log-index">{index + 1}</div>
                                            <div className="log-type">{toast.type}</div>
                                        </div>
                                        <div className="col-metric"><strong>{views}</strong></div>
                                        <div className="col-metric"><strong>{clicks}</strong></div>
                                        <div className="col-metric"><strong>{toast.dismissals || 0}</strong></div>
                                        <div className="col-metric ctr-badge">{ctr}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    // ANALYTICS OVERVIEW
                    <div className="analytics-container fade-in">
                        <div className="metrics-grid">
                            <div className="metric-card">
                                <div className="metric-label">TOTAL IMPRESSIONS</div>
                                <div className="metric-value">{toasts.reduce((acc, t) => acc + (t.views || 0), 0)}</div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-label">TOTAL CLICKS</div>
                                <div className="metric-value">{toasts.reduce((acc, t) => acc + (t.clicks || 0), 0)}</div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-label">TOTAL DISMISSALS</div>
                                <div className="metric-value">{toasts.reduce((acc, t) => acc + (t.dismissals || 0), 0)}</div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-label">CONVERSION RATE</div>
                                <div className="metric-value">
                                    {(() => {
                                        const totalViews = toasts.reduce((acc, t) => acc + (t.views || 0), 0);
                                        const totalClicks = toasts.reduce((acc, t) => acc + (t.clicks || 0), 0);
                                        return totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) + '%' : '0.00%';
                                    })()}
                                </div>
                            </div>
                        </div>

                        <div className="chart-section">
                            <AnalyticsChart data={chartData} />
                        </div>
                    </div>
                )
            ) : (
                <div className="dashboard-card">
                    {selectedToast ? (
                        // MANAGE WIDGET VIEW
                        <>
                            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                                <button
                                    onClick={() => setSelectedToast(null)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#64748b',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    ← Back to Toasts
                                </button>
                            </div>
                            <div className="tabs-header">
                                <button className={`tab-btn ${manageTab === 'Installation' ? 'active' : ''}`} onClick={() => setManageTab('Installation')}>Installation</button>
                                <button className={`tab-btn ${manageTab === 'Analytics' ? 'active' : ''}`} onClick={() => setManageTab('Analytics')}>Analytics</button>
                                <button className={`tab-btn ${manageTab === 'Content & Appearance' ? 'active' : ''}`} onClick={() => setManageTab('Content & Appearance')}>Content & Appearance</button>
                                <button className={`tab-btn ${manageTab === 'Timing' ? 'active' : ''}`} onClick={() => setManageTab('Timing')}>Timing</button>
                            </div>
                            <div className="tab-content">
                                {manageTab === 'Installation' && (
                                    <div className="manage-layout">
                                        <div className="editor-pane" style={{ width: '100%', maxWidth: '100%' }}>
                                            <h2 className="section-title">Deploy Widget</h2>
                                            <p className="section-desc">Embed this lightweight script just before your closing &lt;/body&gt; tag.</p>
                                            <div className="code-block" id="code-snippet-manage">
                                                &lt;script src="http://127.0.0.1:5000/static/widget.js?userId={localStorage.getItem('widgetic_user_id')}"&gt;&lt;/script&gt;
                                                <button className="copy-btn" onClick={() => {
                                                    const snippet = document.getElementById('code-snippet-manage').innerText
                                                    navigator.clipboard.writeText(snippet)
                                                    alert('Snippet copied!')
                                                }}>Copy Snippet</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {manageTab === 'Analytics' && (
                                    <div className="manage-layout">
                                        {(() => {
                                            const t = toasts.find(toast => toast._id === selectedToast._id) || selectedToast;
                                            const views = t.views || 0;
                                            const clicks = t.clicks || 0;
                                            const dismissals = t.dismissals || 0;
                                            const ctr = views > 0 ? ((clicks / views) * 100).toFixed(2) + '%' : '0.00%';
                                            const max = Math.max(views, clicks, dismissals, 10);

                                            return (
                                                <div className="analytics-container" style={{ padding: 0, boxShadow: 'none', background: 'transparent' }}>
                                                    <div className="metrics-grid">
                                                        <div className="metric-card">
                                                            <div className="metric-label">TOTAL IMPRESSIONS</div>
                                                            <div className="metric-value">{views}</div>
                                                        </div>
                                                        <div className="metric-card">
                                                            <div className="metric-label">TOTAL CLICKS</div>
                                                            <div className="metric-value">{clicks}</div>
                                                        </div>
                                                        <div className="metric-card">
                                                            <div className="metric-label">TOTAL DISMISSALS</div>
                                                            <div className="metric-value">{dismissals}</div>
                                                        </div>
                                                        <div className="metric-card">
                                                            <div className="metric-label">CONVERSION RATE</div>
                                                            <div className="metric-value">{ctr}</div>
                                                        </div>
                                                    </div>
                                                    <div className="chart-section" style={{ marginTop: '2rem' }}>
                                                        <div className="chart-header">
                                                            <div className="chart-title">Engagement Overview</div>
                                                        </div>
                                                        <div className="chart-container">
                                                            <div className="bar-group">
                                                                <div className="bar impressions" style={{ height: `${(views / max) * 100}%` }} data-value={views}>
                                                                    <div className="chart-tooltip">
                                                                        <div className="tooltip-title">Impressions</div>
                                                                        <div className="tooltip-row">
                                                                            <span className="tooltip-dot impressions"></span>
                                                                            <span>Total Count: {views}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="bar-label">Impressions</div>
                                                            </div>
                                                            <div className="bar-group">
                                                                <div className="bar clicks" style={{ height: `${(clicks / max) * 100}%` }} data-value={clicks}>
                                                                    <div className="chart-tooltip">
                                                                        <div className="tooltip-title">Clicks</div>
                                                                        <div className="tooltip-row">
                                                                            <span className="tooltip-dot clicks"></span>
                                                                            <span>Total Count: {clicks}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="bar-label">Clicks</div>
                                                            </div>
                                                            <div className="bar-group">
                                                                <div className="bar dismissals" style={{ height: `${(dismissals / max) * 100}%` }} data-value={dismissals}>
                                                                    <div className="chart-tooltip">
                                                                        <div className="tooltip-title">Dismissals</div>
                                                                        <div className="tooltip-row">
                                                                            <span className="tooltip-dot dismissals"></span>
                                                                            <span>Total Count: {dismissals}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="bar-label">Dismissals</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })()}
                                    </div>
                                )}
                                {manageTab === 'Content & Appearance' && (
                                    <div className="manage-layout">
                                        <div className="editor-pane">
                                            <h2 className="section-title">Core Content</h2>
                                            <p className="section-desc">Fine-tune the messaging and calls-to-action for this toast.</p>

                                            <div className="form-group">
                                                <label className="input-label">HEADLINE</label>
                                                <input type="text" name="headline" className="form-input" value={toastForm.headline || ''} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label className="input-label">NARRATIVE</label>
                                                <textarea name="narrative" className="form-input form-textarea" value={toastForm.narrative || ''} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group flex-1">
                                                    <label className="input-label">BUTTON LABEL</label>
                                                    <input type="text" name="cta" className="form-input" value={toastForm.cta || ''} onChange={handleInputChange} />
                                                </div>
                                                <div className="form-group flex-1">
                                                    <label className="input-label">TARGET URL</label>
                                                    <input type="text" name="url" className="form-input" value={toastForm.url || ''} onChange={handleInputChange} />
                                                </div>
                                            </div>

                                            <h2 className="section-title">Appearance</h2>
                                            <p className="section-desc">Customize the look of this toast.</p>

                                            <div className="form-row">
                                                <div className="form-group flex-1">
                                                    <label className="input-label">ACCENT COLOR</label>
                                                    <input type="color" name="accentColor" className="form-input" style={{ width: '100%', height: '45px', padding: '4px' }} value={toastForm.accentColor || '#3b82f6'} onChange={handleInputChange} />
                                                </div>
                                                <div className="form-group flex-1">
                                                    <label className="input-label">BODY COLOR</label>
                                                    <input type="color" name="backgroundColor" className="form-input" style={{ width: '100%', height: '45px', padding: '4px' }} value={toastForm.backgroundColor || '#ffffff'} onChange={handleInputChange} />
                                                </div>
                                            </div>

                                            <div className="form-actions">
                                                <button className="activate-btn" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={handleSyncChanges}>Synchronize Changes</button>
                                                <button className="delete-btn" onClick={() => handleDelete(selectedToast._id)} style={{ marginLeft: '1rem', color: '#ef4444' }}>Delete</button>
                                            </div>
                                        </div>
                                        <div className="preview-pane">
                                            <div className="preview-label">LIVE PREVIEW</div>
                                            <div className="preview-frame">
                                                <div className="preview-card-toast" style={{ borderLeftColor: toastForm.accentColor || '#3b82f6', backgroundColor: toastForm.backgroundColor || '#ffffff' }}>
                                                    <div className="toast-content">
                                                        <div className="toast-headline">{toastForm.headline || 'Headline'}</div>
                                                        <div className="toast-narrative">{toastForm.narrative || 'Narrative content goes here...'}</div>
                                                    </div>
                                                    {toastForm.cta && <button className="toast-cta" style={{ backgroundColor: toastForm.accentColor || '#2563eb' }}>{toastForm.cta}</button>}
                                                    <button className="toast-close">×</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {manageTab === 'Settings' && (
                                    <div className="editor-pane" style={{ maxWidth: '100%', width: '100%' }}>
                                        <h2 className="section-title">Core Configuration</h2>
                                        <div className="form-group">
                                            <label className="input-label">INTERNAL PROTOCOL NAME</label>
                                            <input type="text" name="designation" className="form-input" value={toastForm.designation || ''} onChange={handleInputChange} />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group flex-1">
                                                <label className="input-label">SYSTEM TYPE</label>
                                                <select name="type" className="form-input" value={toastForm.type || 'Notification'} onChange={handleInputChange}>
                                                    <option value="Notification">Notification</option>
                                                    <option value="Announcement">Announcement</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="input-label">POSITION</label>
                                            <select name="position" className="form-input" value={toastForm.position || 'bottom-right'} onChange={handleInputChange}>
                                                <option value="bottom-right">Bottom Right</option>
                                                <option value="bottom-left">Bottom Left</option>
                                                <option value="top-right">Top Right</option>
                                                <option value="top-left">Top Left</option>
                                            </select>
                                        </div>
                                        <button className="activate-btn" style={{ marginTop: '3rem' }} onClick={handleSyncChanges}>Save Global Parameters</button>
                                    </div>
                                )}
                                {manageTab === 'Timing' && (
                                    <div className="editor-pane" style={{ maxWidth: '100%', width: '100%' }}>
                                        <h2 className="section-title">Timing & Appearance</h2>
                                        <p className="section-desc">Control timing, recurrence, and visual style.</p>

                                        <div className="form-row">
                                            <div className="form-group flex-1">
                                                <label className="input-label">START DELAY (SECONDS)</label>
                                                <input type="number" name="startDelay" className="form-input" value={toastForm.startDelay || 0} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group flex-1">
                                                <label className="input-label">AUTO DISMISS (SECONDS)</label>
                                                <input type="number" name="autoDismissTime" className="form-input" value={toastForm.autoDismissTime || 0} onChange={handleInputChange} placeholder="0 for no auto-dismiss" />
                                            </div>
                                        </div>

                                        <div className="form-group" style={{ marginTop: '1.5rem' }}>
                                            <label className="input-label">RECURRENCE LOOP (MAX VIEWS)</label>
                                            <input type="number" name="recurrence" className="form-input" value={toastForm.recurrence || 0} onChange={handleInputChange} />
                                            <p className="input-hint" style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>Set to 0 for unlimited views per user.</p>
                                        </div>

                                        {/* NEW: STYLING OPTIONS */}
                                        <div className="form-row" style={{ marginTop: '1.5rem' }}>
                                            <div className="form-group flex-1">
                                                <label className="input-label">POSITION</label>
                                                <select name="position" className="form-input" value={toastForm.position || 'bottom-right'} onChange={handleInputChange}>
                                                    <option value="bottom-right">Bottom Right</option>
                                                    <option value="bottom-left">Bottom Left</option>
                                                    <option value="top-right">Top Right</option>
                                                    <option value="top-left">Top Left</option>
                                                    <option value="top-center">Top Center</option>
                                                    <option value="bottom-center">Bottom Center</option>
                                                </select>
                                            </div>
                                            <div className="form-group flex-1">
                                                <label className="input-label">THEME</label>
                                                <select name="theme" className="form-input" value={toastForm.theme || 'Light'} onChange={handleInputChange}>
                                                    <option value="Light">Light</option>
                                                    <option value="Dark">Dark Mode</option>
                                                    <option value="Glass">Glassmorphism</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group" style={{ marginTop: '1.5rem' }}>
                                            <label className="input-label">ANIMATION STYLE</label>
                                            <select name="animation" className="form-input" value={toastForm.animation || 'Slide'} onChange={handleInputChange}>
                                                <option value="Slide">Slide In</option>
                                                <option value="Fade">Fade In</option>
                                                <option value="Bounce">Bounce</option>
                                            </select>
                                        </div>

                                        <div className="form-group" style={{ marginTop: '1.5rem' }}>
                                            <label className="input-label">PAGE TARGETING (URL PATHS)</label>
                                            <input
                                                type="text"
                                                name="targetPages"
                                                className="form-input"
                                                value={Array.isArray(toastForm.targetPages) ? toastForm.targetPages.join(', ') : (toastForm.targetPages || '*')}
                                                onChange={(e) => setToastForm({ ...toastForm, targetPages: e.target.value.split(',').map(s => s.trim()) })}
                                                placeholder="e.g., /pricing, /features, *"
                                            />
                                            <p className="input-hint" style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>Enter paths separated by commas. Use '*' for all pages.</p>
                                        </div>

                                        <div className="form-group" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                                            <div
                                                style={{
                                                    position: 'relative',
                                                    width: '44px',
                                                    height: '24px',
                                                    backgroundColor: settings.loopCycle !== false ? '#2563eb' : '#cbd5e1',
                                                    borderRadius: '999px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onClick={() => setSettings({ ...settings, loopCycle: settings.loopCycle === false })}
                                            >
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: '2px',
                                                        left: settings.loopCycle !== false ? '22px' : '2px',
                                                        width: '20px',
                                                        height: '20px',
                                                        backgroundColor: 'white',
                                                        borderRadius: '50%',
                                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <label className="input-label" style={{ marginBottom: 0, cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => setSettings({ ...settings, loopCycle: settings.loopCycle === false })}>
                                                    GLOBAL SETTING: CONTINUOUS RESTART
                                                </label>
                                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Master Switch: If ON, the entire system loops. If OFF, everything stops after one run.</span>
                                            </div>
                                        </div>

                                        <div className="form-actions" style={{ marginTop: '3rem' }}>
                                            <button className="activate-btn" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={handleSyncChanges}>Synchronize Changes</button>
                                            <button className="delete-btn" onClick={() => handleDelete(selectedToast._id)} style={{ marginLeft: '1rem', color: '#ef4444' }}>Delete</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        // MAIN DASHBOARD VIEW
                        <>
                            <div className="tabs-header">
                                <button className={`tab-btn ${activeTab === 'Installation' ? 'active' : ''}`} onClick={() => setActiveTab('Installation')}>Installation</button>
                                <button className={`tab-btn ${activeTab === 'Toasts' ? 'active' : ''}`} onClick={() => setActiveTab('Toasts')}>Toasts</button>
                            </div>
                            <div className="tab-content">
                                {activeTab === 'Installation' && (
                                    <>
                                        <h2 className="section-title">Deploy Widget</h2>
                                        <p className="section-desc">Embed this lightweight script just before your closing &lt;/body&gt; tag.</p>
                                        <div className="code-block" id="code-snippet">
                                            &lt;script src="http://127.0.0.1:5000/static/widget.js?userId={localStorage.getItem('widgetic_user_id')}"&gt;&lt;/script&gt;
                                            <button className="copy-btn" onClick={copySnippet}>Copy Snippet</button>
                                        </div>
                                    </>
                                )}
                                {activeTab === 'Toasts' && (
                                    <div className="toasts-container">
                                        {!showCreateToast ? (
                                            <>
                                                <div className="toasts-header-section">
                                                    <h2 className="section-title">Active Toasts</h2>
                                                    <button className="create-toast-btn" onClick={handleCreateClick}>
                                                        <PlusIcon />
                                                        Create Verification Toast
                                                    </button>
                                                </div>
                                                <div className="toasts-table-container">
                                                    <div className="table-header">
                                                        <span>TOAST IDENTITY</span>
                                                        <span>TYPE</span>
                                                        <span>STATUS</span>
                                                        <span>VIEWS</span>
                                                        <span>ACTIONS</span>
                                                    </div>
                                                    {toasts.length === 0 ? (
                                                        <div className="table-empty-state">No widgets found. Create one to get started!</div>
                                                    ) : (
                                                        <div className="table-body">
                                                            {toasts.map((toast, index) => (
                                                                <div key={toast._id} className="table-row">
                                                                    <div className="col-identity">
                                                                        <strong>{index + 1}</strong>
                                                                        <div className="toast-designation">{toast.designation || `Toast ${index + 1}`}</div>
                                                                    </div>
                                                                    <div className="col-type">{toast.type}</div>
                                                                    <div className="col-status">
                                                                        <button
                                                                            className={`status-badge ${toast.status === 'ACTIVE' ? 'active' : 'inactive'}`}
                                                                            onClick={() => handleToggleStatus(toast)}
                                                                            style={{ cursor: 'pointer', border: 'none' }}
                                                                        >
                                                                            {toast.status || 'ACTIVE'}
                                                                        </button>
                                                                    </div>
                                                                    <div className="col-views">{toast.views}</div>
                                                                    <div className="col-actions">
                                                                        <button className="manage-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleManageClick(toast)}>Manage</button>
                                                                        <button className="delete-btn" onClick={() => handleDelete(toast._id)}>Delete</button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        ) : (

                                            <div className="create-toast-form">
                                                <h2 className="form-page-title">Forge New Toast</h2>
                                                {/* Form Fields from Garbage - Condensed for Restoration */}
                                                <div className="form-group">
                                                    <label className="input-label">TOAST DESIGNATION</label>
                                                    <input type="text" name="designation" className="form-input" value={toastForm.designation} onChange={handleInputChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="input-label">HEADLINE</label>
                                                    <input type="text" name="headline" className="form-input" value={toastForm.headline} onChange={handleInputChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="input-label">NARRATIVE</label>
                                                    <textarea name="narrative" className="form-input form-textarea" value={toastForm.narrative} onChange={handleInputChange} />
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group flex-1">
                                                        <label className="input-label">CTA LABEL</label>
                                                        <input type="text" name="cta" className="form-input" value={toastForm.cta} onChange={handleInputChange} />
                                                    </div>
                                                    <div className="form-group flex-1">
                                                        <label className="input-label">URL</label>
                                                        <input type="text" name="url" className="form-input" value={toastForm.url} onChange={handleInputChange} />
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group flex-1">
                                                        <label className="input-label">START DELAY (SEC)</label>
                                                        <input type="number" name="startDelay" className="form-input" value={toastForm.startDelay} onChange={handleInputChange} />
                                                    </div>
                                                    <div className="form-group flex-1">
                                                        <label className="input-label">AUTO DISMISS (SEC)</label>
                                                        <input type="number" name="autoDismissTime" className="form-input" value={toastForm.autoDismissTime} onChange={handleInputChange} />
                                                    </div>
                                                </div>
                                                <div className="form-actions">
                                                    <button className="abort-btn" onClick={handleAbort}>ABORT</button>
                                                    <button className="activate-btn" onClick={handleActivate}>Activate Toast</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                                }
                            </div >
                        </>
                    )}
                </div >
            )}
        </div >
    )
}

export default Dashboard
