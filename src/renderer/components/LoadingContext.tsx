import React, { createContext, useContext, useState, useMemo } from 'react';

interface LoadingContextData {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextData | undefined>(undefined);

export const useLoadingContext = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error(
      'useLoadingContext must be used within a LoadingContextProvider'
    );
  }
  return context;
};

export default function LoadingContextProvider({ children }: any) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const contextValue = useMemo(
    () => ({ isLoading, setIsLoading }),
    [isLoading, setIsLoading]
  );

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
}
