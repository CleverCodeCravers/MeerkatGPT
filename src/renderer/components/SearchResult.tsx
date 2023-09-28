/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { GPTKeys } from 'main/types/GPTKeys';
import SearchResulTemplate from './SearchResultTemplate';
import { useGPTContext } from './GPTContext';
import { useSearchContext } from './SearchContext';
import { useArticlesContext } from './ArticlesContext';
import AddGPTKeyModal from './AddGPTKeyModal';

function SearchResult() {
  const { articles } = useArticlesContext();
  const { response } = useGPTContext();
  const { searchQuery } = useSearchContext();
  const [isModalOpen, setModalOpen] = useState(false);
  const [keys, setKeys] = useState<GPTKeys>({ keys: [] });

  const fetchKeysFromFile = async () => {
    try {
      const data: GPTKeys = await window.electron.ipcRenderer.invoke(
        'load-key'
      );
      return data;
    } catch (error) {
      return { keys: [] };
    }
  };

  const saveKey = (keyName: string, keyValue: string, id: string) => {
    const keyExists = keys.keys.some((key) => key.id === id);

    if (!keyExists) {
      setKeys((prevKeys) => ({
        keys: [...prevKeys.keys, { id, keyName, keyValue }],
      }));

      window.electron.ipcRenderer.saveGPTKey('save-key', {
        keys: [...keys.keys, { id, keyName, keyValue }],
      });
    } else {
      console.log(`Key with ID ${id} already exists.`);
    }
  };

  const updateKeys = (newKeys: GPTKeys) => {
    setKeys(newKeys);
    window.electron.ipcRenderer.saveGPTKey('remove-key', newKeys);
  };

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const data = await fetchKeysFromFile();
        setKeys(data);
      } catch (error) {
        // Handle error reading feeds
      }
    };
    fetchKeys();
  }, []);

  if (typeof response === 'string') {
    return (
      <div className="search-result">
        <h2>GPT Results</h2>
        <div className="search-result-area">
          <p>
            {' '}
            {typeof response === 'string' ? response : 'No Result from GPT! :'}/
          </p>
        </div>
        <button
          className="btn"
          type="button"
          onClick={() => setModalOpen(true)}
        >
          GPT Keys
        </button>
        {isModalOpen && (
          <AddGPTKeyModal
            onRemove={updateKeys}
            gptKeys={keys}
            onAdd={saveKey}
            onClose={() => setModalOpen(false)}
          />
        )}
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
        <button
          className="btn"
          type="button"
          onClick={() => setModalOpen(true)}
        >
          GPT Keys
        </button>
        {isModalOpen && (
          <AddGPTKeyModal
            onRemove={updateKeys}
            gptKeys={keys}
            onAdd={saveKey}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    );
  }

  let filterResponse;
  if (response.response.length <= 0) {
    return (
      <div className="search-result">
        <h2>GPT Results</h2>
        <div className="search-result-area" />
        <button
          className="btn"
          type="button"
          onClick={() => setModalOpen(true)}
        >
          {' '}
          GPT Keys
        </button>
        {isModalOpen && (
          <AddGPTKeyModal
            onRemove={updateKeys}
            gptKeys={keys}
            onAdd={saveKey}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    );
  }

  if (response.response) {
    filterResponse = response.response.filter(
      (result: any) => result.role !== 'user'
    );

    return (
      <div className="search-result">
        <h2>GPT Results</h2>
        <div className="search-result-area">
          <SearchResulTemplate
            titel={response.feed.title}
            query={searchQuery}
            firstResponse={filterResponse[0].content}
            secondResponse={filterResponse[1].content}
          />
        </div>
        <button
          className="btn"
          type="button"
          onClick={() => setModalOpen(true)}
        >
          {' '}
          GPT Keys
        </button>
        {isModalOpen && (
          <AddGPTKeyModal
            onRemove={updateKeys}
            gptKeys={keys}
            onAdd={saveKey}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="search-result">
      <h2>GPT Results</h2>
      <div className="search-result-area" />
      <button className="btn" type="button" onClick={() => setModalOpen(true)}>
        {' '}
        GPT Keys
      </button>
      {isModalOpen && (
        <AddGPTKeyModal
          onRemove={updateKeys}
          gptKeys={keys}
          onAdd={saveKey}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

export default SearchResult;
