import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Wallet as WalletIcon, TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import CreditCard from "@/components/CreditCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// Dashboard Skeleton Component
const DashboardSkeleton = () => (
  <div className="flex flex-col gap-8">
    <Skeleton className="h-9 w-40" />
    <div className="grid gap-6 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid gap-6 md:grid-cols-12">
      <Card className="md:col-span-8">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
      <div className="md:col-span-4 space-y-6">
        <Skeleton className="h-[240px] w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

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

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="hidden md:flex gap-4">
             {/* Header actions can go here */}
        </div>
      </div>
      
      {/* Stats Cards Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Total Balance - Dark Card */}
        <Card className="bg-stone-900 border-none text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-xl bg-lime-400 flex items-center justify-center text-stone-900">
                  <WalletIcon className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-sm font-medium text-stone-400">Total balance</p>
                  <div className="text-2xl font-bold">${data?.totalBalance?.toFixed(2) || '0.00'}</div>
               </div>
            </div>
            {/* Tiny chart or trend could go here */}
          </CardContent>
        </Card>

        {/* Total Spending */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300">
                  <TrendingDown className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-sm font-medium text-muted-foreground">Total spending</p>
                  <div className="text-2xl font-bold">${data?.totalExpense?.toFixed(2) || '0.00'}</div>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Saved (Income - Spending for now) */}
        <Card className="shadow-sm">
           <CardContent className="p-6">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300">
                  <TrendingUp className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-sm font-medium text-muted-foreground">Total saved</p>
                  <div className="text-2xl font-bold">${((data?.totalIncome || 0) - (data?.totalExpense || 0)).toFixed(2)}</div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Chart Section */}
        <Card className="md:col-span-8 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
                 <CardTitle className="text-xl">Working Capital</CardTitle>
                 <CardDescription>Income vs Expenses over time</CardDescription>
            </div>
            <div className="flex gap-2">
                 {/* Legend */}
                 <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-lime-500"></div> Income
                 </div>
                 <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-yellow-400"></div> Expenses
                 </div>
            </div>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.chartData || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#84cc16" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#facc15" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.4} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                    dy={10}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                    dx={-10}
                  />
                  <Tooltip 
                     contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#84cc16" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Area type="monotone" dataKey="expense" stroke="#facc15" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Wallets & Transfers Column */}
        <div className="md:col-span-4 flex flex-col gap-6">
            
            {/* Wallet Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Wallet</h3>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                </div>
                {/* Stacked Cards Effect */}
                <div className="relative h-[240px]">
                    <div className="absolute top-0 w-full z-20">
                        <CreditCard 
                           type="universal" 
                           balance={data?.totalBalance || 0}
                           number="5495 **** **** 2321"
                        />
                    </div>
                    <div className="absolute top-16 w-full z-10 scale-[0.95] opacity-60">
                         <CreditCard 
                           type="commercial" 
                           balance={1250.00}
                           number="8595 **** **** 4852"
                        />
                    </div>
                </div>
            </div>

            {/* Scheduled Transfers */}
            <div className="space-y-4 mt-6">
                 <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Scheduled Transfers</h3>
                    <Button variant="link" className="text-xs h-auto p-0 text-lime-600">View All</Button>
                </div>
                <div className="space-y-4">
                    {/* Mock Data for UI Matching */}
                    {[
                        { name: 'Saleh Ahmed', date: 'April 28, 2022', amount: -435.00 },
                        { name: 'Delowar Hossain', date: 'April 25, 2022', amount: -132.00 },
                        { name: 'Moinul Hasan', date: 'April 24, 2022', amount: -826.00 },
                    ].map((t, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`} />
                                    <AvatarFallback>{t.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{t.name}</p>
                                    <p className="text-xs text-muted-foreground">{t.date}</p>
                                </div>
                            </div>
                            <div className="font-bold text-sm">
                                {t.amount.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
      
      {/* Recent Transactions Full Width */}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Recent Transactions</CardTitle>
            <Button variant="link" className="text-lime-600">View All</Button>
        </CardHeader>
        <CardContent>
             <div className="space-y-1">
                 {data?.recentTransactions?.map((t) => (
                     <div key={t._id} className="flex items-center justify-between py-4 border-b last:border-0 hover:bg-muted/50 px-2 rounded-lg transition-colors">
                          <div className="flex items-center gap-4">
                              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                 {t.type === 'income' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                              </div>
                              <div>
                                 <p className="font-semibold">{t.title}</p>
                                 <p className="text-sm text-muted-foreground capitalize">{t.category} • {t.type}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <div className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                 {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                              </div>
                              <p className="text-xs text-muted-foreground">{format(new Date(t.date), 'dd MMM yyyy')}</p>
                          </div>
                     </div>
                 ))}
                 {(!data?.recentTransactions || data.recentTransactions.length === 0) && (
                     <p className="text-center text-muted-foreground py-8">No transactions found</p>
                 )}
             </div>
        </CardContent>
      </Card>
    </div>
  );
}
