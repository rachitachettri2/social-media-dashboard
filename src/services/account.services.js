import Account from '../models/account.js';

export const accountService = {
  // Create new account
  async createAccount(platform, username) {
    const account = new Account({
      platform,
      username,
      metrics: [{
        followers: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 5000),
        posts: Math.floor(Math.random() * 100)
      }]
    });
    return await account.save();
  },

  // Get all accounts
  async getAllAccounts() {
    return await Account.find().sort({ lastUpdated: -1 });
  },

  // Get account by ID
  async getAccountById(id) {
    return await Account.findById(id);
  },

  // Update metrics
  async updateMetrics(accountId) {
    const account = await Account.findById(accountId);
    if (!account) throw new Error('Account not found');

    const lastMetric = account.metrics[account.metrics.length - 1];
    account.metrics.push({
      followers: lastMetric?.followers + (Math.random() * 100 - 50),
      likes: lastMetric?.likes + (Math.random() * 50),
      posts: lastMetric?.posts + (Math.random() > 0.7 ? 1 : 0)
    });
    account.lastUpdated = new Date();
    return await account.save();
  },

  // Delete account
  async deleteAccount(id) {
    return await Account.findByIdAndDelete(id);
  },

  // Get metrics for CSV
  async getMetricsForExport(id) {
    const account = await Account.findById(id);
    return account ? account.metrics : [];
  }
};