// EmojiPickerComponent.tsx
import React, { useState } from "react";
import { customEmojis } from "./custom-emojis";

interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
}

const EmojiPickerComponent: React.FC<EmojiPickerProps> = ({ onSelectEmoji }) => {
  const [activeCategory, setActiveCategory] = useState(customEmojis[0].id);

  const handleEmojiClick = (emoji: string) => {
    onSelectEmoji(emoji);
  };

  return (
    <div className="border p-2 w-full max-w-lg bg-white rounded shadow">
      {/* Tabs for categories (emoji only, no button style) */}
      <div className="flex space-x-2 mb-2 overflow-x-auto text-3xl">
        {customEmojis.map((category) => (
          <span
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`cursor-pointer select-none ${
              activeCategory === category.id ? "opacity-100" : "opacity-50"
            }`}
          >
            {category.icon}
          </span>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="grid grid-cols-8 gap-2">
        {customEmojis
          .find((cat) => cat.id === activeCategory)
          ?.emojis.map((emoji) => (
            <span
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              className="text-2xl cursor-pointer hover:bg-gray-100 rounded p-1 select-none"
            >
              {emoji}
            </span>
          ))}
      </div>
    </div>
  );
};

export default EmojiPickerComponent;
