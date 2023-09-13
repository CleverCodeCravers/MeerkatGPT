import React, { useEffect, useState } from 'react';
import { FeedArticleItem } from 'main/types/FeedArticleItem';
import LoadingSpinner from 'renderer/shared/Loading';
import ArtikelItem from './ArtikelItem';
import { useArticlesContext } from './ArticlesContext';
import { useGPTContext } from './GPTContext';
import { useLoadingContext } from './LoadingContext';

export default function ArtikelListe() {
  const { articles, setArticles } = useArticlesContext();
  const [selectedItem, setSelectedItemState] = useState<FeedArticleItem>();
  const [articleInterestState, setArticleInterestState] = useState<
    Record<string, boolean>
  >({});
  const { setResponse } = useGPTContext();
  const { isLoading } = useLoadingContext();
  const handleItemClick = (item: FeedArticleItem) => {
    setSelectedItemState(item);

    if (item.gptResult) {
      setResponse(item.gptResult);
    } else {
      setResponse([]);
    }
  };

  useEffect(() => {
    const handleGPTResponse = (data: any) => {
      let isInteresting: boolean;
      if (data.response && data.response.length > 0) {
        if (data.response[1].content.includes('Nein')) {
          isInteresting = false;
        } else if (data.response[1].content.includes('Ja')) {
          isInteresting = true;
        }
      }
      setArticleInterestState((prevState) => ({
        ...prevState,
        [data.feed.guid]: isInteresting,
      }));

      // Store the GPT result in the article data
      const updatedArticles = articles.map((article) => {
        const updatedItems = article.items?.map((item) => {
          if (item.guid === data.feed.guid) {
            return {
              ...item,
              gptResult: data,
            };
          }
          return item;
        });
        return {
          ...article,
          items: updatedItems,
        };
      });
      setArticles(updatedArticles);
    };

    window.electron.ipcRenderer.on('gpt-response', handleGPTResponse);
  }, [articles, setArticles]);

  return (
    <div className="artikeln-liste">
      {isLoading && <LoadingSpinner />}
      <h2>Artikelliste</h2>
      <ul className="rss-articles">
        <li className="list-felx">
          <div className="article-title">Titel</div>
          <div className="article-interesting">Interessant?</div>
        </li>

        {articles.map((article) => {
          return article.items?.map((item) => {
            // eslint-disable-next-line no-undef-init
            let isInteresting: boolean | undefined = undefined;
            if (articleInterestState[item.guid] !== undefined) {
              isInteresting = articleInterestState[item.guid];
            }
            return (
              <ArtikelItem
                artikelTitle={item.title}
                key={item.guid}
                url={item.link}
                onSelect={() => handleItemClick(item)}
                isSelected={selectedItem === item}
                isInteresting={isInteresting}
              />
            );
          });
        })}
      </ul>
    </div>
  );
}
