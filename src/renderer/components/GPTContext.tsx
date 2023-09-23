import { FeedArticleItem } from 'main/types/FeedArticleItem';
import React, { createContext, useContext, useMemo, useState } from 'react';

interface GPTContextProps {
  response: { feed: FeedArticleItem; response: any[] };
  setResponse: React.Dispatch<
    React.SetStateAction<{ feed: FeedArticleItem; response: any[] }>
  >;
}

const GPTContext = createContext<GPTContextProps | undefined>(undefined);

export const useGPTContext = () => {
  const context = useContext(GPTContext);
  if (!context) {
    throw new Error(
      'useSelectedArtikelContext must be used within an SelectedArtikelProvider'
    );
  }
  return context;
};

export default function GPTProvider({ children }: any) {
  const [response, setResponse] = useState<{
    feed: FeedArticleItem;
    response: any[];
  }>({
    feed: {
      title: '',
      link: '',
      content: '',
      contentSnippet: '',
      'content:encoded': '',
      'content:encodedSnippet': '',
      guid: '',
      pubDate: '',
      isoDate: new Date(),
    },
    response: [],
  });
  const contextValue = useMemo(
    () => ({ response, setResponse }),
    [response, setResponse]
  );

  return (
    <GPTContext.Provider value={contextValue}>{children}</GPTContext.Provider>
  );
}
