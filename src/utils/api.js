// Real AI API Integration - Claude (Anthropic) / OpenAI

// ========== CLAUDE API (Anthropic) ==========
export async function callClaudeAPI(systemPrompt, userMessage, apiKey) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }]
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error("Claude API Error:", data.error);
      return getFallbackResponse(userMessage);
    }
    
    return data.content?.[0]?.text || "No response from AI";
    
  } catch (error) {
    console.error("Claude API Error:", error);
    return getFallbackResponse(userMessage);
  }
}

// ========== OPENAI API ==========
export async function callOpenAIAPI(systemPrompt, userMessage, apiKey) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        max_tokens: 1000,
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ]
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error("OpenAI API Error:", data.error);
      return getFallbackResponse(userMessage);
    }
    
    return data.choices?.[0]?.message?.content || "No response from AI";
    
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return getFallbackResponse(userMessage);
  }
}

// ========== FALLBACK RESPONSE (If API fails) ==========
function getFallbackResponse(userMessage) {
  const lower = userMessage.toLowerCase();
  
  if (lower.includes("sales") || lower.includes("lead") || lower.includes("deal")) {
    return `⚡ **Sales Automation Strategy**\n\nI understand you're looking for sales automation. Here's what NexusAI can do for you:\n\n**Problems Identified:**\n• Slow lead response time\n• Inconsistent follow-ups\n• Missed sales opportunities\n\n**Solutions:**\n• AI Sales Agent qualifies leads in <90 seconds\n• Automated 12-touch follow-up sequences\n• Smart meeting booking system\n\n**Expected ROI:** 3.4x revenue increase within 90 days\n\nWould you like me to create a custom sales automation plan for your business?`;
  }
  
  if (lower.includes("support") || lower.includes("ticket") || lower.includes("customer")) {
    return `🎧 **Support Automation Strategy**\n\nI see you need help with customer support automation. Here's my analysis:\n\n**Current Challenges:**\n• High ticket volume\n• Slow response times\n• Agent burnout\n\n**NexusAI Solutions:**\n• 24/7 AI support across all channels\n• 87% auto-resolution rate\n• Smart ticket routing\n\n**Benefits:**\n• Reduce support costs by 70%\n• Improve CSAT by 34%\n• First response in under 12 seconds\n\nShall I prepare a detailed implementation plan?`;
  }
  
  return `🤖 **NexusAI Analysis**\n\nThank you for your message. Our AI systems are processing your request.\n\n**Next Steps:**\n1. Our AI agents are analyzing your business context\n2. A detailed response will be generated shortly\n3. You can also try one of the suggested prompts above\n\n**Need immediate assistance?** Type "URGENT" to prioritize your request.\n\nHow else can I help you today?`;
}

// ========== GET API KEY FROM LOCALSTORAGE ==========
export function getAPIKey() {
  return localStorage.getItem("nexusai_api_key");
}

export function setAPIKey(key) {
  localStorage.setItem("nexusai_api_key", key);
}

// ========== CHECK IF API IS CONFIGURED ==========
export function isAPIConfigured() {
  return !!localStorage.getItem("nexusai_api_key");
}