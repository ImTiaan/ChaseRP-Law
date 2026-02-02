import { useState } from "react";
import TopBar from "./TopBar";
import Dock from "./Dock";
import Window from "./Window";
import DocViewer from "../apps/DocViewer";
import SearchApp from "../apps/SearchApp";
import contentData from "../../data/content.json";

// Map content IDs to titles and components
// We'll treat every document as a potential "App" if opened directly,
// but mainly we have generic viewers.

export default function Desktop() {
  const [windows, setWindows] = useState([
    // Open Search by default
    { 
      id: "search", 
      title: "Search", 
      component: "search", 
      zIndex: 1, 
      isOpen: true, 
      isMinimized: false, 
      position: { x: 50, y: 80 } 
    }
  ]);
  const [activeWindowId, setActiveWindowId] = useState("search");
  const [maxZIndex, setMaxZIndex] = useState(1);

  const getDocContent = (id) => contentData.find(c => c.id === id);

  // Handle opening an app from the dock
  const handleOpenApp = (id) => {
    // If it's a known document ID, we open a DocViewer
    // If it's "search", we open SearchApp
    
    setWindows((prev) => {
      const existingWindow = prev.find((w) => w.id === id);
      
      if (existingWindow) {
        // Restore/Focus
        return prev.map((w) => 
          w.id === id 
            ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZIndex + 1 }
            : w
        );
      }
      
      // Create new window
      const offset = prev.length * 30;
      const isSearch = id === "search";
      
      let title = "Application";
      let componentType = "doc";
      let content = null;

      if (isSearch) {
        title = "Search";
        componentType = "search";
      } else {
        const doc = getDocContent(id);
        if (doc) {
          title = doc.title;
          content = doc;
        } else {
          title = "Unknown";
        }
      }

      return [
        ...prev,
        { 
          id, 
          title,
          component: componentType,
          content,
          zIndex: maxZIndex + 1, 
          isOpen: true, 
          isMinimized: false, 
          position: { x: 50 + offset, y: 80 + offset } 
        }
      ];
    });

    setMaxZIndex((prev) => prev + 1);
    setActiveWindowId(id);
  };

  const handleCloseWindow = (id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const handleFocusWindow = (id) => {
    setWindows((prev) => 
      prev.map((w) => 
        w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w
      )
    );
    setMaxZIndex((prev) => prev + 1);
    setActiveWindowId(id);
  };

  // Determine active apps for Dock indicator
  const activeApps = windows.filter(w => w.isOpen && !w.isMinimized).map(w => w.id);

  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative selection:bg-emerald-500/30">
      {/* Top Bar */}
      <TopBar />

      {/* Dynamic Green Mesh Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none" />
      
      {/* Windows Layer */}
      <div className="absolute inset-0 z-0">
        {windows.map((win) => (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            isOpen={win.isOpen}
            isActive={activeWindowId === win.id}
            onClose={() => handleCloseWindow(win.id)}
            onFocus={() => handleFocusWindow(win.id)}
            initialPosition={win.position}
            className={win.id === 'search' ? 'bg-black/60' : ''} // Make search slightly darker
          >
            {win.component === "search" ? (
              <SearchApp onOpenDoc={handleOpenApp} />
            ) : (
              <DocViewer content={win.content} />
            )}
          </Window>
        ))}
      </div>

      {/* Dock */}
      <Dock onOpenApp={handleOpenApp} activeApps={activeApps} />
    </div>
  );
}
