import React from 'react'

const EventCard = ({ title, date, time, location, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left bg-gray-700 p-4 rounded-lg shadow-md flex flex-col gap-1 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
  >
    <div>
      <h3 className="text-lg font-bold">{title}</h3>
      <div className="space-y-2 text-sm">
        <div>📅 {date}</div>
        <div>⏰ {time}</div>
        <div>📍 {location}</div>
      </div>
    </div>
  </button>
);

export default EventCard;
