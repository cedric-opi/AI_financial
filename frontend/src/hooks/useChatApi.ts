import { useState } from 'react'
import { API_BASE_URL } from '@/lib/utils'

export function useChatApi() {
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (message: string): Promise<string> => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error('Chat API error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { sendMessage, isLoading }
}