import { useEffect, useState } from 'react';

export default function ReactionKingStory({ data }) {
    const [animate, setAnimate] = useState(false);
    // Use emojis data (which is emoji counts from messages)
    const reactions = data?.emojis || {};
    
    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
    }, []);

    // Sort reactions by count
    const sortedReactions = Object.entries(reactions)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
    const topReaction = sortedReactions[0] || ['❤️', 0];
    const maxCount = topReaction[1];
    
    // Determine personality based on top emoji
    const getPersonality = (emoji) => {
        if (['😂', '🤣', '💀', '😭'].includes(emoji)) return { title: 'Comedy King', desc: 'You appreciate humor!' };
        if (['❤️', '🥰', '😍', '💕'].includes(emoji)) return { title: 'Love Spreader', desc: 'You show the love!' };
        if (['👍', '✅', '👏'].includes(emoji)) return { title: 'The Approver', desc: 'You support your friends!' };
        if (['🔥', '💯', '⚡'].includes(emoji)) return { title: 'Hype Master', desc: "You're always hyping!" };
        if (['😢', '😔', '🥺'].includes(emoji)) return { title: 'Empathetic Soul', desc: 'You feel with others!' };
        return { title: 'Reaction Master', desc: 'Your style is unique!' };
    };
    
    const personality = getPersonality(topReaction[0]);

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#FFC300] text-[#1a1a2e] p-6 relative overflow-hidden">
            {/* Floating reactions */}
            {sortedReactions.slice(0, 3).map(([emoji], i) => (
                <div 
                    key={i}
                    className={`absolute text-4xl transition-all duration-1000`}
                    style={{
                        top: `${20 + i * 25}%`,
                        left: i % 2 === 0 ? '10%' : '80%',
                        transform: animate ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0)',
                        transitionDelay: `${i * 200}ms`,
                        opacity: animate ? 0.3 : 0
                    }}
                >
                    {emoji}
                </div>
            ))}
            
            <div className={`relative z-10 w-full max-w-sm text-center transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {/* Crown animation */}
                <div className={`text-6xl mb-2 transition-all duration-700 delay-200 ${animate ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
                    👑
                </div>
                
                <p className="text-sm font-bold tracking-wider mb-1 opacity-70">{personality.title.toUpperCase()}</p>
                
                {/* Giant emoji */}
                <div className={`text-8xl my-4 transition-all duration-700 delay-300 ${animate ? 'scale-100' : 'scale-0'}`}>
                    {topReaction[0]}
                </div>
                
                <p className={`text-lg font-bold mb-6 transition-all duration-700 delay-400 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    {personality.desc}
                </p>
                
                {/* Top 5 reactions */}
                <div className="space-y-2">
                    {sortedReactions.map(([emoji, count], index) => (
                        <div 
                            key={index}
                            className={`flex items-center bg-black/10 rounded-lg p-2 transition-all duration-500`}
                            style={{
                                transitionDelay: `${500 + index * 100}ms`,
                                transform: animate ? 'translateX(0)' : 'translateX(-20px)',
                                opacity: animate ? 1 : 0
                            }}
                        >
                            <span className="text-2xl mr-3">{emoji}</span>
                            <div className="flex-1 bg-black/10 rounded-full h-4 overflow-hidden">
                                <div 
                                    className="h-full bg-[#1a1a2e] rounded-full transition-all duration-1000"
                                    style={{
                                        width: animate ? `${(count / maxCount) * 100}%` : '0%',
                                        transitionDelay: `${600 + index * 100}ms`
                                    }}
                                />
                            </div>
                            <span className="ml-3 font-bold text-sm w-12 text-right">{count.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
                
                <p className={`text-sm mt-4 font-bold transition-all duration-700 delay-700 ${animate ? 'opacity-70' : 'opacity-0'}`}>
                    {totalReactions.toLocaleString()} total reactions
                </p>
            </div>
        </div>
    );
}
