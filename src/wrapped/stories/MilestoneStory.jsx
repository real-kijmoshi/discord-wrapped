export default function MilestoneStory({ data }) {
    const totalMessages = data?.totalMessages || 0;
    
    // Calculate milestones
    const milestones = [
        { threshold: 100, achieved: totalMessages >= 100, emoji: '🌱', label: '100 messages' },
        { threshold: 500, achieved: totalMessages >= 500, emoji: '🌿', label: '500 messages' },
        { threshold: 1000, achieved: totalMessages >= 1000, emoji: '🌳', label: '1K messages' },
        { threshold: 5000, achieved: totalMessages >= 5000, emoji: '🔥', label: '5K messages' },
        { threshold: 10000, achieved: totalMessages >= 10000, emoji: '💎', label: '10K messages' },
        { threshold: 25000, achieved: totalMessages >= 25000, emoji: '👑', label: '25K messages' },
        { threshold: 50000, achieved: totalMessages >= 50000, emoji: '🏆', label: '50K messages' },
    ];
    
    const achievedMilestones = milestones.filter(m => m.achieved);
    const nextMilestone = milestones.find(m => !m.achieved);
    const highestMilestone = achievedMilestones[achievedMilestones.length - 1];

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#2C3E50] text-white p-6 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-16 right-16 w-24 h-24 bg-[#F39C12]/20 rounded-full" />
            <div className="absolute bottom-24 left-12 w-32 h-32 bg-[#F39C12]/10 rounded-full" />
            
            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-6">
                    <div className="text-6xl mb-3">🎖️</div>
                    <h2 className="text-4xl font-black">Milestones</h2>
                </div>
                
                {/* Milestone progress */}
                <div className="space-y-2 mb-6">
                    {milestones.map((milestone, i) => (
                        <div 
                            key={i} 
                            className={`flex items-center gap-3 p-3 rounded-xl ${
                                milestone.achieved ? 'bg-[#F39C12]/20' : 'bg-white/5'
                            }`}
                        >
                            <span className={`text-2xl ${milestone.achieved ? '' : 'grayscale opacity-50'}`}>
                                {milestone.emoji}
                            </span>
                            <span className={`flex-1 font-bold ${milestone.achieved ? 'text-[#F39C12]' : 'opacity-50'}`}>
                                {milestone.label}
                            </span>
                            {milestone.achieved && <span className="text-[#F39C12]">✓</span>}
                        </div>
                    ))}
                </div>
                
                {/* Current status */}
                <div className="bg-[#F39C12] text-[#2C3E50] rounded-2xl p-5 text-center">
                    {highestMilestone ? (
                        <>
                            <p className="text-sm font-medium opacity-70 mb-1">You reached</p>
                            <p className="text-2xl font-black">{highestMilestone.emoji} {highestMilestone.label}</p>
                            {nextMilestone && (
                                <p className="text-sm mt-2 opacity-70">
                                    {nextMilestone.threshold - totalMessages} more to {nextMilestone.label}!
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="text-xl font-bold">Keep chatting to unlock milestones!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
