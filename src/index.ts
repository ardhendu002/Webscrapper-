import axios from 'axios';
import * as cheerio from 'cheerio';

const url = 'https://www.cricbuzz.com/cricket-series/9237/indian-premier-league-2025/stats';

const AxiosInstance = axios.create({});

interface PlayerData {
  name: string;
  matches: number;
  runs: number;
}

AxiosInstance.get(url)
  .then(response => {
    const html = response.data as string;
    const $ = cheerio.load(html);
    const statsTable: cheerio.Cheerio = $('.cb-series-stats-container tr');
    const topScorers: PlayerData[] = [];

    statsTable.each((i, elem) => {
      const name: string = $(elem).find('.cb-col-50').text().trim();
      const matches: number = parseInt($(elem).find('.cb-col-8').eq(0).text().trim());
      const runs: number = parseInt($(elem).find('.cb-col-8').eq(1).text().trim());

      // Skip empty rows
      if (name) {
        topScorers.push({ name, matches, runs });
      }
    });

    console.log(topScorers);
  })
  .catch(console.error);