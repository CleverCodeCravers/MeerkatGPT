import React from 'react';

function TextSearch() {
  return (
    <div className="search-area">
      <h2>Explain what you are looking for</h2>
      <textarea
        cols={39}
        rows={11}
        className="search-text-area"
        placeholder="Text eingeben für die Suche"
      />
      <div>
        <button type="button" className="btn btn-search">
          Search
        </button>
      </div>
    </div>
  );
}

export default TextSearch;
