import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_period: string;
  features: string[];
  is_active: boolean;
}

interface UserSubscription {
  id: string;
  status: string;
  start_date: string;
  end_date: string;
  package: SubscriptionPackage;
}

export function SubscriptionPage() {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Load available packages
    const { data: packagesData } = await supabase
      .from('subscription_packages')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (packagesData) {
      setPackages(packagesData);
    }

    // Load current subscription
    const { data: subscriptionData } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        package:subscription_packages(*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (subscriptionData) {
      setCurrentSubscription(subscriptionData as any);
    }

    setLoading(false);
  };

  const subscribe = async (packageId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          package_id: packageId,
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: 'Subscription Started',
        description: 'Your subscription is being processed. You will receive a confirmation email.',
      });

      // In a real app, this would integrate with Stripe or another payment processor
      setTimeout(() => {
        loadSubscriptionData();
      }, 1000);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to start subscription',
        variant: 'destructive',
      });
    }
  };

  const cancelSubscription = async () => {
    if (!currentSubscription) return;

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', currentSubscription.id);

      if (error) throw error;

      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription has been cancelled. You can continue using the service until the end of your billing period.',
      });

      setCurrentSubscription(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel subscription',
        variant: 'destructive',
      });
    }
  };

  const getPackageIcon = (name: string) => {
    if (name.toLowerCase().includes('premium')) return Crown;
    if (name.toLowerCase().includes('pro')) return Star;
    return Zap;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">Loading subscription details...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <p className="text-muted-foreground">
          Choose the plan that best fits your investment needs
        </p>
      </div>

      {/* Current Subscription */}
      {currentSubscription && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center">
              Current Plan: {currentSubscription.package.name}
              <Badge className="ml-2">{currentSubscription.status}</Badge>
            </CardTitle>
            <CardDescription>
              Your subscription is active until {new Date(currentSubscription.end_date).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">
                  ${currentSubscription.package.price}/{currentSubscription.package.billing_period}
                </p>
                <p className="text-sm text-muted-foreground">
                  Next billing: {new Date(currentSubscription.end_date).toLocaleDateString()}
                </p>
              </div>
              <Button variant="outline" onClick={cancelSubscription}>
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div className="grid gap-6 md:grid-cols-3">
        {packages.map((pkg) => {
          const Icon = getPackageIcon(pkg.name);
          const isCurrentPlan = currentSubscription?.package.id === pkg.id;
          
          return (
            <Card 
              key={pkg.id} 
              className={`relative ${pkg.name.toLowerCase().includes('pro') ? 'border-primary shadow-lg' : ''}`}
            >
              {pkg.name.toLowerCase().includes('pro') && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <Icon className="h-12 w-12 mx-auto mb-2 text-primary" />
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">${pkg.price}</span>
                  <span className="text-muted-foreground">/{pkg.billing_period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={pkg.name.toLowerCase().includes('pro') ? 'default' : 'outline'}
                  onClick={() => subscribe(pkg.id)}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? 'Current Plan' : `Subscribe to ${pkg.name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Free Plan (Current) */}
      {!currentSubscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5" />
              Free Plan
              <Badge variant="secondary" className="ml-2">Current</Badge>
            </CardTitle>
            <CardDescription>
              You're currently on our free plan with limited features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Basic AI Chat (5 messages/day)
              </li>
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Portfolio Tracking (1 portfolio)
              </li>
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Basic Market Updates
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Upgrade to unlock advanced features and unlimited access to FinGPT.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>
            Secure payments powered by Stripe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            All plans include a 7-day free trial. You can cancel anytime with no questions asked. 
            Your subscription will automatically renew unless cancelled before the next billing date.
          </p>
          
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Need help choosing?</h4>
            <p className="text-sm text-muted-foreground">
              Start with the Pro Plan for the best balance of features and value. 
              You can always upgrade or downgrade later based on your needs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}