import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ModulePage from "./pages/ModulePage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <a href="#/" className="text-lg font-semibold text-white hover:text-blue-400">
            copy-install-poc
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:module" element={<ModulePage />} />
        </Routes>
      </main>
    </div>
  );
}
