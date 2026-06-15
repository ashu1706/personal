import React, { useState, useRef } from "react";
import { Heart, Sparkles, Smile, Check, MapPin, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RSVP } from "../types";
import emailjs from "@emailjs/browser";

interface RSVPFormProps {
  onSubmitRSVP: (rsvpData: Omit<RSVP, "id" | "createdAt">) => void;
  savedRSVP?: RSVP;
}

export default function RSVPForm({ onSubmitRSVP, savedRSVP }: RSVPFormProps) {
  const [name, setName] = useState(savedRSVP?.name || "");
  const [diet, setDiet] = useState(savedRSVP?.dietPreference || "Anything on the menu!");
  const [secretMsg, setSecretMsg] = useState(savedRSVP?.secretMessage || "");
  const [showConfetti, setShowConfetti] = useState(false);
  const [noButtonClicks, setNoButtonClicks] = useState(0);

  // For moving the No button playful physics
  const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const diets = [
    "Anything on the menu! 🍽️",
    "Spicy Food Lover!",
    "Extra Sweet Tooth Only! 🍰",
    "Cook's Choice ♥",
    "Me 💀"
  ];

  const moveNoButton = () => {
    // Generate randomized position shifts
    const randomX = Math.floor(Math.random() * 160) - 80; // random shift between -80px and 80px
    const randomY = Math.floor(Math.random() * 80) - 40;  // random shift between -40px and 40px
    setNoBtnPosition({ x: randomX, y: randomY });
    setNoButtonClicks((prev) => prev + 1);
  };

  const getNoBtnText = () => {
    switch (noButtonClicks) {
      case 0: return "No, sorry...";
      case 1: return "Are you sure? 🤔";
      case 2: return "Think again! 🥺";
      case 3: return "Access Denied! ❌";
      case 4: return "Try clicking me now! 😜";
      case 5: return "Still no? Impossible.";
      default: return "System Error: Love Only! ♥";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!name.trim()) return;

  try {
    await emailjs.send(
  "service_pb8weiv",
  "template_ggfnbnm",
  {
    name,
    diet,
    message: secretMsg,
    attending: "Yes ❤️",
  },
  "3rZiADMBglvEepWvU"
);

    alert("RSVP sent successfully ❤️");
  } catch (err) {
    console.error(err);
    alert("Failed to send RSVP");
  }

  onSubmitRSVP({
    name,
    attending: true,
    dietPreference: diet,
    secretMessage: secretMsg,
  });
};

  // Generate floating hearts for the background of the form
  const [hoveredHeart, setHoveredHeart] = useState(false);

  return (
    <div className="relative max-w-2xl mx-auto py-12 px-4 relative overflow-hidden" id="rsvp-section-box">
      {/* Floating Hearts Confetti Layer */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            {[...Array(40)].map((_, i) => {
              const randX = Math.random() * 100 - 50;
              const randY = Math.random() * 100 - 50;
              const delay = Math.random() * 0.5;
              const size = Math.random() * 20 + 10;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.2, 1, 0.5],
                    x: randX * 10,
                    y: randY * -10 - 200,
                  }}
                  transition={{ duration: 3, delay, ease: "easeOut" }}
                  className="absolute"
                  style={{ fontSize: `${size}px` }}
                >
                  {i % 2 === 0 ? "❤️" : i % 3 === 0 ? "💖" : "✨"}
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <div className="text-center mb-8">
        <h2 className="font-display text-4xl text-romantic-600 font-medium">Join Me for Dinner</h2>
        <p className="font-script text-2xl text-romantic-400 mt-1">Please RSVP so I can finalize the candlelight</p>
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border border-romantic-200">
        <div className="absolute top-4 right-4 animate-bounce">
          <Heart className="h-6 w-6 text-romantic-300 fill-romantic-100" />
        </div>

        {savedRSVP ? (
          <div className="text-center py-6 space-y-4" id="rsvp-confirmed-message">
            <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-500 mx-auto flex items-center justify-center">
              <Check className="h-7 w-7" />
            </div>
            <h3 className="font-display text-2xl text-emerald-700 font-bold">Successfully RSVP'd!</h3>
            <p className="text-gray-600 font-serif text-sm max-w-sm mx-auto">
              Our reservation is secured! You said yes to candlelit dining, delicious food, and endless smiles with {name}.
            </p>
            <div className="p-4 bg-pink-50/50 rounded-xl border border-pink-100 max-w-md mx-auto text-left text-xs font-sans text-romantic-600">
              <p><strong>Culinary:</strong> {savedRSVP.dietPreference}</p>
              {savedRSVP.secretMessage && <p className="mt-1"><strong>Secret Request:</strong> "{savedRSVP.secretMessage}"</p>}
            </div>
            <button
              onClick={() => {
                // Allows re-submitting if they want to edit
                setName(savedRSVP.name);
                setDiet(savedRSVP.dietPreference);
                setSecretMsg(savedRSVP.secretMessage);
                // Clear the saved RSVP temporarily for edit
                onSubmitRSVP({ name: "", attending: false, dietPreference: "", secretMessage: "" });
              }}
              className="mt-4 text-xs font-sans font-bold text-romantic-500 hover:text-romantic-600 underline"
            >
              Update RSVP Choices
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" id="rsvp-submission-form">
            {/* Guest Name */}
            <div>
              <label className="block text-xs font-semibold text-romantic-500 uppercase tracking-widest">
                What should I call you?
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  required
                  placeholder="Enter your cute nickname..."
                  className="w-full pl-4 pr-10 py-3 bg-white border border-romantic-200 rounded-xl font-serif text-base text-gray-700 focus:outline-none focus:ring-1 focus:ring-romantic-400 placeholder:text-gray-300"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Smile className="absolute right-3.5 top-3.5 h-4 w-4 text-romantic-300" />
              </div>
            </div>

            {/* Attendance selection */}
            <div>
              <label className="block text-xs font-semibold text-romantic-500 uppercase tracking-widest mb-3 text-center sm:text-left">
                Will you be my beautiful date?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Yes button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setHoveredHeart(true)}
                  onMouseLeave={() => setHoveredHeart(false)}
                  className="py-4.5 px-6 bg-gradient-to-r from-romantic-400 to-pink-500 hover:from-romantic-500 hover:to-pink-600 text-white font-bold rounded-2xl shadow-lg border border-romantic-300 hover:shadow-pink-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Heart className={`h-5 w-5 ${hoveredHeart ? "fill-white text-white rotate-12 scale-110" : "text-pink-100"} transition-all`} />
                  YES, count me in, 100%!
                </motion.button>

                {/* No button (Playful runner) */}
                <div className="relative inline-block w-full h-14" style={{ perspective: 500 }}>
                  <motion.button
                    type="button"
                    ref={noButtonRef}
                    animate={{ x: noBtnPosition.x, y: noBtnPosition.y }}
                    onMouseEnter={moveNoButton}
                    onClick={moveNoButton}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-0 bg-gray-50 border border-gray-200 text-gray-500 font-semibold rounded-2xl flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-colors text-sm"
                  >
                    {getNoBtnText()}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Food preferences */}
            <div>
              <label className="block text-xs font-semibold text-romantic-500 uppercase tracking-widest mb-3">
                Select Your Culinary Craving
              </label>
              <div className="flex flex-wrap gap-2">
                {diets.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDiet(item)}
                    className={`px-4 py-2 text-xs font-serif rounded-full border transition-all ${
                      diet === item
                        ? "bg-romantic-100 border-romantic-400 text-romantic-600 font-semibold"
                        : "bg-white border-romantic-200 text-gray-600 hover:bg-romantic-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Specific notes */}
            <div>
              
              <textarea
                placeholder="e.g. Can we share a chocolate lava cake? Or 'I'll bring the roses!'"
                rows={3}
                className="w-full mt-2 p-3 bg-white border border-romantic-200 rounded-xl font-serif text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-romantic-400 placeholder:text-gray-300"
                value={secretMsg}
                onChange={(e) => setSecretMsg(e.target.value)}
              />
            </div>

            {/* RSVP Submit Alternative Button */}
            <div className="text-center pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-romantic-50 hover:bg-romantic-100 text-romantic-500 text-xs font-bold uppercase tracking-widest rounded-full border border-romantic-200 transition-colors"
              >
                <Send className="h-3.5 w-3.5" /> Submit RSVP Form
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
