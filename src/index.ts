import axios from 'axios';
import * as cheerio  from 'cheerio';
const url = 'https://www.cricbuzz.com/cricket-series/9237/indian-premier-league-2025/stats'
const AxiosInstance = axios.create({});

interface Playerata{
    name: String;
    matches: Number;
    runs: Number;
}
AxiosInstance.get(url)
    .then(
        response => {
            const html = response.data as string;
            const $ = cheerio.load(html);
            const statsTable : cheerio.Cheerio = $('.statsTableContainer > tr');
            const topScorers : Playerata[] = [];
            statsTable.each((i,elem)) => {
                 
            }
        }
    )
    .catch(console.error);