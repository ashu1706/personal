import React, { useState } from "react";
import { MapPin, Calendar, Clock, Sparkles, Navigation, Edit2, Check, UserCheck, ShieldAlert } from "lucide-react";
import { RestaurantDetails } from "../types";

interface RestaurantMapProps {
  details: RestaurantDetails;
  onUpdateDetails: (updated: RestaurantDetails) => void;
}

export default function RestaurantMap({ details, onUpdateDetails }: RestaurantMapProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(details.name);
  const [address, setAddress] = useState(details.address);
  const [date, setDate] = useState(details.date);
  const [time, setTime] = useState(details.time);
  const [dressCode, setDressCode] = useState(details.dressCode);
  const [reservationName, setReservationName] = useState(details.reservationName);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    // We can generate a dynamic OpenStreetMap Search Embed URL for the address!
    // The OpenStreetMap embeds can read from standard Nominatim searches
    const osmEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(
      name + ", " + address
    )}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

    onUpdateDetails({
      name,
      address,
      date,
      time,
      dressCode,
      reservationName,
      lat: details.lat,
      lng: details.lng,
      mapEmbedUrl: osmEmbed,
    });
    setIsEditing(false);
  };

  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    details.name + " " + details.address
  )}`;

  return (
    <div className="relative max-w-5xl mx-auto py-12 px-4" id="restaurant-navigation-module">
      <div className="text-center mb-8">
        <h2 className="font-display text-4xl text-romantic-600 font-medium">A Table Set With Love</h2>
        <p className="font-script text-2xl text-romantic-400 mt-1">Every dish on the table carries a piece of my heart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Information Card with table booking details */}
        <div className="lg:col-span-5 bg-white/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-romantic-200 shadow-xl flex flex-col justify-between relative overflow-hidden" id="booking-specifications-card">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/30 rounded-bl-full pointer-events-none" />
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-romantic-100 text-romantic-400 hover:text-romantic-505 transition-colors"
            title="Edit location info"
            id="edit-location-btn"
          >
            <Edit2 className="h-4 w-4" />
          </button>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4" id="edit-location-form">
              <h3 className="font-display text-lg text-romantic-600 font-bold mb-2">Edit Reservation Info</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-semibold text-romantic-500 uppercase tracking-widest">Restaurant Name</label>
                  <input
                    type="text"
                    required
                    className="w-full mt-1 p-2 border border-romantic-200 rounded-lg text-sm bg-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-romantic-500 uppercase tracking-widest">Full Address</label>
                  <input
                    type="text"
                    required
                    className="w-full mt-1 p-2 border border-romantic-200 rounded-lg text-sm bg-white"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-romantic-500 uppercase tracking-widest">Dinner Date</label>
                    <input
                      type="date"
                      className="w-full mt-1 p-2 border border-romantic-200 rounded-lg text-xs bg-white"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-romantic-500 uppercase tracking-widest">Time</label>
                    <input
                      type="text"
                      className="w-full mt-1 p-2 border border-romantic-200 rounded-lg text-xs bg-white"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-romantic-500 uppercase tracking-widest">Dress Code</label>
                    <input
                      type="text"
                      className="w-full mt-1 p-2 border border-romantic-200 rounded-lg text-xs bg-white"
                      value={dressCode}
                      onChange={(e) => setDressCode(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-romantic-500 uppercase tracking-widest">Reservation Name</label>
                    <input
                      type="text"
                      className="w-full mt-1 p-2 border border-romantic-200 rounded-lg text-xs bg-white"
                      value={reservationName}
                      onChange={(e) => setReservationName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-gray-50 text-gray-500 border border-gray-150 rounded-lg text-xs font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-romantic-400 hover:bg-romantic-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Check className="h-3 w-3" /> Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6" id="location-view-display">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-romantic-500 text-[10px] uppercase font-bold tracking-widest leading-none">
                  <Sparkles className="h-2.5 w-2.5" /> Anniversary Dinner Table
                </span>
                <h3 className="font-display text-3xl text-romantic-600 font-bold leading-tight pt-1">
                  {details.name}
                </h3>
                <p className="font-serif text-sm text-gray-500 flex items-start gap-1">
                  <MapPin className="h-4 w-4 text-romantic-400 shrink-0 mt-0.5" />
                  <span>{details.address}</span>
                </p>
              </div>

              {/* Grid of RSVP details */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-pink-100/60 py-5 font-serif text-sm">
                <div className="space-y-1">
                  <span className="font-sans text-[10px] text-romantic-400 uppercase tracking-widest block font-semibold">Date</span>
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Calendar className="h-4 w-4 text-romantic-300" />
                    <span>{new Date(details.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-sans text-[10px] text-romantic-400 uppercase tracking-widest block font-semibold">Time</span>
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Clock className="h-4 w-4 text-romantic-300" />
                    <span>{details.time}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-sans text-[10px] text-romantic-400 uppercase tracking-widest block font-semibold">Dress Code</span>
                  <div className="text-gray-700">
                    <span> {details.dressCode}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-sans text-[10px] text-romantic-400 uppercase tracking-widest block font-semibold">Res. Name</span>
                  <div className="text-gray-700 font-bold">
                    <span> {details.reservationName}</span>
                  </div>
                </div>
              </div>

              <div className="bg-pink-50/40 p-4 rounded-xl border border-pink-100/40">
                <p className="font-sans text-xs text-romantic-500 leading-relaxed italic">
                  "Only our favorite dishes, beautiful soft candles, some red wine, and table conversation that will last until midnight. Wear your beautiful smile. See you there!"
                </p>
              </div>

              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-romantic-500 hover:bg-romantic-600 text-white font-bold rounded-2xl shadow-md hover:shadow-pink-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                id="navigate-maps-btn"
              >
                <Navigation className="h-4 w-4" />
                Open Directions in Maps
              </a>
            </div>
          )}
        </div>

        {/* Right Side: Maps Embed */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-pink-100 shadow-xl overflow-hidden aspect-video lg:aspect-auto min-h-[320px] relative flex flex-col justify-between" id="embedded-interactive-map-frame">
          <iframe
            src={details.mapEmbedUrl}
            title={`${details.name} Location Map`}
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            className="border-0 w-full h-full filter saturate-[95%] hue-rotate-[-10deg]"
          />
        </div>
      </div>
    </div>
  );
}
