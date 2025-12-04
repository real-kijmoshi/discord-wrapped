import { useEffect, useState } from 'react';

export default function LinkSharerStory({ data }) {
    const [animate, setAnimate] = useState(false);
    const linkStats = data?.linkStats || { total: 0, domains: {} };
    
    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
    }, []);

    // Sort domains by count
    const sortedDomains = Object.entries(linkStats.domains || {})
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    const totalLinks = linkStats.total || 0;
    const maxCount = sortedDomains[0]?.[1] || 0;
    
    // Get emoji for domain
    const getDomainEmoji = (domain) => {
        if (domain.includes('youtube') || domain.includes('youtu.be')) return '📺';
        if (domain.includes('twitter') || domain.includes('x.com')) return '🐦';
        if (domain.includes('reddit')) return '🤖';
        if (domain.includes('instagram')) return '📸';
        if (domain.includes('tiktok')) return '🎵';
        if (domain.includes('spotify')) return '🎧';
        if (domain.includes('twitch')) return '🎮';
        if (domain.includes('github')) return '💻';
        if (domain.includes('imgur') || domain.includes('giphy')) return '🖼️';
        if (domain.includes('discord')) return '💬';
        return '🔗';
    };
    
    // Determine personality
    const getSharerType = () => {
        const topDomain = sortedDomains[0]?.[0] || '';
        if (topDomain.includes('youtube') || topDomain.includes('youtu.be')) return { type: 'Video Curator', desc: 'You love sharing videos!' };
        if (topDomain.includes('twitter') || topDomain.includes('x.com')) return { type: 'News Breaker', desc: 'First with the updates!' };
        if (topDomain.includes('reddit')) return { type: 'Meme Lord', desc: 'Reddit connoisseur!' };
        if (topDomain.includes('spotify')) return { type: 'Music DJ', desc: 'Spreading the beats!' };
        if (topDomain.includes('github')) return { type: 'Code Sharer', desc: 'Open source warrior!' };
        return { type: 'Link Master', desc: 'Sharing is caring!' };
    };
    
    const sharerType = getSharerType();

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#0A2463] text-white p-6 relative overflow-hidden">
            {/* Floating link icons */}
            {['🔗', '📎', '🌐'].map((emoji, i) => (
                <div
                    key={i}
                    className={`absolute text-3xl transition-all duration-1000`}
                    style={{
                        top: `${20 + i * 30}%`,
                        right: animate ? '10%' : '-10%',
                        opacity: animate ? 0.2 : 0,
                        transitionDelay: `${i * 200}ms`
                    }}
                >
                    {emoji}
                </div>
            ))}
            
            <div className={`relative z-10 w-full max-w-sm text-center transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className={`text-6xl mb-4 transition-all duration-700 delay-200 ${animate ? 'scale-100' : 'scale-0'}`}>
                    🔗
                </div>
                
                <p className="text-sm font-bold tracking-wider mb-1 opacity-70">{sharerType.type.toUpperCase()}</p>
                <p className="text-sm opacity-50 mb-4">{sharerType.desc}</p>
                
                <div className={`transition-all duration-700 delay-300 ${animate ? 'scale-100' : 'scale-90'}`}>
                    <p className="text-5xl font-black">{totalLinks.toLocaleString()}</p>
                    <p className="text-lg opacity-70">links shared</p>
                </div>
                
                {/* Top domains */}
                <div className="mt-6 space-y-2">
                    <p className={`text-sm opacity-70 mb-3 transition-all duration-700 delay-400 ${animate ? 'opacity-70' : 'opacity-0'}`}>
                        Your top sources
                    </p>
                    {sortedDomains.map(([domain, count], index) => (
                        <div 
                            key={index}
                            className={`flex items-center bg-white/10 rounded-lg p-3 transition-all duration-500`}
                            style={{
                                transitionDelay: `${500 + index * 100}ms`,
                                transform: animate ? 'translateX(0)' : 'translateX(-20px)',
                                opacity: animate ? 1 : 0
                            }}
                        >
                            <span className="text-2xl mr-3">{getDomainEmoji(domain)}</span>
                            <div className="flex-1 text-left">
                                <p className="text-sm font-bold truncate">{domain}</p>
                                <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
                                    <div 
                                        className="h-full bg-[#3E92CC] rounded-full transition-all duration-1000"
                                        style={{
                                            width: animate ? `${(count / maxCount) * 100}%` : '0%',
                                            transitionDelay: `${600 + index * 100}ms`
                                        }}
                                    />
                                </div>
                            </div>
                            <span className="ml-3 text-sm font-bold">{count}</span>
                        </div>
                    ))}
                </div>
                
                {sortedDomains.length === 0 && (
                    <p className={`mt-6 text-sm opacity-50 transition-all duration-700 delay-500 ${animate ? 'opacity-50' : 'opacity-0'}`}>
                        No link data found
                    </p>
                )}
            </div>
        </div>
    );
}
