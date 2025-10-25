// ./App.jsx
import React from 'react';
import Header from './components/Header.jsx';
import Calendar from './components/Calendar.jsx';
import EventCard from './components/EventCard.jsx';
import MapView from './components/MapView.jsx';

export default function App() {
  const apiKey = "AIzaSyAVqgZ7cFS1H6VR2ffVH1We8Z9KYkB3-D0";

  const events = [
    { title: "The Union", coords: { lat: 40.8213, lng: -96.7031 } },
    { title: "Memorial Stadium", coords: { lat: 40.8176, lng: -96.6990 } },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-gray-200 font-sans">
      <Header />
        <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 p-6 overflow-hidden">
          {/* Left Column */}
          <div className="md:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
            <Calendar />
            <EventCard title="Tech Meet" date="10/15/2025" time="18:00" location="The Union" />
            <EventCard title="Football Exhibition" date="10/20/2025" time="19:00" location="Memorial Stadium" />
          </div>

          {/* Right Column */}
          <div className="md:col-span-7 h-full w-full rounded-lg overflow-hidden shadow-lg">
            <MapView apiKey={apiKey} events={events} />
          </div>
        </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2d3748;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a5568;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #718096;
        }
      `}</style>
    </div>
  );
}
