import { motion, useDragControls } from "framer-motion";
import { X, Minus, Maximize2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { cn } from "../../lib/utils";

export default function Window({
  id,
  title,
  isOpen,
  isActive,
  onClose,
  onFocus,
  children,
  initialPosition = { x: 100, y: 50 },
  defaultWidth = 800,
  defaultHeight = 600,
  className,
}) {
  const constraintsRef = useRef(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const dragControls = useDragControls();

  useEffect(() => {
    // Default to maximized on mobile
    if (window.innerWidth < 768) {
      setIsMaximized(true);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <motion.div
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      initial={initialPosition}
      animate={
        isMaximized
          ? { x: 0, y: 0, width: "100%", height: "100%", borderRadius: 0 }
          : { width: defaultWidth, height: defaultHeight, borderRadius: "0.75rem" }
      }
      onDragStart={onFocus}
      onClick={onFocus}
      className={cn(
        "absolute flex flex-col bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden",
        isActive ? "shadow-[0_0_40px_rgba(16,185,129,0.15)] z-50 border-emerald-500/30 ring-1 ring-emerald-500/20 scale-[1.002]" : "z-10 opacity-90 scale-100",
        isMaximized ? "inset-0 top-10 rounded-none z-[60]" : "rounded-xl",
        className
      )}
      style={{ 
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Window Header / Title Bar */}
      <div
        className="h-12 bg-white/5 border-b border-white/5 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing select-none shrink-0"
        onPointerDown={(e) => {
          onFocus();
          dragControls.start(e);
        }}
        onDoubleClick={() => setIsMaximized(!isMaximized)}
      >
        <div className="flex items-center gap-2 group">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
          >
            <X className="w-2 h-2 text-black/50 opacity-0 group-hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center transition-colors">
            <Minus className="w-2 h-2 text-black/50 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors"
          >
            <Maximize2 className="w-2 h-2 text-black/50 opacity-0 group-hover:opacity-100" />
          </button>
        </div>

        <span className="text-sm font-medium text-white/70 tracking-wide">{title}</span>
        
        <div className="w-12"></div> {/* Spacer to balance title */}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto custom-scrollbar relative bg-black/20">
        {children}
      </div>
    </motion.div>
  );
}
