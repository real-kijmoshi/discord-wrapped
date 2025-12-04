import { useEffect, useState } from 'react';

export default function MessageSpeedStory({ data }) {
    const [animate, setAnimate] = useState(false);
    const [count, setCount] = useState(0);
    
    const avgPerDay = data?.avgMessagesPerDay || 0;
    const avgPerHour = Math.round(avgPerDay / 24);
    const peakHour = data?.mostActiveHour || 0;
    
    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
        
        // Animate counter
        if (avgPerDay > 0) {
            const duration = 1500;
            const steps = 30;
            const increment = avgPerDay / steps;
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= avgPerDay) {
                    setCount(avgPerDay);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);
            return () => clearInterval(timer);
        }
    }, [avgPerDay]);

    // Determine typing speed personality
    const getSpeedTier = () => {
        if (avgPerDay > 200) return { tier: 'Speed Demon', emoji: '⚡', color: '#FF6B6B' };
        if (avgPerDay > 100) return { tier: 'Fast Typer', emoji: '🏃', color: '#FFA94D' };
        if (avgPerDay > 50) return { tier: 'Steady Chatter', emoji: '💬', color: '#69DB7C' };
        if (avgPerDay > 20) return { tier: 'Thoughtful', emoji: '🤔', color: '#74C0FC' };
        return { tier: 'Quality Over Quantity', emoji: '💎', color: '#B197FC' };
    };

    const speed = getSpeedTier();

    return (
        <div className="flex flex-col items-center justify-center h-full text-white p-6 relative overflow-hidden" style={{ backgroundColor: '#1A1A2E' }}>
            {/* Animated speed lines */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000`}
                        style={{
                            top: `${15 + i * 10}%`,
                            left: animate ? '100%' : '-100%',
                            width: '200%',
                            transitionDelay: `${i * 100}ms`,
                        }}
                    />
                ))}
            </div>
            
            <div className={`relative z-10 text-center transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="text-6xl mb-4">{speed.emoji}</div>
                <p className="text-white/60 text-lg mb-2">Your typing speed is</p>
                <h2 className="text-4xl font-black mb-6" style={{ color: speed.color }}>{speed.tier}</h2>
                
                <div className={`bg-white/10 rounded-2xl p-6 mb-6 transition-all duration-700 delay-300 ${animate ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                    <p className="text-6xl font-black" style={{ color: speed.color }}>{count}</p>
                    <p className="text-white/60 mt-2">messages per active day</p>
                </div>
                
                <div className={`flex gap-4 justify-center transition-all duration-700 delay-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold" style={{ color: speed.color }}>~{avgPerHour}</p>
                        <p className="text-white/50 text-xs">per hour</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold" style={{ color: speed.color }}>{peakHour}:00</p>
                        <p className="text-white/50 text-xs">peak hour</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
