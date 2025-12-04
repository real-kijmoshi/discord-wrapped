export default function MessageCountStory({ data }) {
    const totalMessages = data?.totalMessages || 0;
    const formattedCount = totalMessages.toLocaleString();
    const avgPerDay = data?.avgMessagesPerDay || 0;

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#57F287] text-black p-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-16 right-20 w-32 h-32 bg-black/5 rounded-full" />
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-black/5 rounded-full" />
            <div className="absolute top-1/3 left-8 w-4 h-4 bg-black/20 rounded-full" />
            
            <div className="text-center space-y-6 animate-scale-in relative z-10">
                <div className="text-7xl mb-2">💬</div>
                <div>
                    <h2 className="text-2xl font-bold mb-4 opacity-80">
                        In 2025, you sent
                    </h2>
                    <div className="text-8xl font-black mb-2">
                        {formattedCount}
                    </div>
                    <h2 className="text-3xl font-bold">
                        messages
                    </h2>
                </div>
                
                <div className="bg-black/10 rounded-2xl px-6 py-4 mt-6">
                    <p className="text-lg font-medium">That's ~{avgPerDay} messages per day!</p>
                </div>
                
                <div className="text-xl font-bold mt-6">
                    {totalMessages > 10000 
                        ? "You're a conversation machine! 🔥" 
                        : totalMessages > 5000 
                        ? "Quite the chatter! ✨" 
                        : totalMessages > 1000
                        ? "Quality conversations! 💎"
                        : "Just getting started! 🚀"}
                </div>
            </div>
        </div>
    );
}
