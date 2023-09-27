/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React from 'react';

interface ArtikelItemProps {
  artikelTitle: string;
  url: string;
  onSelect: () => void;
  isSelected: boolean;
  isInteresting: boolean | undefined;
  isLoading: boolean | undefined;
}

export default function ArtikelItem({
  artikelTitle,
  url,
  onSelect,
  isSelected,
  isInteresting,
  isLoading,
}: ArtikelItemProps) {
  function openArticle() {
    window.electron.ipcRenderer.openExternal('open-url', url);
  }

  function interessantInfo() {
    if (isLoading === true && isInteresting === undefined) {
      return (
        <div className="article-loading-spinner">
          <div className="article-spinner" />
        </div>
      );
    }

    if (isLoading === false && isInteresting === true) {
      return <div>✅</div>;
    }

    if (isLoading === false && isInteresting === false) {
      return <div>❌</div>;
    }

    return null;
  }
  return (
    <li className={`list-felx  ${isSelected ? 'selected' : ''}`}>
      <div className="item" onClick={onSelect}>
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

      {interessantInfo()}

      <button type="button" className="btn btn-lesen" onClick={openArticle}>
        Lesen
      </button>
    </li>
  );
}
