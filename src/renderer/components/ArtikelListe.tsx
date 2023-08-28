import React from 'react';
import ArtikelItem from './ArtikelItem';
import { useArticlesContext } from './ArticlesContext';

export default function ArtikelListe() {
  const { articles } = useArticlesContext();

  return (
    <div className="artikeln-liste">
      <h2>Artikelliste</h2>
      <ul className="rss-articles">
        {articles.map((article) => {
          return article.items?.map((item) => {
            return <ArtikelItem artikelTitle={item.title} key={item.guid} />;
          });
        })}
      </ul>
    </div>
  );
}
