export interface PortfolioMetrics {
  totalValue: number
  monthlyReturn: number
  yearToDateReturn: number
  riskScore: number
  diversificationScore: number
  holdings: Holding[]
  performanceHistory: PerformanceData[]
}

export interface Holding {
  symbol: string
  name: string
  value: number
  percentage: number
  dayChange: number
  sector: string
}

export interface PerformanceData {
  date: string
  value: number
  return: number
}

export class AnalyticsService {
  async getPortfolioAnalytics(): Promise<PortfolioMetrics> {
    // In a real application, this would fetch data from a database or external API
    // For now, we'll return mock data
    
    return {
      totalValue: 98342.67,
      monthlyReturn: 3.2,
      yearToDateReturn: 12.5,
      riskScore: 7.2,
      diversificationScore: 85,
      holdings: [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          value: 25840.12,
          percentage: 26.3,
          dayChange: 2.4,
          sector: 'Technology'
        },
        {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          value: 19656.34,
          percentage: 20.0,
          dayChange: 1.8,
          sector: 'Technology'
        },
        {
          symbol: 'TSLA',
          name: 'Tesla, Inc.',
          value: 15712.89,
          percentage: 16.0,
          dayChange: -3.2,
          sector: 'Automotive'
        },
        {
          symbol: 'AMZN',
          name: 'Amazon.com Inc.',
          value: 11801.45,
          percentage: 12.0,
          dayChange: 0.9,
          sector: 'E-commerce'
        },
        {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          value: 9834.22,
          percentage: 10.0,
          dayChange: 1.5,
          sector: 'Technology'
        }
      ],
      performanceHistory: this.generatePerformanceHistory()
    }
  }

  private generatePerformanceHistory(): PerformanceData[] {
    const history: PerformanceData[] = []
    let baseValue = 85000
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 6)

    for (let i = 0; i < 180; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      
      // Simulate realistic market movements
      const dailyChange = (Math.random() - 0.5) * 0.04 // ±2% daily change
      baseValue *= (1 + dailyChange)
      
      const returnPercent = ((baseValue - 85000) / 85000) * 100

      history.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(baseValue * 100) / 100,
        return: Math.round(returnPercent * 100) / 100
      })
    }

    return history
  }

  async getMarketData(symbol: string) {
    // Mock market data - in real app, would fetch from financial API
    return {
      symbol,
      price: Math.random() * 200 + 50,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 1000000),
      marketCap: Math.floor(Math.random() * 1000000000000),
    }
  }

  async calculateRiskMetrics(holdings: Holding[]) {
    // Simplified risk calculation
    const sectorDiversification = this.calculateSectorDiversification(holdings)
    const volatility = this.calculateVolatility(holdings)
    
    return {
      riskScore: Math.round((volatility + (10 - sectorDiversification)) / 2 * 10) / 10,
      diversificationScore: Math.round(sectorDiversification * 10),
      volatility: Math.round(volatility * 10) / 10
    }
  }

  private calculateSectorDiversification(holdings: Holding[]): number {
    const sectors = new Set(holdings.map(h => h.sector))
    return Math.min(sectors.size / 5, 1) * 10 // Max score of 10 for 5+ sectors
  }

  private calculateVolatility(holdings: Holding[]): number {
    // Simplified volatility calculation based on day changes
    const avgChange = holdings.reduce((sum, h) => sum + Math.abs(h.dayChange), 0) / holdings.length
    return Math.min(avgChange / 3 * 10, 10) // Normalize to 0-10 scale
  }
}