(function() {
    console.log("Widgetic Script Main Loaded");

    // 1. Get User ID from Script Tag - find the widget script
    const scripts = document.getElementsByTagName('script');
    let userId = null;
    
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.includes('widget.js')) {
            const urlParams = new URLSearchParams(scripts[i].src.split('?')[1]);
            userId = urlParams.get('userId');
            break;
        }
    }

    if (!userId) {
        console.error("Widgetic Error: No userId provided in script tag.");
        return;
    }

    console.log("Widgetic User ID:", userId);

    // Helper to get/set view counts from localStorage
    const getViewCount = (toastId) => {
        const counts = JSON.parse(localStorage.getItem('widgetic_views') || '{}');
        return counts[toastId] || 0;
    };
    
    const incrementViewCount = (toastId) => {
        const counts = JSON.parse(localStorage.getItem('widgetic_views') || '{}');
        counts[toastId] = (counts[toastId] || 0) + 1;
        localStorage.setItem('widgetic_views', JSON.stringify(counts));
        return counts[toastId];
    };

    // 2. Continuous Cycle Logic
    const startWidgetCycle = () => {
        Promise.all([
            fetch(`http://localhost:5000/api/toasts?userId=${userId}`).then(res => res.json()),
            fetch(`http://localhost:5000/api/settings?userId=${userId}`).then(res => res.json())
        ])
        .then(([toasts, settings]) => {
            console.log("Widgetic Data Fetched:", { toasts, settings });
        // Filter toasts based on status, completion, and PAGE TARGETING
        const activeToasts = toasts.filter(t => {
            if (t.status !== 'ACTIVE') {
                return false;
            }
            
            // Recurrence Check
            if (t.recurrence > 0) {
                const views = getViewCount(t._id);
                if (views >= t.recurrence) {
                     console.log(`Widgetic: Toast ${t._id} skipped (Recurrence limit reached: ${views}/${t.recurrence})`);
                     return false;
                }
            }

            // Page Targeting Check
            let currentPath = window.location.pathname.replace(/\/$/, '') || '/';
            
            // Handle local file system (file://) for testing
            if (window.location.protocol === 'file:') {
                const parts = currentPath.split('/');
                const fileName = parts[parts.length - 1];
                // Treat common test files as root if target is '/'
                if (fileName === 'hello.html' || fileName === 'index.html' || fileName === '') {
                    currentPath = '/';
                } else {
                    currentPath = '/' + fileName;
                }
                console.log("Widgetic: Local file detected. Normalized path to:", currentPath);
            }

            if (t.targetPages && t.targetPages.length > 0 && !t.targetPages.includes('*')) {
                // Normalize target pages to handle full URLs and trailing slashes
                const normalizedTargets = t.targetPages.map(p => {
                    try {
                        if (p.startsWith('http')) {
                            return new URL(p).pathname.replace(/\/$/, '') || '/';
                        }
                        return p.replace(/\/$/, '') || '/';
                    } catch (e) {
                        return p;
                    }
                });

                if (!normalizedTargets.includes(currentPath)) {
                    console.log(`Widgetic: Toast ${t._id} skipped (Page mismatch). Current: ${currentPath}, Targets:`, normalizedTargets);
                    return false;
                }
            }

            return true;
        });    if (activeToasts.length === 0) {
                if (settings.loopCycle !== false) {
                    console.warn("Widgetic: No active toasts found. Restarting cycle in 10s...");
                    setTimeout(startWidgetCycle, 10000);
                } else {
                    console.log("Widgetic: No active toasts. Cycle disabled.");
                }
                return;
            }

            console.log(`Widgetic: Starting Cycle with ${activeToasts.length} toasts.`);
            let toastQueue = [...activeToasts];

            const showNextToast = () => {
                if (toastQueue.length === 0) {
                    console.log("Widgetic: Queue empty. All scheduled toasts finished.");
                    if (settings.loopCycle !== false) {
                        console.log("Widgetic: Cycle complete. Restarting in 5s...");
                        setTimeout(startWidgetCycle, 5000);
                    } else {
                        console.log("Widgetic: Cycle complete. Loop disabled.");
                    }
                    return;
                }

                const toast = toastQueue.shift();
                
                if (toast.autoDismissTime === undefined || toast.autoDismissTime === 0) {
                    toast.autoDismissTime = settings.toastDisplayTime || 0;
                }
                
                toast.position = toast.position || settings.position || 'bottom-right';
                toast.accentColor = toast.accentColor || settings.accentColor || '#3b82f6';
                toast.backgroundColor = toast.backgroundColor || settings.backgroundColor || '#ffffff';

                incrementViewCount(toast._id);
                fetch(`http://localhost:5000/api/toasts/${toast._id}/view`, { method: 'POST' });

                const startDelay = (toast.startDelay || 0) * 1000;
                
                setTimeout(() => {
                    renderToast(toast, () => {
                        showNextToast();
                    });
                }, startDelay);
            };

            showNextToast();
        })
        .catch(err => {
            console.error("Widgetic Fetch Error:", err);
            setTimeout(startWidgetCycle, 10000); // Retry on error
        });
    };

    startWidgetCycle();

    function renderToast(toast, onDismiss) {
        const trackClick = () => fetch(`http://localhost:5000/api/toasts/${toast._id}/click`, { method: 'POST' });
        const trackDismiss = () => fetch(`http://localhost:5000/api/toasts/${toast._id}/dismiss`, { method: 'POST' });

        const isAnnouncement = toast.type === 'Announcement';
        const accentColor = toast.accentColor || '#3b82f6';
        const position = toast.position || 'bottom-right';
        const bgColor = toast.backgroundColor || '#ffffff';

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.width = isAnnouncement ? '360px' : '320px';
        container.style.backgroundColor = bgColor;
        container.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        container.style.borderRadius = isAnnouncement ? '16px' : '12px';
        container.style.padding = isAnnouncement ? '1.25rem 1.5rem' : '1rem 1.25rem';
        container.style.zIndex = '9999';
        container.style.fontFamily = 'Inter, system-ui, sans-serif';
        container.style.border = isAnnouncement ? `2px solid ${accentColor}` : 'none';
        container.style.borderLeft = isAnnouncement ? `2px solid ${accentColor}` : `4px solid ${accentColor}`;
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '0.75rem';
        container.style.opacity = '0';
        container.style.transition = 'all 0.5s ease';

        // Position
        let initialTransform = '';
        let enterTransform = '';
        let exitTransform = '';

        if (position.includes('bottom')) {
            container.style.bottom = '20px';
            initialTransform = 'translateY(20px)';
            enterTransform = 'translateY(0)';
            exitTransform = 'translateY(20px)';
        } else {
            container.style.top = '20px';
            initialTransform = 'translateY(-20px)';
            enterTransform = 'translateY(0)';
            exitTransform = 'translateY(-20px)';
        }
        
        if (position.includes('left')) {
            container.style.left = '20px';
        } else if (position.includes('center')) {
            container.style.left = '50%';
            initialTransform += ' translateX(-50%)';
            enterTransform += ' translateX(-50%)';
            exitTransform += ' translateX(-50%)';
        } else {
            // Default to right
            container.style.right = '20px';
        }

        container.style.transform = initialTransform;

        const content = document.createElement('div');
        const headline = document.createElement('div');
        headline.innerText = toast.headline || '';
        headline.style.fontWeight = '600';
        headline.style.fontSize = '0.95rem';
        headline.style.color = '#1e293b';
        
        const narrative = document.createElement('div');
        narrative.innerText = toast.narrative || '';
        narrative.style.fontSize = '0.875rem';
        narrative.style.color = '#64748b';

        content.appendChild(headline);
        content.appendChild(narrative);
        container.appendChild(content);

        if (toast.cta) {
            const btn = document.createElement('a');
            btn.href = toast.url || '#';
            btn.innerText = toast.cta;
            btn.style.display = 'inline-block';
            btn.style.backgroundColor = accentColor;
            btn.style.color = '#fff';
            btn.style.padding = '0.4rem 1rem';
            btn.style.borderRadius = '6px';
            btn.style.textDecoration = 'none';
            btn.style.fontSize = '0.85rem';
            btn.style.fontWeight = '500';
            btn.style.marginTop = '0.5rem';
            btn.style.cursor = 'pointer';
            btn.style.alignSelf = 'flex-start';
            btn.target = '_blank';
            btn.onclick = trackClick;
            container.appendChild(btn);
        }

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '0.5rem';
        closeBtn.style.right = '0.75rem';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '1.25rem';
        closeBtn.style.color = '#94a3b8';
        closeBtn.style.cursor = 'pointer';

        const dismissToast = () => {
            container.style.opacity = '0';
            container.style.transform = exitTransform;
            setTimeout(() => {
                container.remove();
                if (onDismiss) onDismiss();
            }, 500);
        };

        closeBtn.onclick = () => {
            trackDismiss();
            dismissToast();
        };
        container.appendChild(closeBtn);

        document.body.appendChild(container);

        setTimeout(() => {
            container.style.opacity = '1';
            container.style.transform = enterTransform;
            
            const autoDismissTime = (toast.autoDismissTime || 0) * 1000;
            if (autoDismissTime > 0) {
                setTimeout(dismissToast, autoDismissTime);
            }
        }, 100);
    }

})();
