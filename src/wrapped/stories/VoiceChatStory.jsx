export default function VoiceChatStory({ data }) {
    const voiceMinutes = data?.voiceMinutes || 0;
    const voiceCallCount = data?.voiceCallCount || 0;
    const hours = Math.floor(voiceMinutes / 60);
    const minutes = voiceMinutes % 60;
    const hasRealData = voiceMinutes > 0;

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#1e1e2e] text-white p-8 relative overflow-hidden">
            {/* Sound wave decorations */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <div 
                        key={i} 
                        className="w-2 mx-1 bg-[#c9f31d] rounded-full"
                        style={{ 
                            height: `${Math.sin(i * 0.5) * 80 + 100}px`,
                        }} 
                    />
                ))}
            </div>
            
            {/* Decorative circles */}
            <div className="absolute top-16 left-16 w-20 h-20 border-2 border-[#c9f31d]/30 rounded-full" />
            <div className="absolute bottom-24 right-12 w-32 h-32 border-2 border-[#c9f31d]/20 rounded-full" />
            
            <div className="relative z-10 text-center">
                <div className="text-8xl mb-8">🎧</div>
                <h2 className="text-2xl font-medium text-gray-400 mb-4">All time, you spent</h2>
                
                {hasRealData ? (
                    <>
                        <div className="flex items-baseline justify-center gap-2 mb-2">
                            <span className="text-8xl font-black text-[#c9f31d]">{hours}</span>
                            <span className="text-3xl font-bold text-[#c9f31d]">h</span>
                            {minutes > 0 && (
                                <>
                                    <span className="text-5xl font-black text-[#c9f31d] ml-2">{minutes}</span>
                                    <span className="text-2xl font-bold text-[#c9f31d]">m</span>
                                </>
                            )}
                        </div>
                        
                        <h2 className="text-2xl font-medium text-gray-400 mb-4">in voice chats</h2>
                        
                        {voiceCallCount > 0 && (
                            <p className="text-lg text-white/60 mb-6">
                                across <span className="text-[#c9f31d] font-bold">{voiceCallCount.toLocaleString()}</span> calls
                            </p>
                        )}
                        
                        {hours > 100 ? (
                            <p className="text-xl text-white/80">You're basically a podcast host! 🎙️</p>
                        ) : hours > 50 ? (
                            <p className="text-xl text-white/80">Social butterfly alert! 🦋</p>
                        ) : hours > 10 ? (
                            <p className="text-xl text-white/80">Love those voice hangs! 💬</p>
                        ) : hours > 0 ? (
                            <p className="text-xl text-white/80">Quality over quantity! 🎯</p>
                        ) : (
                            <p className="text-xl text-white/80">Text is more your vibe! 📝</p>
                        )}
                    </>
                ) : (
                    <>
                        <p className="text-4xl font-black text-[#c9f31d] mb-4">No voice data</p>
                        <p className="text-lg text-white/60">Voice analytics not found in your data package</p>
                    </>
                )}
            </div>
        </div>
    );
}
