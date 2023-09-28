/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { GPTKeys } from 'main/types/GPTKeys';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ModalProps {
  gptKeys: GPTKeys;
  onClose: () => void;
  onAdd: (keyName: string, value: string, id: string) => void;
  onRemove: (keys: GPTKeys) => void;
}

function AddGPTKeyModal({ onAdd, onClose, gptKeys, onRemove }: ModalProps) {
  const [keyName, setKeyName] = useState<string>('');
  const [keyValue, setKeyValue] = useState<string>('');

  const addKey = () => {
    if (keyName && keyValue) {
      onAdd(keyName, keyValue, uuidv4());
      setKeyName('');
      setKeyValue('');
    }
  };

  const removeKey = (id: string) => {
    const updatedKeys = gptKeys?.keys.filter((key) => key.id !== id);
    onRemove({ keys: updatedKeys });
  };

  const copyKey = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="modal-gpt open">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2>Manage Keys</h2>
        <div className="key-inputs">
          <input
            type="text"
            placeholder="Key Name"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Key Value"
            value={keyValue}
            onChange={(e) => setKeyValue(e.target.value)}
          />
          <button className="gptkey-button-add" type="button" onClick={addKey}>
            Add Key
          </button>
        </div>
        <div className="key-list">
          {gptKeys &&
            gptKeys?.keys.map((key) => (
              <div key={key?.id} className="key-item">
                <span>{key?.keyName}</span>
                <span>{key?.keyValue}</span>
                <button
                  type="button"
                  className="gptkey-button-delete"
                  onClick={() => removeKey(key.id)}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="gptkey-button-copy"
                  onClick={() => copyKey(key.keyValue)}
                >
                  Copy
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default AddGPTKeyModal;
