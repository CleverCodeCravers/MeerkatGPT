import React, { useEffect, useState } from 'react';
import { RSSFeed } from 'renderer/types/RssFeed';
import { RSSFeeds } from 'renderer/types/RSSFeeds';
import AddRSSModal from './AddRSSFeedModal';
import NachrichtenQuelle from './NachrichtenQuelle';

export default function NachrichtenQuellen() {
  const [showModal, setShowModal] = useState(false);
  const [feeds, setFeeds] = useState<RSSFeeds>({ feeds: [] });
  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);

  const handleSelectFeed = (name: string) => {
    setSelectedFeeds([name]);
  };

  const handleRemoveSelectedFeeds = () => {
    const updatedFeeds = feeds.feeds.filter(
      (feed) => !selectedFeeds.includes(feed.name)
    );
    setFeeds({ feeds: updatedFeeds });

    const rssToRemove = feeds.feeds.filter((feed) =>
      selectedFeeds.includes(feed.name)
    );

    window.electron.ipcRenderer.removeRSSFeed(
      'remove-rss',
      rssToRemove[0].name
    );

    setSelectedFeeds([]);
  };

  const handleAddFeed = async (name: string, url: string) => {
    const newFeed: RSSFeed = { name, url };
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
      // Handle IPC error
      return { feeds: [] };
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

      // Check if the clicked element is not inside the ul
      if (!target.closest('.rss-feeds')) {
        setSelectedFeeds([]); // Deselect the selected feed
      }
    };

    document.body.addEventListener('click', handleDocumentClick);

    // Cleanup: remove the event listener when the component unmounts
    return () => {
      document.body.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  // const rssManager = new RSSFeedFileManager('C:/Users/Kane/Documents/Projekte');
  // console.log(rssManager.filePath);
  // const [inputText, setInputText] = useState('');
  // const [items, setItems] = useState<string[]>([]);
  // const [selectedItem, setSelectedItem] = useState(null);

  // const handleAddItem = () => {
  //   const newItem = `Item ${items.length + 1}`;
  //   setItems([...items, newItem]);
  // };

  // const handleItemClick = (index: any) => {
  //   setSelectedItem(index);
  // };

  // // window.electron.rssFeedManager.save()
  // const handleRemoveItem = () => {
  //   setItems((prevItems) => {
  //     const updatedItems = [...prevItems];
  //     updatedItems.splice(Number(selectedItem), 1);
  //     setSelectedItem(null);
  //     return updatedItems;
  //   });
  // };

  // const handleSearch = () => {
  //   console.log('Searching');
  //   console.log(inputText);
  //   setInputText('');
  // };

  return (
    <div className="nachrichten-quellen">
      <div className="nachrichten-quellen-header">
        <h2>Nachrichtenquellen</h2>
        <button type="button" className="btn btn-update">
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
    // <div style={{ maxWidth: '600px' }}>
    //   <Container fluid>
    //     <Card>
    //       <Card.Body
    //         className="d-flex flex-column"
    //         style={{
    //           height: '300px',
    //         }}
    //       >
    //         <div className="d-flex align-items-center justify-content-between mb-3">
    //           <Card.Title>Nachrichtenquellen</Card.Title>
    //           <Button variant="secondary">Artikel Aktualisieren</Button>
    //         </div>
    //         <Row
    //           className="flex-grow-1 overflow-auto"
    //           style={{
    //             border: '2px solid #BBBB',
    //             padding: '20px',
    //             borderRadius: '25px',
    //             marginBottom: '10px',
    //           }}
    //         >
    //           <Col>
    //             {items.map((item, index) => (
    //               <div
    //                 role="presentation"
    //                 // eslint-disable-next-line react/no-array-index-key
    //                 key={index}
    //                 onClick={() => handleItemClick(index)}
    //                 onKeyDown={() => console.log(item)}
    //                 style={{
    //                   userSelect: 'text',
    //                   cursor: 'pointer',
    //                   background:
    //                     selectedItem === index ? 'lightblue' : 'transparent',
    //                 }}
    //               >
    //                 {item}
    //               </div>
    //             ))}
    //           </Col>
    //         </Row>
    //         <div className="d-flex align-items-center justify-content-between">
    //           <Button variant="secondary" onClick={handleAddItem}>
    //             RSS Hinzufügen
    //           </Button>
    //           <Button
    //             variant="secondary"
    //             onClick={handleRemoveItem}
    //             disabled={selectedItem === null}
    //           >
    //             RSS Entfernen
    //           </Button>
    //         </div>
    //       </Card.Body>
    //       <TextSearch
    //         inputText={inputText}
    //         handleAddItem={handleAddItem}
    //         onChangeValue={setInputText}
    //       />
    //     </Card>
    //   </Container>
    // </div>
  );

  // return (
  //   <div style={{ maxWidth: "600px" }}>
  //     <Container fluid="true">
  //       <Card>
  //         <Card.Body
  //           className="d-flex flex-column"
  //           style={{
  //             height: "300px",
  //           }}
  //         >
  //           <div className="d-flex align-items-center justify-content-between mb-3">
  //             <Card.Title>Nachrichtenquellen</Card.Title>
  //             <Button variant="secondary">Artikel Aktualisieren</Button>
  //           </div>
  //           <Row
  //             className="flex-grow-1 overflow-auto"
  //             style={{
  //               border: "2px solid #BBBB",
  //               padding: "20px",
  //               borderRadius: "25px",
  //               marginBottom: "10px",
  //             }}
  //           >
  //             <Col>
  //               {items.map((item, index) => (
  //                 <div
  //                   key={index}
  //                   onClick={() => handleItemClick(index)}
  //                   style={{
  //                     userSelect: "text",
  //                     cursor: "pointer",
  //                     background:
  //                       selectedItem === index ? "lightblue" : "transparent",
  //                   }}
  //                 >
  //                   {item}
  //                 </div>
  //               ))}
  //             </Col>
  //           </Row>
  //           <div className="d-flex align-items-center justify-content-between">
  //             <Button variant="secondary" onClick={handleAddItem}>
  //               RSS Hinzufügen
  //             </Button>
  //             <Button
  //               variant="secondary"
  //               onClick={handleRemoveItem}
  //               disabled={selectedItem === null}
  //             >
  //               RSS Entfernen
  //             </Button>
  //           </div>
  //         </Card.Body>
  //         <TextSearch
  //           inputText={inputText}
  //           handleAddItem={handleAddItem}
  //           onChangeValue={setInputText}
  //         />
  //       </Card>
  //     </Container>
  //   </div>
  // );
}
