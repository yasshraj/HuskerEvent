import React from "react";
import { UserCircle, Plus, Search } from "lucide-react";

const Header = ({ query, onQueryChange, sortMode, onSortChange, onCreateClick }) => (
  <header className="bg-red-700 text-white p-4 flex items-center justify-between shadow-lg">
    {/* Logo */}
    <div className="flex items-center">
      <div className="bg-white text-red-700 w-16 h-16 flex items-center justify-center rounded-lg">
        <span className="text-4xl font-extrabold tracking-tighter">N</span>
        <span className="text-4xl font-extrabold tracking-tighter -ml-1.5">
          HE
        </span>
      </div>
    </div>

    {/* Search Bar + Sort */}
    <div className="flex-1 max-w-lg mx-8 flex items-center gap-3">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search events…"
          className="w-full bg-black bg-opacity-30 text-white placeholder-gray-300 rounded-full py-3 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-white focus:bg-opacity-40"
          value={query}
          onChange={(e) => onQueryChange?.(e.target.value)}
          aria-label="Search events"
        />
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
          size={20}
        />
      </div>

      <select
        className="bg-black bg-opacity-30 text-white rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-white"
        value={sortMode}
        onChange={(e) => onSortChange?.(e.target.value)}
        aria-label="Sort events"
      >
        <option value="date">Sort by date</option>
        <option value="location">Sort by location</option>
      </select>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => onCreateClick?.()}
        className="flex items-center gap-2 bg-white text-gray-900 font-semibold py-2 px-5 rounded-full shadow-md hover:bg-gray-200 transition-colors"
      >
        <Plus size={20} />
        <span>Create Event</span>
      </button>
      <button className="text-white hover:bg-red-800 rounded-full p-2">
        <UserCircle size={32} />
      </button>
    </div>
  </header>
);

export default Header;