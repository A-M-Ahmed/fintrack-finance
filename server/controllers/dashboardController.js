import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
export const getDashboardSummary = async (req, res) => {
    try {
        const { range } = req.query; // '7d', '30d', 'all'
        const userId = req.user.id;

        // Calculate Date Range
        let startDate = new Date();
        if (range === '7d') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (range === '30d') {
            startDate.setDate(startDate.getDate() - 30);
        } else {
            // Default to 30 days if not specified or 'all' handling needed
            startDate.setDate(startDate.getDate() - 30);
        }

        // 1. Total Balance (Sum of all wallets)
        const wallets = await Wallet.find({ user: userId });
        const totalBalance = wallets.reduce((acc, wallet) => acc + wallet.currentBalance, 0);

        // 2. Total Income & Expense (in range)
        const transactions = await Transaction.find({
            user: userId,
            date: { $gte: startDate }
        });

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0);

        const totalExpense = transactions
            .filter(t => t.type === 'expense') // transfers also count as out for now?
            .reduce((acc, t) => acc + t.amount, 0);

        // 3. Recent Transactions
        const recentTransactions = await Transaction.find({ user: userId })
            .sort({ date: -1 })
            .limit(5)
            .populate('wallet', 'name');

        // 4. Chart Data (Group by date) - Simplified for MVP
        // We can group by Day.
        // Map entries to format: { date: 'YYYY-MM-DD', income: 0, expense: 0 }
        // Ideally use Mongo Aggregation for performance, but JS is fine for MVP scale.

        const chartMap = {};

        transactions.forEach(t => {
            const dateStr = t.date.toISOString().split('T')[0];
            if (!chartMap[dateStr]) {
                chartMap[dateStr] = { date: dateStr, income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                chartMap[dateStr].income += t.amount;
            } else if (t.type === 'expense') {
                chartMap[dateStr].expense += t.amount;
            }
        });

        const chartData = Object.values(chartMap).sort((a, b) => new Date(a.date) - new Date(b.date));

        res.status(200).json({
            totalBalance,
            totalIncome,
            totalExpense,
            recentTransactions,
            chartData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
