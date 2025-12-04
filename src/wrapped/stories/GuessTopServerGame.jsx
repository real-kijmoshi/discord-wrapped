import { useState, useMemo } from 'react';

export default function GuessTopServerGame({ data }) {
    const [selectedServer, setSelectedServer] = useState(null);
    const [revealed, setRevealed] = useState(false);
    
    const servers = useMemo(() => data?.servers || [], [data?.servers]);
    const topServer = servers[0];
    
    // Pick 3 servers + the top one, using stable indices
    const options = useMemo(() => {
        if (!topServer || servers.length < 2) return [];
        const otherServers = servers.slice(1, 10);
        // Use deterministic selection based on server names hash
        const selected = otherServers.slice(0, Math.min(3, otherServers.length));
        // Shuffle deterministically by sorting on name
        return [...selected, topServer].sort((a, b) => {
            const hashA = a.name?.charCodeAt(0) || 0;
            const hashB = b.name?.charCodeAt(0) || 0;
            return hashA - hashB;
        });
    }, [servers, topServer]);

    const handleSelect = (e, server) => {
        e.stopPropagation();
        setSelectedServer(server);
        setRevealed(true);
    };

    const isCorrect = selectedServer?.name === topServer?.name;

    if (!topServer) {
        return (
            <div className="flex items-center justify-center h-full bg-[#2f3136] text-white">
                <p>No server data for 2025</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#2f3136] text-white p-6 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-[#c9f31d]/10 rounded-full blur-2xl" />
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#c9f31d]/10 rounded-full blur-2xl" />
            <div className="absolute top-1/4 right-20 w-4 h-4 bg-[#c9f31d] rounded-full opacity-60" />
            
            <div className="relative z-10 w-full max-w-lg">
                {!revealed ? (
                    <>
                        <div className="text-center mb-6">
                            <span className="text-[#c9f31d] text-lg font-bold tracking-wider">🎮 MINI GAME</span>
                            <h2 className="text-4xl font-black mt-3">
                                Guess your<br />#1 Server
                            </h2>
                            <p className="text-gray-400 mt-3 text-lg">Where did you message most in 2025?</p>
                        </div>

                        <div className="space-y-3">
                            {options.map((server, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => handleSelect(e, server)}
                                    className="w-full p-5 bg-white/5 hover:bg-[#c9f31d]/20 border border-white/10 hover:border-[#c9f31d]/50 rounded-2xl text-left transition-all duration-200 hover:scale-[1.02] group"
                                >
                                    <span className="text-lg font-semibold group-hover:text-[#c9f31d] transition-colors">
                                        {server?.name || 'Unknown'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="text-7xl mb-6">
                            {isCorrect ? '🎉' : '😅'}
                        </div>
                        <h2 className="text-4xl font-black mb-4">
                            {isCorrect ? 'You got it!' : 'Not quite!'}
                        </h2>
                        <p className="text-gray-400 mb-6 text-lg">
                            Your #1 server was
                        </p>
                        <div className="bg-[#c9f31d] text-black rounded-2xl p-6 mb-6">
                            <p className="text-2xl font-black">{topServer?.name}</p>
                            <p className="text-lg font-medium mt-2 opacity-80">
                                {topServer?.messages?.toLocaleString()} messages
                            </p>
                        </div>
                        <p className="text-sm text-gray-500">Tap to continue →</p>
                    </div>
                )}
            </div>
        </div>
    );
}
