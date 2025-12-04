import { useMemo } from 'react';

export default function EmojiStory({ data }) {
    const topEmojis = data?.topEmojis || [];

    const getEmojiPersonality = (emoji) => {
        if (['😂', '🤣', '😆', '💀', '😭'].includes(emoji)) return "You're the funny one! 🎭";
        if (['❤️', '💕', '💖', '🥰', '😍'].includes(emoji)) return "Spreading love everywhere! 💝";
        if (['👍', '👌', '✅', '💯'].includes(emoji)) return "The supportive friend! 🤝";
        if (['🔥', '⚡', '💪', '🙌'].includes(emoji)) return "Full of energy! ⚡";
        if (['😊', '🙂', '☺️', '😄'].includes(emoji)) return "Always positive! ✨";
        return "Your emoji game is unique! 🌟";
    };

    // Pre-calculate stable positions for floating emojis
    const floatingPositions = useMemo(() => {
        return topEmojis.slice(0, 6).map((_, i) => ({
            top: `${15 + (i * 13) % 60}%`,
            left: `${5 + (i * 17) % 80}%`,
            rotate: `${(i * 23) % 40 - 20}deg`
        }));
    }, [topEmojis]);

    if (topEmojis.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#FEE75C] text-black p-8">
                <div className="text-6xl mb-6">😶</div>
                <h2 className="text-3xl font-black mb-4">No Emoji Data</h2>
                <p className="opacity-70">No emoji usage found in 2025</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#FEE75C] text-black p-8 relative overflow-hidden">
            {/* Floating emoji decorations */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
                {topEmojis.slice(0, 6).map((item, i) => (
                    <span 
                        key={i} 
                        className="absolute text-4xl"
                        style={{
                            top: floatingPositions[i]?.top,
                            left: floatingPositions[i]?.left,
                            transform: `rotate(${floatingPositions[i]?.rotate})`
                        }}
                    >
                        {item.emoji}
                    </span>
                ))}
            </div>
            
            <div className="relative z-10 text-center">
                <h2 className="text-4xl font-black mb-2">Your Emoji Vibe</h2>
                <p className="opacity-70 mb-8 text-lg">Most used in 2025</p>
                
                {/* Top emoji showcase */}
                <div className="flex justify-center items-end gap-4 mb-8">
                    {topEmojis.slice(0, 5).map((item, i) => (
                        <div 
                            key={i} 
                            className="flex flex-col items-center"
                        >
                            <span 
                                className="mb-2"
                                style={{ fontSize: `${70 - i * 10}px` }}
                            >
                                {item.emoji}
                            </span>
                            <span className="font-black text-lg bg-black/10 px-3 py-1 rounded-full">
                                {item.count.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
                
                {/* Personality badge */}
                <div className="bg-black text-[#FEE75C] rounded-2xl p-5 max-w-sm mx-auto">
                    <p className="text-xl font-black">
                        {getEmojiPersonality(topEmojis[0]?.emoji)}
                    </p>
                </div>
            </div>
        </div>
    );
}
