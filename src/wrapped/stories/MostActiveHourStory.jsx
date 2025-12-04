export default function MostActiveHourStory({ data }) {
    const mostActiveHour = data?.mostActiveHour || 14;
    const timeString = new Date(2024, 0, 1, mostActiveHour).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        hour12: true 
    });

    const getTimeEmoji = (hour) => {
        if (hour >= 5 && hour < 12) return '🌅';
        if (hour >= 12 && hour < 17) return '☀️';
        if (hour >= 17 && hour < 21) return '🌆';
        return '🌙';
    };

    const getTimeMessage = (hour) => {
        if (hour >= 22 || hour < 6) return "Night owl vibes 🦉";
        if (hour >= 6 && hour < 12) return "Early bird energy 🐦";
        if (hour >= 12 && hour < 17) return "Afternoon warrior ☕";
        return "Evening chatter 🌆";
    };

    const getBgColor = (hour) => {
        if (hour >= 5 && hour < 12) return '#FEE75C';  // Morning - yellow
        if (hour >= 12 && hour < 17) return '#57F287'; // Afternoon - green
        if (hour >= 17 && hour < 21) return '#ED4245'; // Evening - red
        return '#5865F2'; // Night - blue
    };

    const getTextColor = (hour) => {
        if (hour >= 5 && hour < 17) return 'text-black';
        return 'text-white';
    };

    return (
        <div className={`flex flex-col items-center justify-center h-full ${getTextColor(mostActiveHour)} p-8 relative overflow-hidden`} style={{ backgroundColor: getBgColor(mostActiveHour) }}>
            {/* Decorative elements */}
            <div className="absolute top-20 right-16 w-32 h-32 bg-black/5 rounded-full" />
            <div className="absolute bottom-24 left-10 w-24 h-24 bg-white/10 rounded-full" />
            
            <div className="text-center space-y-6 animate-fade-in relative z-10">
                <div className="text-8xl mb-4">
                    {getTimeEmoji(mostActiveHour)}
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4 opacity-80">
                        Your peak hour
                    </h2>
                    <div className="text-8xl font-black mb-4">
                        {timeString}
                    </div>
                    <p className="text-2xl font-bold">
                        {getTimeMessage(mostActiveHour)}
                    </p>
                </div>
            </div>
        </div>
    );
}
