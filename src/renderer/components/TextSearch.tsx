import React from 'react';
// import { Card, InputGroup, FormControl, Button } from 'react-bootstrap';
// import { TextSearchProps } from './types/TextSearchProps';

function TextSearch() {
  // const { inputText, onChangeValue, handleAddItem } = props;

  return (
    <div className="search-area">
      <h2>Explain what you are looking for</h2>
      <textarea
        cols={42}
        rows={11}
        className="search-text-area"
        placeholder="Text eingeben für die Suche"
      />
      <div>
        <button type="button" className="btn btn-search">
          Search
        </button>
      </div>
    </div>
    // <div className="mb-4">
    //   <Card.Title className="mb-3">Erklären Sie, wonach Sie suchen</Card.Title>

    //   <InputGroup className="mb-4">
    //     <FormControl
    //       as="textarea"
    //       rows={4}
    //       placeholder="Text Eingeben"
    //       value={inputText}
    //       onChange={(e) => onChangeValue(e.target.value)}
    //       style={{ width: '100%' }}
    //     />
    //   </InputGroup>
    //   <Button
    //     variant="secondary"
    //     onClick={handleAddItem}
    //     className="position-absolute end-0 bottom-0 mb-0"
    //   >
    //     Suchen
    //   </Button>
    // </div>
  );
}

export default TextSearch;
