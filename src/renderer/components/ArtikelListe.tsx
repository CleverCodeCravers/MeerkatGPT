import React from 'react';
import ArtikelItme from './ArtikelItem';

export default function ArtikelListe() {
  const artikelName = 'Naseif has gone crazy ';
  return (
    <div className="artikeln-liste">
      <h2>Artikelliste</h2>
      <ul className="rss-articles">
        <ArtikelItme artikelTitle={artikelName} />
        <ArtikelItme artikelTitle={artikelName} />
      </ul>
    </div>
  );
}
