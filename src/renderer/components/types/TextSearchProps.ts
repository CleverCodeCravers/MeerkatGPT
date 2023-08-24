import React, { HTMLProps } from 'react';

export type TextSearchProps = HTMLProps<HTMLInputElement> & {
  handleAddItem: () => void;
  inputText: string;
  onChangeValue: React.Dispatch<React.SetStateAction<string>>;
};
