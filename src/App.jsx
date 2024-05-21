import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { Dubbing } from "./pages/pages/Dubbing";
import { Main } from "./pages/pages/Main";
function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/dubbing" element= {<Dubbing/>} />
      <Route path="/home" element= {<Main/>} />
      {/* <Route path="*" element={<Navigate to="/dashboard/home" replace />} /> */}
    </Routes>
  );
}

export default App;
