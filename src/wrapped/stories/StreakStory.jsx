export default function StreakStory({ data }) {
    const streakData = data?.longestStreak || {};
    const longestStreak = typeof streakData === 'number' ? streakData : (streakData.days || 0);
    const activeDays = data?.activeDaysCount || data?.daysActive || 0;

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#FF9F1C] text-black p-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-16 right-16 w-24 h-24 bg-black/5 rounded-full" />
            <div className="absolute bottom-24 left-12 w-32 h-32 bg-black/5 rounded-full" />
            <div className="absolute top-1/3 left-10 w-4 h-4 bg-black/10 rounded-full" />
            
            <div className="relative z-10 text-center">
                <div className="text-8xl mb-6">🔥</div>
                <h2 className="text-4xl font-black mb-6">Your Streak Game</h2>
                
                <div className="bg-black text-[#FF9F1C] rounded-3xl p-8 mb-6">
                    <div className="text-7xl font-black">{longestStreak}</div>
                    <div className="text-xl font-bold mt-2">Day Streak!</div>
                </div>
                
                <div className="bg-black/10 rounded-2xl px-6 py-4 mb-6">
                    <p className="text-lg font-bold">Active on {activeDays} days in 2025</p>
                </div>
                
                <p className="text-xl font-bold">
                    {longestStreak > 100 ? 
                        "Legendary dedication! 🏆" :
                     longestStreak > 30 ?
                        "Month-long commitment! 💪" :
                     longestStreak > 7 ?
                        "Week warrior! ⚔️" :
                        "Building momentum! 🚀"}
                </p>
            </div>
        </div>
    );
}
