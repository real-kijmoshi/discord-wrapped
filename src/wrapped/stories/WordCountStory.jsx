import { useEffect, useState } from 'react';

export default function WordCountStory({ data }) {
    const [animate, setAnimate] = useState(false);
    const totalWords = data?.totalWords || 0;
    const totalMessages = data?.totalMessages || 0;
    
    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
    }, []);

    const avgWordsPerMessage = totalMessages > 0 ? (totalWords / totalMessages).toFixed(1) : 0;
    
    // Fun comparisons
    const harryPotterWords = 77325; // Philosopher's Stone
    const booksWritten = (totalWords / harryPotterWords).toFixed(1);
    const tweetWords = 40; // avg tweet
    const tweetsWritten = Math.round(totalWords / tweetWords);
    
    // Personality based on avg words
    const getChatterType = () => {
        if (avgWordsPerMessage >= 20) return { type: 'Storyteller', emoji: '📚', desc: 'You write novels!' };
        if (avgWordsPerMessage >= 10) return { type: 'Conversationalist', emoji: '💬', desc: 'Detailed and clear!' };
        if (avgWordsPerMessage >= 5) return { type: 'Casual Chatter', emoji: '😎', desc: 'Just right!' };
        return { type: 'Quick Typer', emoji: '⚡', desc: 'Short and sweet!' };
    };
    
    const chatterType = getChatterType();

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#1B4332] text-white p-6 relative overflow-hidden">
            {/* Floating words */}
            {['hello', 'lol', 'nice', 'yes', 'wow'].map((word, i) => (
                <div
                    key={i}
                    className={`absolute text-sm font-bold opacity-0 transition-all duration-1000`}
                    style={{
                        top: `${15 + i * 18}%`,
                        left: i % 2 === 0 ? '5%' : '85%',
                        opacity: animate ? 0.15 : 0,
                        transform: animate ? 'translateY(0)' : 'translateY(20px)',
                        transitionDelay: `${i * 150}ms`
                    }}
                >
                    {word}
                </div>
            ))}
            
            <div className={`relative z-10 w-full max-w-sm text-center transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className={`text-5xl mb-4 transition-all duration-700 delay-200 ${animate ? 'scale-100' : 'scale-0'}`}>
                    {chatterType.emoji}
                </div>
                
                <p className="text-sm font-bold tracking-wider mb-1 opacity-70">{chatterType.type.toUpperCase()}</p>
                <p className="text-sm opacity-50 mb-6">{chatterType.desc}</p>
                
                <div className={`transition-all duration-700 delay-300 ${animate ? 'scale-100' : 'scale-90'}`}>
                    <p className="text-6xl font-black">{totalWords.toLocaleString()}</p>
                    <p className="text-xl opacity-70">words typed</p>
                </div>
                
                {/* Stats */}
                <div className={`mt-6 bg-white/10 rounded-xl p-4 transition-all duration-700 delay-400 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-sm opacity-70">Average per message</p>
                    <p className="text-3xl font-black">{avgWordsPerMessage}</p>
                    <p className="text-xs opacity-50">words</p>
                </div>
                
                {/* Fun comparisons */}
                <div className={`mt-4 grid grid-cols-2 gap-3 transition-all duration-700 delay-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="bg-white/10 rounded-xl p-3">
                        <span className="text-2xl">📖</span>
                        <p className="text-xl font-black mt-1">{booksWritten}</p>
                        <p className="text-xs opacity-70">Harry Potter books</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                        <span className="text-2xl">🐦</span>
                        <p className="text-xl font-black mt-1">{tweetsWritten.toLocaleString()}</p>
                        <p className="text-xs opacity-70">tweets equivalent</p>
                    </div>
                </div>
                
                {/* Characters stat */}
                <p className={`mt-4 text-sm opacity-50 transition-all duration-700 delay-600 ${animate ? 'opacity-50' : 'opacity-0'}`}>
                    ~{(totalWords * 5).toLocaleString()} characters typed
                </p>
            </div>
        </div>
    );
}
