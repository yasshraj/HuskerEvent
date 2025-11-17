// ./components/EventSummary.jsx
import React from "react";

export default function EventSummary({ event, onClose, onRSVP, onDelete }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4 text-gray-200">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold leading-tight">{event.title}</h3>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600"
          >
            Close
          </button>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <div className="text-gray-400 uppercase tracking-wide text-xs">
              Date
            </div>
            <div className="font-medium">{event.date}</div>
          </div>
          <div>
            <div className="text-gray-400 uppercase tracking-wide text-xs">
              Time
            </div>
            <div className="font-medium">{event.time}</div>
          </div>
          <div>
            <div className="text-gray-400 uppercase tracking-wide text-xs">
              Location
            </div>
            <div className="font-medium">{event.location}</div>
          </div>
          <div>
            <div className="text-gray-400 uppercase tracking-wide text-xs">
              Description
            </div>
            <div className="font-normal whitespace-pre-wrap">
              {event.description || "—"}
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center">
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-md bg-red-700 hover:bg-red-800 font-semibold"
          >
            Delete Event
          </button>
          <button 
            onClick={onRSVP}
            className={`px-4 py-2 rounded-md font-semibold ${
              event.Rsvp 
                ? 'bg-gray-600 hover:bg-gray-700 text-gray-200' 
                : 'bg-gray-200 text-gray-900 hover:bg-white'
            }`}
          >
            {event.Rsvp ? 'Un-RSVP' : 'RSVP'}
          </button>
        </div>
      </div>
    </div>
  );
}