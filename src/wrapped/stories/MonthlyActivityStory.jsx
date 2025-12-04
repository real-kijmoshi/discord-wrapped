export default function MonthlyActivityStory({ data }) {
    const monthlyMessages = data?.monthlyMessages || new Array(12).fill(0);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const maxMessages = Math.max(...monthlyMessages);
    const topMonthIndex = monthlyMessages.indexOf(maxMessages);
    const topMonth = months[topMonthIndex];

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#EB459E] text-white p-6 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-16 left-12 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute bottom-20 right-16 w-32 h-32 bg-white/5 rounded-full" />
            
            <div className="w-full max-w-lg relative z-10">
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-black">Your Year</h2>
                    <p className="text-white/80 text-lg">Month by month</p>
                </div>
                
                {/* Monthly bars */}
                <div className="grid grid-cols-12 gap-1.5 h-32 mb-3 items-end">
                    {monthlyMessages.map((count, i) => (
                        <div key={i} className="flex flex-col items-center justify-end h-full">
                            <div 
                                className="w-full rounded-t-md transition-all duration-500"
                                style={{ 
                                    height: `${maxMessages > 0 ? (count / maxMessages) * 100 : 0}%`, 
                                    minHeight: count > 0 ? '6px' : '2px',
                                    backgroundColor: i === topMonthIndex ? '#fff' : 'rgba(255,255,255,0.3)'
                                }} 
                            />
                        </div>
                    ))}
                </div>
                
                {/* Month labels */}
                <div className="grid grid-cols-12 gap-1.5 text-xs text-white/70 mb-8">
                    {months.map(m => (
                        <span key={m} className="text-center font-medium">{m.charAt(0)}</span>
                    ))}
                </div>
                
                {/* Top month highlight */}
                <div className="bg-white text-[#EB459E] rounded-2xl p-6 text-center">
                    <p className="text-sm font-medium opacity-70 mb-1">Your busiest month</p>
                    <p className="text-4xl font-black">{topMonth}</p>
                    <p className="text-lg font-bold mt-1">{maxMessages.toLocaleString()} messages</p>
                </div>
            </div>
        </div>
    );
}
