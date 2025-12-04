export default function WelcomeStory({ data }) {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#5865F2] text-white p-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-32 right-16 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute top-1/4 right-10 w-4 h-4 bg-white rounded-full opacity-60" />
            <div className="absolute bottom-1/4 left-16 w-6 h-6 bg-white rounded-full opacity-40" />
            <div className="absolute top-1/2 left-8 w-3 h-3 bg-[#c9f31d] rounded-full" />
            
            <div className="text-center space-y-6 animate-fade-in relative z-10">
                <div className="text-8xl mb-4">🎮</div>
                <h1 className="text-6xl font-black mb-4 tracking-tight">
                    Discord
                    <br />
                    <span className="text-[#c9f31d]">Wrapped</span>
                </h1>
                <p className="text-3xl font-bold">
                    2025
                </p>
                <div className="mt-8 text-lg opacity-75 animate-pulse">
                    Tap to start →
                </div>
            </div>
        </div>
    );
}
