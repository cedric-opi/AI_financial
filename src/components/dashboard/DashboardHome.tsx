import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Users, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export function DashboardHome() {
  const [profile, setProfile] = useState<any>(null);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Load user profile
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    setProfile(profileData);

    // Load portfolio data
    const { data: portfolios } = await supabase
      .from('portfolios')
      .select('total_value')
      .eq('user_id', user.id);
    
    const totalValue = portfolios?.reduce((sum, p) => sum + (p.total_value || 0), 0) || 0;
    setPortfolioValue(totalValue);

    // Load notifications
    const { data: notificationsData } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(5);
    
    setNotifications(notificationsData || []);
  };

  const stats = [
    {
      title: 'Portfolio Value',
      value: `$${portfolioValue.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      title: 'Monthly Return',
      value: '+$2,350',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: TrendingUp,
    },
    {
      title: 'Risk Score',
      value: profile?.risk_tolerance === 'conservative' ? '3/10' : 
             profile?.risk_tolerance === 'moderate' ? '6/10' : '8/10',
      change: 'Stable',
      changeType: 'neutral' as const,
      icon: PieChart,
    },
    {
      title: 'Experts Following',
      value: '3',
      change: '+1 this week',
      changeType: 'positive' as const,
      icon: Users,
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name?.split(' ')[0] || 'Investor'}!</h1>
        <p className="text-muted-foreground">
          Here's your financial overview and market insights for today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-muted-foreground'
                }`}>
                  {stat.changeType === 'positive' && <TrendingUp className="inline w-3 h-3 mr-1" />}
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with these common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/dashboard/chat')}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Analyze Market Trends
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/dashboard/portfolio')}
            >
              <PieChart className="mr-2 h-4 w-4" />
              Review Portfolio
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/dashboard/experts')}
            >
              <Users className="mr-2 h-4 w-4" />
              Follow New Experts
            </Button>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Recent Notifications
            </CardTitle>
            <CardDescription>Stay updated with market insights</CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No new notifications</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Investment Profile Summary */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>Your Investment Profile</CardTitle>
            <CardDescription>Based on your survey responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Risk Tolerance</h4>
                <p className="capitalize">{profile.risk_tolerance}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Experience Level</h4>
                <p className="capitalize">{profile.investment_experience}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Monthly Target</h4>
                <p>${profile.profit_target?.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Preferred Industries</h4>
                <p>{profile.preferred_industries?.slice(0, 3).join(', ')}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Loss Threshold</h4>
                <p>{profile.loss_threshold}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}