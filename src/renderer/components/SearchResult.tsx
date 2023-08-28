import React from 'react';
// import { useArticlesContext } from './ArticlesContext';
import SearchResulTemplate from './SearchResultTemplate';
import { useGPTContext } from './GPTContext';
import { useSearchContext } from './SearchContext';

function SearchResult() {
  const { response } = useGPTContext();
  const { searchQuery } = useSearchContext();

  const filterResponse = response.response.filter(
    (result: any) => result.role !== 'user'
  );
  console.log(filterResponse);
  if (response.response.length > 0) {
    return (
      <div className="search-result">
        <h2>GPT Results</h2>
        <div className="search-result-area">
          <SearchResulTemplate
            title={response.title}
            query={searchQuery}
            firstResponse={filterResponse[0].content}
            secondResponse={filterResponse[1].content}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="search-result">
      <h2>GPT Results</h2>
      <div className="search-result-area" />
    </div>
  );
}

export default SearchResult;
