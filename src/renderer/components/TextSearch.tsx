import React, { useState } from 'react';
import { useSearchContext } from './SearchContext';

function TextSearch() {
  const { setSearchQuery } = useSearchContext();
  const [textValue, setTextValue] = useState('');

  function handleSearchButton() {
    setSearchQuery(textValue);
    setTextValue('');
  }

  return (
    <div className="search-area">
      <h2>Explain what you are looking for</h2>
      <textarea
        cols={39}
        rows={11}
        className="search-text-area"
        placeholder="Text eingeben für die Suche"
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
      />
      <div>
        <button
          type="button"
          className="btn btn-search"
          onClick={handleSearchButton}
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default TextSearch;
