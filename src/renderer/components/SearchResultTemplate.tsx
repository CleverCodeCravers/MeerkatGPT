import React from 'react';

interface SearchResulTemplateProps {
  title: string | undefined;
  query: string;
  firstResponse: string;
  secondResponse: string;
}
export default function SearchResulTemplate({
  title,
  query,
  firstResponse,
  secondResponse,
}: SearchResulTemplateProps) {
  return (
    <>
      <h3>{title}</h3>
      <p>- Query: {query}</p>
      <br />
      <strong>- Enthält der Artikel Informationen zu {query}?</strong>
      <p>- {firstResponse}</p>
      <strong>- Welche Informationen enthält der Artikel zu {query}?</strong>
      <p>- {secondResponse} </p>
    </>
  );
}
