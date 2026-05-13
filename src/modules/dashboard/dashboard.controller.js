const dashboardService = require("./dashboard.service");

async function getDashboardSummary(req, res, next) {
    try {
        const summary = await dashboardService.getDashboardSummary();

        res.json({
            success: true,
            data: summary,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getDashboardSummary,
};