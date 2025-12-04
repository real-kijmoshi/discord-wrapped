export default function ActivityTimelineStory({ data }) {
    const hourlyActivity = data?.hourlyActivity || new Array(24).fill(0);
    const maxActivity = Math.max(...hourlyActivity);
    const mostActiveHour = data?.mostActiveHour || 0;

    const getPersonality = (hour) => {
        if (hour >= 22 || hour < 6) return { type: '🦉 Night Owl', desc: 'The world sleeps, you chat' };
        if (hour >= 6 && hour < 12) return { type: '🌅 Early Bird', desc: 'Starting strong!' };
        if (hour >= 12 && hour < 17) return { type: '☀️ Afternoon Warrior', desc: 'Peak productivity hours' };
        return { type: '🌆 Evening Person', desc: 'Winding down with friends' };
    };

    const personality = getPersonality(mostActiveHour);

    return (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23] text-white p-6 relative">
            {/* Decorative dots */}
            <div className="absolute top-20 right-10 w-4 h-4 bg-[#c9f31d] rounded-full opacity-60" />
            <div className="absolute bottom-32 left-8 w-3 h-3 bg-[#c9f31d] rounded-full opacity-40" />
            
            <div className="w-full max-w-lg relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-black mb-2">Your Day on Discord</h2>
                    <p className="text-gray-400 text-lg">Activity by hour</p>
                </div>
                
                {/* Activity bars */}
                <div className="flex items-end justify-between h-36 gap-0.5 mb-4 px-2">
                    {hourlyActivity.map((count, hour) => (
                        <div key={hour} className="flex-1 flex flex-col items-center">
                            <div 
                                className="w-full rounded-t transition-all duration-500"
                                style={{ 
                                    height: `${maxActivity > 0 ? (count / maxActivity) * 100 : 0}%`, 
                                    minHeight: count > 0 ? '4px' : '2px',
                                    backgroundColor: hour === mostActiveHour ? '#c9f31d' : 'rgba(201, 243, 29, 0.3)'
                                }}
                            />
                        </div>
                    ))}
                </div>
                
                {/* Time labels */}
                <div className="flex justify-between text-xs text-gray-500 px-2 mb-8">
                    <span>12am</span>
                    <span>6am</span>
                    <span>12pm</span>
                    <span>6pm</span>
                    <span>11pm</span>
                </div>
                
                {/* Personality badge */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                    <p className="text-gray-400 mb-2">You're a</p>
                    <p className="text-3xl font-black text-[#c9f31d] mb-2">{personality.type}</p>
                    <p className="text-gray-400">{personality.desc}</p>
                </div>
            </div>
        </div>
    );
}
