import { Feed } from 'main/types/Feed';
import React, { createContext, useContext, useMemo, useState } from 'react';

interface ArticlesContextType {
  articles: Feed[];
  setArticles: React.Dispatch<React.SetStateAction<Feed[]>>;
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(
  undefined
);

export const useArticlesContext = () => {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error(
      'useArticlesContext must be used within an ArticlesProvider'
    );
  }
  return context;
};

export default function ArticlesProvider({ children }: any) {
  const [articles, setArticles] = useState<Feed[]>([]);

  const contextValue = useMemo(
    () => ({ articles, setArticles }),
    [articles, setArticles]
  );

  return (
    <ArticlesContext.Provider value={contextValue}>
      {children}
    </ArticlesContext.Provider>
  );
}
