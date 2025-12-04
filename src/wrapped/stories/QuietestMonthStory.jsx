import { useEffect, useState } from 'react';

// Pre-calculated durations (deterministic for React Compiler)
const SNOW_DURATIONS = [2.3, 3.1, 2.8, 3.5, 2.1, 3.8, 2.6, 3.3, 2.4, 3.7, 2.9, 3.2, 2.5, 3.6, 2.2];

export default function QuietestMonthStory({ data }) {
    const [animate, setAnimate] = useState(false);
    const monthlyStats = data?.messagesByMonth || {};
    
    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
    }, []);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthData = months.map((name, i) => ({
        name,
        count: monthlyStats[i + 1] || 0
    }));
    
    const maxMonth = monthData.reduce((a, b) => a.count > b.count ? a : b);
    const minMonth = monthData.filter(m => m.count > 0).reduce((a, b) => a.count < b.count ? a : b, monthData[0]);
    const maxCount = maxMonth.count;
    const totalMessages = monthData.reduce((acc, m) => acc + m.count, 0);
    const avgPerMonth = Math.round(totalMessages / 12);

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#2C3E50] text-white p-6 relative overflow-hidden">
            {/* Snow effect for quiet theme */}
            {SNOW_DURATIONS.map((duration, i) => (
                <div
                    key={i}
                    className={`absolute w-2 h-2 bg-white/30 rounded-full transition-all duration-1000`}
                    style={{
                        top: animate ? '110%' : '-10%',
                        left: `${5 + (i * 6.5)}%`,
                        transitionDelay: `${i * 100}ms`,
                        transitionDuration: `${duration}s`
                    }}
                />
            ))}
            
            <div className={`relative z-10 w-full max-w-sm transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <p className="text-sm font-bold tracking-wider mb-4 text-center opacity-70">YOUR YEAR IN MESSAGES</p>
                
                {/* Mini bar chart */}
                <div className="flex items-end justify-between h-32 mb-6 px-1">
                    {monthData.map((month, i) => (
                        <div key={i} className="flex flex-col items-center flex-1">
                            <div 
                                className={`w-full mx-0.5 rounded-t transition-all duration-700 ${month === maxMonth ? 'bg-[#27AE60]' : month === minMonth ? 'bg-[#E74C3C]' : 'bg-white/30'}`}
                                style={{
                                    height: animate ? `${maxCount > 0 ? (month.count / maxCount) * 100 : 0}%` : '0%',
                                    transitionDelay: `${200 + i * 50}ms`,
                                    minHeight: month.count > 0 ? '4px' : '0'
                                }}
                            />
                            <span className="text-[8px] mt-1 opacity-50">{month.name}</span>
                        </div>
                    ))}
                </div>
                
                {/* Stats comparison */}
                <div className={`grid grid-cols-2 gap-4 mb-6 transition-all duration-700 delay-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="bg-[#27AE60]/20 rounded-xl p-4 text-center border border-[#27AE60]/30">
                        <span className="text-3xl">🔥</span>
                        <p className="text-sm font-bold opacity-70 mt-1">Busiest</p>
                        <p className="text-xl font-black text-[#27AE60]">{maxMonth.name}</p>
                        <p className="text-xs opacity-50">{maxMonth.count.toLocaleString()} msgs</p>
                    </div>
                    
                    <div className="bg-[#E74C3C]/20 rounded-xl p-4 text-center border border-[#E74C3C]/30">
                        <span className="text-3xl">🤫</span>
                        <p className="text-sm font-bold opacity-70 mt-1">Quietest</p>
                        <p className="text-xl font-black text-[#E74C3C]">{minMonth.name}</p>
                        <p className="text-xs opacity-50">{minMonth.count.toLocaleString()} msgs</p>
                    </div>
                </div>
                
                {/* Difference */}
                <div className={`bg-white/10 rounded-xl p-4 text-center transition-all duration-700 delay-600 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-xs opacity-70">Difference between busiest and quietest</p>
                    <p className="text-3xl font-black text-[#F39C12]">{(maxMonth.count - minMonth.count).toLocaleString()}</p>
                    <p className="text-xs opacity-50">messages • avg {avgPerMonth.toLocaleString()}/month</p>
                </div>
            </div>
        </div>
    );
}
