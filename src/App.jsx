// ./App.jsx
import React, { useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import Calendar from "./components/Calendar.jsx";
import EventCard from "./components/EventCard.jsx";
import MapView from "./components/MapView.jsx";

export default function App() {
  const apiKey = "AIzaSyAVqgZ7cFS1H6VR2ffVH1We8Z9KYkB3-D0";

  // Map known location names to coordinates for the map pins
  const coordsByLocation = useMemo(
    () => ({
      "The Union": { lat: 40.817748017902026, lng: -96.70036127955429 },
      "Memorial Stadium": { lat: 40.82069437820795, lng: -96.70558792268038 },
      "Avery Hall": { lat: 40.81947974559484, lng: -96.7044773183429 },
      "Selleck": { lat: 40.81901427788554, lng: -96.69949222684372 },
      "Kaufmann": { lat: 40.81977928709701, lng: -96.7004736305157 },
      
    }),
    []
  );

  // Events now live in state
  const [events, setEvents] = useState([
    {
      title: "Tech Meet",
      date: "10/15/2025",
      time: "18:00",
      location: "The Union",
      coords: coordsByLocation["The Union"],
    },
    {
      title: "Football Exhibition",
      date: "10/20/2025",
      time: "19:00",
      location: "Memorial Stadium",
      coords: coordsByLocation["Memorial Stadium"],
    },
  ]);

  // Selected date coming from the Calendar (optional but nice)
  const [selectedDate, setSelectedDate] = useState("");

  // Simple modal visibility
  const [showForm, setShowForm] = useState(false);

  // Form fields
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
  });

  const todayDMY = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`; // e.g. 05/11/2025
  };

  const openForm = () => {
    const today = todayDMY();
    let prefill = today;
    if (selectedDate) {
      const [y, m, d] = selectedDate.split("-").map(Number);
      const selected = new Date(y, m - 1, d);
      const now = new Date();
      if (selected >= now) {
        prefill = `${String(d).padStart(2, "0")}/${String(m).padStart(
          2,
          "0"
        )}/${y}`;
      }
    }

    setForm((f) => ({ ...f, date: prefill }));
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const addEvent = (e) => {
    e.preventDefault();
    const coords = coordsByLocation[form.location] || null;
    setEvents((prev) => [...prev, { ...form, coords }]);
    // Reset and close
    setForm({ title: "", date: "", time: "", location: "" });
    setShowForm(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-gray-200 font-sans">
      {/* Pass the openForm handler into Header */}
      <Header onCreateClick={openForm} />

      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 p-6 overflow-hidden">
        {/* Left Column */}
        <div className="md:col-span-5 flex flex-col gap-6 pr-2 h-full overflow-hidden">
          {/* Calendar: fixed height, does not shrink */}
          <div className="flex-none h-[380px] md:h-[460px] shrink-0">
            <Calendar onDateSelect={(d) => setSelectedDate(d)} />
          </div>

          {/* Events List: scrolls independently */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
            {events.length === 0 ? (
              <div className="bg-gray-900 rounded-xl p-4 text-sm text-gray-400">
                No events yet. Click “Create Event” to add one.
              </div>
            ) : (
              events.map((ev, idx) => (
                <EventCard
                  key={idx}
                  title={ev.title}
                  date={ev.date}
                  time={ev.time}
                  location={ev.location}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-7 h-full w-full rounded-lg overflow-hidden shadow-lg">
          <MapView apiKey={apiKey} events={events} />
        </div>
      </main>

      {/* Very small modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form
            onSubmit={addEvent}
            className="bg-gray-900 w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4"
          >
            <h3 className="text-xl font-bold">Add Event</h3>

            <div className="space-y-1">
              <label className="text-sm">Title</label>
              <input
                className="w-full rounded-md bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm">Date (MM/DD/YYYY)</label>
                <input
                  className="w-full rounded-md bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={form.date}
                  placeholder="10/28/2025"
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Time (HH:MM)</label>
                <input
                  className="w-full rounded-md bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={form.time}
                  placeholder="18:00"
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm">Location</label>
              <select
                className="w-full rounded-md bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              >
                <option value="" disabled>
                  Select a location
                </option>

                {/* Dynamically list all known locations */}
                {Object.keys(coordsByLocation).map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              <p className="text-xs text-gray-400">
                Choose from the predefined locations shown on the map.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 font-semibold"
              >
                Add Event
              </button>
            </div>
          </form>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #2d3748; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4a5568; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #718096; }
      `}</style>
    </div>
  );
}
