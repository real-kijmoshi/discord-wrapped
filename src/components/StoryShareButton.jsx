import { useState } from 'react';

export default function StoryShareButton({ storyTitle, stats }) {
    const [showCopied, setShowCopied] = useState(false);

    const handleShare = async (e) => {
        e.stopPropagation(); // Don't trigger story navigation
        
        const shareText = `🎮 Discord Wrapped 2025\n\n${storyTitle}\n${stats}\n\n#DiscordWrapped`;
        
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'My Discord Wrapped 2025',
                    text: shareText,
                });
            } else {
                await navigator.clipboard.writeText(shareText);
                setShowCopied(true);
                setTimeout(() => setShowCopied(false), 2000);
            }
        } catch (err) {
            // User cancelled or error
            console.log('Share cancelled');
        }
    };

    return (
        <button
            onClick={handleShare}
            className="absolute bottom-20 right-4 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Share this story"
        >
            {showCopied ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
            )}
        </button>
    );
}
