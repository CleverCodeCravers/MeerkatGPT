import React, { useState } from 'react';
import ArtikelItem from './ArtikelItem';
import { useArticlesContext } from './ArticlesContext';
import { useSearchContext } from './SearchContext';
import { useGPTContext } from './GPTContext';

export default function ArtikelListe() {
  const { articles } = useArticlesContext();
  const [selectedItem, setSelectedItemState] = useState(null);
  const { setResponse } = useGPTContext();
  const { searchQuery } = useSearchContext();

  const askGPT = async (title: string, query: string) => {
    try {
      const response: any[] = await window.electron.ipcRenderer.invoke(
        'search-gpt',
        { title, searchQuery: query }
      );

      return setResponse({ title, response });
    } catch (error) {
      setResponse({ title: '', response: [] });
      return [];
    }
  };

  const handleItemClick = (item: any) => {
    setSelectedItemState(item);
    if (searchQuery) {
      askGPT(item.title, searchQuery);
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
