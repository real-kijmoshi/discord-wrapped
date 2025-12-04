import { useEffect, useState } from 'react';

export default function ServerLoyaltyStory({ data }) {
    const [animate, setAnimate] = useState(false);
    const servers = data?.servers || [];
    const topServer = servers[0];
    const totalMessages = data?.totalMessages || 0;
    
    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
    }, []);

    if (!topServer) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#1E3A5F] text-white p-8">
                <p className="text-2xl">No server data found</p>
            </div>
        );
    }

    const percentage = totalMessages > 0 ? Math.round((topServer.messages / totalMessages) * 100) : 0;
    
    // Determine loyalty level
    const getLoyaltyLevel = () => {
        if (percentage > 50) return { level: 'Die-Hard Fan', emoji: '👑', stars: 5 };
        if (percentage > 35) return { level: 'Dedicated Member', emoji: '💪', stars: 4 };
        if (percentage > 20) return { level: 'Active Contributor', emoji: '⭐', stars: 3 };
        if (percentage > 10) return { level: 'Regular Visitor', emoji: '🏠', stars: 2 };
        return { level: 'Explorer', emoji: '🌍', stars: 1 };
    };

    const loyalty = getLoyaltyLevel();

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#1E3A5F] text-white p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-[#3498DB]/10 rounded-full -translate-y-1/2 translate-x-1/2 transition-all duration-1000 ${animate ? 'scale-100' : 'scale-0'}`} />
            
            <div className={`relative z-10 w-full max-w-sm text-center transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="text-6xl mb-4">{loyalty.emoji}</div>
                <p className="text-[#3498DB] text-sm font-bold tracking-wider mb-2">YOUR #1 SERVER</p>
                
                <h2 className={`text-3xl font-black mb-4 transition-all duration-700 delay-200 ${animate ? 'scale-100' : 'scale-90'}`}>
                    {topServer.name}
                </h2>
                
                {/* Loyalty meter */}
                <div className={`bg-white/10 rounded-full h-4 w-full mb-4 overflow-hidden transition-all duration-700 delay-300 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    <div 
                        className="h-full bg-gradient-to-r from-[#3498DB] to-[#9B59B6] transition-all duration-1000 delay-500"
                        style={{ width: animate ? `${percentage}%` : '0%' }}
                    />
                </div>
                
                <p className={`text-5xl font-black text-[#3498DB] mb-2 transition-all duration-700 delay-400 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    {percentage}%
                </p>
                <p className="text-white/60 mb-4">of your messages</p>
                
                {/* Stars */}
                <div className={`flex justify-center gap-1 mb-4 transition-all duration-700 delay-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-2xl ${i < loyalty.stars ? 'text-[#F1C40F]' : 'text-white/20'}`}>★</span>
                    ))}
                </div>
                
                <div className={`bg-[#3498DB] text-white rounded-xl py-3 px-6 inline-block transition-all duration-700 delay-600 ${animate ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                    <p className="font-bold">{loyalty.level}</p>
                </div>
                
                <p className={`text-white/50 text-sm mt-4 transition-all duration-700 delay-700 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    {topServer.messages.toLocaleString()} messages sent here
                </p>
            </div>
        </div>
    );
}
