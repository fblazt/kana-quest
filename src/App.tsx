import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="flex flex-col flex-1 h-full w-full">
      <Routes>
        <Route 
          path="/" 
          element={
            <div className="flex flex-col items-center justify-center h-screen w-full bg-surface">
              <h1 className="font-serif text-5xl text-primary mb-4">Kana Quest</h1>
              <p className="text-on-surface-variant font-sans text-lg">Dashboard Placeholder</p>
            </div>
          } 
        />
        <Route 
          path="/practice" 
          element={
            <div className="flex flex-col items-center justify-center h-screen w-full bg-surface">
              <h2 className="font-serif text-3xl text-primary">Practice Screen</h2>
            </div>
          } 
        />
        <Route 
          path="/learning-path" 
          element={
            <div className="flex flex-col items-center justify-center h-screen w-full bg-surface">
              <h2 className="font-serif text-3xl text-primary">Learning Path</h2>
            </div>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <div className="flex flex-col items-center justify-center h-screen w-full bg-surface">
              <h2 className="font-serif text-3xl text-primary">Analytics</h2>
            </div>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <div className="flex flex-col items-center justify-center h-screen w-full bg-surface">
              <h2 className="font-serif text-3xl text-primary">Settings</h2>
            </div>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
