export default function ChatPersonalityStory({ data }) {
    const activeDays = data?.activeDaysCount || 0;
    const avgPerDay = data?.avgMessagesPerDay || 0;
    const servers = data?.serverCount || 0;
    const longestStreak = data?.longestStreak?.days || (typeof data?.longestStreak === 'number' ? data.longestStreak : 0);
    const lateNight = data?.lateNightMessages || 0;
    const total = (data?.lateNightMessages || 0) + (data?.morningMessages || 0) + (data?.afternoonMessages || 0) + (data?.eveningMessages || 0);
    const nightPercent = total > 0 ? (lateNight / total) * 100 : 0;

    // Determine personality type
    let personality = { type: '', emoji: '', desc: '', color: '#5865F2' };
    
    if (avgPerDay > 100) {
        personality = { type: 'The Chatterbox', emoji: '🗣️', desc: 'Non-stop conversations!', color: '#57F287' };
    } else if (nightPercent > 25) {
        personality = { type: 'Night Owl', emoji: '🦉', desc: 'The late night philosopher', color: '#5865F2' };
    } else if (longestStreak > 30) {
        personality = { type: 'Dedicated', emoji: '💎', desc: 'Consistency is key', color: '#EB459E' };
    } else if (servers > 15) {
        personality = { type: 'Community Hopper', emoji: '🦘', desc: 'Everywhere at once', color: '#FEE75C' };
    } else if (activeDays > 200) {
        personality = { type: 'The Regular', emoji: '☕', desc: 'Always here, always reliable', color: '#ED4245' };
    } else {
        personality = { type: 'Chill Chatter', emoji: '😎', desc: 'Quality over quantity', color: '#57F287' };
    }

    return (
        <div className="flex flex-col items-center justify-center h-full text-white p-8 relative overflow-hidden" style={{ backgroundColor: personality.color }}>
            {/* Decorative elements */}
            <div className="absolute top-16 right-16 w-32 h-32 bg-black/5 rounded-full" />
            <div className="absolute bottom-24 left-12 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute top-1/3 left-10 w-4 h-4 bg-white rounded-full opacity-50" />
            
            <div className="relative z-10 text-center">
                <p className="text-xl font-bold mb-4 opacity-80">Your Discord personality is...</p>
                
                <div className="text-9xl mb-6">{personality.emoji}</div>
                
                <h2 className="text-5xl font-black mb-4">{personality.type}</h2>
                
                <p className="text-2xl font-medium mb-8 opacity-90">{personality.desc}</p>
                
                <div className="bg-black/20 rounded-2xl p-6 max-w-sm">
                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div>
                            <p className="text-3xl font-black">{avgPerDay}</p>
                            <p className="text-sm opacity-70">msgs/day avg</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black">{longestStreak}</p>
                            <p className="text-sm opacity-70">day streak</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black">{servers}</p>
                            <p className="text-sm opacity-70">servers</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black">{activeDays}</p>
                            <p className="text-sm opacity-70">active days</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
