import React from 'react';

interface ArtikelItemProps {
  artikelTitle: string;
}

export default function ArtikelItme({ artikelTitle }: ArtikelItemProps) {
  return (
    <li className="list-felx">
      <div className="item">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 256 256"
          className="article-icon"
        >
          <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM184,96a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,96Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,128Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,160Z" />
        </svg>
        <span>
          <strong>{artikelTitle}</strong>
        </span>
      </div>
      <button type="button" className="btn btn-lesen">
        Lesen
      </button>
    </li>
  );
}
