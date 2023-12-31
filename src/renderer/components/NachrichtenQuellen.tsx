/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { RSSFeedConfig } from 'renderer/types/RSSFeed';
import { RSSFeeds } from 'renderer/types/RSSFeeds';
import { Feed } from 'main/types/Feed';
import AddRSSModal from './AddRSSFeedModal';
import NachrichtenQuelle from './NachrichtenQuelle';
import { useArticlesContext } from './ArticlesContext';
import { useLoadingContext } from './LoadingContext';

export default function NachrichtenQuellen() {
  const [showModal, setShowModal] = useState(false);
  const [feeds, setFeeds] = useState<RSSFeeds>({ feeds: [] });
  // const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);
  const { setIsLoading } = useLoadingContext();
  const { setArticles } = useArticlesContext();
  const [selectedFeedNames, setSelectedFeedNames] = useState<string[]>([]);

  const handleSelectFeed = (name: string) => {
    if (selectedFeedNames.includes(name)) {
      setSelectedFeedNames(selectedFeedNames.filter((feed) => feed !== name));
    } else {
      setSelectedFeedNames([...selectedFeedNames, name]);
    }
  };

  const handleRemoveSelectedFeeds = () => {
    const feedNamesToRemove = selectedFeedNames;

    const updatedFeeds = feeds.feeds.filter(
      (feed) => !feedNamesToRemove.includes(feed.name)
    );

    setFeeds({ feeds: updatedFeeds });

    window.electron.ipcRenderer.removeRSSFeed('remove-rss', feedNamesToRemove);

    setSelectedFeedNames([]);
  };

  const handleAddFeed = async (name: string, url: string) => {
    const newFeed: RSSFeedConfig = { name, url };
    const updatedFeeds: RSSFeeds = { feeds: [...feeds.feeds, newFeed] };

    setFeeds(updatedFeeds);

    window.electron.ipcRenderer.saveRssFeed('save-rss', newFeed);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchFeedsFromFile = async () => {
    try {
      const response: RSSFeeds = await window.electron.ipcRenderer.invoke(
        'fetch-feeds'
      );
      return response;
    } catch (error) {
      return { feeds: [] };
    }
  };

  const updateArtikelListe = async () => {
    setIsLoading(true);

    try {
      const response: Feed[] = await window.electron.ipcRenderer.invoke(
        'update-articles',
        selectedFeedNames
      );

      setIsLoading(false);
      return setArticles(response);
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await fetchFeedsFromFile();
        setFeeds(response);
      } catch (error) {
        // Handle error reading feeds
      }
    };

    fetchFeeds();

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest('.rss-feeds')) {
        setSelectedFeedNames([]);
      }
    };

    document.body.addEventListener('click', handleDocumentClick);

    return () => {
      document.body.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <div className="nachrichten-quellen">
      <div className="nachrichten-quellen-header">
        <h2>Nachrichtenquellen</h2>
        <button
          type="button"
          className="btn btn-update"
          onClick={updateArtikelListe}
        >
          Artikel Aktualisieren
        </button>
      </div>

      <ul className="rss-feeds">
        {feeds.feeds.map((feed) => {
          return (
            <NachrichtenQuelle
              sourceName={feed.name}
              key={feed.name}
              isSelected={selectedFeedNames.includes(feed.name)}
              onSelect={() => handleSelectFeed(feed.name)}
              onCheckboxChange={(isChecked) => {
                if (isChecked) {
                  setSelectedFeedNames([...selectedFeedNames, feed.name]);
                } else {
                  setSelectedFeedNames(
                    selectedFeedNames.filter((name) => name !== feed.name)
                  );
                }
              }}
            />
          );
        })}
      </ul>

      <div className="buttons">
        <button
          type="button"
          className="btn btn-add"
          onClick={() => setShowModal(true)}
        >
          RSS Hinzufügen
        </button>
        <button
          type="button"
          className="btn btn-remove"
          onClick={handleRemoveSelectedFeeds}
        >
          RSS Entfernen
        </button>
      </div>
      {showModal && (
        <AddRSSModal onClose={handleCloseModal} onAdd={handleAddFeed} />
      )}
    </div>
  );
}
