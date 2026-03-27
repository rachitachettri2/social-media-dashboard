import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { fileURLToPath } from 'url';
import { accountService } from './account.services.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportMetricsService = {
  async exportToCSV(accountId, res) {
    const metrics = await accountService.getMetricsForExport(accountId);
    
    const csvWriter = createObjectCsvWriter({
      path: path.join(__dirname, '../metrics.csv'),
      header: [
        { id: 'date', title: 'Date' },
        { id: 'followers', title: 'Followers' },
        { id: 'likes', title: 'Likes' },
        { id: 'posts', title: 'Posts' }
      ]
    });

    await csvWriter.writeRecords(
      metrics.map(m => ({
        date: new Date(m.date).toLocaleDateString(),
        followers: m.followers,
        likes: m.likes,
        posts: m.posts
      }))
    );

    res.download(path.join(__dirname, '../metrics.csv'));
  }
};