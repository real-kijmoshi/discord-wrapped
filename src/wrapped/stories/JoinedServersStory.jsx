export default function JoinedServersStory({ data }) {
    const totalServers = data?.serverCount || 0;

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#ED4245] text-white p-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-16 right-16 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute bottom-24 left-12 w-16 h-16 bg-white/10 rounded-lg rotate-12" />
            <div className="absolute top-1/3 left-10 w-4 h-4 bg-white rounded-full opacity-50" />
            
            <div className="relative z-10 text-center">
                <div className="text-8xl mb-6">🏰</div>
                <h2 className="text-4xl font-black mb-6">Server Explorer</h2>
                
                <div className="bg-white text-[#ED4245] rounded-3xl p-8 mb-6">
                    <div className="text-7xl font-black">{totalServers}</div>
                    <div className="text-xl font-bold mt-2">Active servers in 2025</div>
                </div>
                
                <p className="text-xl font-medium max-w-xs">
                    {totalServers > 20 ? 
                        "Community collector! You're everywhere 🌟" :
                     totalServers > 10 ?
                        "Nice variety of communities! 🎯" :
                     totalServers > 3 ?
                        "Quality over quantity! 💎" :
                        "Keeping it tight-knit! 👊"}
                </p>
            </div>
        </div>
    );
}
