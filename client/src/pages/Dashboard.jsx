import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard/summary?range=30d');
        setData(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Dashboard fetch error", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.totalBalance?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">Across all wallets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income (30d)</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+${data?.totalIncome?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expense (30d)</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-${data?.totalExpense?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Working Capital</CardTitle>
            <p className="text-sm text-muted-foreground">Income vs Expenses over time</p>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.chartData || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={2} activeDot={{ r: 8 }} dot={false} />
                  <Line type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data?.recentTransactions?.map((t) => (
                        <div key={t._id} className="flex items-center">
                             <div className={`h-9 w-9 rounded-full flex items-center justify-center border ${t.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                                <Activity className={`h-4 w-4 ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                             </div>
                             <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{t.title}</p>
                                <p className="text-sm text-muted-foreground">{t.category}</p>
                             </div>
                             <div className={`ml-auto font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {t.type === 'income' ? '+' : '-'}${t.amount}
                             </div>
                        </div>
                    ))}
                    {(!data?.recentTransactions || data.recentTransactions.length === 0) && (
                        <p className="text-sm text-muted-foreground text-center py-4">No recent transactions</p>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
