import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAudio } from './AudioManager';

const AchievementsContext = createContext();

export const ACHIEVEMENTS = {
    corridor_enter: { id: 'corridor_enter', label: '点击门进入房间', title: '初入走廊' },
    corridor_explore: { id: 'corridor_explore', label: '滚动探索走廊', title: '漫步时光' },
    about_fly: { id: 'about_fly', label: '滚动翱翔于知识天空', title: '凌空展翅' },
    studio_interact: { id: 'studio_interact', label: '拖拽旋转浏览理论', title: '理论探索者' },
    gallery_inspect: { id: 'gallery_inspect', label: '点击画卡查看考点', title: '概念鉴赏家' },
    contact_choose: { id: 'contact_choose', label: '选择一个学习板块', title: '求学问道' }
};

export const AchievementsProvider = ({ children }) => {
    const { playSound } = useAudio();

    // Synchronous ref to prevent double-firing on rapid events (like wheel scroll)
    const completedRef = useRef([]);

    // Load completed achievements from local storage
    const [completed, setCompleted] = useState(() => {
        try {
            const saved = localStorage.getItem('zzz_politics_achievements');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Wrzucamy do pule, ale ignorujemy 'corridor_enter' żeby tooltip wejściowy zawsze się pojawiał
                const filtered = parsed.filter(id => id !== 'corridor_enter');
                completedRef.current = [...filtered];
                return filtered;
            }
            return [];
        } catch (e) {
            return [];
        }
    });

    // Lazy global AudioContext to avoid creating it on every unlock
    const audioCtxRef = useRef(null);

    // Simple WebAudio chime for achievement unlock
    const playUnlockChime = useCallback(() => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;

            // Initialize once and reuse
            if (!audioCtxRef.current) {
                audioCtxRef.current = new AudioCtx();
            }

            const ctx = audioCtxRef.current;

            // Resume context if suspended (browser auto-play policy)
            // Note: This might still fail if not called directly from a click event,
            // but we wrap it in a try/catch and silent fail for Awwwards.
            if (ctx.state === 'suspended') {
                ctx.resume().catch(() => {
                    // Silently fail if still blocked by policy
                });
            }

            if (ctx.state !== 'running') return;

            const gain = ctx.createGain();
            const osc = ctx.createOscillator();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';

            // Nice "ding-ding" interval (A4 -> E5)
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);

            // Envelope for volume
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
            gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

            // Audio is muted by start/stop being commented out, but we still ensure context logic is clean
            // osc.start(ctx.currentTime);
            // osc.stop(ctx.currentTime + 0.5);
        } catch (err) {
            // console.warn('Failed to play unlock chime', err);
        }
    }, []);

    // Currently displayed popup
    // Structure: { id: 'corridor_enter', status: 'pending' | 'completed' | 'hiding' }
    const [activePopup, setActivePopup] = useState(null);

    // Save to localStorage when completed changes
    useEffect(() => {
        const toSave = completed.filter(id => id !== 'corridor_enter');
        localStorage.setItem('zzz_politics_achievements', JSON.stringify(toSave));
    }, [completed]);

    const showTutorial = useCallback((id) => {
        // Only show if it's a valid achievement, not already completed, and no popup currently active
        // Also ensure we're not currently hiding another popup
        if (ACHIEVEMENTS[id] && !completed.includes(id) && (!activePopup || activePopup.status === 'hiding')) {
            // Slight delay to ensure previous hiding finished
            setTimeout(() => {
                setActivePopup({ id, status: 'pending' });
            }, 50);
        }
    }, [completed, activePopup]);

    const unlockAchievement = useCallback((id) => {
        // Use synchronous ref check to avoid 100x fires during continuous scroll events
        if (!completedRef.current.includes(id)) {
            completedRef.current.push(id);

            setCompleted(prev => {
                const updated = [...prev, id];
                // Save locally excluding corridor_enter
                const toSave = updated.filter(item => item !== 'corridor_enter');
                localStorage.setItem('zzz_politics_achievements', JSON.stringify(toSave));
                return updated;
            });

            // (PostHog 已移除: 离线知识库版本不做行为分析上报)

            // Trigger sound effect
            playUnlockChime();

            setActivePopup(prev => {
                // If this is the current active popup, transition it to 'completed' then hide
                if (prev && prev.id === id) {
                    // Start timeouts for the hiding animations
                    setTimeout(() => {
                        setActivePopup(p => p && p.id === id ? { ...p, status: 'hiding' } : p);
                        setTimeout(() => {
                            setActivePopup(p => p && p.id === id ? null : p);
                        }, 500);
                    }, 2000);
                    return { ...prev, status: 'completed' };
                } else {
                    // Set as completed immediately to show unexpected unlock
                    setTimeout(() => {
                        setActivePopup(p => p && p.id === id ? { ...p, status: 'hiding' } : p);
                        setTimeout(() => {
                            setActivePopup(p => p && p.id === id ? null : p);
                        }, 500);
                    }, 3000);
                    return { id, status: 'completed' };
                }
            });
        }
    }, [playUnlockChime]);

    const hidePopup = useCallback(() => {
        if (activePopup && activePopup.status !== 'hiding') {
            setActivePopup(prev => prev ? { ...prev, status: 'hiding' } : null);
            setTimeout(() => {
                setActivePopup(null);
            }, 500);
        }
    }, [activePopup]);

    return (
        <AchievementsContext.Provider value={{
            completed,
            activePopup,
            showTutorial,
            unlockAchievement,
            hidePopup
        }}>
            {children}
        </AchievementsContext.Provider>
    );
};

export const useAchievements = () => useContext(AchievementsContext);
