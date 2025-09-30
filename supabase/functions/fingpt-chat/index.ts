import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, conversationId, expertId } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get user from auth
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user profile for personalization
    const { data: profile } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get expert info if specified
    let expertInfo = null;
    if (expertId) {
      const { data: expert } = await supabaseClient
        .from('experts')
        .select('*')
        .eq('id', expertId)
        .single();
      expertInfo = expert;
    }

    // Get conversation history
    const { data: messages } = await supabaseClient
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    // Build system prompt based on user profile and expert
    let systemPrompt = `You are FinGPT, a professional financial advisor AI assistant specialized in investment analysis, market insights, and financial planning. You provide expert-level advice with deep financial knowledge.

Key capabilities:
- Advanced portfolio analysis and optimization
- Market trend analysis and predictions
- Risk assessment and management strategies
- Stock and business analysis
- Financial education and concept explanation
- Personalized investment recommendations

Guidelines:
- Always provide evidence-based financial advice
- Consider market conditions and economic factors
- Explain complex financial concepts clearly
- Include risk disclaimers when appropriate
- Suggest diversification strategies
- Stay updated with current market trends

IMPORTANT: All investment advice should include appropriate risk disclaimers.`;

    if (profile) {
      systemPrompt += `\n\nUser Profile:
- Risk Tolerance: ${profile.risk_tolerance || 'Not specified'}
- Investment Experience: ${profile.investment_experience || 'Not specified'}
- Monthly Income: $${profile.monthly_income || 'Not specified'}
- Profit Target: $${profile.profit_target || 'Not specified'}
- Loss Threshold: ${profile.loss_threshold || 'Not specified'}%
- Preferred Industries: ${profile.preferred_industries?.join(', ') || 'Not specified'}

Personalize your advice based on this profile.`;
    }

    if (expertInfo) {
      systemPrompt += `\n\nYou are embodying the expertise of ${expertInfo.name}: ${expertInfo.bio}
Specializations: ${expertInfo.specialization?.join(', ')}
Provide advice in the style and approach of this expert.`;
    }

    // Prepare messages for AI
    const conversationMessages = [
      { role: 'system', content: systemPrompt },
      ...(messages || []).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Call Lovable AI Gateway
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash', // Using free Gemini model
        messages: conversationMessages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage limit reached. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      throw new Error('AI service unavailable');
    }

    const aiData = await aiResponse.json();
    const assistantMessage = aiData.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

    // Save user message
    await supabaseClient
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content: message,
      });

    // Save assistant message
    await supabaseClient
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: assistantMessage,
      });

    // Update conversation timestamp
    await supabaseClient
      .from('chat_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return new Response(
      JSON.stringify({ response: assistantMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('FinGPT Chat error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});