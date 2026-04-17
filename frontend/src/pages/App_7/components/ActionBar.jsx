import { motion } from 'motion/react';
import { RefreshCw, Edit2, Play } from 'lucide-react';

export default function ActionBar({ onTryAnother, onEditName, onReplay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4 z-10"
    >
      <div className="flex bg-zinc-950/80 backdrop-blur-md p-2 rounded-2xl border border-zinc-800/50 shadow-xl">
        {/* <button
          onClick={onEditName}
          className="flex flex-col items-center justify-center w-24 h-20 gap-1 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors active:scale-95"
        >
          <Edit2 className="w-6 h-6" />
          <span className="text-xs font-medium">Edit Name</span>
        </button>
        
        <div className="w-px bg-zinc-800 my-2 mx-1" />
        
        <button
          onClick={onReplay}
          className="flex flex-col items-center justify-center w-24 h-20 gap-1 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors active:scale-95"
        >
          <Play className="w-6 h-6" />
          <span className="text-xs font-medium">Replay</span>
        </button>

        <div className="w-px bg-zinc-800 my-2 mx-1" /> */}

        <button
          onClick={onTryAnother}
          className="flex flex-col items-center justify-center w-24 h-20 gap-1 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors active:scale-95"
        >
          <RefreshCw className="w-6 h-6" />
          <span className="text-xs font-medium">Next Style</span>
        </button>
      </div>
    </motion.div>
  );
}
