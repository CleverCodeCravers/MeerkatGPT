import React, { useState } from 'react';
import { FeedArticleItem } from 'main/types/FeedArticleItem';
import ArtikelItem from './ArtikelItem';
import { useArticlesContext } from './ArticlesContext';
import { useSearchContext } from './SearchContext';
import { useGPTContext } from './GPTContext';

export default function ArtikelListe() {
  const { articles } = useArticlesContext();
  const [selectedItem, setSelectedItemState] = useState<FeedArticleItem>();
  const { setResponse } = useGPTContext();
  const { searchQuery } = useSearchContext();

  const askGPT = async (content: string, query: string) => {
    try {
      const response: any[] = await window.electron.ipcRenderer.invoke(
        'search-gpt',
        { content, searchQuery: query }
      );

      return setResponse({ title: content, response });
    } catch (error) {
      setResponse({ title: '', response: [] });
      return [];
    }
  };

  const handleItemClick = (item: FeedArticleItem) => {
    setSelectedItemState(item);
    if (searchQuery) {
      askGPT(item['content:encodedSnippet'], searchQuery);
    }
  };

  return (
    <div className="artikeln-liste">
      <h2>Artikelliste</h2>
      <ul className="rss-articles">
        {articles.map((article) => {
          return article.items?.map((item) => {
            return (
              <ArtikelItem
                artikelTitle={item.title}
                key={item.guid}
                url={item.link}
                onSelect={() => handleItemClick(item)}
                isSelected={selectedItem === item}
              />
            );
          });
        })}
      </ul>
    </div>
  );
}
