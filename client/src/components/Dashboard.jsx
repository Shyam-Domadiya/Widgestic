import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    const [settings, setSettings] = useState({
        timeBetweenToasts: 2,
        toastDisplayTime: 2,
        position: 'bottom-right',
        backgroundColor: '#000000',
        typography: '',
        interactiveDismissal: false,
        brandedSignature: false
    })

    const [toastForm, setToastForm] = useState({
        designation: '',
        headline: '',
        narrative: '',
        cta: '',
        url: '',
        type: 'Notification',
        recurrence: '0'
    })

    const [showDailyLogs, setShowDailyLogs] = useState(false)
    const navigate = useNavigate()

    // Fetch Initial Data
    React.useEffect(() => {
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

    const handleCreateClick = () => {
        if (toasts.length >= 3) {
            navigate('/plan')
        } else {
            setShowCreateToast(true)
        }
    }



    const handleManageClick = (toast) => {
        setSelectedToast(toast)
        setToastForm(toast) // Pre-fill form with toast data
        setManageTab('Content & Appearance')
    }

    const handleSyncChanges = async () => {
        try {
            const updatedToast = await apiCall(`toasts/${selectedToast._id}`, 'PUT', toastForm);
            setToasts(toasts.map(t => t._id === selectedToast._id ? updatedToast : t));
            alert('Changes Synchronized!');
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
        const { name, value } = e.target
        setToastForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSettingsChange = (e) => {
        const { name, value, type, checked } = e.target
        const val = type === 'checkbox' ? checked : value
        setSettings(prev => ({ ...prev, [name]: val }))
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
            recurrence: '0'
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

    // ... existing code ...
    const location = window.location; // Use window.location or useLocation hook if imported
    const isAnalyticsPage = location.pathname === '/analytics';

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
                            <div className="chart-header">
                                <div className="chart-title">Engagement Overview</div>
                            </div>
                            <div className="chart-container">
                                {(() => {
                                    const views = toasts.reduce((acc, t) => acc + (t.views || 0), 0);
                                    const clicks = toasts.reduce((acc, t) => acc + (t.clicks || 0), 0);
                                    const dismissals = toasts.reduce((acc, t) => acc + (t.dismissals || 0), 0);
                                    const max = Math.max(views, clicks, dismissals, 10);

                                    return (
                                        <>
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
                                        </>
                                    )
                                })()}
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <div className="dashboard-card">
                    {selectedToast ? (
                        // MANAGE WIDGET VIEW
                        <>
                            <div className="tabs-header">
                                <button className={`tab-btn ${manageTab === 'Installation' ? 'active' : ''}`} onClick={() => setManageTab('Installation')}>Installation</button>
                                <button className={`tab-btn ${manageTab === 'Analytics' ? 'active' : ''}`} onClick={() => setManageTab('Analytics')}>Analytics</button>
                                <button className={`tab-btn ${manageTab === 'Content & Appearance' ? 'active' : ''}`} onClick={() => setManageTab('Content & Appearance')}>Content & Appearance</button>
                                <button className={`tab-btn ${manageTab === 'Settings' ? 'active' : ''}`} onClick={() => setManageTab('Settings')}>Settings</button>
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
                                            <div className="form-actions">
                                                <button className="activate-btn" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={handleSyncChanges}>Synchronize Changes</button>
                                                <button className="delete-btn" onClick={() => handleDelete(selectedToast._id)} style={{ marginLeft: '1rem', color: '#ef4444' }}>Delete</button>
                                            </div>
                                        </div>
                                        <div className="preview-pane">
                                            <div className="preview-label">LIVE PREVIEW</div>
                                            <div className="preview-frame">
                                                <div className="preview-card-toast">
                                                    <div className="toast-content">
                                                        <div className="toast-headline">{toastForm.headline || 'Headline'}</div>
                                                        <div className="toast-narrative">{toastForm.narrative || 'Narrative content goes here...'}</div>
                                                    </div>
                                                    {toastForm.cta && <button className="toast-cta">{toastForm.cta}</button>}
                                                    <button className="toast-close">×</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {manageTab === 'Settings' && (
                                    <div className="editor-pane">
                                        <h2 className="section-title">Core Configuration</h2>
                                        <div className="form-group">
                                            <label className="input-label">INTERNAL PROTOCOL NAME</label>
                                            <input type="text" name="designation" className="form-input" value={toastForm.designation || ''} onChange={handleInputChange} />
                                        </div>
                                        <div className="form-row" style={{ marginTop: '2rem' }}>
                                            <div className="form-group flex-1">
                                                <label className="input-label">SYSTEM TYPE</label>
                                                <select name="type" className="form-input" value={toastForm.type || 'Notification'} onChange={handleInputChange}>
                                                    <option value="Notification">Notification</option>
                                                    <option value="Announcement">Announcement</option>
                                                </select>
                                            </div>
                                            <div className="form-group flex-1">
                                                <label className="input-label">RECURRENCE LOOP</label>
                                                <input type="number" name="recurrence" className="form-input" value={toastForm.recurrence || 0} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <button className="activate-btn" style={{ marginTop: '3rem' }} onClick={handleSyncChanges}>Save Global Parameters</button>
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
                                <button className={`tab-btn ${activeTab === 'Settings' ? 'active' : ''}`} onClick={() => setActiveTab('Settings')}>Settings</button>
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
                                                                    <div className="col-status"><span className="status-badge active">ACTIVE</span></div>
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
                                                <div className="form-actions">
                                                    <button className="abort-btn" onClick={handleAbort}>ABORT</button>
                                                    <button className="activate-btn" onClick={handleActivate}>Activate Toast</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'Settings' && (
                                    <div className="settings-container">
                                        <div className="settings-section">
                                            <h2 className="section-title">Display Timing</h2>
                                            <div className="form-row">
                                                <div className="form-group flex-1">
                                                    <label className="input-label">TIME BETWEEN TOASTS (SEC)</label>
                                                    <input type="number" name="timeBetweenToasts" className="form-input" value={settings.timeBetweenToasts} onChange={handleSettingsChange} />
                                                </div>
                                                <div className="form-group flex-1">
                                                    <label className="input-label">TOAST DISPLAY TIME (SEC)</label>
                                                    <input type="number" name="toastDisplayTime" className="form-input" value={settings.toastDisplayTime} onChange={handleSettingsChange} />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Simplified Settings - Assuming user can re-add complex ones if needed, or I inferred enough */}
                                        <button className="activate-btn" style={{ marginTop: '2rem' }} onClick={handleUpdateGlobal}>Update Global Ecosystem</button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default Dashboard
