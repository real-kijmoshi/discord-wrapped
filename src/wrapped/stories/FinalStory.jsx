import { useEffect, useState } from 'react';

// Pre-calculated positions (deterministic for React Compiler)
const CONFETTI_POSITIONS = [
    { top: 15, left: 23, delay: 100 },
    { top: 42, left: 67, delay: 250 },
    { top: 78, left: 12, delay: 50 },
    { top: 33, left: 89, delay: 300 },
    { top: 55, left: 45, delay: 150 },
    { top: 88, left: 34, delay: 400 },
    { top: 22, left: 78, delay: 200 },
    { top: 66, left: 56, delay: 350 },
    { top: 44, left: 11, delay: 450 },
    { top: 91, left: 92, delay: 50 },
    { top: 18, left: 41, delay: 275 },
    { top: 72, left: 28, delay: 125 },
    { top: 36, left: 73, delay: 375 },
    { top: 59, left: 19, delay: 225 },
    { top: 81, left: 61, delay: 325 },
    { top: 27, left: 52, delay: 175 },
    { top: 48, left: 85, delay: 425 },
    { top: 95, left: 37, delay: 75 },
    { top: 13, left: 64, delay: 475 },
    { top: 67, left: 8, delay: 25 }
];

export default function FinalStory({ data }) {
    const [animate, setAnimate] = useState(false);
    
    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
    }, []);

    // Calculate stats
    const totalMessages = data?.totalMessages || 0;
    const serverCount = data?.serverCount || 0;
    const activeDays = data?.activeDaysCount || data?.daysActive || 0;
    const longestStreak = data?.longestStreak?.days || (typeof data?.longestStreak === 'number' ? data.longestStreak : 0);
    const voiceHours = Math.round((data?.voiceStats?.totalDuration || data?.voiceMinutes * 60 || 0) / 3600);
    const topEmoji = data?.topEmojis?.[0]?.emoji || Object.keys(data?.emojis || {})[0] || '😊';
    const topServer = data?.servers?.[0]?.name || 'Unknown';
    const totalWords = data?.totalWords || 0;
    
    // Resolve best friend name from userLookup
    const userLookup = data?.userLookup || {};
    const bestFriendRaw = data?.dms?.[0]?.name || data?.topDMUsers?.[0]?.name || '';
    const bestFriend = userLookup[bestFriendRaw]?.name || userLookup[bestFriendRaw]?.username || bestFriendRaw || 'Unknown';
    
    // Get fun title based on activity
    const getTitle = () => {
        if (totalMessages >= 100000) return { title: 'Discord Legend', emoji: '👑' };
        if (totalMessages >= 50000) return { title: 'Power User', emoji: '⚡' };
        if (totalMessages >= 10000) return { title: 'Social Butterfly', emoji: '🦋' };
        if (totalMessages >= 1000) return { title: 'Regular Chatter', emoji: '💬' };
        return { title: 'Casual User', emoji: '🌱' };
    };
    
    const userTitle = getTitle();

    return (
        <div className="flex flex-col items-center justify-center h-full text-white p-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
            
            {/* Confetti/sparkles */}
            {CONFETTI_POSITIONS.map((pos, i) => (
                <div
                    key={i}
                    className={`absolute w-2 h-2 rounded-full transition-all duration-1000`}
                    style={{
                        top: animate ? `${pos.top}%` : '-10%',
                        left: `${pos.left}%`,
                        backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA', '#F472B6'][i % 5],
                        opacity: animate ? 0.6 : 0,
                        transitionDelay: `${pos.delay}ms`,
                        transitionDuration: '2s'
                    }}
                />
            ))}
            
            <div className={`text-center relative z-10 w-full max-w-sm transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {/* User badge */}
                <div className={`mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-[#5865F2] to-[#EB459E] flex items-center justify-center mb-4 shadow-lg transition-all duration-700 delay-200 ${animate ? 'scale-100' : 'scale-0'}`}>
                    <span className="text-5xl">{userTitle.emoji}</span>
                </div>
                
                <p className={`text-sm font-bold tracking-widest text-[#5865F2] mb-1 transition-all duration-700 delay-300 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    YOUR TITLE
                </p>
                <h2 className={`text-3xl font-black mb-2 transition-all duration-700 delay-400 ${animate ? 'scale-100' : 'scale-90'}`}>
                    {userTitle.title}
                </h2>
                
                {/* Main highlights */}
                <div className={`bg-white/5 rounded-2xl p-4 mb-4 border border-white/10 transition-all duration-700 delay-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                            <p className="text-2xl font-black text-[#57F287]">{totalMessages.toLocaleString()}</p>
                            <p className="text-[10px] opacity-60">messages</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-[#5865F2]">{serverCount}</p>
                            <p className="text-[10px] opacity-60">servers</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-[#EB459E]">{activeDays}</p>
                            <p className="text-[10px] opacity-60">active days</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <p className="text-2xl font-black text-[#FEE75C]">{longestStreak}</p>
                            <p className="text-[10px] opacity-60">day streak</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-[#9B59B6]">{voiceHours}h</p>
                            <p className="text-[10px] opacity-60">in voice</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-[#E67E22]">{totalWords.toLocaleString()}</p>
                            <p className="text-[10px] opacity-60">words</p>
                        </div>
                    </div>
                </div>
                
                {/* Top highlights */}
                <div className={`space-y-2 mb-4 transition-all duration-700 delay-600 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                        <span className="text-sm opacity-70">Top Server</span>
                        <span className="text-sm font-bold truncate ml-2 max-w-[150px]">{topServer}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                        <span className="text-sm opacity-70">Best Friend</span>
                        <span className="text-sm font-bold truncate ml-2 max-w-[150px]">{bestFriend}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                        <span className="text-sm opacity-70">Favorite Emoji</span>
                        <span className="text-2xl">{topEmoji}</span>
                    </div>
                </div>
                
                {/* Share prompt */}
                <div className={`transition-all duration-700 delay-700 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-xs opacity-50 mb-2">Share your Discord Wrapped!</p>
                    <div className="text-4xl">🎉</div>
                </div>
                
                {/* Year */}
                <p className={`text-sm font-black mt-4 bg-gradient-to-r from-[#5865F2] to-[#EB459E] bg-clip-text text-transparent transition-all duration-700 delay-800 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    DISCORD WRAPPED 2025
                </p>
            </div>
        </div>
    );
}
