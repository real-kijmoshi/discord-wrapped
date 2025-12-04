import { useEffect, useState } from 'react';

export default function WeekendWarriorStory({ data }) {
    const [animate, setAnimate] = useState(false);
    const dayStats = data?.messagesByDayOfWeek || [];
    
    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
    }, []);

    // Calculate weekday vs weekend
    const weekdayTotal = dayStats.slice(1, 6).reduce((a, b) => a + b, 0); // Mon-Fri
    const weekendTotal = dayStats[0] + dayStats[6]; // Sun + Sat
    const total = weekdayTotal + weekendTotal;
    
    const weekdayPercent = total > 0 ? Math.round((weekdayTotal / total) * 100) : 50;
    const weekendPercent = total > 0 ? Math.round((weekendTotal / total) * 100) : 50;
    
    const isWeekendWarrior = weekendPercent > weekdayPercent;
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const busiestDay = dayStats.indexOf(Math.max(...dayStats));
    const maxMessages = Math.max(...dayStats);

    return (
        <div className={`flex flex-col items-center justify-center h-full text-white p-6 relative overflow-hidden ${isWeekendWarrior ? 'bg-[#7B2CBF]' : 'bg-[#2D3436]'}`}>
            {/* Decorative elements */}
            <div className={`absolute top-10 right-10 w-20 h-20 rounded-full transition-all duration-1000 ${animate ? 'scale-100 opacity-20' : 'scale-0 opacity-0'}`} style={{ backgroundColor: isWeekendWarrior ? '#E0AAFF' : '#74C0FC' }} />
            
            <div className={`relative z-10 w-full max-w-sm text-center transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="text-6xl mb-4">{isWeekendWarrior ? '🎉' : '💼'}</div>
                <p className="text-sm font-bold tracking-wider mb-2 opacity-70">YOU ARE A</p>
                
                <h2 className={`text-4xl font-black mb-6 transition-all duration-700 delay-200 ${animate ? 'scale-100' : 'scale-90'}`}>
                    {isWeekendWarrior ? 'Weekend Warrior' : 'Weekday Warrior'}
                </h2>
                
                {/* Bar comparison */}
                <div className={`flex gap-4 justify-center mb-6 transition-all duration-700 delay-300 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="text-center">
                        <div className="w-24 bg-white/20 rounded-full h-32 relative overflow-hidden">
                            <div 
                                className="absolute bottom-0 w-full bg-[#74C0FC] rounded-full transition-all duration-1000 delay-500"
                                style={{ height: animate ? `${weekdayPercent}%` : '0%' }}
                            />
                        </div>
                        <p className="mt-2 font-bold">{weekdayPercent}%</p>
                        <p className="text-xs opacity-70">Weekdays</p>
                    </div>
                    <div className="text-center">
                        <div className="w-24 bg-white/20 rounded-full h-32 relative overflow-hidden">
                            <div 
                                className="absolute bottom-0 w-full bg-[#E0AAFF] rounded-full transition-all duration-1000 delay-500"
                                style={{ height: animate ? `${weekendPercent}%` : '0%' }}
                            />
                        </div>
                        <p className="mt-2 font-bold">{weekendPercent}%</p>
                        <p className="text-xs opacity-70">Weekends</p>
                    </div>
                </div>
                
                {/* Busiest day */}
                <div className={`bg-white/10 rounded-xl p-4 transition-all duration-700 delay-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-sm opacity-70">Your busiest day is</p>
                    <p className="text-2xl font-black">{dayNames[busiestDay]}</p>
                    <p className="text-xs opacity-50">{maxMessages.toLocaleString()} messages</p>
                </div>
            </div>
        </div>
    );
}
