import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { Dubbing } from "./pages/pages/Dubbing";
import Studio from "./pages/pages/Studio";
import { Main } from "./pages/pages/Main";
import { SettingsContext } from './pages/context/settingsContext';
import './styles.scss';
import './styles/fontawesome/css/all.css';
import { Test } from "./pages/pages/Test";
function App() {
  return (
    
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/dubbing" element={<Dubbing />} />
        <Route path="/test" element={<Test />} />
        <Route path="/studio" element={<SettingsContext><Studio /></SettingsContext>} />
        <Route path="/" element={<Main />} />
        {/* <Route path="*" element={<Navigate to="/dashboard/home" replace />} /> */}
      </Routes>
  );
}

export default App;
