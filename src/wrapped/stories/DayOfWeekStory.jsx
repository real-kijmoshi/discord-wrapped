export default function DayOfWeekStory({ data }) {
    const dayOfWeekData = data?.messagesByDayOfWeek || new Array(7).fill(0);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const maxMessages = Math.max(...dayOfWeekData);
    const topDayIndex = dayOfWeekData.indexOf(maxMessages);
    const topDay = fullDays[topDayIndex];

    const isWeekend = topDayIndex === 0 || topDayIndex === 6;

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#9B59B6] text-white p-6 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-16 left-12 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute bottom-20 right-16 w-32 h-32 bg-white/5 rounded-full" />
            
            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-6">
                    <div className="text-6xl mb-3">📅</div>
                    <h2 className="text-4xl font-black">Your Week</h2>
                </div>
                
                {/* Day bars */}
                <div className="flex items-end justify-between h-32 gap-2 mb-3">
                    {dayOfWeekData.map((count, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                            <div 
                                className="w-full rounded-t-lg transition-all duration-500"
                                style={{ 
                                    height: `${maxMessages > 0 ? (count / maxMessages) * 100 : 0}%`, 
                                    minHeight: count > 0 ? '8px' : '4px',
                                    backgroundColor: i === topDayIndex ? '#fff' : 'rgba(255,255,255,0.3)'
                                }} 
                            />
                        </div>
                    ))}
                </div>
                
                {/* Day labels */}
                <div className="flex justify-between text-sm text-white/70 font-bold mb-8">
                    {days.map((d, i) => (
                        <span key={d} className={`flex-1 text-center ${i === topDayIndex ? 'text-white' : ''}`}>
                            {d}
                        </span>
                    ))}
                </div>
                
                {/* Top day highlight */}
                <div className="bg-white text-[#9B59B6] rounded-2xl p-6 text-center">
                    <p className="text-sm font-medium opacity-70 mb-1">Your busiest day</p>
                    <p className="text-4xl font-black">{topDay}</p>
                    <p className="text-lg font-bold mt-2">
                        {isWeekend ? "Weekend warrior! 🎮" : "Weekday grinder! 💼"}
                    </p>
                </div>
            </div>
        </div>
    );
}
