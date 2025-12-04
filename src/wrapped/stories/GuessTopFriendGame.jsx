import { useState, useMemo } from 'react';

export default function GuessTopFriendGame({ data }) {
    const [selected, setSelected] = useState(null);
    const [revealed, setRevealed] = useState(false);
    
    const dmUsers = useMemo(() => data?.topDMUsers || [], [data?.topDMUsers]);
    const userLookup = data?.userLookup || {};
    const topFriend = dmUsers[0];

    // Helper to get display name (from lookup or fallback to original)
    const getDisplayName = (name) => {
        if (userLookup[name]) {
            return userLookup[name].name || userLookup[name].username || name;
        }
        return name;
    };

    // Helper to get avatar URL
    const getAvatar = (name) => {
        return userLookup[name]?.avatar || null;
    };
    
    const options = useMemo(() => {
        if (!topFriend || dmUsers.length < 2) return [];
        const others = dmUsers.slice(1, 6);
        const selected = others.slice(0, Math.min(3, others.length));
        return [...selected, topFriend].sort((a, b) => {
            const hashA = a.name?.charCodeAt(0) || 0;
            const hashB = b.name?.charCodeAt(0) || 0;
            return hashA - hashB;
        });
    }, [dmUsers, topFriend]);

    const isCorrect = selected?.name === topFriend?.name;

    if (!topFriend || dmUsers.length < 2) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#23272A] text-white p-8">
                <div className="text-6xl mb-6">💬</div>
                <h2 className="text-3xl font-black mb-4">Your DMs</h2>
                <p className="text-gray-400 text-center">Not enough DM data for 2025</p>
            </div>
        );
    }

    const topFriendAvatar = getAvatar(topFriend?.name);
    const topFriendName = getDisplayName(topFriend?.name);

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#23272A] text-white p-6 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-10 right-20 w-24 h-24 border-4 border-[#57F287]/30 rounded-full" />
            <div className="absolute bottom-32 left-10 w-16 h-16 bg-[#57F287]/20 rounded-full" />
            <div className="absolute top-1/2 right-8 w-3 h-3 bg-[#57F287] rounded-full" />
            
            <div className="relative z-10 w-full max-w-lg">
                {!revealed ? (
                    <>
                        <div className="text-center mb-6">
                            <span className="text-[#57F287] text-lg font-bold tracking-wider">🎮 MINI GAME</span>
                            <h2 className="text-4xl font-black mt-3">
                                Who's your<br />#1 chat buddy?
                            </h2>
                            <p className="text-gray-400 mt-3 text-lg">Most DMs in 2025?</p>
                        </div>
                        
                        <div className="space-y-3">
                            {options.map((user, i) => {
                                const avatar = getAvatar(user?.name);
                                const displayName = getDisplayName(user?.name);
                                
                                return (
                                    <button
                                        key={i}
                                        onClick={(e) => { e.stopPropagation(); setSelected(user); setRevealed(true); }}
                                        className="w-full p-5 bg-white/5 hover:bg-[#57F287]/20 border border-white/10 hover:border-[#57F287]/50 rounded-2xl text-left transition-all duration-200 hover:scale-[1.02] group flex items-center gap-3"
                                    >
                                        {avatar ? (
                                            <img 
                                                src={avatar} 
                                                alt="" 
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                                                {displayName?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                        )}
                                        <span className="text-lg font-semibold group-hover:text-[#57F287] transition-colors">
                                            {displayName || 'Unknown User'}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="text-7xl mb-6">{isCorrect ? '💚' : '💬'}</div>
                        <h2 className="text-4xl font-black mb-4">
                            {isCorrect ? 'Best friends!' : 'Good guess!'}
                        </h2>
                        <p className="text-gray-400 mb-6 text-lg">Your bestie is...</p>
                        <div className="bg-[#57F287] text-black rounded-2xl p-6 flex flex-col items-center">
                            {topFriendAvatar ? (
                                <img 
                                    src={topFriendAvatar} 
                                    alt="" 
                                    className="w-16 h-16 rounded-full object-cover mb-3 border-4 border-black/20"
                                />
                            ) : null}
                            <p className="text-2xl font-black">{topFriendName}</p>
                            <p className="text-lg font-medium mt-2 opacity-80">
                                {topFriend?.messages?.toLocaleString()} messages exchanged
                            </p>
                        </div>
                        <p className="text-sm text-gray-500 mt-6">Tap to continue →</p>
                    </div>
                )}
            </div>
        </div>
    );
}
