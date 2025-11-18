import React, { useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import Calendar from "./components/Calendar.jsx";
import EventCard from "./components/EventCard.jsx";
import MapView from "./components/MapView.jsx";
import EventSummary from "./components/EventSummary.jsx";
import useEventForm from "./hooks/createEventForm.js";
import usePersistentEvents from "./hooks/persistentEvents.js";

// Helper: convert "MM/DD/YYYY" -> "YYYY-MM-DD"
function toISOFromMMDDYYYY(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("/");
  if (parts.length !== 3) return "";
  const [mm, dd, yyyy] = parts;
  if (!mm || !dd || !yyyy) return "";
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

export default function App() {
  const apiKey = "AIzaSyAVqgZ7cFS1H6VR2ffVH1We8Z9KYkB3-D0";

  // Map of known locations -> coordinates
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

  // Start with no events (team requested empty initial state)
  const initialEvents = [];

  // All events are stored & persisted
  const [events, setEvents] = usePersistentEvents("events_v1", initialEvents);

  // Calendar-clicked date: FullCalendar gives "YYYY-MM-DD"
  const [selectedDate, setSelectedDate] = useState("");

  // Search + sort controls
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState("date");

  // Create Event form state/handlers
  const { showForm, form, setForm, openForm, closeForm, addEvent } =
    useEventForm(coordsByLocation, selectedDate);

  // Event details modal state
  const [selectedEvent, setSelectedEvent] = useState(null);

  const openEvent = (ev) => {
    setSelectedEvent(ev);
  };

  function closeEvent() {
    setSelectedEvent(null);
  }

  // Toggle RSVP on the selected event
  const onRSVP = () => {
    setEvents((prevEvents) =>
      prevEvents.map((ev) =>
        ev === selectedEvent ? { ...ev, Rsvp: !ev.Rsvp } : ev
      )
    );
    closeEvent();
  };

  // Delete the selected event
  const deleteSelectedEvent = () => {
    setEvents((prev) => prev.filter((ev) => ev !== selectedEvent));
    closeEvent();
  };

  // Text search helper
  function matchesSearch(ev, query) {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const text = `${ev.title ?? ""} ${ev.location ?? ""} ${
      ev.description ?? ""
    }`.toLowerCase();
    return text.includes(q);
  }

  // Calendar-date filter: compare ISO versions
  function isOnSelectedDate(ev, isoDate) {
    if (!isoDate) return true;
    if (!ev.date) return false;
    const evISO = toISOFromMMDDYYYY(ev.date); 
    if (!evISO) return false;
    return evISO === isoDate;
  }

  // Sorting by date or location
  function sortEvents(a, b, mode) {
    if (mode === "location") {
      return (a.location ?? "").localeCompare(b.location ?? "");
    }

    // Default: sort by date using ISO so JS Date parses correctly
    const isoA = a.date ? toISOFromMMDDYYYY(a.date) : "";
    const isoB = b.date ? toISOFromMMDDYYYY(b.date) : "";

    const da = isoA ? new Date(isoA).getTime() : 0;
    const db = isoB ? new Date(isoB).getTime() : 0;

    return da - db;
  }

  // Apply search + calendar filter + sort
  const filteredAndSortedEvents = useMemo(() => {
    const filtered = events.filter(
      (ev) => matchesSearch(ev, searchQuery) && isOnSelectedDate(ev, selectedDate)
    );
    return filtered.slice().sort((a, b) => sortEvents(a, b, sortMode));
  }, [events, searchQuery, selectedDate, sortMode]);

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-gray-200 font-sans">
      {/* Top header with search + sort + create button */}
      <Header
        query={searchQuery}
        onQueryChange={setSearchQuery}
        sortMode={sortMode}
        onSortChange={setSortMode}
        onCreateClick={openForm}
      />

      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 p-6 overflow-hidden">
        {/* Left side: Calendar + event list */}
        <div className="md:col-span-5 flex flex-col gap-6 pr-2 h-full overflow-hidden">
          <div className="flex-none h-[380px] md:h-[460px] shrink-0">
            <Calendar
              events={events}
              onDateSelect={(d) => setSelectedDate(d)} // d is "YYYY-MM-DD"
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
            {events.length === 0 ? (
              <div className="bg-gray-900 rounded-xl p-4 text-sm text-gray-400">
                No events yet. Click “Create Event” to add one.
              </div>
            ) : filteredAndSortedEvents.length === 0 ? (
              <div className="bg-gray-900 rounded-xl p-4 text-sm text-gray-400">
                No events match your filters.
              </div>
            ) : (
              filteredAndSortedEvents.map((ev, idx) => (
                <EventCard
                  key={idx}
                  title={ev.title}
                  date={ev.date}
                  time={ev.time}
                  location={ev.location}
                  rsvp={ev.Rsvp}
                  onClick={() => openEvent(ev)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right side: Map */}
        <div className="md:col-span-7 h-full w-full rounded-lg overflow-hidden shadow-lg">
          <MapView apiKey={apiKey} events={filteredAndSortedEvents} />
        </div>
      </main>

      {/* Create Event Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form
            onSubmit={(e) => addEvent(e, setEvents)}
            className="bg-gray-900 w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4"
          >
            <h3 className="text-xl font-bold">Add Event</h3>

            <div className="space-y-1">
              <label className="text-sm">Title</label>
              <input
                className="w-full rounded-md bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm">Date (MM/DD/YYYY)</label>
                <input
                  className="w-full rounded-md bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={form.date}
                  placeholder="10/20/2025"
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Time (HH:MM)</label>
                <input
                  className="w-full rounded-md bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={form.time}
                  placeholder="18:00"
                  onChange={(e) =>
                    setForm({ ...form, time: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm">Description</label>
              <textarea
                className="w-full rounded-md bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[90px]"
                value={form.description}
                placeholder="Write a short summary..."
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm">Location</label>
              <select
                className="w-full rounded-md bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                required
              >
                <option value="" disabled>
                  Select a location
                </option>
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

      {/* Event Summary Modal */}
      {selectedEvent && (
        <EventSummary
          event={selectedEvent}
          onClose={closeEvent}
          onRSVP={onRSVP}
          onDelete={deleteSelectedEvent}
        />
      )}

      {/* Scrollbar styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #2d3748; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4a5568; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #718096; }
      `}</style>
    </div>
  );
}