/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback, useEffect, useState } from 'react';
import { FeedArticleItem } from 'main/types/FeedArticleItem';
import LoadingSpinner from 'renderer/shared/Loading';
import ArtikelItem from './ArtikelItem';
import { useArticlesContext } from './ArticlesContext';
import { useGPTContext } from './GPTContext';
import { useLoadingContext } from './LoadingContext';

export default function ArtikelListe() {
  const { articles, setArticles } = useArticlesContext();
  const [selectedItem, setSelectedItemState] = useState<FeedArticleItem>();
  const { setResponse } = useGPTContext();
  const { isLoading } = useLoadingContext();
  const [showInteresting, setShowInteresting] = useState(true);
  const [processingItems, setProcessingItems] = useState<
    {
      guid: string;
      loading: boolean | undefined;
      isInteresting: boolean | undefined;
    }[]
  >([]);

  const toggleFilter = () => {
    setShowInteresting(!showInteresting);
  };

  const handleItemClick = (item: FeedArticleItem) => {
    setSelectedItemState(item);

    if (item.gptResult) {
      setResponse(item.gptResult);
    } else {
      setResponse({
        feed: {
          title: '',
          link: '',
          'content:encoded': '',
          'content:encodedSnippet': '',
          content: '',
          contentSnippet: '',
          pubDate: '',
          guid: '',
          isoDate: new Date(),
        },
        response: [],
      });
    }
  };

  const handleGPTResponse = useCallback(
    (data: any) => {
      let isInteresting: boolean;
      if (data.response && data.response.length > 0) {
        if (data.response[1].content.includes('Nein')) {
          isInteresting = false;
        } else if (data.response[1].content.includes('Ja')) {
          isInteresting = true;
        }
      }

      const updatedProcessingItems = processingItems.map((item) => {
        if (item.guid === data.feed.guid) {
          return {
            ...item,
            isInteresting,
            loading: data.loading,
          };
        }
        return item;
      });
      setProcessingItems(updatedProcessingItems);

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
    },
    [articles, setArticles, processingItems, setProcessingItems]
  );

  const handleLoading = useCallback(
    (data: any) => {
      const { guid } = data.feed;
      const testLoading = data.loading;

      if (data.loading) {
        setProcessingItems((prevProcessingItems) => [
          ...prevProcessingItems,
          { guid, loading: testLoading, isInteresting: undefined },
        ]);
      }
    },
    [setProcessingItems]
  );

  useEffect(() => {
    window.electron.ipcRenderer.on('gpt-loading', handleLoading);
    window.electron.ipcRenderer.on('gpt-response', handleGPTResponse);

    return () => {
      window.electron.ipcRenderer.removeListener('gpt-loading', handleLoading);
      window.electron.ipcRenderer.removeListener(
        'gpt-response',
        handleGPTResponse
      );
    };
  }, [handleLoading, handleGPTResponse]);

  return (
    <div className="artikeln-liste">
      {isLoading && <LoadingSpinner />}
      <h2>Artikelliste</h2>
      <ul className="rss-articles">
        <li className="list-felx">
          <div className="article-title">Titel</div>
          <div className="article-interesting" onClick={toggleFilter}>
            Interessant?
          </div>
        </li>

        {articles.map((article) => {
          return article.items?.map((articleItem) => {
            const loading =
              processingItems.filter(
                (item) => item.guid === articleItem.guid
              ) || undefined;

            if (showInteresting && loading[0]?.isInteresting === false) {
              return null;
            }

            if (!showInteresting && loading[0]?.isInteresting === true) {
              return null;
            }

            return (
              <ArtikelItem
                artikelTitle={articleItem.title}
                key={articleItem.guid}
                url={articleItem.link}
                onSelect={() => handleItemClick(articleItem)}
                isSelected={selectedItem === articleItem}
                isInteresting={loading[0]?.isInteresting}
                isLoading={loading[0]?.loading}
              />
            );
          });
        })}
      </ul>
    </div>
  );
}
