import { useState, useRef } from "react";
import { Mail, Heart, ChevronDown, Check, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LoveLetterProps {
  message: string;
  onUpdateMessage: (newMessage: string) => void;
  senderName: string;
  receiverName: string;
  onUpdateNames: (sender: string, receiver: string) => void;
}

export default function LoveLetter({
  message,
  onUpdateMessage,
  senderName,
  receiverName,
  onUpdateNames,
}: LoveLetterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempMessage, setTempMessage] = useState(message);
  const [tempSender, setTempSender] = useState(senderName);
  const [tempReceiver, setTempReceiver] = useState(receiverName);

  const handleSave = () => {
    onUpdateMessage(tempMessage);
    onUpdateNames(tempSender, tempReceiver);
    setIsEditing(false);
  };

  return (
    <div className="relative max-w-2xl mx-auto py-8 px-4" id="love-letter-module">
      <div className="text-center mb-6">
        <h2 className="font-display text-4xl text-romantic-600 font-medium">A Letter for You</h2>
        <p className="font-script text-2xl text-romantic-400 mt-1">Written from my heart</p>
      </div>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* Sealed Envelope View */
          <motion.div
            key="envelope"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            onClick={() => setIsOpen(true)}
            className="cursor-pointer group relative bg-romantic-100 rounded-2xl p-8 shadow-xl max-w-lg mx-auto border border-romantic-200 overflow-hidden flex flex-col items-center justify-center min-h-[280px] hover:shadow-2xl hover:border-romantic-300 transition-all"
            id="envelope-sealed"
          >
            {/* Flap outline back elements */}
            <div className="absolute top-0 inset-x-0 h-0 w-0 border-t-[140px] border-t-white/30 border-x-[260px] border-x-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-[140px] bg-romantic-50/20 rounded-b-2xl pointer-events-none border-t border-romantic-200/40" />

            {/* Heart Seal (Clickable Button) */}
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="z-10 bg-white shadow-lg h-16 w-16 rounded-full flex items-center justify-center border border-romantic-200 text-romantic-500 hover:text-romantic-600"
              id="seal-sticker"
            >
              <Heart className="h-8 w-8 text-romantic-500 fill-romantic-300 group-hover:fill-romantic-400 transition-colors animate-pulse" />
            </motion.div>

            <span className="z-10 mt-6 font-serif text-sm tracking-widest text-romantic-500 uppercase font-medium">
              Click to Open
            </span>
            <span className="z-10 font-script text-xl text-romantic-400 mt-1">
              To: {receiverName}
            </span>
          </motion.div>
        ) : (
          /* Opened Letter View */
          <motion.div
            key="letter"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-2xl border border-romantic-200/60 relative"
            id="envelope-opened"
          >
            {/* Cursive Handwriting Notebook Line Styling */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-red-200/40" />
            
            <div className="absolute right-4 top-4 flex gap-2">
              <button
                onClick={() => {
                  setTempMessage(message);
                  setTempSender(senderName);
                  setTempReceiver(receiverName);
                  setIsEditing(!isEditing);
                }}
                className="p-2 rounded-full hover:bg-romantic-100 text-romantic-400 hover:text-romantic-500 transition-colors"
                title="Edit message"
                id="edit-message-btn"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4" id="edit-message-form">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-romantic-500 uppercase tracking-wider">To (Boyfriend's Name)</label>
                    <input
                      type="text"
                      className="mt-1 w-full p-2 border border-romantic-200 rounded-lg text-sm bg-white/70 focus:outline-none focus:ring-1 focus:ring-romantic-400"
                      value={tempReceiver}
                      onChange={(e) => setTempReceiver(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-romantic-500 uppercase tracking-wider">From (Your Name)</label>
                    <input
                      type="text"
                      className="mt-1 w-full p-2 border border-romantic-200 rounded-lg text-sm bg-white/70 focus:outline-none focus:ring-1 focus:ring-romantic-400"
                      value={tempSender}
                      onChange={(e) => setTempSender(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-romantic-500 uppercase tracking-wider">Your Love Letter Content</label>
                  <textarea
                    rows={6}
                    className="mt-1 w-full p-2 border border-romantic-200 rounded-lg text-sm bg-white/70 focus:outline-none focus:ring-1 focus:ring-romantic-400 font-sans"
                    value={tempMessage}
                    onChange={(e) => setTempMessage(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-1.5 text-xs bg-romantic-400 hover:bg-romantic-500 text-white font-medium rounded-lg shadow-sm flex items-center gap-1 transition-all"
                  >
                    <Check className="h-3 w-3" /> Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-6" id="letter-content-display">
                <div className="font-serif italic text-lg sm:text-xl text-romantic-600 font-medium tracking-wide">
                  Dearest {receiverName},
                </div>
                
                <p className="font-serif leading-relaxed text-gray-700 text-base sm:text-lg whitespace-pre-line text-justify tracking-wide pl-2">
                  {message}
                </p>

                <div className="self-end text-right pt-4 px-4 border-t border-romantic-100/60 w-1/2">
                  <span className="font-script text-3xl text-romantic-500 block leading-none">
                    From your,
                  </span>
                  <span className="font-serif italic text-lg text-romantic-600 font-medium block mt-1">
                    {senderName}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-romantic-50 border border-romantic-200 text-romantic-500 text-xs font-medium uppercase tracking-widest rounded-full hover:bg-romantic-100 flex items-center gap-1 transition-all"
                id="close-envelope-btn"
              >
                Close Letter
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
