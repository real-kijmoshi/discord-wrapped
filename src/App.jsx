import { useState } from "react"
import Upload from "./components/upload"
import Dashboard from "./components/Dashboard"
import WrappedIndex from "./wrapped/index"

function App() {
  const [discordData, setDiscordData] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showWrapped, setShowWrapped] = useState(false);
  const [dateRange, setDateRange] = useState('2025');

  const handleDataUploaded = (data) => {
    console.log('Data received in App:', Object.keys(data).length, 'keys');
    setDiscordData(data);
    setShowDashboard(true);
  };

  const handleStartWrapped = () => {
    // Update discordData with selected date range label
    setDiscordData(prev => ({
      ...prev,
      dateRangeLabel: dateRange === '2025' ? '2025' : dateRange === '2years' ? '2024-2025' : 'All Time'
    }));
    setShowDashboard(false);
    setShowWrapped(true);
  };

  const handleUpdateUserLookup = (userLookup) => {
    setDiscordData(prev => ({
      ...prev,
      userLookup
    }));
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    // Note: The actual data filtering happens at upload time
    // This just tracks the user's preference for display purposes
  };

  if (showWrapped && discordData) {
    return <WrappedIndex discordData={discordData} />;
  }

  if (showDashboard && discordData) {
    return (
      <Dashboard 
        discordData={discordData} 
        onStartWrapped={handleStartWrapped}
        onUpdateUserLookup={handleUpdateUserLookup}
        onDateRangeChange={handleDateRangeChange}
      />
    );
  }

  return <Upload onDataUploaded={handleDataUploaded} />;
}

export default App
