import React, { useEffect, useState } from 'react';
import { RSSFeedConfig } from 'renderer/types/RSSFeed';
import { RSSFeeds } from 'renderer/types/RSSFeeds';
import { Feed } from 'main/types/Feed';
import AddRSSModal from './AddRSSFeedModal';
import NachrichtenQuelle from './NachrichtenQuelle';
import { useArticlesContext } from './ArticlesContext';

export default function NachrichtenQuellen() {
  const [showModal, setShowModal] = useState(false);
  const [feeds, setFeeds] = useState<RSSFeeds>({ feeds: [] });
  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);

  const { setArticles } = useArticlesContext();

  const handleSelectFeed = (name: string) => {
    setSelectedFeeds([name]);
  };

  const handleRemoveSelectedFeeds = () => {
    const rssToRemove = feeds.feeds.filter((feed) =>
      selectedFeeds.includes(feed.name)
    );

    if (rssToRemove.length === 0) return;

    const updatedFeeds = feeds.feeds.filter(
      (feed) => !selectedFeeds.includes(feed.name)
    );

    setFeeds({ feeds: updatedFeeds });

    window.electron.ipcRenderer.removeRSSFeed(
      'remove-rss',
      rssToRemove[0].name
    );

    setSelectedFeeds([]);
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
    try {
      const response: Feed[] = await window.electron.ipcRenderer.invoke(
        'update-articles'
      );

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
        setSelectedFeeds([]);
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
              isSelected={selectedFeeds.includes(feed.name)}
              onSelect={() => handleSelectFeed(feed.name)}
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
