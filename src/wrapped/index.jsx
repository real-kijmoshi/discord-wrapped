import { useState, useEffect, useMemo } from 'react';
import ShareButtons from '../components/ShareButtons';
import WelcomeStory from './stories/WelcomeStory';
import TopServersStory from './stories/TopServersStory';
import MessageCountStory from './stories/MessageCountStory';
import MostActiveHourStory from './stories/MostActiveHourStory';
import FinalStory from './stories/FinalStory';
import GuessTopServerGame from './stories/GuessTopServerGame';
import GuessTopFriendGame from './stories/GuessTopFriendGame';
import VoiceChatStory from './stories/VoiceChatStory';
import DeviceStory from './stories/DeviceStory';
import EmojiStory from './stories/EmojiStory';
import JoinedServersStory from './stories/JoinedServersStory';
import MonthlyActivityStory from './stories/MonthlyActivityStory';
import StreakStory from './stories/StreakStory';
import DayOfWeekStory from './stories/DayOfWeekStory';
import TopDMsStory from './stories/TopDMsStory';
import NightOwlStory from './stories/NightOwlStory';
import ChatPersonalityStory from './stories/ChatPersonalityStory';
import MilestoneStory from './stories/MilestoneStory';
// New animated stories
import FirstMessageStory from './stories/FirstMessageStory';
import MessageSpeedStory from './stories/MessageSpeedStory';
import ServerLoyaltyStory from './stories/ServerLoyaltyStory';
import EmojiPersonalityStory from './stories/EmojiPersonalityStory';
import WeekendWarriorStory from './stories/WeekendWarriorStory';
import LongestMessageStory from './stories/LongestMessageStory';
import ReactionKingStory from './stories/ReactionKingStory';
import QuietestMonthStory from './stories/QuietestMonthStory';
import VoicePartyStory from './stories/VoicePartyStory';
import ChatStreakStory from './stories/ChatStreakStory';
import LinkSharerStory from './stories/LinkSharerStory';
import WordCountStory from './stories/WordCountStory';
import GuildExplorerStory from './stories/GuildExplorerStory';

export default function WrappedIndex({ discordData }) {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Data is already pre-processed from upload component
    const processedData = discordData;

    // Define all stories with custom durations (games get more time)
    const stories = useMemo(() => [
        { component: WelcomeStory, data: processedData, duration: 4000 },
        { component: FirstMessageStory, data: processedData, duration: 5000 },
        { component: MessageCountStory, data: processedData, duration: 5000 },
        { component: WordCountStory, data: processedData, duration: 5000 },
        { component: MessageSpeedStory, data: processedData, duration: 5000 },
        { component: LongestMessageStory, data: processedData, duration: 6000 },
        { component: GuessTopServerGame, data: processedData, duration: 15000 },
        { component: TopServersStory, data: processedData, duration: 6000 },
        { component: ServerLoyaltyStory, data: processedData, duration: 5000 },
        { component: GuildExplorerStory, data: processedData, duration: 6000 },
        { component: ChatStreakStory, data: processedData, duration: 5000 },
        { component: StreakStory, data: processedData, duration: 5000 },
        { component: WeekendWarriorStory, data: processedData, duration: 5000 },
        { component: DayOfWeekStory, data: processedData, duration: 5000 },
        { component: QuietestMonthStory, data: processedData, duration: 6000 },
        { component: MonthlyActivityStory, data: processedData, duration: 6000 },
        { component: MostActiveHourStory, data: processedData, duration: 5000 },
        { component: NightOwlStory, data: processedData, duration: 6000 },
        { component: GuessTopFriendGame, data: processedData, duration: 15000 },
        { component: TopDMsStory, data: processedData, duration: 6000 },
        { component: VoiceChatStory, data: processedData, duration: 5000 },
        { component: VoicePartyStory, data: processedData, duration: 5000 },
        { component: DeviceStory, data: processedData, duration: 6000 },
        { component: EmojiStory, data: processedData, duration: 6000 },
        { component: EmojiPersonalityStory, data: processedData, duration: 6000 },
        { component: ReactionKingStory, data: processedData, duration: 6000 },
        { component: LinkSharerStory, data: processedData, duration: 6000 },
        { component: ChatPersonalityStory, data: processedData, duration: 6000 },
        { component: MilestoneStory, data: processedData, duration: 6000 },
        { component: JoinedServersStory, data: processedData, duration: 5000 },
        { component: FinalStory, data: processedData, duration: 10000 },
    ], [processedData]);

    const CurrentStory = stories[currentStoryIndex].component;
    const currentData = stories[currentStoryIndex].data;
    const currentDuration = stories[currentStoryIndex].duration;

    // Auto-advance timer with variable duration
    useEffect(() => {
        if (isPaused) return;

        const interval = 50;
        const increment = (interval / currentDuration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    if (currentStoryIndex < stories.length - 1) {
                        setCurrentStoryIndex((i) => i + 1);
                        return 0;
                    }
                    return 100;
                }
                return prev + increment;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [currentStoryIndex, isPaused, stories.length, currentDuration]);

    const nextStory = () => {
        if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex((i) => i + 1);
            setProgress(0);
        }
    };

    const prevStory = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex((i) => i - 1);
            setProgress(0);
        }
    };

    const handleInteraction = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width / 2) {
            prevStory();
        } else {
            nextStory();
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            {/* Progress bars */}
            <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-2">
                {stories.map((_, index) => (
                    <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-100"
                            style={{
                                width: `${index < currentStoryIndex ? 100 : index === currentStoryIndex ? progress : 0}%`,
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Story content */}
            <div
                className="w-full h-full cursor-pointer"
                onClick={handleInteraction}
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                <CurrentStory data={currentData} />
            </div>

            {/* Share button */}
            <ShareButtons data={processedData} />

            {/* Story counter */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
                <span className="text-white/40 text-sm font-medium">
                    {currentStoryIndex + 1} / {stories.length}
                </span>
            </div>
        </div>
    );
}
