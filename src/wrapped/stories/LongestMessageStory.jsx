import { useEffect, useState } from 'react';

export default function LongestMessageStory({ data }) {
    const [animate, setAnimate] = useState(false);
    const longestMessage = data?.longestMessage || { content: '', length: 0, channel: 'Unknown' };
    
    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
    }, []);

    // Truncate for display
    const displayContent = longestMessage.content.length > 200 
        ? longestMessage.content.substring(0, 200) + '...' 
        : longestMessage.content;
    
    // Fun comparison
    const wordCount = longestMessage.content.split(/\s+/).filter(w => w.length > 0).length;
    const tweetLength = 280;
    const tweetsEquivalent = Math.ceil(longestMessage.length / tweetLength);

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#1E1E2E] text-white p-6 relative overflow-hidden">
            {/* Typing dots animation */}
            <div className={`absolute top-16 left-8 flex gap-1 transition-all duration-500 ${animate ? 'opacity-60' : 'opacity-0'}`}>
                <span className="w-3 h-3 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-3 h-3 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-3 h-3 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            
            <div className={`relative z-10 w-full max-w-sm transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <p className="text-sm font-bold tracking-wider mb-2 opacity-70 text-center">YOUR LONGEST MESSAGE</p>
                
                {/* Message bubble */}
                <div className={`bg-[#5865F2] rounded-2xl rounded-bl-sm p-4 shadow-lg transition-all duration-700 delay-200 ${animate ? 'scale-100' : 'scale-95'}`}>
                    <p className="text-sm leading-relaxed break-words">{displayContent}</p>
                </div>
                
                {/* Stats */}
                <div className={`mt-6 space-y-3 transition-all duration-700 delay-400 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <span className="text-2xl">📝</span>
                        <div className="text-right">
                            <p className="text-2xl font-black text-[#5865F2]">{longestMessage.length.toLocaleString()}</p>
                            <p className="text-xs opacity-70">characters</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <span className="text-2xl">💬</span>
                        <div className="text-right">
                            <p className="text-2xl font-black text-[#EB459E]">{wordCount}</p>
                            <p className="text-xs opacity-70">words</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <span className="text-2xl">🐦</span>
                        <div className="text-right">
                            <p className="text-2xl font-black text-[#1DA1F2]">{tweetsEquivalent}</p>
                            <p className="text-xs opacity-70">tweets equivalent</p>
                        </div>
                    </div>
                </div>
                
                <p className="text-xs text-center mt-4 opacity-50">in {longestMessage.channel}</p>
            </div>
        </div>
    );
}
