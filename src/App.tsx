import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './screens/Dashboard';
import { PracticeScreen } from './screens/PracticeScreen';
import { SessionSummary } from './screens/SessionSummary';
import { LearningPath } from './screens/LearningPath';
import { ProgressScreen } from './screens/ProgressScreen';
import { HeatMapScreen } from './screens/HeatMapScreen';
import { SettingsScreen } from './screens/SettingsScreen';

function App() {
  return (
    <div className="flex flex-col flex-1 h-full w-full">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/practice" element={<PracticeScreen />} />
        <Route path="/session-summary" element={<SessionSummary />} />
        <Route path="/learning-path" element={<LearningPath />} />
        <Route path="/progress" element={<ProgressScreen />} />
        <Route path="/heat-map" element={<HeatMapScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
    </div>
  );
}

export default App;
