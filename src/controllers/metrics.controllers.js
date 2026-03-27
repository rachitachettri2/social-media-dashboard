import { accountService } from "../services/account.services.js";
import { io } from "../../index.js";
import { exportMetricsService } from "../services/export.services.js";

export const metricsController = {
  // POST /api/metrics/:id
  async updateMetrics(req, res) {
    try {
      const account = await accountService.updateMetrics(req.params.id);
      io.emit("metricsUpdate", account);

      res.json({
        success: true,
        data: account,
        message: "Metrics updated successfully",
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  },

  // GET /api/export/:id
  async exportMetrics(req, res) {
    try {
      await exportMetricsService.exportToCSV(req.params.id, res);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
};
