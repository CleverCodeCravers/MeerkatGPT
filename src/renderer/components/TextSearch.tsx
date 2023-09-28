import React, { useState } from 'react';
import { Feed } from 'main/types/Feed';
import { useSearchContext } from './SearchContext';
import { useArticlesContext } from './ArticlesContext';

function TextSearch() {
  const { setSearchQuery } = useSearchContext();
  const [textValue, setTextValue] = useState('');
  const { articles } = useArticlesContext();

  const askGPT = async (item: Feed[], query: string) => {
    try {
      const response: any[] = await window.electron.ipcRenderer.invoke(
        'search-gpt',
        { articles, searchQuery: query }
      );

      return response;
    } catch (error) {
      return [];
    }
  };

  function handleSearchButton() {
    setSearchQuery(textValue);

    if (textValue) {
      askGPT(articles, textValue);
    }
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
