export default function NightOwlStory({ data }) {
    const lateNight = data?.lateNightMessages || 0;
    const morning = data?.morningMessages || 0;
    const afternoon = data?.afternoonMessages || 0;
    const evening = data?.eveningMessages || 0;
    const total = lateNight + morning + afternoon + evening;
    
    const times = [
        { name: 'Late Night', count: lateNight, time: '12am-5am', emoji: '🌙', color: '#5865F2' },
        { name: 'Morning', count: morning, time: '5am-12pm', emoji: '🌅', color: '#FEE75C' },
        { name: 'Afternoon', count: afternoon, time: '12pm-6pm', emoji: '☀️', color: '#57F287' },
        { name: 'Evening', count: evening, time: '6pm-12am', emoji: '🌆', color: '#ED4245' },
    ];
    
    const sorted = [...times].sort((a, b) => b.count - a.count);
    const topTime = sorted[0];
    const nightOwlPercent = total > 0 ? Math.round((lateNight / total) * 100) : 0;

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#1a1a2e] text-white p-6 relative overflow-hidden">
            {/* Stars decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full opacity-60" />
                <div className="absolute top-32 right-20 w-1 h-1 bg-white rounded-full opacity-40" />
                <div className="absolute top-16 right-32 w-2 h-2 bg-white rounded-full opacity-50" />
                <div className="absolute bottom-40 left-20 w-1 h-1 bg-white rounded-full opacity-40" />
                <div className="absolute bottom-32 right-16 w-2 h-2 bg-white rounded-full opacity-60" />
            </div>
            
            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-6">
                    <div className="text-6xl mb-3">{topTime.emoji}</div>
                    <h2 className="text-4xl font-black">Time of Day</h2>
                </div>
                
                <div className="space-y-3 mb-6">
                    {times.map((time, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                            <div className="text-3xl">{time.emoji}</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold">{time.name}</span>
                                    <span className="text-sm opacity-60">{time.time}</span>
                                </div>
                                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full"
                                        style={{ 
                                            width: total > 0 ? `${(time.count / total) * 100}%` : '0%', 
                                            backgroundColor: time.color 
                                        }} 
                                    />
                                </div>
                            </div>
                            <div className="text-right font-black w-16" style={{ color: time.color }}>
                                {time.count.toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="bg-white/10 rounded-2xl p-5 text-center">
                    <p className="text-lg">
                        {nightOwlPercent >= 20 
                            ? `${nightOwlPercent}% late night chatter! 🦉`
                            : topTime.name === 'Morning'
                            ? "Early bird gets the messages! 🐦"
                            : topTime.name === 'Evening'
                            ? "Evening socialite! 🌃"
                            : "Afternoon productivity! ☀️"
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}
