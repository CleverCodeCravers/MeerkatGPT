/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

interface NachrichtenQuelleProps {
  sourceName: string;
  isSelected: boolean;
  onSelect: () => void;
}

export default function NachrichtenQuelle({
  sourceName,
  isSelected,
  onSelect,
}: NachrichtenQuelleProps) {
  return (
    <li className={`${isSelected ? 'selected' : ''}`}>
      <div className="rss-feed" onClick={onSelect}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          className="feed-icon"
          viewBox="0 0 256 256"
        >
          <path d="M98.91,157.09A71.53,71.53,0,0,1,120,208a8,8,0,0,1-16,0,56,56,0,0,0-56-56,8,8,0,0,1,0-16A71.53,71.53,0,0,1,98.91,157.09ZM48,88a8,8,0,0,0,0,16A104,104,0,0,1,152,208a8,8,0,0,0,16,0A120,120,0,0,0,48,88Zm118.79,1.21A166.9,166.9,0,0,0,48,40a8,8,0,0,0,0,16,151,151,0,0,1,107.48,44.52A151,151,0,0,1,200,208a8,8,0,0,0,16,0A166.9,166.9,0,0,0,166.79,89.21ZM52,192a12,12,0,1,0,12,12A12,12,0,0,0,52,192Z" />
        </svg>
        <strong className="feed-name">{sourceName}</strong>
      </div>
    </li>
  );
}
