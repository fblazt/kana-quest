import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { SplashScreen } from './screens/SplashScreen';
import { Dashboard } from './screens/Dashboard';
import { PracticeScreen } from './screens/PracticeScreen';
import { PracticeModeScreen } from './screens/PracticeModeScreen';
import { SessionSummary } from './screens/SessionSummary';
import { LearningPath } from './screens/LearningPath';
import { ProgressScreen } from './screens/ProgressScreen';
import { HeatMapScreen } from './screens/HeatMapScreen';
import { SettingsScreen } from './screens/SettingsScreen';

function RouteWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    const el = document.getElementById('route-content');
    if (el) {
      el.classList.remove('route-enter');
      void el.offsetWidth;
      el.classList.add('route-enter');
    }
  }, [location.pathname]);

  return <div id="route-content" className="route-enter flex flex-col flex-1 h-full w-full">{children}</div>;
}

function App() {
  return (
    <div className="flex flex-col flex-1 h-full w-full">
      <RouteWrapper>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/practice" element={<PracticeScreen />} />
          <Route path="/practice/mode" element={<PracticeModeScreen />} />
          <Route path="/session-summary" element={<SessionSummary />} />
          <Route path="/learning-path" element={<LearningPath />} />
          <Route path="/progress" element={<ProgressScreen />} />
          <Route path="/heat-map" element={<HeatMapScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </RouteWrapper>
    </div>
  );
}

export default App;
