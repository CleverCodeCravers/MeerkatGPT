/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import './App.css';

import NachrichtenQuellen from './components/NachrichtenQuellen';
import ArtikelListe from './components/ArtikelListe';
import Header from './components/Header';
import TextSearch from './components/TextSearch';
import ArticlesProvider from './components/ArticlesContext';
import SearchResult from './components/SearchResult';
import SearchProvider from './components/SearchContext';
import GPTProvider from './components/GPTContext';

export default function App() {
  return (
    <ArticlesProvider>
      <Header />
      <div className="app">
        <NachrichtenQuellen />
        <GPTProvider>
          <SearchProvider>
            <ArtikelListe />
            <TextSearch />
            <SearchResult />
          </SearchProvider>
        </GPTProvider>
      </div>
    </ArticlesProvider>
  );
}
