import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users, TrendingUp, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Expert {
  id: string;
  name: string;
  bio: string;
  avatar_url?: string;
  specialization: string[];
  years_experience: number;
  rating: number;
  total_followers: number;
  is_following?: boolean;
}

export function ExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadExperts();
  }, []);

  const loadExperts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get all experts
    const { data: expertsData } = await supabase
      .from('experts')
      .select('*')
      .order('rating', { ascending: false });

    // Get user's follows
    const { data: followsData } = await supabase
      .from('expert_follows')
      .select('expert_id')
      .eq('user_id', user.id);

    const followedIds = new Set(followsData?.map(f => f.expert_id) || []);

    if (expertsData) {
      const expertsWithFollowStatus = expertsData.map(expert => ({
        ...expert,
        is_following: followedIds.has(expert.id)
      }));
      setExperts(expertsWithFollowStatus);
    }

    setLoading(false);
  };

  const toggleFollow = async (expertId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const expert = experts.find(e => e.id === expertId);
    if (!expert) return;

    try {
      if (expert.is_following) {
        // Unfollow
        const { error } = await supabase
          .from('expert_follows')
          .delete()
          .eq('user_id', user.id)
          .eq('expert_id', expertId);

        if (error) throw error;

        toast({
          title: 'Unfollowed',
          description: `You are no longer following ${expert.name}`,
        });
      } else {
        // Follow
        const { error } = await supabase
          .from('expert_follows')
          .insert({
            user_id: user.id,
            expert_id: expertId,
          });

        if (error) throw error;

        toast({
          title: 'Following',
          description: `You are now following ${expert.name}`,
        });
      }

      // Update local state
      setExperts(prev => prev.map(e => 
        e.id === expertId ? { ...e, is_following: !e.is_following } : e
      ));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update follow status',
        variant: 'destructive',
      });
    }
  };

  const startChatWithExpert = (expertId: string) => {
    navigate(`/dashboard/chat?expert=${expertId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">Loading experts...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Experts</h1>
        <p className="text-muted-foreground">
          Follow AI-powered experts and get personalized investment advice
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {experts.map((expert) => (
          <Card key={expert.id} className="flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={expert.avatar_url} />
                  <AvatarFallback>
                    {expert.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg">{expert.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-muted-foreground ml-1">
                        {expert.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground ml-1">
                        {expert.total_followers} followers
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              <CardDescription className="text-sm">
                {expert.bio}
              </CardDescription>

              <div>
                <p className="text-sm font-medium mb-2">Specializations:</p>
                <div className="flex flex-wrap gap-1">
                  {expert.specialization.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                {expert.years_experience} years experience
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  variant={expert.is_following ? "secondary" : "default"}
                  onClick={() => toggleFollow(expert.id)}
                  className="flex-1"
                >
                  {expert.is_following ? 'Following' : 'Follow'}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => startChatWithExpert(expert.id)}
                  title="Chat with this expert"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {experts.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No Experts Found</CardTitle>
            <CardDescription>
              We're working on adding more financial experts to our platform.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}