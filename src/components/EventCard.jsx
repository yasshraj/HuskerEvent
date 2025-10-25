import React from 'react'

const EventCard = ({ title, date, time, location }) => (
  <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col gap-1">
   <div>
      <h3 className="text-lg font-bold">{title}</h3>
      <div className="space-y-2">
            <div>📅 {date}</div>
            <div>⏰ {time}</div>
            <div>📍 {location}</div>
      </div>
   </div>
  </div>
);

export default EventCard;


