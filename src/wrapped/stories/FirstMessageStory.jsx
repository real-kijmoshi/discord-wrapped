import { useEffect, useState } from 'react';

export default function FirstMessageStory({ data }) {
    const [animate, setAnimate] = useState(false);
    const firstDate = data?.firstMessageDate ? new Date(data.firstMessageDate) : null;
    
    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
    }, []);

    if (!firstDate) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#2D3436] text-white p-8">
                <p className="text-2xl">No message data found</p>
            </div>
        );
    }

    const formattedDate = firstDate.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const daysAgo = Math.floor((new Date() - firstDate) / (1000 * 60 * 60 * 24));

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#2D3436] text-white p-6 relative overflow-hidden">
            {/* Animated background circles */}
            <div className={`absolute top-20 right-10 w-32 h-32 bg-[#00B894]/20 rounded-full transition-all duration-1000 ${animate ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
            <div className={`absolute bottom-32 left-8 w-24 h-24 bg-[#00B894]/10 rounded-full transition-all duration-1000 delay-200 ${animate ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
            
            <div className={`relative z-10 text-center transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="text-7xl mb-6">📜</div>
                <p className="text-[#00B894] text-lg font-bold tracking-wider mb-4">YOUR JOURNEY BEGAN</p>
                
                <h2 className={`text-3xl font-black mb-6 transition-all duration-700 delay-300 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                    {formattedDate}
                </h2>
                
                <div className={`bg-[#00B894] text-[#2D3436] rounded-2xl py-4 px-8 inline-block transition-all duration-700 delay-500 ${animate ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                    <p className="text-4xl font-black">{daysAgo.toLocaleString()}</p>
                    <p className="text-sm font-bold">days of Discord</p>
                </div>
                
                <p className={`text-white/60 mt-6 text-lg transition-all duration-700 delay-700 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    That&apos;s {Math.floor(daysAgo / 365)} years and {daysAgo % 365} days! 🎂
                </p>
            </div>
        </div>
    );
}
