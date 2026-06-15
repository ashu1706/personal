import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Calendar, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PhotoMoment } from "../types";

interface PhotoSliderProps {
  moments: PhotoMoment[];
  onAddMoment: (moment: Omit<PhotoMoment, "id">) => void;
  onDeleteMoment: (id: string) => void;
}

export default function PhotoSlider({ moments, onAddMoment, onDeleteMoment }: PhotoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % moments.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + moments.length) % moments.length);
  };

  const currentMoment = moments[currentIndex];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || !newTitle) {
      alert("Please provide at least a title and a valid image URL!");
      return;
    }
    onAddMoment({
      title: newTitle,
      caption: newCaption || "A special moment together...",
      date: newDate || "Sometime Beautiful",
      url: newUrl,
    });
    // Reset form
    setNewTitle("");
    setNewCaption("");
    setNewDate("");
    setNewUrl("");
    setShowAddForm(false);
    setCurrentIndex(moments.length); // switch to the newly added item
  };

  const removeCurrent = () => {
    if (moments.length <= 1) {
      alert("You need at least one beautiful memory to showcase!");
      return;
    }
    onDeleteMoment(currentMoment.id);
    setCurrentIndex(0);
  };

  return (
    <div className="relative max-w-4xl mx-auto py-12 px-4" id="photo-moments-gallery">
      <div className="text-center mb-8">
        <h2 className="font-display text-4xl text-romantic-600 font-medium">Our Story in Frames</h2>
        <p className="font-script text-2xl text-romantic-400 mt-1">Every picture tells a million love stories</p>
      </div>

      <div className="relative flex flex-col items-center">
        {moments.length === 0 ? (
          <div className="text-center p-12 bg-white/60 border border-romantic-200 rounded-2xl w-full">
            <p className="text-gray-500 font-serif">No moments added yet. Let's create some!</p>
          </div>
        ) : (
          <div className="relative w-full max-w-md" id="carousel-frame-container">
            {/* Washi-Tape Accent at the top */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-28 h-6 bg-pink-100/75 border-l-2 border-r-2 border-dashed border-romantic-300 opacity-80 z-20 rotate-[-2deg] flex items-center justify-center font-sans text-[10px] text-romantic-500 uppercase tracking-widest pointer-events-none shadow-sm">
              ♥ together ♥
            </div>

            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentMoment.id}
                initial={{ opacity: 0, x: 100, rotate: -2 }}
                animate={{ opacity: 1, x: 0, rotate: 1 }}
                exit={{ opacity: 0, x: -100, rotate: 2 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-white p-4 pb-8 rounded-sm shadow-2xl border border-gray-100 flex flex-col aspect-[4/5] justify-between relative transform hover:scale-[1.01] transition-transform"
                id={`polaroid-${currentMoment.id}`}
              >
                {/* Photo space */}
                <div className="relative w-full aspect-square overflow-hidden bg-romantic-50 rounded-xs border border-gray-100/50">
                  <img
                    src={currentMoment.url}
                    alt={currentMoment.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute bottom-2 right-2 bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Calendar className="h-2.5 w-2.5 text-romantic-500" />
                    <span className="font-sans text-[10px] text-gray-600 font-medium">{currentMoment.date}</span>
                  </div>
                </div>

                {/* Polaroid Text Box */}
                <div className="mt-5 text-center px-2">
                  <h3 className="font-display text-xl text-romantic-600 font-semibold italic truncate">
                    {currentMoment.title}
                  </h3>
                  <p className="font-script text-2xl text-romantic-400 mt-1.5 leading-tight line-clamp-2">
                    "{currentMoment.caption}"
                  </p>
                </div>

                {/* Quick actions inside card */}
                <button
                  type="button"
                  onClick={removeCurrent}
                  className="absolute bottom-2 right-2 p-1.5 rounded-full text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-colors opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-60"
                  title="Remove reference photo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6 w-full px-2">
              <button
                onClick={prevSlide}
                className="p-2.5 bg-white border border-romantic-200 text-romantic-500 hover:bg-romantic-100 rounded-full shadow-md transition-all active:scale-90"
                id="carousel-btn-prev"
                title="Previous photo"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="font-sans text-xs text-romantic-400 font-bold tracking-widest bg-pink-50/50 px-3 py-1 rounded-full border border-pink-100/40">
                {currentIndex + 1} / {moments.length}
              </div>

              <button
                onClick={nextSlide}
                className="p-2.5 bg-white border border-romantic-200 text-romantic-500 hover:bg-romantic-100 rounded-full shadow-md transition-all active:scale-90"
                id="carousel-btn-next"
                title="Next photo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-4.5 py-2 bg-white hover:bg-romantic-50 border border-romantic-200 text-romantic-500 rounded-full text-xs font-semibold uppercase tracking-widest shadow-sm hover:shadow-md transition-all duration-300"
            id="toggle-add-photo-btn"
          >
            <Plus className="h-3.5 w-3.5" />
            Add a New Memory
          </button>

          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-6 w-full max-w-lg bg-white/70 backdrop-blur-md rounded-2xl border border-romantic-200/60 shadow-xl p-6"
                id="add-photo-form-box"
              >
                <form onSubmit={handleCreate} className="space-y-4">
                  <h4 className="font-display text-lg text-romantic-600 font-medium flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-romantic-400" />
                    Insert Couple Moment
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-romantic-500 uppercase tracking-wider">Moment Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Rainy Day Hugs"
                        required
                        className="mt-1 w-full p-2 border border-romantic-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-romantic-400"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-romantic-500 uppercase tracking-wider">Date</label>
                      <input
                        type="text"
                        placeholder="e.g. October 14, 2025"
                        className="mt-1 w-full p-2 border border-romantic-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-romantic-400"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-romantic-500 uppercase tracking-wider">Unsplash Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      required
                      className="mt-1 w-full p-2 border border-romantic-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-romantic-400"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                    />
                    <span className="text-[10px] text-gray-400 font-sans mt-1 block">
                      Tip: You can copy any Unsplash picture URL, e.g. from unsplash.com or keep our default ones!
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-romantic-500 uppercase tracking-wider">Caption/Love Note</label>
                    <input
                      type="text"
                      placeholder="e.g. Hand in hand we stroll anywhere..."
                      className="mt-1 w-full p-2 border border-romantic-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-romantic-400"
                      value={newCaption}
                      onChange={(e) => setNewCaption(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-romantic-100">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs bg-romantic-400 hover:bg-romantic-500 text-white font-semibold rounded-lg shadow-sm transition"
                    >
                      Save Memory
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
