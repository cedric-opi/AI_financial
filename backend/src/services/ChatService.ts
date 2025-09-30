import { OpenAI } from 'openai'

export class ChatService {
  private openai: OpenAI

  constructor() {
    // Initialize OpenAI client - you'll need to set OPENAI_API_KEY environment variable
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    })
  }

  async processMessage(message: string): Promise<string> {
    try {
      // If no API key is set, return a mock response
      if (!process.env.OPENAI_API_KEY) {
        return this.getMockResponse(message)
      }

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional financial advisor AI assistant. You provide helpful, accurate, and responsible financial advice. 
            
            Key guidelines:
            - Always provide balanced, risk-aware investment advice
            - Mention that investments carry risk and past performance doesn't guarantee future results
            - Suggest diversification when appropriate
            - Keep responses informative but concise
            - Never provide specific stock recommendations without proper disclaimers
            - Focus on educational content and general investment principles
            
            You can help with:
            - Portfolio analysis and optimization
            - Risk assessment strategies
            - Market trend analysis
            - Investment education
            - Financial planning concepts
            - Asset allocation guidance`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      })

      return completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.'
    } catch (error) {
      console.error('OpenAI API error:', error)
      return this.getMockResponse(message)
    }
  }

  private getMockResponse(message: string): string {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('portfolio') || lowerMessage.includes('diversif')) {
      return `Based on modern portfolio theory, diversification is key to managing risk. Consider spreading your investments across different asset classes such as stocks, bonds, real estate, and commodities. A common approach is the 60/40 portfolio (60% stocks, 40% bonds), but this should be adjusted based on your age, risk tolerance, and financial goals.

Remember: All investments carry risk, and past performance doesn't guarantee future results. Consider consulting with a qualified financial advisor for personalized advice.`
    }

    if (lowerMessage.includes('risk') || lowerMessage.includes('safe')) {
      return `Risk management is crucial in investing. Here are key strategies:

1. **Diversification**: Spread investments across asset classes
2. **Asset Allocation**: Match your portfolio to your risk tolerance
3. **Emergency Fund**: Keep 3-6 months of expenses in cash
4. **Time Horizon**: Longer investment periods can handle more volatility
5. **Regular Review**: Rebalance your portfolio periodically

Lower-risk options include treasury bonds, high-grade corporate bonds, and diversified index funds. However, remember that lower risk often means lower potential returns.`
    }

    if (lowerMessage.includes('market') || lowerMessage.includes('trend')) {
      return `Market analysis should consider multiple factors:

**Technical Analysis**: Chart patterns, moving averages, trading volume
**Fundamental Analysis**: Company earnings, economic indicators, industry trends
**Market Sentiment**: Investor psychology and market momentum

Key economic indicators to watch:
- GDP growth rates
- Inflation data
- Employment statistics
- Interest rate changes
- Corporate earnings reports

Remember that markets are inherently unpredictable, and even professional analysts frequently make incorrect predictions. Focus on long-term trends rather than short-term volatility.`
    }

    if (lowerMessage.includes('invest') || lowerMessage.includes('buy') || lowerMessage.includes('stock')) {
      return `When considering investments, follow these principles:

1. **Start with your goals**: Define what you're investing for (retirement, house, etc.)
2. **Assess your risk tolerance**: How much volatility can you handle?
3. **Consider index funds**: Low-cost, diversified options for beginners
4. **Dollar-cost averaging**: Invest regularly regardless of market conditions
5. **Stay informed**: Research companies and read financial statements

Popular investment vehicles:
- Index funds (S&P 500, Total Market)
- ETFs (Exchange-Traded Funds)
- Individual stocks (higher risk, requires research)
- Bonds (lower risk, steady income)

Always invest money you won't need for at least 5 years, and never invest more than you can afford to lose.`
    }

    // Default response
    return `Thank you for your question about financial matters. As your AI financial advisor, I'm here to help with investment strategies, risk management, portfolio optimization, and market analysis.

For the most accurate and personalized advice, I'd need more specific information about your financial situation, goals, and risk tolerance. 

Some areas I can help with:
- Portfolio diversification strategies
- Risk assessment and management
- Market trend analysis
- Investment education and principles
- Asset allocation guidance

Could you please provide more details about what specific aspect of finance or investing you'd like to explore?

**Disclaimer**: This is educational information only. All investments carry risk, and you should consider consulting with a qualified financial advisor for personalized advice.`
  }
}