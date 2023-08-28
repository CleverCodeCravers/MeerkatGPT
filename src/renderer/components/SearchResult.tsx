import React from 'react';

interface SearchResultProps {
  result: string;
}

function SearchResult({ result }: SearchResultProps) {
  return (
    <div className="search-result">
      <h2>GPT Results</h2>
      <p className="search-result-area">{result}</p>
    </div>
  );
}

export default SearchResult;
