import { useEffect, useState } from 'react';

export default function GuildExplorerStory({ data }) {
    const [animate, setAnimate] = useState(false);
    const servers = data?.servers || [];
    
    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
    }, []);

    const totalServers = servers.length;
    const serversWithMessages = servers.filter(s => s.messageCount > 0);
    const activeServers = serversWithMessages.length;
    
    // Sort by messages
    const topServers = [...serversWithMessages]
        .sort((a, b) => b.messageCount - a.messageCount)
        .slice(0, 5);
    
    const totalServerMessages = servers.reduce((acc, s) => acc + (s.messageCount || 0), 0);
    
    // Explorer rank
    const getRank = () => {
        if (totalServers >= 50) return { rank: 'Legendary Explorer', emoji: '🏆', color: '#FFD700' };
        if (totalServers >= 30) return { rank: 'Master Explorer', emoji: '🌟', color: '#C0C0C0' };
        if (totalServers >= 15) return { rank: 'Adventurer', emoji: '⚔️', color: '#CD7F32' };
        if (totalServers >= 5) return { rank: 'Traveler', emoji: '🧭', color: '#5865F2' };
        return { rank: 'Homebody', emoji: '🏠', color: '#57F287' };
    };
    
    const rank = getRank();

    return (
        <div className="flex flex-col items-center justify-center h-full text-white p-6 relative overflow-hidden"
            style={{ backgroundColor: '#2D2D2D' }}>
            {/* Server icons floating */}
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className={`absolute w-10 h-10 rounded-xl bg-white/10 transition-all duration-1000`}
                    style={{
                        top: `${10 + (i % 3) * 30}%`,
                        left: i < 3 ? '5%' : '85%',
                        transform: animate ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(45deg)',
                        opacity: animate ? 0.2 : 0,
                        transitionDelay: `${i * 100}ms`
                    }}
                />
            ))}
            
            <div className={`relative z-10 w-full max-w-sm text-center transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className={`text-5xl mb-2 transition-all duration-700 delay-200 ${animate ? 'scale-100' : 'scale-0'}`}>
                    {rank.emoji}
                </div>
                
                <p className="text-sm font-bold tracking-wider mb-4" style={{ color: rank.color }}>
                    {rank.rank.toUpperCase()}
                </p>
                
                <div className={`transition-all duration-700 delay-300 ${animate ? 'scale-100' : 'scale-90'}`}>
                    <p className="text-6xl font-black">{totalServers}</p>
                    <p className="text-lg opacity-70">servers joined</p>
                </div>
                
                <p className={`text-sm opacity-50 mt-2 transition-all duration-700 delay-400 ${animate ? 'opacity-50' : 'opacity-0'}`}>
                    Active in {activeServers} servers
                </p>
                
                {/* Top servers */}
                {topServers.length > 0 && (
                    <div className={`mt-6 transition-all duration-700 delay-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                        <p className="text-sm opacity-70 mb-3">Your top servers</p>
                        <div className="space-y-2">
                            {topServers.map((server, index) => (
                                <div 
                                    key={index}
                                    className={`flex items-center bg-white/5 rounded-lg p-2 transition-all duration-500`}
                                    style={{
                                        transitionDelay: `${600 + index * 100}ms`,
                                        transform: animate ? 'translateX(0)' : 'translateX(-20px)',
                                        opacity: animate ? 1 : 0
                                    }}
                                >
                                    <div 
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                                        style={{ backgroundColor: rank.color + '40' }}
                                    >
                                        {index + 1}
                                    </div>
                                    <span className="flex-1 text-left ml-3 text-sm truncate font-medium">
                                        {server.name || 'Unknown Server'}
                                    </span>
                                    <span className="text-xs opacity-70">
                                        {server.messageCount?.toLocaleString()} msgs
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Total server messages */}
                <div className={`mt-4 bg-white/10 rounded-xl p-3 transition-all duration-700 delay-700 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-xs opacity-70">Total server messages</p>
                    <p className="text-xl font-black">{totalServerMessages.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
