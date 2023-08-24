/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

interface AddRSSModalProps {
  onClose: () => void;
  onAdd: (name: string, url: string) => void;
}

function AddRSSModal({ onClose, onAdd }: AddRSSModalProps) {
  const [feedName, setFeedName] = useState('');
  const [feedUrl, setFeedUrl] = useState('');

  const handleFormSubmit = (event: any) => {
    event.preventDefault();
    onAdd(feedName, feedUrl);

    setFeedName('');
    setFeedUrl('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add RSS Feed</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="feedName">Name of RSS Feed:</label>
            <input
              type="text"
              id="feedName"
              value={feedName}
              onChange={(e) => setFeedName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="feedUrl">URL of RSS Feed:</label>
            <input
              type="url"
              id="feedUrl"
              value={feedUrl}
              onChange={(e) => setFeedUrl(e.target.value)}
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn btn-add">
              Add
            </button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRSSModal;
