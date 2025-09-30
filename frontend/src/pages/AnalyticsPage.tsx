import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Percent, BarChart3, PieChart } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts'

export function AnalyticsPage() {
  // Mock data for demonstration
  const portfolioData = [
    { month: 'Jan', value: 85000, growth: 5.2 },
    { month: 'Feb', value: 89000, growth: 4.7 },
    { month: 'Mar', value: 92000, growth: 3.4 },
    { month: 'Apr', value: 88000, growth: -4.3 },
    { month: 'May', value: 95000, growth: 8.0 },
    { month: 'Jun', value: 98000, growth: 3.2 },
  ]

  const metrics = [
    {
      title: 'Total Portfolio Value',
      value: '$98,342',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Monthly Return',
      value: '+3.2%',
      change: '+0.8%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Risk Score',
      value: '7.2/10',
      change: '-0.3',
      trend: 'down',
      icon: BarChart3,
    },
    {
      title: 'Diversification',
      value: '85%',
      change: '+5%',
      trend: 'up',
      icon: PieChart,
    },
  ]

  const holdings = [
    { name: 'Apple Inc.', symbol: 'AAPL', value: 25840, percentage: 26.3, change: 2.4 },
    { name: 'Microsoft Corp.', symbol: 'MSFT', value: 19656, percentage: 20.0, change: 1.8 },
    { name: 'Tesla Inc.', symbol: 'TSLA', value: 15712, percentage: 16.0, change: -3.2 },
    { name: 'Amazon.com Inc.', symbol: 'AMZN', value: 11801, percentage: 12.0, change: 0.9 },
    { name: 'Alphabet Inc.', symbol: 'GOOGL', value: 9834, percentage: 10.0, change: 1.5 },
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your investment performance and track market trends
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          const isPositive = metric.trend === 'up'
          return (
            <Card key={index} variant="financial">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`text-xs flex items-center mt-1 ${
                  isPositive ? 'text-success' : 'text-danger'
                }`}>
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {metric.change} from last month
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Performance */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>6-month portfolio value trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={portfolioData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary) / 0.1)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Growth Rate */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Monthly Growth Rate</CardTitle>
            <CardDescription>Percentage change month over month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={portfolioData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="growth"
                  stroke="hsl(var(--success))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card variant="financial">
        <CardHeader>
          <CardTitle>Top Holdings</CardTitle>
          <CardDescription>Your largest portfolio positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {holdings.map((holding, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    {holding.symbol.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{holding.name}</p>
                    <p className="text-sm text-muted-foreground">{holding.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${holding.value.toLocaleString()}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{holding.percentage}%</span>
                    <span className={`text-sm ${
                      holding.change >= 0 ? 'text-success' : 'text-danger'
                    }`}>
                      {holding.change >= 0 ? '+' : ''}{holding.change}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}