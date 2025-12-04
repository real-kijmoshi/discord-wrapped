import { useEffect, useState } from 'react';

// Pre-calculated flame positions (deterministic for React Compiler)
const FLAME_POSITIONS = [
    { bottom: 115, left: 25, delay: 200 },
    { bottom: 140, left: 72, delay: 600 },
    { bottom: 125, left: 45, delay: 100 },
    { bottom: 135, left: 18, delay: 800 },
    { bottom: 110, left: 58, delay: 400 },
    { bottom: 148, left: 82, delay: 300 },
    { bottom: 120, left: 35, delay: 700 },
    { bottom: 130, left: 65, delay: 500 },
    { bottom: 145, left: 12, delay: 900 },
    { bottom: 118, left: 88, delay: 150 }
];

export default function ChatStreakStory({ data }) {
    const [animate, setAnimate] = useState(false);
    const streak = data?.longestStreak || { days: 0, startDate: null, endDate: null };
    
    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    // Streak title based on length
    const getStreakTitle = (days) => {
        if (days >= 365) return { title: 'LEGENDARY', emoji: '🏆', color: '#FFD700' };
        if (days >= 180) return { title: 'INCREDIBLE', emoji: '⭐', color: '#FF6B6B' };
        if (days >= 90) return { title: 'AMAZING', emoji: '🔥', color: '#FF8C00' };
        if (days >= 30) return { title: 'GREAT', emoji: '✨', color: '#9B59B6' };
        if (days >= 7) return { title: 'SOLID', emoji: '💪', color: '#3498DB' };
        return { title: 'STARTER', emoji: '🌱', color: '#27AE60' };
    };
    
    const streakInfo = getStreakTitle(streak.days);
    const daysActive = data?.daysActive || 0;
    const consistencyPercent = daysActive > 0 && streak.days > 0 
        ? Math.min(100, Math.round((streak.days / daysActive) * 100))
        : 0;

    return (
        <div className="flex flex-col items-center justify-center h-full text-white p-6 relative overflow-hidden"
            style={{ backgroundColor: streakInfo.color }}>
            {/* Flame particles for high streaks */}
            {streak.days >= 30 && FLAME_POSITIONS.map((pos, i) => (
                <div
                    key={i}
                    className={`absolute text-2xl transition-all duration-1000`}
                    style={{
                        bottom: animate ? `${pos.bottom}%` : '0%',
                        left: `${pos.left}%`,
                        opacity: animate ? 0 : 0.6,
                        transitionDelay: `${pos.delay}ms`,
                        transitionDuration: '2s'
                    }}
                >
                    🔥
                </div>
            ))}
            
            <div className={`relative z-10 w-full max-w-sm text-center transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className={`text-6xl mb-2 transition-all duration-700 delay-200 ${animate ? 'scale-100 rotate-0' : 'scale-0 -rotate-180'}`}>
                    {streakInfo.emoji}
                </div>
                
                <p className="text-sm font-bold tracking-wider mb-2 opacity-70">{streakInfo.title} STREAK</p>
                
                <div className={`transition-all duration-700 delay-300 ${animate ? 'scale-100' : 'scale-90'}`}>
                    <p className="text-7xl font-black">{streak.days}</p>
                    <p className="text-xl opacity-70">consecutive days</p>
                </div>
                
                {/* Date range */}
                {streak.startDate && (
                    <p className={`text-sm opacity-60 mt-2 transition-all duration-700 delay-400 ${animate ? 'opacity-60' : 'opacity-0'}`}>
                        {formatDate(streak.startDate)} → {formatDate(streak.endDate)}
                    </p>
                )}
                
                {/* Streak visualization */}
                <div className={`mt-6 flex justify-center gap-1 flex-wrap transition-all duration-700 delay-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    {[...Array(Math.max(0, Math.min(streak.days || 0, 30)))].map((_, i) => (
                        <div
                            key={i}
                            className="w-3 h-3 bg-white rounded-sm transition-all duration-300"
                            style={{
                                opacity: animate ? 0.3 + (i / 30) * 0.7 : 0,
                                transitionDelay: `${600 + i * 20}ms`
                            }}
                        />
                    ))}
                    {(streak.days || 0) > 30 && (
                        <span className="text-sm opacity-70 ml-2">+{streak.days - 30} more</span>
                    )}
                </div>
                
                {/* Consistency meter */}
                <div className={`mt-6 bg-black/20 rounded-xl p-4 transition-all duration-700 delay-600 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-xs opacity-70 mb-2">Consistency Score</p>
                    <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
                        <div 
                            className="h-full bg-white rounded-full transition-all duration-1000"
                            style={{
                                width: animate ? `${consistencyPercent}%` : '0%',
                                transitionDelay: '700ms'
                            }}
                        />
                    </div>
                    <p className="text-lg font-bold mt-1">{consistencyPercent}%</p>
                </div>
            </div>
        </div>
    );
}
