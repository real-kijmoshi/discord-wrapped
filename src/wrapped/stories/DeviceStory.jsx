export default function DeviceStory({ data }) {
    const mobileLogins = data?.mobileLogins || 0;
    const desktopLogins = data?.desktopLogins || 0;
    const webLogins = data?.webLogins || 0;
    const total = mobileLogins + desktopLogins + webLogins;
    
    const devices = [
        { name: 'Desktop', count: desktopLogins, icon: '🖥️', color: '#57F287' },
        { name: 'Mobile', count: mobileLogins, icon: '📱', color: '#EB459E' },
        { name: 'Web', count: webLogins, icon: '🌐', color: '#5865F2' },
    ].sort((a, b) => b.count - a.count);

    const topDevice = devices[0];

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#0a0a0a] text-white p-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/10 rounded-lg rotate-12" />
            <div className="absolute bottom-20 right-10 w-32 h-32 border-2 border-white/10 rounded-full" />
            <div className="absolute top-1/3 right-16 w-4 h-4 bg-[#57F287] rounded-full opacity-50" />
            <div className="absolute bottom-1/3 left-20 w-3 h-3 bg-[#EB459E] rounded-full opacity-50" />
            
            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-black mb-2">Your Devices</h2>
                    <p className="text-gray-400 text-lg">(estimated sessions)</p>
                </div>
                
                <div className="space-y-4">
                    {devices.map((device, i) => (
                        <div key={i} className="bg-white/5 rounded-2xl p-5 flex items-center gap-4">
                            <div className="text-5xl">{device.icon}</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-bold text-lg">{device.name}</span>
                                    <span className="font-black text-xl" style={{ color: device.color }}>
                                        {device.count.toLocaleString()}
                                    </span>
                                </div>
                                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full"
                                        style={{ 
                                            width: total > 0 ? `${(device.count / total) * 100}%` : '0%', 
                                            backgroundColor: device.color 
                                        }} 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-gray-400 mb-2">You're a</p>
                    <p className="text-2xl font-black" style={{ color: topDevice.color }}>
                        {topDevice.name} warrior {topDevice.icon}
                    </p>
                </div>
            </div>
        </div>
    );
}
