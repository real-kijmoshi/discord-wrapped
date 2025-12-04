export default function TopServersStory({ data }) {
    const servers = data?.servers || [];
    const topServers = servers.slice(0, 5);
    const totalServerMessages = topServers.reduce((sum, s) => sum + s.messages, 0);

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#5865F2] text-white p-6 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-10 right-10 w-24 h-24 border-4 border-white/20 rounded-full" />
            <div className="absolute bottom-20 left-8 w-16 h-16 bg-white/10 rounded-full" />
            
            <div className="max-w-lg w-full space-y-4 animate-slide-up relative z-10">
                <div className="text-center mb-6">
                    <div className="text-5xl mb-3">🏰</div>
                    <h2 className="text-4xl font-black">Your Top Servers</h2>
                </div>

                <div className="space-y-3">
                    {topServers.length > 0 ? (
                        topServers.map((server, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3"
                            >
                                <div className="text-2xl font-black text-[#c9f31d] w-10">
                                    #{index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-lg truncate">
                                        {server.name || 'Unknown Server'}
                                    </div>
                                    <div className="h-2 bg-white/20 rounded-full overflow-hidden mt-1">
                                        <div 
                                            className="h-full bg-[#c9f31d] rounded-full"
                                            style={{ width: `${totalServerMessages > 0 ? (server.messages / topServers[0].messages) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-black text-lg">{server.messages?.toLocaleString()}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-xl opacity-75 py-8">
                            No server data for 2025
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
