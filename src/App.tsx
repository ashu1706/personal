import { useState, useEffect, useRef } from "react";
import { 
  Heart, 
  Music, 
  VolumeX, 
  Share2, 
  Check, 
  Settings,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import CountdownTimer from "./components/CountdownTimer";
import LoveLetter from "./components/LoveLetter";
import PhotoSlider from "./components/PhotoSlider";
import RSVPForm from "./components/RSVPForm";
import RestaurantMap from "./components/RestaurantMap";
import StarMap from "./components/StarMap";
import photo7 from "../assets/photo7.jpeg";
import photo6 from "../assets/photo6.jpeg";
import photo3 from "../assets/photo3.jpeg";
import photo5 from "../assets/photo5.jpeg";
import photo2 from "../assets/photo2.jpeg";

import { RSVP, PhotoMoment, RestaurantDetails } from "./types";
// Class to manage our offline romantic procedural synthesizer (Web Audio API)
class RomanticLoveSynth {
  private ctx: AudioContext | null = null;
  private intervalId: any = null;

  start() {
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Soothing harmonic arpeggios that mimic an ambient sweet music box
      // progression: Cmaj9 - G6 - Am9 - Fmaj9
      const chords = [
        [261.63, 329.63, 392.00, 493.88, 523.25], // C, E, G, B, C (Cmaj9)
        [196.00, 246.94, 293.66, 392.00, 440.00], // G, B, D, G, A (G6)
        [220.00, 261.63, 329.63, 392.00, 440.00], // A, C, E, G, A (Am7/9)
        [174.61, 220.00, 261.63, 349.23, 440.00], // F, A, C, F, A (Fmaj7/9)
      ];
      
      let chordIndex = 0;

      const playProgression = () => {
        if (!this.ctx || this.ctx.state === "suspended") return;
        const now = this.ctx.currentTime;
        const currentChord = chords[chordIndex];

        // Sequentially play chords, staggering notes for a gorgeous harp effect
        currentChord.forEach((freq, index) => {
          const osc = this.ctx!.createOscillator();
          const gainNode = this.ctx!.createGain();
          
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + index * 0.2);

          // Soft ambient amplitude envelope (slow attack, long decay)
          gainNode.gain.setValueAtTime(0, now + index * 0.2);
          gainNode.gain.linearRampToValueAtTime(0.04, now + index * 0.2 + 0.15);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.2 + 1.8);

          osc.connect(gainNode);
          gainNode.connect(this.ctx!.destination);

          osc.start(now + index * 0.2);
          osc.stop(now + index * 0.2 + 2.0);
        });

        chordIndex = (chordIndex + 1) % chords.length;
      };

      playProgression();
      this.intervalId = setInterval(playProgression, 2800);
    } catch (e) {
      console.warn("Web Audio API not supported fully in this environment browser.", e);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

export default function App() {
  // 1. Initial configuration / Hydration from URL query if boyfriend opens it!
  const defaultAnniversaryDate = "2026-06-16T20:30:00";
  const defaultSenderName = "Shawty";
  const defaultReceiverName = "Mr. Moody";
  const defaultLoveLetter = " I know I am annoying sometimes or I should say always. But in real I can never stop loving you either by myself or even if this world forces me.\n\n I love you to the moon and back jus I can not control my words the bad ones that I said to you, I never mean to that any single time I said. I love you Forever till my last breath it will be you only.\n\nI dont know how to love you the way you want I will always try to learn that I can assure you that till my end you will say, Yes!! She loves me. I have no one than you who would understand me about how I feel. I am not crying btw I am so happy to write all I have.\n\n At last I would say that I promise you to be there in your highs and lows, You are my Prince.";
  
  const defaultRestaurantDetails: RestaurantDetails = {
    name: "Our Cozy Home",
    address: "Flat 303, House No. 732, Golf Course Road, Sector 54, Gurugram, Haryana 122002",
    date: "2026-06-16",
    time: "07:30 PM",
    dressCode: "No Clothes will be better I guess",
    reservationName: "Bby",
    lat: 40.73061,
    lng: -73.935242,
    mapEmbedUrl:
  "https://maps.google.com/maps?q=Golf%20Course%20Road%20Sector%2054%20Gurugram&t=&z=15&ie=UTF8&iwloc=&output=embed",
  };

  const defaultMoments: PhotoMoment[] = [
  {
    id: "m1",
    url: photo7,
    title: "Happy Date",
    date: "The Beginning",
    caption: "The day you made me feel Special",
  },
  {
    id: "m2",
    url: photo6,
    title: "My Best View",
    date: "A Beautiful Memory",
    caption: "My favorite view is you, always and forever.",
  },
  {
    id: "m4",
    url: photo5,
    title: "Us Forever",
    date: "Today & Always",
    caption: "Every moment with you feels Home",
  },
  {
    id: "m3",
    url: photo3,
    title: "Aren't We Cute?",
    date: "Forever & Always",
    caption: "Melted my heart",
  },
  {
    id: "m5",
    url: photo2,
    title: "My Favorite Person",
    date: "Today & Always",
    caption: "You make every day brighter.",
  },
  
];
  // 2. React States
  const [senderName, setSenderName] = useState(defaultSenderName);
  const [receiverName, setReceiverName] = useState(defaultReceiverName);
  const [anniversaryDate, setAnniversaryDate] = useState(defaultAnniversaryDate);
  const [loveLetter, setLoveLetter] = useState(defaultLoveLetter);
  const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetails>(defaultRestaurantDetails);
  const [moments, setMoments] = useState<PhotoMoment[]>(defaultMoments);
  const [rsvp, setRsvp] = useState<RSVP | undefined>(undefined);

  // Helper States
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const audioManager = useRef<RomanticLoveSynth | null>(null);

  // 3. Hydrate states from localstorage OR from URL param (if boyfriend opens link)
  useEffect(() => {
    // Check URL parameters first
    const params = new URLSearchParams(window.location.search);
    const invitePayload = params.get("invite");

    if (invitePayload) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(invitePayload))));
        if (decoded.senderName) setSenderName(decoded.senderName);
        if (decoded.receiverName) setReceiverName(decoded.receiverName);
        if (decoded.anniversaryDate) setAnniversaryDate(decoded.anniversaryDate);
        if (decoded.loveLetter) setLoveLetter(decoded.loveLetter);
        if (decoded.restaurantDetails) setRestaurantDetails(decoded.restaurantDetails);
        if (decoded.moments) setMoments(decoded.moments);
        return; // Skip loading localstorage if loading a custom invite link!
      } catch (err) {
        console.error("Failed to decode customized invite payload from URL:", err);
      }
    }

    // Otherwise load local storage for the editor/creator
    const savedSender = localStorage.getItem("love_sender");
    const savedReceiver = localStorage.getItem("love_receiver");
    const savedDate = localStorage.getItem("love_date");
    const savedLetter = localStorage.getItem("love_letter");
    const savedRest = localStorage.getItem("love_restaurant");
    const savedMoments = localStorage.getItem("love_moments");
    const savedRsvp = localStorage.getItem("love_rsvp");

    if (savedSender) setSenderName(JSON.parse(savedSender));
    if (savedReceiver) setReceiverName(JSON.parse(savedReceiver));
    if (savedDate) setAnniversaryDate(JSON.parse(savedDate));
    if (savedLetter) setLoveLetter(JSON.parse(savedLetter));
    if (savedRest) setRestaurantDetails(JSON.parse(savedRest));
    if (savedMoments) setMoments(JSON.parse(savedMoments));
    if (savedRsvp) setRsvp(JSON.parse(savedRsvp));
  }, []);

  // 4. Persistence Effect
  useEffect(() => {
    // Don't save to local storage if viewing an active invite param (avoid overwriting creator's state if we are boyfriend)
    const params = new URLSearchParams(window.location.search);
    if (params.get("invite")) return;

    localStorage.setItem("love_sender", JSON.stringify(senderName));
    localStorage.setItem("love_receiver", JSON.stringify(receiverName));
    localStorage.setItem("love_date", JSON.stringify(anniversaryDate));
    localStorage.setItem("love_letter", JSON.stringify(loveLetter));
    localStorage.setItem("love_restaurant", JSON.stringify(restaurantDetails));
    localStorage.setItem("love_moments", JSON.stringify(moments));
    if (rsvp) localStorage.setItem("love_rsvp", JSON.stringify(rsvp));
  }, [senderName, receiverName, anniversaryDate, loveLetter, restaurantDetails, moments, rsvp]);

  // Audio trigger
  const toggleMusicPlay = () => {
    if (!audioManager.current) {
      audioManager.current = new RomanticLoveSynth();
    }

    if (isPlayingMusic) {
      audioManager.current.stop();
      setIsPlayingMusic(false);
    } else {
      audioManager.current.start();
      setIsPlayingMusic(true);
    }
  };

  // Clean-up synth
  useEffect(() => {
    return () => {
      audioManager.current?.stop();
    };
  }, []);

  // State handlers passed to children
  const handleAddMoment = (newMoment: Omit<PhotoMoment, "id">) => {
    const id = "m_" + Date.now();
    setMoments([...moments, { ...newMoment, id }]);
  };

  const handleDeleteMoment = (id: string) => {
    setMoments(moments.filter(m => m.id !== id));
  };

  const handleSubmitRSVP = (rsvpData: Omit<RSVP, "id" | "createdAt">) => {
    if (!rsvpData.name) {
      setRsvp(undefined);
      localStorage.removeItem("love_rsvp");
      return;
    }
    const rsvpObj: RSVP = {
      ...rsvpData,
      id: "r_" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setRsvp(rsvpObj);
  };

  // Generate customized link containing current state compressed
  const generateShareLink = () => {
    const stateBundle = {
      senderName,
      receiverName,
      anniversaryDate,
      loveLetter,
      restaurantDetails,
      moments,
    };
    const stringified = JSON.stringify(stateBundle);
    const compressed = btoa(unescape(encodeURIComponent(stringified)));
    const fullLink = `${window.location.origin}${window.location.pathname}?invite=${compressed}`;
    
    navigator.clipboard.writeText(fullLink).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  // Reset entirely to initial presets if needed
  const resetToFactoryDefaults = () => {
    if (window.confirm("Are you sure you want to reset all modifications to our default sweet template?")) {
      localStorage.clear();
      window.location.href = window.location.origin + window.location.pathname;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-romantic-50 via-white to-romantic-100/40 text-gray-800 font-sans selection:bg-romantic-200" id="main-anniversary-framework">
      
      {/* Rosebud Garland Overlay Grid */}
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-romantic-300 via-rose-200 to-romantic-400 z-40" />

      {/* Floating Music player capsule */}
      <div className="fixed bottom-6 left-6 z-40" id="floating-love-synth-music-trigger">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMusicPlay}
          className={`h-12 w-12 rounded-full shadow-lg border flex items-center justify-center transition-all cursor-pointer ${
            isPlayingMusic 
              ? "bg-romantic-400 text-white border-romantic-300 animate-spin" 
              : "bg-white text-romantic-500 border-romantic-200"
          }`}
          title={isPlayingMusic ? "Mute Background Harmony" : "Play Gentle Romantic Harmony"}
        >
          {isPlayingMusic ? <Music className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-gray-400" />}
        </motion.button>
        {isPlayingMusic && (
          <div className="absolute left-14 top-3.5 bg-white/85 backdrop-blur-xs border border-pink-100 rounded-full px-3 py-0.5 whitespace-nowrap shadow-xs pointer-events-none text-[10px] uppercase font-bold tracking-widest text-romantic-500 animate-pulse font-sans">
            Playing Harp Harmony ♫
          </div>
        )}
      </div>

      {/* Floating Quick Customizer Toolbar for the user */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2" id="floating-customizer-toolbar">
        <AnimatePresence>
          {showConfigPanel && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="bg-white/95 backdrop-blur-md border border-romantic-200 rounded-2xl p-5 shadow-2xl w-72 text-sm space-y-4"
              id="anniversary-date-picker-widget"
            >
              <div className="flex justify-between items-center border-b border-pink-50 pb-2">
                <span className="font-display font-bold text-romantic-600 flex items-center gap-1.5 text-base">
                  <Settings className="h-4.5 w-4.5 text-romantic-400" />
                  Invitation Options
                </span>
                <button
                  onClick={() => setShowConfigPanel(false)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-romantic-500 uppercase tracking-widest">
                    Dinner Countdown Target Date
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full mt-1.5 p-2 bg-pink-50/50 border border-romantic-200 rounded-lg text-xs font-mono font-bold text-romantic-600 focus:outline-none"
                    value={anniversaryDate.slice(0, 16)}
                    onChange={(e) => setAnniversaryDate(e.target.value)}
                  />
                  <span className="text-[9px] text-gray-400 font-sans mt-1 block">
                    Choose when your lovely anniversary dinner initiates.
                  </span>
                </div>

                <div className="pt-2 border-t border-pink-50 flex flex-col gap-2">
                  <button
                    onClick={generateShareLink}
                    className="w-full py-2.5 bg-romantic-400 hover:bg-romantic-500 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Share2 className="h-3 w-3" />
                    {copiedLink ? "Link Copied!" : "Copy Invite Link"}
                  </button>
                  <button
                    onClick={resetToFactoryDefaults}
                    className="w-full py-1.5 text-gray-400 hover:text-rose-500 text-[10px] transition font-bold uppercase tracking-wider"
                  >
                    Reset Template
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2">
          {/* Quick Share Link button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateShareLink}
            className="px-4.5 py-3 rounded-full bg-romantic-400 hover:bg-romantic-500 text-white shadow-lg border border-romantic-300 font-bold uppercase text-xs tracking-widest flex items-center gap-2 cursor-pointer transition-colors"
            id="share-invite-btn-widget"
          >
            {copiedLink ? <Check className="h-4 w-4 animate-bounce" /> : <Share2 className="h-4 w-4" />}
            {copiedLink ? "Copied Invite! ♥" : "Get Invite Link"}
          </motion.button>

          {/* Settings gear toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowConfigPanel(!showConfigPanel)}
            className="p-3 bg-white hover:bg-romantic-50 border border-romantic-200 text-romantic-500 rounded-full shadow-lg cursor-pointer"
            id="settings-gear-btn"
          >
            <Settings className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden pt-24 pb-16 px-4 flex flex-col items-center justify-center text-center" id="sweet-hero-banner">
        {/* Floating Heart vector assets in background */}
        <div className="absolute top-1/4 left-10 opacity-10 text-[64px] float-slow pointer-events-none">🌸</div>
        <div className="absolute top-1/3 right-12 opacity-10 text-[72px] float-slow pointer-events-none" style={{ animationDelay: "2s" }}>❤️</div>
        <div className="absolute bottom-10 left-1/4 opacity-10 text-[56px] float-slow pointer-events-none" style={{ animationDelay: "4s" }}>✨</div>

        <div className="max-w-3xl space-y-6 relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.2 }}
            className="mx-auto h-20 w-20 rounded-full bg-pink-100/70 border border-romantic-200 flex items-center justify-center text-romantic-500 heartbeat-sync shadow-inner"
          >
            <Heart className="h-10 w-10 fill-romantic-300 text-romantic-500" />
          </motion.div>

          <div className="space-y-3">
            <motion.h4
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-script text-3xl sm:text-4xl text-romantic-400 block tracking-wide"
            >
              My Dearest {receiverName},
            </motion.h4>
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-5xl sm:text-7xl font-semibold leading-tight text-romantic-600 tracking-tight"
            >
              Happy Anniversary
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.3 }}
              className="font-serif italic text-lg sm:text-xl text-gray-500 max-w-xl mx-auto"
            >
             To celebrate another beautiful year of us, I have planned a special evening just for you and me.
            </motion.p>
          </div>

          {/* Countdown timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-6"
          >
            <CountdownTimer targetDate={anniversaryDate} />
          </motion.div>
        </div>
      </section>

      {/* Dividers: Symmetrical heart string */}
      <div className="flex items-center justify-center gap-4 py-6" id="symmetrical-heart-divider">
        <div className="h-px w-20 sm:w-40 bg-gradient-to-r from-transparent to-romantic-300" />
        <Heart className="h-3 w-3 text-romantic-400 fill-romantic-300 rotate-12" />
        <Heart className="h-4.5 w-4.5 text-romantic-500 fill-romantic-400" />
        <Heart className="h-3 w-3 text-romantic-400 fill-romantic-300 -rotate-12" />
        <div className="h-px w-20 sm:w-40 bg-gradient-to-l from-transparent to-romantic-300" />
      </div>

      {/* Love Letter (Personal Message) Section */}
      <section className="bg-white/30 backdrop-blur-md py-12" id="personal-letter-section">
        <div className="max-w-7xl mx-auto">
          <LoveLetter
            message={loveLetter}
            onUpdateMessage={setLoveLetter}
            senderName={senderName}
            receiverName={receiverName}
            onUpdateNames={(s, r) => {
              setSenderName(s);
              setReceiverName(r);
            }}
          />
        </div>
      </section>

      {/* Symmetrical heart string */}
      <div className="flex items-center justify-center gap-4 py-6">
        <div className="h-px w-20 sm:w-40 bg-gradient-to-r from-transparent to-romantic-300" />
        <Heart className="h-4.5 w-4.5 text-romantic-500 fill-romantic-400 animate-pulse" />
        <div className="h-px w-20 sm:w-40 bg-gradient-to-l from-transparent to-romantic-300" />
      </div>

      {/* Photo Slider Section */}
      <section className="py-12" id="gallery-story-section">
        <PhotoSlider
          moments={moments}
          onAddMoment={handleAddMoment}
          onDeleteMoment={handleDeleteMoment}
        />
      </section>

      {/* Symmetrical heart string */}
      <div className="flex items-center justify-center gap-4 py-6">
        <div className="h-px w-20 sm:w-40 bg-gradient-to-r from-transparent to-romantic-300" />
        <Heart className="h-3.5 w-3.5 text-romantic-500 fill-romantic-400" />
        <div className="h-px w-20 sm:w-40 bg-gradient-to-l from-transparent to-romantic-300" />
      </div>

      {/* Map Section */}
      <section className="bg-white/30 backdrop-blur-md py-12" id="restaurant-coordinates-section">
        <RestaurantMap
          details={restaurantDetails}
          onUpdateDetails={setRestaurantDetails}
        />
      </section>

      {/* Symmetrical heart string */}
      <div className="flex items-center justify-center gap-4 py-6">
        <div className="h-px w-20 sm:w-40 bg-gradient-to-r from-transparent to-romantic-300" />
        <Heart className="h-5 w-5 text-romantic-500 fill-romantic-400 animate-bounce" />
        <div className="h-px w-20 sm:w-40 bg-gradient-to-l from-transparent to-romantic-300" />
      </div>

      {/* RSVP Form Section */}
      <section className="py-12" id="rsvp-reservation-form-section">
        <RSVPForm
          onSubmitRSVP={handleSubmitRSVP}
          savedRSVP={rsvp}
        />
      </section>

      {/* Symmetrical heart string */}
      <div className="flex items-center justify-center gap-4 py-6">
        <div className="h-px w-20 sm:w-40 bg-gradient-to-r from-transparent to-romantic-300" />
        <Heart className="h-3.5 w-3.5 text-romantic-500 fill-romantic-300" />
        <div className="h-px w-20 sm:w-40 bg-gradient-to-l from-transparent to-romantic-300" />
      </div>


      <section className="bg-white/30 backdrop-blur-md py-12 pb-24">
      <StarMap />
    </section>


      {/* Footer message */}
      <footer className="bg-white/70 backdrop-blur-md border-t border-romantic-200 py-10 text-center text-gray-500 text-xs font-serif" id="applet-page-footer">
        <div className="max-w-md mx-auto space-y-2 flex flex-col items-center">
          <Heart className="h-5 w-5 text-romantic-400 fill-romantic-200 heartbeat-sync" />
          <p className="font-display font-semibold text-romantic-600 text-sm italic tracking-wide">
            Designed with endless love.
          </p>
        </div>
      </footer>
    </div>
  );
}
