import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const surveySchema = z.object({
  profitTarget: z.number().min(1, 'Profit target must be positive'),
  monthlyIncome: z.number().min(0, 'Monthly income must be non-negative'),
  preferredIndustries: z.array(z.string()).min(1, 'Select at least one industry'),
  lossThreshold: z.number().min(0).max(100, 'Loss threshold must be between 0-100%'),
  riskTolerance: z.enum(['conservative', 'moderate', 'aggressive']),
  investmentExperience: z.enum(['beginner', 'intermediate', 'advanced']),
});

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Energy', 'Real Estate',
  'Consumer Goods', 'Manufacturing', 'Transportation', 'Utilities', 'Agriculture'
];

interface SurveyPageProps {
  onComplete: () => void;
}

export function SurveyPage({ onComplete }: SurveyPageProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    profitTarget: '',
    monthlyIncome: '',
    preferredIndustries: [] as string[],
    lossThreshold: '',
    riskTolerance: '',
    investmentExperience: '',
  });
  const { toast } = useToast();

  const handleIndustryChange = (industry: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferredIndustries: checked
        ? [...prev.preferredIndustries, industry]
        : prev.preferredIndustries.filter(i => i !== industry)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = surveySchema.parse({
        profitTarget: parseFloat(formData.profitTarget),
        monthlyIncome: parseFloat(formData.monthlyIncome),
        preferredIndustries: formData.preferredIndustries,
        lossThreshold: parseFloat(formData.lossThreshold),
        riskTolerance: formData.riskTolerance,
        investmentExperience: formData.investmentExperience,
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_profiles')
        .update({
          profit_target: validated.profitTarget,
          monthly_income: validated.monthlyIncome,
          preferred_industries: validated.preferredIndustries,
          loss_threshold: validated.lossThreshold,
          risk_tolerance: validated.riskTolerance,
          investment_experience: validated.investmentExperience,
          survey_completed: true,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Survey Completed',
        description: 'Your financial profile has been saved successfully!',
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save survey data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Financial Profile Survey</CardTitle>
            <CardDescription>
              Help us understand your investment goals and risk tolerance to provide personalized advice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Monthly Profit Target ($)</label>
                <Input
                  type="number"
                  placeholder="e.g., 1000"
                  value={formData.profitTarget}
                  onChange={(e) => setFormData(prev => ({ ...prev, profitTarget: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Monthly Income ($)</label>
                <Input
                  type="number"
                  placeholder="e.g., 5000"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Industries</label>
                <div className="grid grid-cols-2 gap-3">
                  {industries.map((industry) => (
                    <div key={industry} className="flex items-center space-x-2">
                      <Checkbox
                        id={industry}
                        checked={formData.preferredIndustries.includes(industry)}
                        onCheckedChange={(checked) => handleIndustryChange(industry, checked as boolean)}
                      />
                      <label htmlFor={industry} className="text-sm">{industry}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Maximum Loss Threshold (%)</label>
                <Input
                  type="number"
                  placeholder="e.g., 10"
                  min="0"
                  max="100"
                  value={formData.lossThreshold}
                  onChange={(e) => setFormData(prev => ({ ...prev, lossThreshold: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Risk Tolerance</label>
                <Select
                  value={formData.riskTolerance}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, riskTolerance: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your risk tolerance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative - Prefer stable, low-risk investments</SelectItem>
                    <SelectItem value="moderate">Moderate - Balanced risk and return</SelectItem>
                    <SelectItem value="aggressive">Aggressive - Higher risk for higher returns</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Investment Experience</label>
                <Select
                  value={formData.investmentExperience}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, investmentExperience: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner - New to investing</SelectItem>
                    <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                    <SelectItem value="advanced">Advanced - Experienced investor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Complete Survey'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}