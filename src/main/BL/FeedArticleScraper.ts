import axios from 'axios';
import { JSDOM } from 'jsdom';

export default async function fetchNewsArticle(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    const htmlContent = response.data;

    const dom = new JSDOM(htmlContent);
    const articleElement = dom.window.document.querySelector('article'); // Adjust the selector as needed

    if (!articleElement) {
      throw new Error('Article content not found');
    }

    const articleText = articleElement.textContent || '';

    const trimmedText = articleText
      .replace(/\s+/g, ' ')
      .trim()
      .replace('\n', '');

    return trimmedText;
  } catch (error) {
    // console.error('Error fetching news article:', error.message);
    throw new Error('Failed to fetch news article');
  }
}
