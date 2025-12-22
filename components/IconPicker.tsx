"use client";

import React, { useState, useMemo } from 'react';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

// Curated list of food and stationary-related emojis
const foodAndStationaryEmojis = [
  // Existing fruits, vegetables, general food
  '🍎', '🍏', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🥔', '🍠',
  // Baked Goods
  '🥐', '🍞', '🥖', '🥨', '🥯', '🥞', '🧇', '🍪', '🍩', '🎂', '🍰', '🧁', '🥧', '🍮', '🍫', '🍬', '🍭', '🍯',
  // Cooked Meals & Dishes
  '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🥚', '🍳', '🥘', '🍲', '🥣', '🥗', '🍝', '🍛', '🍜', '🍣', '🍤', '🍥', '🥟', '🍢', '🍚', '🍙', '🍲', '🥘', '🫕', '🥫', '🧆', '🫙', '🫚', '🫛', '🫗', '🫓', '🫚','🫛', '🫗', '🫓', '🫔', '🫕', '🫙', '🫚', '🫛', '🫗', '🫓'
  ];

const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredEmojis = useMemo(() => {
    if (!searchTerm) {
      return foodAndStationaryEmojis;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return foodAndStationaryEmojis.filter(emoji => {
      // A simple way to "search" emojis is to check if their common name contains the search term.
      // This would ideally be backed by a more robust emoji data library for better search.
      // For now, we'll just check if the emoji itself is typed.
      return emoji.includes(lowerCaseSearchTerm) || emojiNameContains(emoji, lowerCaseSearchTerm);
    });
  }, [searchTerm]);

  // Helper to check if emoji name contains search term (very basic, could be improved)
  const emojiNameContains = (emoji: string, term: string) => {
    // This is a very basic heuristic. A real solution would use a library like 'emoji-datasource'
    // or a predefined map of emoji to keywords.
    // For now, we'll just hardcode a few common ones or rely on the emoji itself.
    if (emoji === '🍎' && 'apple'.includes(term)) return true;
    if (emoji === '🍔' && 'burger'.includes(term)) return true;
    if (emoji === '📝' && 'memo pen'.includes(term)) return true;
    // ... add more as needed, or use a proper library
    return false;
  };


  const handleEmojiClick = (emoji: string) => {
    onChange(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label htmlFor="icon-picker-input" className="block text-lg font-bold text-gray-700">
        Icon
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          type="hidden"
          id="icon-picker-input"
          value={value}
          onChange={(e) => onChange(e.target.value)} // Allow direct input as well
          onFocus={() => setIsOpen(true)}
          // onBlur={() => setTimeout(() => setIsOpen(false), 100)} // Delay to allow click
          className="flex-1 block w-full rounded-l-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 text-lg"
          placeholder="Select or type an emoji"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
        >
          <span className="text-xl">{value || '✨'}</span>
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          <input
            type="text"
            className="block w-full p-2 border-b border-gray-200 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Search emojis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="p-2 grid grid-cols-8 gap-1"> {/* Adjusted grid for better mobile display */}
            {filteredEmojis.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleEmojiClick(emoji)}
                className="p-1 text-2xl hover:bg-gray-100 rounded-md flex items-center justify-center"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconPicker;
