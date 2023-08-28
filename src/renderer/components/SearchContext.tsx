import React, { createContext, useContext, useMemo, useState } from 'react';

interface SearchContextProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<string>;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within an SearchProvider');
  }
  return context;
};

export default function SearchProvider({ children }: any) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const contextValue = useMemo(
    () => ({ searchQuery, setSearchQuery }),
    [searchQuery, setSearchQuery]
  );

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}
