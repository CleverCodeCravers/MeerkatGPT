import React, { createContext, useContext, useMemo, useState } from 'react';

interface GPTContextProps {
  response: { title: string; response: any[] };
  setResponse: React.Dispatch<
    React.SetStateAction<{ title: string; response: any[] }>
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
  const [response, setResponse] = useState<{ title: string; response: any[] }>({
    title: '',
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
