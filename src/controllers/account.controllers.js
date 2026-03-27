import { accountService } from "../services/account.services.js";
import { io } from "../../index.js";

export const accountsController = {
  // POST /api/accounts
  async createAccount(req, res) {
    try {
      const { platform, username } = req.body;

      const account = await accountService.createAccount(platform, username);
      io.emit("newAccount", account);

      res.status(201).json({
        success: true,
        data: account,
        message: "Account created successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  // GET /api/dashboard
  async getDashboard(req, res) {
    try {
      const accounts = await accountService.getAllAccounts();
      res.json({
        success: true,
        data: accounts,
        count: accounts.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  // DELETE /api/accounts/:id
  async deleteAccount(req, res) {
    try {
      await accountService.deleteAccount(req.params.id);
      io.emit("accountDeleted", req.params.id);

      res.json({
        success: true,
        message: "Account deleted successfully",
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  },
};
