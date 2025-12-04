import { useState } from 'react';

export default function ShareButtons({ data }) {
    const [copied, setCopied] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const stats = {
        messages: data?.totalMessages || 0,
        servers: data?.serverCount || 0,
        days: data?.activeDaysCount || 0,
        streak: data?.longestStreak?.days || data?.longestStreak || 0
    };

    const shareText = `🎮 My Discord Wrapped 2025!\n\n💬 ${stats.messages.toLocaleString()} messages\n🏰 ${stats.servers} servers\n📅 ${stats.days} active days\n🔥 ${stats.streak} day streak\n\nGet yours at discordwrapped.netlify.app\n\n#DiscordWrapped #Discord2025`;

    const shareToTwitter = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'width=550,height=420');
    };

    const shareToReddit = () => {
        const url = `https://reddit.com/submit?title=${encodeURIComponent('My Discord Wrapped 2025!')}&text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank');
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const downloadImage = () => {
        // Create a canvas with Spotify Wrapped-inspired design
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1920;
        const ctx = canvas.getContext('2d');

        // Vibrant gradient background (Spotify-like)
        const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
        gradient.addColorStop(0, '#1a0a2e');
        gradient.addColorStop(0.3, '#2d1b4e');
        gradient.addColorStop(0.6, '#5865F2');
        gradient.addColorStop(1, '#1a0a2e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1080, 1920);

        // Add some decorative circles (Spotify style)
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = '#EB459E';
        ctx.beginPath();
        ctx.arc(900, 300, 400, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#57F287';
        ctx.beginPath();
        ctx.arc(180, 1600, 350, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FEE75C';
        ctx.beginPath();
        ctx.arc(1000, 1400, 250, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1;

        // Top section - "Your 2025"
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 42px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Your', 540, 180);
        
        // Big year number
        ctx.font = '900 200px system-ui, -apple-system, sans-serif';
        const yearGradient = ctx.createLinearGradient(200, 200, 880, 450);
        yearGradient.addColorStop(0, '#57F287');
        yearGradient.addColorStop(0.5, '#5865F2');
        yearGradient.addColorStop(1, '#EB459E');
        ctx.fillStyle = yearGradient;
        ctx.fillText('2025', 540, 400);

        // "on Discord" subtitle
        ctx.fillStyle = '#ffffff';
        ctx.font = '500 38px system-ui, -apple-system, sans-serif';
        ctx.fillText('on Discord', 540, 480);

        // Main stats section with cards
        const cardStartY = 580;
        const cardHeight = 220;
        const cardWidth = 900;
        const cardX = 90;
        const cardRadius = 30;

        const drawCard = (y, emoji, value, label, accentColor) => {
            // Card background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.beginPath();
            ctx.roundRect(cardX, y, cardWidth, cardHeight, cardRadius);
            ctx.fill();
            
            // Accent line on left
            ctx.fillStyle = accentColor;
            ctx.beginPath();
            ctx.roundRect(cardX, y, 8, cardHeight, [cardRadius, 0, 0, cardRadius]);
            ctx.fill();

            // Emoji
            ctx.font = '80px system-ui';
            ctx.textAlign = 'left';
            ctx.fillText(emoji, cardX + 50, y + 100);
            
            // Value
            ctx.font = '900 72px system-ui, -apple-system, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(typeof value === 'number' ? value.toLocaleString() : value, cardX + 180, y + 95);
            
            // Label
            ctx.font = '400 32px system-ui, -apple-system, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fillText(label, cardX + 180, y + 150);
        };

        drawCard(cardStartY, '💬', stats.messages, 'messages sent', '#57F287');
        drawCard(cardStartY + cardHeight + 20, '🏰', stats.servers, 'servers active', '#5865F2');
        drawCard(cardStartY + (cardHeight + 20) * 2, '📅', stats.days, 'days on Discord', '#EB459E');
        drawCard(cardStartY + (cardHeight + 20) * 3, '🔥', stats.streak, 'day longest streak', '#FEE75C');

        // Bottom branding
        ctx.textAlign = 'center';
        
        // Discord Wrapped logo/text
        ctx.font = '800 48px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Discord Wrapped', 540, 1720);
        
        // URL
        ctx.font = '400 28px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText('discordwrapped.netlify.app', 540, 1780);
        
        // Small Discord logo indicator
        ctx.font = '32px system-ui';
        ctx.fillText('🎮', 540, 1840);

        // Download
        const link = document.createElement('a');
        link.download = 'discord-wrapped-2025.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-20 right-4 z-50 bg-[#5865F2] hover:bg-[#4752C4] text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                title="Share"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowModal(false)}>
                    <div 
                        className="bg-[#2b2d31] rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-white mb-4 text-center">Share Your Wrapped</h3>
                        
                        {/* Preview */}
                        <div className="bg-[#1a1a2e] rounded-xl p-4 mb-4 text-center">
                            <p className="text-xs text-white/50 mb-2">Preview</p>
                            <p className="text-white text-sm whitespace-pre-line">{shareText}</p>
                        </div>
                        
                        {/* Share buttons */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                                onClick={shareToTwitter}
                                className="flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white py-3 px-4 rounded-lg font-medium transition-all"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                                Twitter/X
                            </button>
                            
                            <button
                                onClick={shareToReddit}
                                className="flex items-center justify-center gap-2 bg-[#FF4500] hover:bg-[#e03d00] text-white py-3 px-4 rounded-lg font-medium transition-all"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                                </svg>
                                Reddit
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={copyToClipboard}
                                className={`flex items-center justify-center gap-2 ${copied ? 'bg-green-500' : 'bg-[#4f545c] hover:bg-[#5d6269]'} text-white py-3 px-4 rounded-lg font-medium transition-all`}
                            >
                                {copied ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        Copy Text
                                    </>
                                )}
                            </button>
                            
                            <button
                                onClick={downloadImage}
                                className="flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white py-3 px-4 rounded-lg font-medium transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Save Image
                            </button>
                        </div>
                        
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full mt-4 text-white/50 hover:text-white py-2 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
