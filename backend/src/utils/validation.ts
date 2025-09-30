import { z } from 'zod'

// Chat request validation schema
export const chatRequestSchema = z.object({
  message: z.string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message must be less than 1000 characters')
    .trim()
})

export type ChatRequest = z.infer<typeof chatRequestSchema>

export function validateChatRequest(data: unknown) {
  return chatRequestSchema.safeParse(data)
}

// Portfolio request validation schema
export const portfolioRequestSchema = z.object({
  symbols: z.array(z.string()).optional(),
  timeframe: z.enum(['1D', '1W', '1M', '3M', '6M', '1Y']).optional(),
  includeMetrics: z.boolean().optional()
})

export type PortfolioRequest = z.infer<typeof portfolioRequestSchema>

export function validatePortfolioRequest(data: unknown) {
  return portfolioRequestSchema.safeParse(data)
}

// Market data request validation
export const marketDataRequestSchema = z.object({
  symbol: z.string()
    .min(1, 'Symbol is required')
    .max(10, 'Symbol must be less than 10 characters')
    .regex(/^[A-Z]+$/, 'Symbol must contain only uppercase letters')
})

export type MarketDataRequest = z.infer<typeof marketDataRequestSchema>

export function validateMarketDataRequest(data: unknown) {
  return marketDataRequestSchema.safeParse(data)
}