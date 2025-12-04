/* eslint-disable no-unused-vars */
import { useState } from 'react';

export default function Dashboard({ discordData, onStartWrapped, onUpdateUserLookup, onDateRangeChange }) {
    const [showEnhance, setShowEnhance] = useState(false);
    const [jsonInput, setJsonInput] = useState('');
    const [enhanceError, setEnhanceError] = useState('');
    const [enhanced, setEnhanced] = useState(false);
    const [copied, setCopied] = useState(false);
    const [dateRange, setDateRange] = useState('2025');

    // Get unique user IDs that need resolution
    const userIds = discordData?.uniqueUserIds || [];
    
    const handleDateRangeChange = (range) => {
        setDateRange(range);
        if (onDateRangeChange) {
            onDateRangeChange(range);
        }
    };
    

    // Generate Discord console script - uses Discord's REST API
    const discordScript = `// Discord Wrapped - User Data Fetcher
// Paste this in Discord (browser) DevTools Console (F12 → Console)

(async () => {
    const userIds = ${JSON.stringify(userIds.slice(0, 100))};
    const results = {};
    
    // Get token from webpack
    let token = null;
    try {
        const mods = [];
        webpackChunkdiscord_app.push([[""], {}, e => { for(let c in e.c) mods.push(e.c[c]); }]);
        for (const m of mods) {
            try {
                if (m?.exports?.default?.getToken) {
                    token = m.exports.default.getToken();
                    break;
                }
                if (m?.exports?.getToken) {
                    token = m.exports.getToken();
                    break;
                }
            } catch(e) {}
        }
    } catch(e) {}
    
    if (!token || typeof token !== 'string') {
        console.log('❌ Could not get token automatically.');
        console.log('');
        console.log('👉 MANUAL METHOD:');
        console.log('1. Go to Network tab in DevTools');
        console.log('2. Type in any chat to trigger a request');
        console.log('3. Find a request to discord.com/api');
        console.log('4. In Headers, find "authorization:" (the string value, not object)');
        console.log('5. Copy that string and run:');
        console.log('');
        console.log('fetchUsers("paste_token_here")');
        console.log('');
        
        window.fetchUsers = async (t) => {
            if (!t || typeof t !== 'string') { console.log('❌ Token must be a string'); return; }
            const r = {};
            console.log('Fetching ' + userIds.length + ' users...');
            for (const id of userIds) {
                try {
                    const res = await fetch('https://discord.com/api/v9/users/' + id, {
                        headers: { 'Authorization': t }
                    });
                    if (res.ok) {
                        const u = await res.json();
                        r[id] = { name: u.global_name || u.username, avatar: u.avatar ? 'https://cdn.discordapp.com/avatars/' + id + '/' + u.avatar + '.png' : null, username: u.username };
                        console.log('✓ ' + (u.global_name || u.username));
                    }
                    await new Promise(x => setTimeout(x, 150));
                } catch(e) {}
            }
            const json = JSON.stringify(r);
            console.log('\\n=== COPY THIS ===\\n' + json + '\\n=================');
            try { await navigator.clipboard.writeText(json); console.log('✅ Copied!'); } catch(e) {}
            return r;
        };
        return;
    }
    
    console.log('✅ Token found! Fetching ' + userIds.length + ' users...');
    
    for (const id of userIds) {
        try {
            const res = await fetch('https://discord.com/api/v9/users/' + id, {
                headers: { 'Authorization': token }
            });
            if (res.ok) {
                const u = await res.json();
                results[id] = { name: u.global_name || u.username, avatar: u.avatar ? 'https://cdn.discordapp.com/avatars/' + id + '/' + u.avatar + '.png' : null, username: u.username };
                console.log('✓ ' + (u.global_name || u.username));
            }
            await new Promise(r => setTimeout(r, 150));
        } catch (e) {}
    }
    
    const json = JSON.stringify(results);
    console.log('\\n=== COPY THIS ===\\n' + json + '\\n=================');
    
    try {
        await navigator.clipboard.writeText(json);
        console.log('✅ Copied to clipboard!');
    } catch (e) {}
    
    console.log('Found ' + Object.keys(results).length + '/' + userIds.length + ' users');
    return results;
})();`;

    const handleCopyScript = async () => {
        try {
            await navigator.clipboard.writeText(discordScript);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = discordScript;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleJsonPaste = () => {
        setEnhanceError('');
        try {
            let parsedJSON = jsonInput.trim();
            // remove ===COPY THIS=== markers if present and closing markers
            parsedJSON = parsedJSON.replace(/=== COPY THIS ===/g, '').trim();
            parsedJSON = parsedJSON.replace(/=================/g, '').trim();

            const parsed = JSON.parse(parsedJSON);

            if (typeof parsed !== 'object' || Array.isArray(parsed)) {
                throw new Error('Invalid format');
            }
            
            // Validate structure
            const userLookup = {};
            for (const [id, data] of Object.entries(parsed)) {
                if (data && typeof data === 'object') {
                    userLookup[id] = {
                        name: data.name || data.username || 'Unknown',
                        avatar: data.avatar || null,
                        username: data.username || null
                    };
                }
            }
            
            if (Object.keys(userLookup).length === 0) {
                throw new Error('No valid user data found');
            }
            
            onUpdateUserLookup(userLookup);
            setEnhanced(true);
            setShowEnhance(false);
        } catch (e) {
            setEnhanceError('Invalid JSON format. Make sure you copied the full output.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#23272A] p-4">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">🎉</div>
                    <h1 className="text-4xl font-black text-white mb-2">Your Data is Ready!</h1>
                    <p className="text-white/60">Choose your time range and start your journey</p>
                </div>

                {/* Date Range Selector */}
                <div className="bg-white/5 rounded-2xl p-4 mb-4">
                    <p className="text-white/70 text-sm mb-3 text-center">Select time range</p>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { value: '2025', label: '2025', emoji: '📅' },
                            { value: '2years', label: '2 Years', emoji: '📆' },
                            { value: 'lifetime', label: 'All Time', emoji: '♾️' },
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleDateRangeChange(option.value)}
                                className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                                    dateRange === option.value
                                        ? 'bg-[#5865F2] text-white scale-105'
                                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                            >
                                <span className="text-lg">{option.emoji}</span>
                                <p className="text-sm mt-1">{option.label}</p>
                            </button>
                        ))}
                    </div>
                </div>


                {/* Enhance with Names Section */}
                <div className="bg-white/5 rounded-2xl p-4 mb-6">
                    <button 
                        onClick={() => setShowEnhance(!showEnhance)}
                        className="w-full flex items-center justify-between text-left"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{enhanced ? '✅' : '✨'}</span>
                            <div>
                                <p className="text-white font-bold">
                                    {enhanced ? 'Names Enhanced!' : 'Enhance with Real Names'}
                                </p>
                                <p className="text-white/50 text-sm">
                                    {enhanced ? `${Object.keys(discordData?.userLookup || {}).length} users resolved` : 'Show usernames instead of IDs (optional)'}
                                </p>
                            </div>
                        </div>
                        <svg 
                            className={`w-5 h-5 text-white/50 transition-transform ${showEnhance ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showEnhance && (
                        <div className="mt-4 space-y-4">
                            {userIds.length === 0 ? (
                                <p className="text-white/50 text-sm text-center py-2">
                                    No user IDs to resolve - all names are already available!
                                </p>
                            ) : (
                                <>
                                    <div className="bg-[#2f3136] rounded-xl p-3">
                                        <p className="text-white/80 text-sm mb-2">
                                            <strong>Step 1:</strong> Copy this script
                                        </p>
                                        <button
                                            onClick={handleCopyScript}
                                            className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                                                copied 
                                                    ? 'bg-[#57F287] text-[#23272A]' 
                                                    : 'bg-[#5865F2] text-white hover:bg-[#4752C4]'
                                            }`}
                                        >
                                            {copied ? '✓ Copied!' : 'Copy Script'}
                                        </button>
                                    </div>

                                    <div className="bg-[#2f3136] rounded-xl p-3">
                                        <p className="text-white/80 text-sm mb-2">
                                            <strong>Step 2:</strong> Open Discord in browser → F12 → Console → Paste & Enter
                                        </p>
                                    </div>

                                    <div className="bg-[#2f3136] rounded-xl p-3">
                                        <p className="text-white/80 text-sm mb-2">
                                            <strong>Step 3:</strong> Paste the output JSON here
                                        </p>
                                        <textarea
                                            value={jsonInput}
                                            onChange={(e) => setJsonInput(e.target.value)}
                                            placeholder='{"123456789": {"name": "Username", ...}}'
                                            className="w-full bg-[#23272A] text-white rounded-lg p-3 text-sm font-mono h-24 resize-none border border-white/10 focus:border-[#5865F2] focus:outline-none"
                                        />
                                        {enhanceError && (
                                            <p className="text-[#ED4245] text-sm mt-1">{enhanceError}</p>
                                        )}
                                        <button
                                            onClick={handleJsonPaste}
                                            disabled={!jsonInput.trim()}
                                            className="w-full mt-2 py-2 px-4 rounded-lg font-semibold bg-[#57F287] text-[#23272A] hover:bg-[#3ba55c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Apply Names
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={onStartWrapped}
                        className="w-full py-4 px-6 rounded-2xl font-bold text-xl bg-[#5865F2] text-white hover:bg-[#4752C4] transition-colors shadow-lg"
                    >
                        🚀 Start Your Wrapped
                    </button>

                    <button
                        disabled
                        className="w-full py-3 px-6 rounded-2xl font-semibold bg-white/10 text-white/50 cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <span>👥</span>
                        <span>Join Party Wrapped</span>
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Coming Soon</span>
                    </button>
                </div>

                {/* Footer hint */}
                <p className="text-center text-white/30 text-xs mt-6">
                    Your data stays on your device. Nothing is uploaded. Unless using Party Wrapped (only nessessary data is shared and is not stored on our servers longer than needed).
                </p>
            </div>
        </div>
    );
}
