import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, MessageCircle, Shield, Zap, BarChart3, Users } from 'lucide-react'

export function HomePage() {
  const features = [
    {
      icon: MessageCircle,
      title: 'AI-Powered Chat',
      description: 'Get personalized investment advice from our advanced AI financial advisor',
    },
    {
      icon: BarChart3,
      title: 'Market Analytics',
      description: 'Real-time market analysis and comprehensive portfolio insights',
    },
    {
      icon: Shield,
      title: 'Risk Assessment',
      description: 'Intelligent risk evaluation to protect and optimize your investments',
    },
    {
      icon: Zap,
      title: 'Instant Insights',
      description: 'Get immediate responses to complex financial questions and scenarios',
    },
    {
      icon: TrendingUp,
      title: 'Performance Tracking',
      description: 'Track your portfolio performance with detailed analytics and reports',
    },
    {
      icon: Users,
      title: 'Expert Network',
      description: 'Access insights from top financial experts and market professionals',
    },
  ]

  const stats = [
    { label: 'Active Users', value: '50K+', change: '+12%' },
    { label: 'Total Trades', value: '$2.4B', change: '+24%' },
    { label: 'Success Rate', value: '94.2%', change: '+3.1%' },
    { label: 'AI Accuracy', value: '97.8%', change: '+1.2%' },
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-6xl">
              Your AI-Powered
              <br />
              <span className="bg-gradient-to-r from-primary-glow to-success-glow bg-clip-text text-transparent">
                Financial Advisor
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Make smarter investment decisions with our advanced AI chatbot. Get personalized advice, 
              market insights, and risk analysis to maximize your financial potential.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button variant="secondary" size="xl" asChild>
                <Link to="/chat">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start Chat
                </Link>
              </Button>
              <Button variant="outline" size="xl" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} variant="financial">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  <div className="text-sm text-success font-medium mt-2">{stat.change}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need for smart investing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive tools and insights to help you make 
            informed financial decisions and achieve your investment goals.
          </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} variant="elevated">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-card border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Ready to start your financial journey?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of investors who trust our AI advisor for smarter trading decisions.
            </p>
            <div className="mt-8">
              <Button variant="hero" size="xl" asChild>
                <Link to="/chat">
                  Get Started Today
                  <TrendingUp className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}