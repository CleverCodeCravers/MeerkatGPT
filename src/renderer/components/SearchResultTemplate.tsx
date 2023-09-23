import React from 'react';

interface SearchResulTemplateProps {
  titel: string;
  query: string;
  firstResponse: string;
  secondResponse: string;
}
export default function SearchResulTemplate({
  titel,
  query,
  firstResponse,
  secondResponse,
}: SearchResulTemplateProps) {
  return (
    <>
      <h3>{titel}</h3>
      <p className="result-text">- Query: {query}</p>
      <br />
      <strong>- Enthält der Artikel Informationen zu {query}?</strong>
      <p className="result-text">- {firstResponse}</p>
      <strong>- Welche Informationen enthält der Artikel zu {query}?</strong>
      <p className="result-text">- {secondResponse} </p>
    </>
  );
}
