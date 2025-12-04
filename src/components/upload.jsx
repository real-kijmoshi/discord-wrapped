/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */

import { useState } from 'react';
import JSZip from 'jszip';

export default function Upload({ onDataUploaded }) {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('');

    const handleZipUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setStatus('Reading ZIP file...');
        setProgress(10);

        try {
            const arrayBuffer = await file.arrayBuffer();
            setProgress(30);
            setStatus('Extracting ZIP contents...');

            const zip = new JSZip();
            const zipContent = await zip.loadAsync(arrayBuffer);
            setProgress(40);

            // Pre-process stats to avoid storing all raw data - 2025 ONLY
            const THIS_YEAR = 2025;
            const stats = {
                totalMessages: 0,
                totalWords: 0,
                messagesByHour: new Array(24).fill(0),
                messagesByDayOfWeek: new Array(7).fill(0), // 0=Sunday, 6=Saturday
                monthlyMessages: new Array(12).fill(0),
                messagesByMonth: {}, // month number -> count
                serverMessages: {},  // server name -> count
                dmMessages: {},      // recipient name/id -> count
                emojiCounts: {},
                reactions: {},       // emoji -> count
                linkDomains: {},     // domain -> count
                totalLinks: 0,
                channelInfo: {},     // channelId -> { type, name, guild?, recipients? }
                firstMessageDate: null,
                lastMessageDate: null,
                longestMessage: { content: '', length: 0, channel: '' },
                longestStreak: 0,
                currentStreak: 0,
                streakStartDate: null,
                streakEndDate: null,
                activeDays: new Set(),
                lateNightMessages: 0, // 12am-5am
                morningMessages: 0,   // 5am-12pm
                afternoonMessages: 0, // 12pm-6pm
                eveningMessages: 0,   // 6pm-12am
                uniqueUserIds: new Set(), // Collect user IDs for name resolution
                // Voice chat stats
                voiceTotalMinutes: 0,
                voiceCallCount: 0,
                voiceLongestSession: 0,
                voiceChannels: {}, // channel_id -> total minutes
            };

            const files = Object.keys(zipContent.files).filter(f => !zipContent.files[f].dir);

            // Step 1: Load all channel.json files first to build channel info map
            setStatus('Loading channel data...');
            const channelFiles = files.filter(f => 
                f.startsWith('Messages/') && f.endsWith('channel.json')
            );

            for (const filename of channelFiles) {
                try {
                    const fileData = zipContent.files[filename];
                    const content = await fileData.async('string');
                    const channelData = JSON.parse(content);
                    
                    // Get channel folder name (e.g., "c123456789")
                    const pathParts = filename.split('/');
                    const channelFolder = pathParts[1] || '';
                    
                    stats.channelInfo[channelFolder] = {
                        type: channelData.type,
                        name: channelData.name,
                        guild: channelData.guild,
                        recipients: channelData.recipients
                    };
                    
                    // Collect user IDs from DM recipients
                    if (channelData.recipients && Array.isArray(channelData.recipients)) {
                        for (const recipient of channelData.recipients) {
                            // Only add if it looks like a numeric ID (not "Deleted User" or username)
                            if (recipient && /^\d{17,20}$/.test(recipient)) {
                                stats.uniqueUserIds.add(recipient);
                            }
                        }
                    }
                    
                    // Pre-initialize server counters
                    if (channelData.guild?.name) {
                        if (!stats.serverMessages[channelData.guild.name]) {
                            stats.serverMessages[channelData.guild.name] = 0;
                        }
                    }
                } catch (e) {
                    // Skip problematic channel files
                }
            }

            setProgress(50);
            console.log(`Loaded ${Object.keys(stats.channelInfo).length} channel info files`);

            // Step 2: Process message files
            const messageFiles = files.filter(f => 
                f.startsWith('Messages/') && f.endsWith('messages.json')
            );

            setStatus(`Processing ${messageFiles.length} message files...`);

            const BATCH_SIZE = 50;
            let processedFiles = 0;

            for (let i = 0; i < messageFiles.length; i += BATCH_SIZE) {
                const batch = messageFiles.slice(i, i + BATCH_SIZE);
                
                await Promise.all(batch.map(async (filename) => {
                    try {
                        const fileData = zipContent.files[filename];
                        const blob = await fileData.async('blob');
                        
                        // Skip files larger than 5MB
                        if (blob.size > 5 * 1024 * 1024) return;
                        
                        const content = await blob.text();
                        let messages = [];
                        
                        try {
                            messages = JSON.parse(content);
                        } catch {
                            // Try JSONL
                            const lines = content.trim().split('\n');
                            for (const line of lines) {
                                try {
                                    if (line.trim()) messages.push(JSON.parse(line));
                                } catch {}
                            }
                        }
                        
                        if (!Array.isArray(messages)) return;
                        
                        // Get channel folder to lookup channel info
                        const pathParts = filename.split('/');
                        const channelFolder = pathParts[1] || '';
                        const channelData = stats.channelInfo[channelFolder];
                        
                        // Filter messages to 2025 only and count
                        let channelMsgCount = 0;
                        
                        for (const msg of messages) {
                            // Timestamp
                            const timestamp = msg.timestamp || msg.Timestamp;
                            if (timestamp) {
                                const date = new Date(timestamp);
                                if (isNaN(date.getTime())) continue;
                                
                                // FILTER: Only process 2025 messages
                                if (date.getFullYear() !== THIS_YEAR) continue;
                                
                                stats.totalMessages++;
                                channelMsgCount++;
                                
                                const hour = date.getHours();
                                stats.messagesByHour[hour]++;
                                stats.monthlyMessages[date.getMonth()]++;
                                stats.messagesByDayOfWeek[date.getDay()]++;
                                
                                // Time of day tracking
                                if (hour >= 0 && hour < 5) stats.lateNightMessages++;
                                else if (hour >= 5 && hour < 12) stats.morningMessages++;
                                else if (hour >= 12 && hour < 18) stats.afternoonMessages++;
                                else stats.eveningMessages++;
                                
                                // Track active days for streak
                                const dayKey = date.toISOString().split('T')[0];
                                stats.activeDays.add(dayKey);
                                
                                // Track first and last message dates
                                if (!stats.firstMessageDate || date < stats.firstMessageDate) {
                                    stats.firstMessageDate = date;
                                }
                                if (!stats.lastMessageDate || date > stats.lastMessageDate) {
                                    stats.lastMessageDate = date;
                                }
                            }
                            
                            // Content analysis
                            const msgContent = msg.content || msg.Contents || '';
                            
                            // Word count
                            const words = msgContent.split(/\s+/).filter(w => w.length > 0);
                            stats.totalWords += words.length;
                            
                            // Longest message tracking
                            if (msgContent.length > stats.longestMessage.length) {
                                stats.longestMessage = {
                                    content: msgContent.substring(0, 500),
                                    length: msgContent.length,
                                    channel: channelData?.name || channelData?.guild?.name || 'Unknown'
                                };
                            }
                            
                            // Link tracking
                            const urlRegex = /https?:\/\/([^\s\/]+)/gi;
                            let urlMatch;
                            while ((urlMatch = urlRegex.exec(msgContent)) !== null) {
                                const domain = urlMatch[1].toLowerCase();
                                stats.linkDomains[domain] = (stats.linkDomains[domain] || 0) + 1;
                                stats.totalLinks++;
                            }
                            
                            // Emojis (limit processing)
                            if (msgContent.length < 500) {
                                const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
                                const emojis = msgContent.match(emojiRegex);
                                if (emojis) {
                                    emojis.slice(0, 10).forEach(emoji => {
                                        stats.emojiCounts[emoji] = (stats.emojiCounts[emoji] || 0) + 1;
                                    });
                                }
                            }
                        }
                        
                        // Count messages per channel using channel info (only 2025 messages)
                        if (channelData && channelMsgCount > 0) {
                            if (channelData.type === 'DM') {
                                // DM - use recipient info
                                const recipientName = channelData.recipients?.[1] || channelData.recipients?.[0] || channelFolder;
                                const displayName = recipientName === 'Deleted User' ? 'Deleted User' : recipientName;
                                stats.dmMessages[displayName] = (stats.dmMessages[displayName] || 0) + channelMsgCount;
                            } else if (channelData.type === 'GROUP_DM') {
                                // Group DM
                                const groupName = channelData.name || 'Group Chat';
                                stats.dmMessages[groupName] = (stats.dmMessages[groupName] || 0) + channelMsgCount;
                            } else if (channelData.guild?.name) {
                                // Server channel
                                stats.serverMessages[channelData.guild.name] = (stats.serverMessages[channelData.guild.name] || 0) + channelMsgCount;
                            }
                        }
                        
                        // Clear references to help GC
                        messages = null;
                    } catch (error) {
                        // Skip problematic files
                    }
                }));
                
                processedFiles += batch.length;
                setProgress(50 + (processedFiles / messageFiles.length) * 40);
                setStatus(`Processing messages... ${Math.round((processedFiles / messageFiles.length) * 100)}%`);
            }

            // Step 3: Process voice chat analytics from Activity folder
            setStatus('Processing voice chat data...');
            setProgress(92);
            
            // Match both "activity/" and "Activity/" (case insensitive)
            const activityFiles = files.filter(f => 
                f.toLowerCase().includes('activity/') && f.endsWith('.json')
            );
            
            console.log(`Found ${activityFiles.length} activity files:`, activityFiles);
            
            // Collect all voice events first, then match join/leave pairs
            const voiceJoins = new Map(); // rtc_connection_id -> join event
            
            for (const filename of activityFiles) {
                try {
                    const fileData = zipContent.files[filename];
                    
                    // Try multiple decompression methods
                    let content = '';
                    try {
                        // Method 1: Try as string directly
                        content = await fileData.async('string');
                    } catch (e1) {
                        try {
                            // Method 2: Try as arraybuffer then decode
                            const buffer = await fileData.async('arraybuffer');
                            content = new TextDecoder('utf-8').decode(buffer);
                        } catch (e2) {
                            try {
                                // Method 3: Try as uint8array
                                const uint8 = await fileData.async('uint8array');
                                content = new TextDecoder('utf-8').decode(uint8);
                            } catch (e3) {
                                console.log(`Could not decompress ${filename}, skipping`);
                                continue;
                            }
                        }
                    }
                    
                    if (!content || content.length === 0) continue;
                    
                    const lines = content.trim().split('\n');
                    console.log(`Processing ${filename}: ${lines.length} lines`);
                    
                    for (const line of lines) {
                        try {
                            const event = JSON.parse(line);
                            
                            // Get timestamp
                            const timestampRaw = event.timestamp || event.client_send_timestamp;
                            if (!timestampRaw) continue;
                            const dateStr = timestampRaw.replace(/"/g, '');
                            const date = new Date(dateStr);
                            if (isNaN(date.getTime())) continue;
                            
                            // For voice, include all years (user may not have 2025 voice data yet)
                            // We'll show it as "all time" voice stats
                            
                            if (event.event_type === 'join_voice_channel') {
                                // Store join event by connection ID
                                const connId = event.rtc_connection_id || event.channel_id + '_' + date.getTime();
                                voiceJoins.set(connId, { timestamp: date, channelId: event.channel_id });
                            } 
                            else if (event.event_type === 'leave_voice_channel') {
                                // Try to find matching join
                                const connId = event.rtc_connection_id;
                                let durationMinutes = 0;
                                
                                // Method 1: Use duration field if available
                                if (event.duration) {
                                    durationMinutes = Math.round(parseInt(event.duration, 10) / 1000 / 60);
                                }
                                // Method 2: Match with join event
                                else if (connId && voiceJoins.has(connId)) {
                                    const joinEvent = voiceJoins.get(connId);
                                    const diffMs = date.getTime() - joinEvent.timestamp.getTime();
                                    if (diffMs > 0 && diffMs < 24 * 60 * 60 * 1000) { // Max 24 hours
                                        durationMinutes = Math.round(diffMs / 1000 / 60);
                                    }
                                    voiceJoins.delete(connId);
                                }
                                
                                if (durationMinutes > 0) {
                                    stats.voiceTotalMinutes += durationMinutes;
                                    stats.voiceCallCount++;
                                    
                                    // Track longest session
                                    if (durationMinutes > stats.voiceLongestSession) {
                                        stats.voiceLongestSession = durationMinutes;
                                    }
                                    
                                    if (event.channel_id) {
                                        stats.voiceChannels[event.channel_id] = (stats.voiceChannels[event.channel_id] || 0) + durationMinutes;
                                    }
                                }
                            }
                        } catch (e) {
                            // Skip invalid JSON lines
                        }
                    }
                } catch (e) {
                    // Skip problematic files
                    console.log('Error processing activity file:', filename, e.message);
                }
            }
            
            console.log(`Voice stats: ${stats.voiceTotalMinutes} minutes across ${stats.voiceCallCount} calls`);

            setProgress(98);

            // Calculate streak
            const sortedDays = Array.from(stats.activeDays).sort();
            let maxStreak = 0;
            let currentStreak = 0;
            let prevDate = null;
            
            for (const dayStr of sortedDays) {
                const currDate = new Date(dayStr);
                if (prevDate) {
                    const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);
                    if (diffDays === 1) {
                        currentStreak++;
                    } else {
                        maxStreak = Math.max(maxStreak, currentStreak);
                        currentStreak = 1;
                    }
                } else {
                    currentStreak = 1;
                }
                prevDate = currDate;
            }
            maxStreak = Math.max(maxStreak, currentStreak);

            // Build final processed data object (much smaller than raw data)
            const processedData = {
                totalMessages: stats.totalMessages,
                totalWords: stats.totalWords,
                mostActiveHour: stats.messagesByHour.indexOf(Math.max(...stats.messagesByHour)),
                hourlyActivity: stats.messagesByHour,
                monthlyMessages: stats.monthlyMessages,
                messagesByMonth: stats.monthlyMessages.reduce((acc, count, i) => { acc[i + 1] = count; return acc; }, {}),
                messagesByDayOfWeek: stats.messagesByDayOfWeek,
                servers: Object.entries(stats.serverMessages)
                    .map(([name, messages]) => ({ name, messages, messageCount: messages }))
                    .filter(s => s.messages > 0)
                    .sort((a, b) => b.messages - a.messages),
                serverCount: Object.keys(stats.serverMessages).filter(name => stats.serverMessages[name] > 0).length,
                topDMUsers: Object.entries(stats.dmMessages)
                    .map(([name, messages]) => ({ name, messages }))
                    .sort((a, b) => b.messages - a.messages)
                    .slice(0, 10),
                dms: Object.entries(stats.dmMessages)
                    .map(([name, messages]) => ({ name, messages, messageCount: messages }))
                    .sort((a, b) => b.messages - a.messages)
                    .slice(0, 10),
                // Voice chat data
                voiceMinutes: stats.voiceTotalMinutes,
                voiceCallCount: stats.voiceCallCount,
                voiceStats: {
                    totalDuration: stats.voiceTotalMinutes * 60, // in seconds for consistency
                    totalSessions: stats.voiceCallCount,
                    longestSession: stats.voiceLongestSession * 60 || 0,
                },
                // Estimate device usage based on common patterns
                mobileLogins: Math.round(stats.totalMessages * 0.3),
                desktopLogins: Math.round(stats.totalMessages * 0.6),
                webLogins: Math.round(stats.totalMessages * 0.1),
                topEmojis: Object.entries(stats.emojiCounts)
                    .map(([emoji, count]) => ({ emoji, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 15),
                emojis: stats.emojiCounts,
                reactions: stats.reactions || {},
                // Link stats
                linkStats: {
                    total: stats.totalLinks,
                    domains: stats.linkDomains,
                },
                // Longest message
                longestMessage: stats.longestMessage,
                totalHours: Math.round(stats.voiceTotalMinutes / 60) || Math.round((stats.totalMessages * 30) / 3600),
                // Activity stats
                activeDaysCount: stats.activeDays.size,
                daysActive: stats.activeDays.size,
                longestStreak: {
                    days: maxStreak,
                    startDate: sortedDays[0] || null,
                    endDate: sortedDays[sortedDays.length - 1] || null,
                },
                lateNightMessages: stats.lateNightMessages,
                morningMessages: stats.morningMessages,
                afternoonMessages: stats.afternoonMessages,
                eveningMessages: stats.eveningMessages,
                firstMessageDate: stats.firstMessageDate?.toISOString(),
                lastMessageDate: stats.lastMessageDate?.toISOString(),
                avgMessagesPerDay: stats.activeDays.size > 0 ? Math.round(stats.totalMessages / stats.activeDays.size) : 0,
                year: 2025,
                uniqueUserIds: Array.from(stats.uniqueUserIds),
                userLookup: {}, // Will be populated from Dashboard
            };

            setProgress(100);
            setStatus('✓ Upload complete!');
            
            console.log('Processed stats:', {
                messages: processedData.totalMessages,
                servers: processedData.servers.length,
                topServers: processedData.servers.slice(0, 3).map(s => `${s.name}: ${s.messages}`),
                dmUsers: processedData.topDMUsers.length,
                emojis: processedData.topEmojis.length,
                voiceMinutes: processedData.voiceMinutes,
                voiceCalls: processedData.voiceCallCount,
                hourlyActivity: processedData.hourlyActivity
            });
            
            // Pass processed data to parent component after a brief delay
            setTimeout(() => {
                if (onDataUploaded) {
                    onDataUploaded(processedData);
                }
            }, 1500);

        } catch (error) {
            console.error('Error processing ZIP file:', error);
            setStatus('❌ Error: ' + error.message);
            setIsLoading(false);
        }
    };

    // Handle folder upload (for extracted packages - better for large files)
    const handleFolderUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsLoading(true);
        setStatus('Processing folder...');
        setProgress(10);

        try {
            const THIS_YEAR = 2025;
            const stats = {
                totalMessages: 0,
                totalWords: 0,
                totalLinks: 0,
                linkDomains: {},
                messagesByHour: new Array(24).fill(0),
                messagesByDayOfWeek: new Array(7).fill(0),
                monthlyMessages: new Array(12).fill(0),
                serverMessages: {},
                dmMessages: {},
                emojiCounts: {},
                channelInfo: {},
                firstMessageDate: null,
                lastMessageDate: null,
                activeDays: new Set(),
                lateNightMessages: 0,
                morningMessages: 0,
                afternoonMessages: 0,
                eveningMessages: 0,
                uniqueUserIds: new Set(),
                voiceTotalMinutes: 0,
                voiceCallCount: 0,
                voiceChannels: {},
                voiceLongestSession: 0,
                longestMessage: { content: '', length: 0, channel: 'Unknown', date: null },
                reactions: { given: 0, received: 0, topReaction: null },
            };

            // Filter relevant files
            const channelFiles = files.filter(f => 
                f.webkitRelativePath.includes('Messages/') && f.name === 'channel.json'
            );
            const messageFiles = files.filter(f => 
                f.webkitRelativePath.includes('Messages/') && f.name === 'messages.json'
            );
            const activityFiles = files.filter(f => 
                f.webkitRelativePath.toLowerCase().includes('activity/') && f.name.endsWith('.json')
            );

            console.log(`Found: ${channelFiles.length} channels, ${messageFiles.length} message files, ${activityFiles.length} activity files`);

            // Step 1: Process channel files
            setStatus('Loading channel data...');
            setProgress(20);
            
            for (const file of channelFiles) {
                try {
                    const content = await file.text();
                    const channelData = JSON.parse(content);
                    const pathParts = file.webkitRelativePath.split('/');
                    const channelFolder = pathParts.find(p => p.startsWith('c')) || '';
                    
                    stats.channelInfo[channelFolder] = {
                        type: channelData.type,
                        name: channelData.name,
                        guild: channelData.guild,
                        recipients: channelData.recipients
                    };
                    
                    if (channelData.recipients && Array.isArray(channelData.recipients)) {
                        for (const recipient of channelData.recipients) {
                            if (recipient && /^\d{17,20}$/.test(recipient)) {
                                stats.uniqueUserIds.add(recipient);
                            }
                        }
                    }
                    
                    if (channelData.guild?.name && !stats.serverMessages[channelData.guild.name]) {
                        stats.serverMessages[channelData.guild.name] = 0;
                    }
                } catch (e) {}
            }

            // Step 2: Process message files
            setStatus('Processing messages...');
            let processed = 0;
            
            for (const file of messageFiles) {
                try {
                    const content = await file.text();
                    let messages = [];
                    
                    try {
                        messages = JSON.parse(content);
                    } catch {
                        const lines = content.trim().split('\n');
                        for (const line of lines) {
                            try { if (line.trim()) messages.push(JSON.parse(line)); } catch {}
                        }
                    }
                    
                    if (!Array.isArray(messages)) continue;
                    
                    const pathParts = file.webkitRelativePath.split('/');
                    const channelFolder = pathParts.find(p => p.startsWith('c')) || '';
                    const channelData = stats.channelInfo[channelFolder];
                    
                    let channelMsgCount = 0;
                    
                    for (const msg of messages) {
                        const timestamp = msg.timestamp || msg.Timestamp;
                        if (!timestamp) continue;
                        
                        const date = new Date(timestamp);
                        if (isNaN(date.getTime()) || date.getFullYear() !== THIS_YEAR) continue;
                        
                        stats.totalMessages++;
                        channelMsgCount++;
                        
                        const hour = date.getHours();
                        stats.messagesByHour[hour]++;
                        stats.monthlyMessages[date.getMonth()]++;
                        stats.messagesByDayOfWeek[date.getDay()]++;
                        
                        if (hour >= 0 && hour < 5) stats.lateNightMessages++;
                        else if (hour >= 5 && hour < 12) stats.morningMessages++;
                        else if (hour >= 12 && hour < 18) stats.afternoonMessages++;
                        else stats.eveningMessages++;
                        
                        stats.activeDays.add(date.toISOString().split('T')[0]);
                        
                        if (!stats.firstMessageDate || date < stats.firstMessageDate) stats.firstMessageDate = date;
                        if (!stats.lastMessageDate || date > stats.lastMessageDate) stats.lastMessageDate = date;
                        
                        const msgContent = msg.content || msg.Contents || '';
                        
                        // Count words
                        const words = msgContent.split(/\s+/).filter(w => w.length > 0);
                        stats.totalWords += words.length;
                        
                        // Track longest message
                        if (msgContent.length > stats.longestMessage.length) {
                            const channelName = channelData?.name || channelData?.guild?.name || 'Unknown';
                            stats.longestMessage = {
                                content: msgContent,
                                length: msgContent.length,
                                channel: channelName,
                                date: date.toISOString()
                            };
                        }
                        
                        // Count links
                        const urlRegex = /https?:\/\/[^\s<>]+/gi;
                        const urls = msgContent.match(urlRegex);
                        if (urls) {
                            stats.totalLinks += urls.length;
                            urls.forEach(url => {
                                try {
                                    const domain = new URL(url).hostname.replace('www.', '');
                                    stats.linkDomains[domain] = (stats.linkDomains[domain] || 0) + 1;
                                } catch {}
                            });
                        }
                        
                        if (msgContent.length < 500) {
                            const emojis = msgContent.match(/(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu);
                            if (emojis) {
                                emojis.slice(0, 10).forEach(emoji => {
                                    stats.emojiCounts[emoji] = (stats.emojiCounts[emoji] || 0) + 1;
                                });
                            }
                        }
                    }
                    
                    if (channelData && channelMsgCount > 0) {
                        if (channelData.type === 'DM') {
                            const recipientName = channelData.recipients?.[1] || channelData.recipients?.[0] || channelFolder;
                            stats.dmMessages[recipientName] = (stats.dmMessages[recipientName] || 0) + channelMsgCount;
                        } else if (channelData.type === 'GROUP_DM') {
                            const groupName = channelData.name || 'Group Chat';
                            stats.dmMessages[groupName] = (stats.dmMessages[groupName] || 0) + channelMsgCount;
                        } else if (channelData.guild?.name) {
                            stats.serverMessages[channelData.guild.name] = (stats.serverMessages[channelData.guild.name] || 0) + channelMsgCount;
                        }
                    }
                } catch (e) {}
                
                processed++;
                setProgress(20 + (processed / messageFiles.length) * 50);
                setStatus(`Processing messages... ${Math.round((processed / messageFiles.length) * 100)}%`);
            }

            // Step 3: Process voice activity using streaming (for huge files)
            setStatus('Processing voice chat data...');
            setProgress(75);
            
            const voiceJoins = new Map();
            let activityProcessed = 0;
            
            // Helper to process a single line
            const processVoiceLine = (line) => {
                if (!line.trim()) return;
                try {
                    const event = JSON.parse(line);
                    
                    const timestampRaw = event.timestamp || event.client_send_timestamp;
                    if (!timestampRaw) return;
                    const date = new Date(timestampRaw.replace(/"/g, ''));
                    if (isNaN(date.getTime())) return;
                    
                    if (event.event_type === 'join_voice_channel') {
                        const connId = event.rtc_connection_id || `${event.channel_id}_${date.getTime()}`;
                        voiceJoins.set(connId, { timestamp: date, channelId: event.channel_id });
                    } 
                    else if (event.event_type === 'leave_voice_channel') {
                        const connId = event.rtc_connection_id;
                        let durationMinutes = 0;
                        
                        if (event.duration) {
                            durationMinutes = Math.round(parseInt(event.duration, 10) / 1000 / 60);
                        } else if (connId && voiceJoins.has(connId)) {
                            const joinEvent = voiceJoins.get(connId);
                            const diffMs = date.getTime() - joinEvent.timestamp.getTime();
                            if (diffMs > 0 && diffMs < 24 * 60 * 60 * 1000) {
                                durationMinutes = Math.round(diffMs / 1000 / 60);
                            }
                            voiceJoins.delete(connId);
                        }
                        
                        if (durationMinutes > 0) {
                            stats.voiceTotalMinutes += durationMinutes;
                            stats.voiceCallCount++;
                            
                            // Track longest session
                            if (durationMinutes > stats.voiceLongestSession) {
                                stats.voiceLongestSession = durationMinutes;
                            }
                        }
                    }
                } catch (e) {}
            };
            
            for (const file of activityFiles) {
                // Skip files larger than 100MB - use streaming for those
                if (file.size > 100 * 1024 * 1024) {
                    console.log(`Streaming large file: ${file.name} (${Math.round(file.size / 1024 / 1024)}MB)`);
                    setStatus(`Processing ${file.name} (${Math.round(file.size / 1024 / 1024)}MB)...`);
                    
                    try {
                        const stream = file.stream();
                        const reader = stream.getReader();
                        const decoder = new TextDecoder();
                        let buffer = '';
                        let linesProcessed = 0;
                        
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;
                            
                            buffer += decoder.decode(value, { stream: true });
                            
                            // Process complete lines
                            const lines = buffer.split('\n');
                            buffer = lines.pop() || ''; // Keep incomplete line in buffer
                            
                            for (const line of lines) {
                                processVoiceLine(line);
                                linesProcessed++;
                            }
                            
                            // Update progress every 10k lines
                            if (linesProcessed % 10000 === 0) {
                                setStatus(`Processing voice data... ${linesProcessed.toLocaleString()} events`);
                            }
                        }
                        
                        // Process remaining buffer
                        if (buffer.trim()) {
                            processVoiceLine(buffer);
                        }
                        
                        console.log(`Processed ${linesProcessed} events from ${file.name}`);
                    } catch (e) {
                        console.log(`Error streaming ${file.name}:`, e.message);
                    }
                } else {
                    // Small files - read normally
                    try {
                        const content = await file.text();
                        const lines = content.split('\n');
                        console.log(`Processing ${file.name}: ${lines.length} events`);
                        
                        for (const line of lines) {
                            processVoiceLine(line);
                        }
                    } catch (e) {
                        console.log(`Error processing ${file.name}:`, e.message);
                    }
                }
                
                activityProcessed++;
                setProgress(75 + (activityProcessed / activityFiles.length) * 20);
            }
            
            console.log(`Voice stats: ${stats.voiceTotalMinutes} minutes across ${stats.voiceCallCount} calls`);

            // Calculate streak
            const sortedDays = Array.from(stats.activeDays).sort();
            let maxStreak = 0, currentStreak = 0, prevDate = null;
            for (const dayStr of sortedDays) {
                const currDate = new Date(dayStr);
                if (prevDate) {
                    const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);
                    if (diffDays === 1) currentStreak++;
                    else { maxStreak = Math.max(maxStreak, currentStreak); currentStreak = 1; }
                } else currentStreak = 1;
                prevDate = currDate;
            }
            maxStreak = Math.max(maxStreak, currentStreak);

            const processedData = {
                totalMessages: stats.totalMessages,
                totalWords: stats.totalWords,
                mostActiveHour: stats.messagesByHour.indexOf(Math.max(...stats.messagesByHour)),
                hourlyActivity: stats.messagesByHour,
                monthlyMessages: stats.monthlyMessages,
                messagesByMonth: stats.monthlyMessages.reduce((acc, count, i) => { acc[i + 1] = count; return acc; }, {}),
                messagesByDayOfWeek: stats.messagesByDayOfWeek,
                servers: Object.entries(stats.serverMessages)
                    .map(([name, messages]) => ({ name, messages, messageCount: messages }))
                    .filter(s => s.messages > 0)
                    .sort((a, b) => b.messages - a.messages),
                serverCount: Object.keys(stats.serverMessages).filter(name => stats.serverMessages[name] > 0).length,
                topDMUsers: Object.entries(stats.dmMessages)
                    .map(([name, messages]) => ({ name, messages }))
                    .sort((a, b) => b.messages - a.messages)
                    .slice(0, 10),
                dms: Object.entries(stats.dmMessages)
                    .map(([name, messages]) => ({ name, messages, messageCount: messages }))
                    .sort((a, b) => b.messages - a.messages)
                    .slice(0, 10),
                // Voice chat data
                voiceMinutes: stats.voiceTotalMinutes,
                voiceCallCount: stats.voiceCallCount,
                voiceStats: {
                    totalDuration: stats.voiceTotalMinutes * 60, // in seconds for consistency
                    totalSessions: stats.voiceCallCount,
                    longestSession: stats.voiceLongestSession * 60 || 0,
                },
                // Estimate device usage based on common patterns
                mobileLogins: Math.round(stats.totalMessages * 0.3),
                desktopLogins: Math.round(stats.totalMessages * 0.6),
                webLogins: Math.round(stats.totalMessages * 0.1),
                topEmojis: Object.entries(stats.emojiCounts)
                    .map(([emoji, count]) => ({ emoji, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 15),
                emojis: stats.emojiCounts,
                reactions: stats.reactions || {},
                // Link stats
                linkStats: {
                    total: stats.totalLinks,
                    domains: stats.linkDomains,
                },
                // Longest message
                longestMessage: stats.longestMessage,
                totalHours: Math.round(stats.voiceTotalMinutes / 60) || Math.round((stats.totalMessages * 30) / 3600),
                // Activity stats
                activeDaysCount: stats.activeDays.size,
                daysActive: stats.activeDays.size,
                longestStreak: {
                    days: maxStreak,
                    startDate: sortedDays[0] || null,
                    endDate: sortedDays[sortedDays.length - 1] || null,
                },
                lateNightMessages: stats.lateNightMessages,
                morningMessages: stats.morningMessages,
                afternoonMessages: stats.afternoonMessages,
                eveningMessages: stats.eveningMessages,
                firstMessageDate: stats.firstMessageDate?.toISOString(),
                lastMessageDate: stats.lastMessageDate?.toISOString(),
                avgMessagesPerDay: stats.activeDays.size > 0 ? Math.round(stats.totalMessages / stats.activeDays.size) : 0,
                year: 2025,
                uniqueUserIds: Array.from(stats.uniqueUserIds),
                userLookup: {},
            };

            setProgress(100);
            setStatus('✓ Upload complete!');
            
            console.log('Processed stats:', processedData);
            
            setTimeout(() => {
                if (onDataUploaded) onDataUploaded(processedData);
            }, 1500);

        } catch (error) {
            console.error('Error processing folder:', error);
            setStatus('❌ Error: ' + error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#23272A] p-8">
            <div className="bg-[#2f3136] rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-white mb-2 text-center">
                    Discord Wrapped
                </h1>
                <p className="text-gray-400 mb-6 text-center">
                    Upload your Discord data package
                </p>

                {/* ZIP Upload */}
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-[#5865F2] transition-colors mb-4">
                    <input
                        type="file"
                        accept=".zip"
                        onChange={handleZipUpload}
                        disabled={isLoading}
                        className="hidden"
                        id="zip-upload"
                    />
                    <label
                        htmlFor="zip-upload"
                        className={`cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className="flex flex-col items-center">
                            <svg
                                className="w-12 h-12 text-gray-500 mb-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            <p className="text-lg font-semibold text-white mb-1">
                                Upload ZIP file
                            </p>
                            <p className="text-sm text-gray-500">
                                Discord data package (.zip)
                            </p>
                        </div>
                    </label>
                </div>

                {/* Folder Upload - for large files */}
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-[#57F287] transition-colors">
                    <input
                        type="file"
                        webkitdirectory=""
                        directory=""
                        onChange={handleFolderUpload}
                        disabled={isLoading}
                        className="hidden"
                        id="folder-upload"
                    />
                    <label
                        htmlFor="folder-upload"
                        className={`cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className="flex flex-col items-center">
                            <svg
                                className="w-12 h-12 text-gray-500 mb-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                />
                            </svg>
                            <p className="text-lg font-semibold text-white mb-1">
                                Upload extracted folder
                            </p>
                            <p className="text-sm text-gray-500">
                                Better for large packages (voice data)
                            </p>
                        </div>
                    </label>
                </div>

                {isLoading && (
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-300">
                                {status}
                            </span>
                            <span className="text-sm font-medium text-gray-300">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-[#5865F2] h-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {!isLoading && status && (
                    <div className="mt-4 p-4 bg-[#57F287]/20 border border-[#57F287]/30 rounded-lg">
                        <p className="text-[#57F287] text-center font-medium">
                            {status}
                        </p>
                    </div>
                )}

                {/* How to download data section */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span>📥</span> How to download your Discord data
                    </h3>
                    <ol className="text-sm text-gray-400 space-y-3 list-decimal list-inside">
                        <li>
                            Open Discord and go to <span className="text-white font-medium">User Settings</span> (gear icon)
                        </li>
                        <li>
                            Scroll down to <span className="text-white font-medium">Privacy & Safety</span>
                        </li>
                        <li>
                            Scroll to the bottom and click <span className="text-[#5865F2] font-medium">"Request all of my Data"</span>
                        </li>
                        <li>
                            Wait for Discord to email you (can take up to 30 days, usually 1-3 days)
                        </li>
                        <li>
                            Download the ZIP file from the email link and upload it here!
                        </li>
                    </ol>
                    <div className="mt-4 p-3 bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-lg">
                        <p className="text-xs text-gray-400">
                            <span className="text-[#FEE75C]">💡 Tip:</span> For the best experience, request your data with <span className="text-white">all categories selected</span>, especially Messages and Activity data.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}