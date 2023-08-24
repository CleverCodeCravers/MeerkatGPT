/* eslint-disable jsx-a11y/no-static-element-interactions */
// import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
import React from 'react';
import './App.css';

import NachrichtenQuellen from './components/NachrichtenQuellen';
import ArtikelListe from './components/ArtikelListe';
import Header from './components/Header';
import TextSearch from './components/TextSearch';

export default function App() {
  return (
    <>
      <Header />
      <div className="app">
        <NachrichtenQuellen />
        <ArtikelListe />
        <TextSearch />
      </div>
    </>
  );
}
