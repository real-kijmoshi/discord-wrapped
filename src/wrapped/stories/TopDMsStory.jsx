export default function TopDMsStory({ data }) {
    const topDMs = data?.topDMUsers || [];
    const userLookup = data?.userLookup || {};
    const top5 = topDMs.slice(0, 5);
    const totalDMMessages = top5.reduce((sum, dm) => sum + dm.messages, 0);

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

    if (top5.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#E91E63] text-white p-8">
                <div className="text-6xl mb-6">💬</div>
                <h2 className="text-3xl font-black">No DM Data</h2>
                <p className="opacity-70 mt-4">No DMs found in 2025</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#E91E63] text-white p-6 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute bottom-20 left-8 w-16 h-16 bg-white/10 rounded-full" />
            
            <div className="max-w-lg w-full relative z-10">
                <div className="text-center mb-6">
                    <div className="text-5xl mb-3">💬</div>
                    <h2 className="text-4xl font-black">Your Top DMs</h2>
                    <p className="opacity-80 mt-2">{totalDMMessages.toLocaleString()} messages with your top 5</p>
                </div>

                <div className="space-y-3">
                    {top5.map((dm, index) => {
                        const avatar = getAvatar(dm.name);
                        const displayName = getDisplayName(dm.name);
                        
                        return (
                            <div
                                key={index}
                                className="bg-white/10 rounded-xl p-4 flex items-center gap-3"
                            >
                                <div className="text-2xl font-black text-white w-8">
                                    #{index + 1}
                                </div>
                                {avatar ? (
                                    <img 
                                        src={avatar} 
                                        alt="" 
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                                        {displayName?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-lg truncate">
                                        {displayName || 'Unknown'}
                                    </div>
                                    <div className="h-2 bg-white/20 rounded-full overflow-hidden mt-1">
                                        <div 
                                            className="h-full bg-white rounded-full"
                                            style={{ width: `${top5[0].messages > 0 ? (dm.messages / top5[0].messages) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-black">{dm.messages?.toLocaleString()}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
