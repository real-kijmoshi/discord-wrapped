import { useEffect, useState } from 'react';

export default function EmojiPersonalityStory({ data }) {
    const [animate, setAnimate] = useState(false);
    const topEmojis = data?.topEmojis || [];
    
    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
    }, []);

    // Analyze emoji personality based on top emojis
    const getEmojiPersonality = () => {
        // Check for different vibes
        const happyEmojis = ['😂', '🤣', '😊', '😄', '😁', '🥰', '😍', '💀', '😭'];
        const loveEmojis = ['❤️', '💕', '💗', '💖', '🥰', '😍', '💞', '😘'];
        const coolEmojis = ['😎', '🔥', '💯', '✨', '⭐', '🌟', '💫'];
        const funnyEmojis = ['💀', '☠️', '🤡', '😈', '👀', '🗿'];
        
        const happyCount = topEmojis.filter(e => happyEmojis.includes(e.emoji)).length;
        const loveCount = topEmojis.filter(e => loveEmojis.includes(e.emoji)).length;
        const coolCount = topEmojis.filter(e => coolEmojis.includes(e.emoji)).length;
        const funnyCount = topEmojis.filter(e => funnyEmojis.includes(e.emoji)).length;
        
        if (loveCount >= 2) return { type: 'The Romantic', desc: 'You spread love everywhere you go', color: '#FF6B9D', bg: '#2D132C' };
        if (funnyCount >= 2) return { type: 'The Comedian', desc: 'Your humor is unmatched', color: '#FFD93D', bg: '#1A1A2E' };
        if (coolCount >= 2) return { type: 'The Hype Beast', desc: 'Everything you touch turns to fire', color: '#FF6B35', bg: '#1E3D59' };
        if (happyCount >= 3) return { type: 'The Optimist', desc: 'Your positivity is contagious', color: '#6BCB77', bg: '#1B2430' };
        
        return { type: 'The Expressive', desc: 'You have an emoji for everything', color: '#9B59B6', bg: '#16213E' };
    };

    const personality = getEmojiPersonality();

    return (
        <div className="flex flex-col items-center justify-center h-full text-white p-6 relative overflow-hidden" style={{ backgroundColor: personality.bg }}>
            {/* Floating emojis background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {topEmojis.slice(0, 6).map((emoji, i) => (
                    <div
                        key={i}
                        className={`absolute text-4xl transition-all duration-1000 ${animate ? 'opacity-30' : 'opacity-0'}`}
                        style={{
                            top: `${10 + (i * 15)}%`,
                            left: `${5 + (i % 2) * 80}%`,
                            transform: animate ? 'translateY(0) rotate(0deg)' : 'translateY(20px) rotate(-10deg)',
                            transitionDelay: `${i * 150}ms`,
                        }}
                    >
                        {emoji.emoji}
                    </div>
                ))}
            </div>
            
            <div className={`relative z-10 text-center transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <p className="text-sm font-bold tracking-wider mb-4 opacity-70">YOUR EMOJI PERSONALITY</p>
                
                {/* Top emojis display */}
                <div className={`flex justify-center gap-2 mb-6 transition-all duration-700 delay-200 ${animate ? 'scale-100' : 'scale-90'}`}>
                    {topEmojis.slice(0, 5).map((emoji, i) => (
                        <span 
                            key={i} 
                            className="text-5xl"
                            style={{ 
                                animationDelay: `${i * 100}ms`,
                                animation: animate ? 'bounce 0.5s ease-out' : 'none'
                            }}
                        >
                            {emoji.emoji}
                        </span>
                    ))}
                </div>
                
                <h2 
                    className={`text-4xl font-black mb-3 transition-all duration-700 delay-400 ${animate ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
                    style={{ color: personality.color }}
                >
                    {personality.type}
                </h2>
                
                <p className={`text-white/70 text-lg mb-6 transition-all duration-700 delay-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    {personality.desc}
                </p>
                
                {/* Emoji stats */}
                <div className={`grid grid-cols-3 gap-3 transition-all duration-700 delay-600 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    {topEmojis.slice(0, 3).map((emoji, i) => (
                        <div key={i} className="bg-white/10 rounded-xl p-3 text-center">
                            <span className="text-3xl">{emoji.emoji}</span>
                            <p className="text-sm font-bold mt-1" style={{ color: personality.color }}>{emoji.count}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
