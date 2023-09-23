import axios from 'axios';
import { load } from 'cheerio';

export default async function fetchNewsArticle(url: string): Promise<string> {
  try {
    const antwort = await axios.get(url);
    const htmlInhalt = antwort.data;
    const $ = load(htmlInhalt);
    const artikelElement = $('article');

    if (!artikelElement.length) {
      throw new Error('Artikelinhalt nicht gefunden');
    }

    const artikelText = artikelElement.text();
    const bereinigterText = artikelText
      .replace(/\s+/g, ' ')
      .trim()
      .replace('\n', '');

    return bereinigterText;
  } catch (fehler) {
    throw new Error('Fehler beim Abrufen des Nachrichtenartikels');
  }
}
