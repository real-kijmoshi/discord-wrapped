import { useEffect, useState } from 'react';

export default function VoicePartyStory({ data }) {
    const [animate, setAnimate] = useState(false);
    const voiceStats = data?.voiceStats || {};
    
    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
    }, []);

    const totalMinutes = Math.round((voiceStats.totalDuration || 0) / 60);
    const totalHours = Math.round(totalMinutes / 60);
    const totalSessions = voiceStats.totalSessions || 0;
    const avgSessionMinutes = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
    const longestSession = Math.round((voiceStats.longestSession || 0) / 60);
    
    // Fun comparisons
    const moviesWatched = Math.floor(totalMinutes / 120);
    const songsListened = Math.floor(totalMinutes / 3.5);

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#8E44AD] text-white p-6 relative overflow-hidden">
            {/* Sound waves */}
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className={`absolute left-1/2 top-1/2 border-2 border-white/20 rounded-full transition-all duration-1000`}
                    style={{
                        width: animate ? `${100 + i * 80}px` : '0px',
                        height: animate ? `${100 + i * 80}px` : '0px',
                        transform: 'translate(-50%, -50%)',
                        transitionDelay: `${i * 150}ms`,
                        opacity: animate ? 0.2 - i * 0.03 : 0
                    }}
                />
            ))}
            
            <div className={`relative z-10 w-full max-w-sm text-center transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className={`text-6xl mb-4 transition-all duration-700 delay-200 ${animate ? 'scale-100' : 'scale-0'}`}>
                    🎤
                </div>
                
                <p className="text-sm font-bold tracking-wider mb-2 opacity-70">YOU SPENT</p>
                
                <div className={`transition-all duration-700 delay-300 ${animate ? 'scale-100' : 'scale-90'}`}>
                    <p className="text-6xl font-black">{totalHours.toLocaleString()}</p>
                    <p className="text-xl opacity-70">hours in voice chat</p>
                </div>
                
                {/* Stats grid */}
                <div className={`grid grid-cols-2 gap-3 mt-6 mb-6 transition-all duration-700 delay-400 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="bg-white/10 rounded-xl p-3">
                        <p className="text-2xl font-black">{totalSessions}</p>
                        <p className="text-xs opacity-70">voice sessions</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                        <p className="text-2xl font-black">{avgSessionMinutes}</p>
                        <p className="text-xs opacity-70">avg mins/session</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 col-span-2">
                        <p className="text-sm opacity-70">Longest session</p>
                        <p className="text-2xl font-black">{longestSession} minutes</p>
                    </div>
                </div>
                
                {/* Fun comparisons */}
                <div className={`space-y-2 transition-all duration-700 delay-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-sm opacity-70">That's like...</p>
                    <div className="flex justify-center gap-4 text-sm">
                        <div className="bg-white/10 rounded-lg px-3 py-2">
                            <span className="text-lg">🎬</span> {moviesWatched} movies
                        </div>
                        <div className="bg-white/10 rounded-lg px-3 py-2">
                            <span className="text-lg">🎵</span> {songsListened.toLocaleString()} songs
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
