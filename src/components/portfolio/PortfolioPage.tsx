import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Portfolio {
  id: string;
  name: string;
  total_value: number;
  created_at: string;
}

interface Holding {
  id: string;
  symbol: string;
  quantity: number;
  average_price: number;
  current_price: number;
}

export function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setPortfolios(data);
      if (data.length > 0) {
        setSelectedPortfolio(data[0]);
        loadHoldings(data[0].id);
      }
    }
    setLoading(false);
  };

  const loadHoldings = async (portfolioId: string) => {
    const { data } = await supabase
      .from('portfolio_holdings')
      .select('*')
      .eq('portfolio_id', portfolioId);

    if (data) {
      // Simulate current prices (in real app, would fetch from financial API)
      const holdingsWithPrices = data.map(holding => ({
        ...holding,
        current_price: holding.average_price * (0.95 + Math.random() * 0.1) // ±5% variation
      }));
      setHoldings(holdingsWithPrices);
    }
  };

  const createPortfolio = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('portfolios')
      .insert({
        user_id: user.id,
        name: `Portfolio ${portfolios.length + 1}`,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create portfolio',
        variant: 'destructive',
      });
    } else {
      setPortfolios(prev => [data, ...prev]);
      setSelectedPortfolio(data);
      setHoldings([]);
      toast({
        title: 'Success',
        description: 'Portfolio created successfully',
      });
    }
  };

  const calculatePortfolioValue = () => {
    return holdings.reduce((total, holding) => {
      return total + (holding.quantity * (holding.current_price || holding.average_price));
    }, 0);
  };

  const calculateTotalReturn = () => {
    const currentValue = calculatePortfolioValue();
    const costBasis = holdings.reduce((total, holding) => {
      return total + (holding.quantity * holding.average_price);
    }, 0);
    
    return costBasis > 0 ? ((currentValue - costBasis) / costBasis) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Management</h1>
          <p className="text-muted-foreground">Track and analyze your investments</p>
        </div>
        <Button onClick={createPortfolio}>
          <Plus className="mr-2 h-4 w-4" />
          New Portfolio
        </Button>
      </div>

      {portfolios.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Create your first portfolio to start tracking investments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={createPortfolio}>
              <Plus className="mr-2 h-4 w-4" />
              Create Portfolio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Portfolio Selection */}
          <div className="flex space-x-2 overflow-x-auto">
            {portfolios.map((portfolio) => (
              <Button
                key={portfolio.id}
                variant={selectedPortfolio?.id === portfolio.id ? "default" : "outline"}
                onClick={() => {
                  setSelectedPortfolio(portfolio);
                  loadHoldings(portfolio.id);
                }}
              >
                {portfolio.name}
              </Button>
            ))}
          </div>

          {/* Portfolio Summary */}
          {selectedPortfolio && (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${calculatePortfolioValue().toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Return</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold flex items-center ${
                    calculateTotalReturn() >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {calculateTotalReturn() >= 0 ? (
                      <TrendingUp className="mr-1 h-5 w-5" />
                    ) : (
                      <TrendingDown className="mr-1 h-5 w-5" />
                    )}
                    {Math.abs(calculateTotalReturn()).toFixed(2)}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {holdings.length}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Holdings Table */}
          {holdings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Holdings</CardTitle>
                <CardDescription>Your current investment positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Symbol</th>
                        <th className="text-right p-2">Shares</th>
                        <th className="text-right p-2">Avg Price</th>
                        <th className="text-right p-2">Current Price</th>
                        <th className="text-right p-2">Market Value</th>
                        <th className="text-right p-2">Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holdings.map((holding) => {
                        const marketValue = holding.quantity * (holding.current_price || holding.average_price);
                        const costBasis = holding.quantity * holding.average_price;
                        const returnPercent = ((marketValue - costBasis) / costBasis) * 100;
                        
                        return (
                          <tr key={holding.id} className="border-b">
                            <td className="p-2 font-medium">{holding.symbol}</td>
                            <td className="text-right p-2">{holding.quantity}</td>
                            <td className="text-right p-2">${holding.average_price.toFixed(2)}</td>
                            <td className="text-right p-2">
                              ${(holding.current_price || holding.average_price).toFixed(2)}
                            </td>
                            <td className="text-right p-2">${marketValue.toFixed(2)}</td>
                            <td className={`text-right p-2 ${
                              returnPercent >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {returnPercent.toFixed(2)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {holdings.length === 0 && selectedPortfolio && (
            <Card>
              <CardHeader>
                <CardTitle>No Holdings</CardTitle>
                <CardDescription>
                  This portfolio doesn't have any holdings yet. Start by adding some investments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Use the chat feature to get personalized investment recommendations from FinGPT.
                </p>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Holdings (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}