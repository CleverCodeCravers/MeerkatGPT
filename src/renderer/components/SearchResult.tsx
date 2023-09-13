import React from 'react';
// import { useArticlesContext } from './ArticlesContext';
import SearchResulTemplate from './SearchResultTemplate';
import { useGPTContext } from './GPTContext';
import { useSearchContext } from './SearchContext';
import { useArticlesContext } from './ArticlesContext';

function SearchResult() {
  const { articles } = useArticlesContext();
  const { response } = useGPTContext();
  const { searchQuery } = useSearchContext();

  // @ts-expect-error
  if (response.response === null || typeof response.response === 'string') {
    return (
      <div className="search-result">
        <h2>GPT Results</h2>
        <div className="search-result-area">
          <p>
            {' '}
            {
              // @ts-expect-error

              typeof response.response === 'string'
                ? // @ts-expect-error
                  response.response
                : 'No Result from GPT! :'
            }
            /
          </p>
        </div>
      </div>
    );
  }

  if (articles.length > 0 && String(searchQuery).length === 0) {
    return (
      <div className="search-result">
        <h2>GPT Results</h2>
        <div className="search-result-area">
          <p> You have to enter a search query first!</p>
        </div>
      </div>
    );
  }

  let filterResponse;
  // @ts-expect-error
  if (response.response) {
    // @ts-expect-error
    filterResponse = response.response.filter(
      (result: any) => result.role !== 'user'
    );

    return (
      <div className="search-result">
        <h2>GPT Results</h2>
        <div className="search-result-area">
          <SearchResulTemplate
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
