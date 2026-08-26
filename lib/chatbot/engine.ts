import { ChatbotIntent } from './types';
import { getAllKeywords } from './intents';

interface IntentScore {
  intent: ChatbotIntent;
  score: number;
}

export function detectIntent(message: string): { intent: ChatbotIntent, confidence: 'HIGH' | 'MEDIUM' | 'LOW' } {
  const normalizedMessage = message.toLowerCase().trim();
  
  if (!normalizedMessage) {
    return { intent: 'UNKNOWN', confidence: 'LOW' };
  }

  // Exact phrase matching - Highest priority
  const allKeywords = getAllKeywords();
  for (const { intent, keyword } of allKeywords) {
    // If exact match
    if (normalizedMessage === keyword) {
      return { intent, confidence: 'HIGH' };
    }
  }

  // Token based matching
  const messageTokens = normalizedMessage.split(/[^a-z0-9]+/);
  
  const scores: Record<ChatbotIntent, number> = {} as Record<ChatbotIntent, number>;
  
  for (const { intent, keyword } of allKeywords) {
    const keywordTokens = keyword.split(/[^a-z0-9]+/);
    
    // Check if the message contains the exact full keyword phrase
    if (normalizedMessage.includes(keyword)) {
      scores[intent] = (scores[intent] || 0) + 10;
    } else {
      // Check individual tokens
      let tokenMatches = 0;
      for (const token of keywordTokens) {
        if (messageTokens.includes(token)) {
          tokenMatches++;
        }
      }
      
      // If we matched all tokens of a multi-word keyword (but not in exact order)
      if (tokenMatches === keywordTokens.length && keywordTokens.length > 1) {
        scores[intent] = (scores[intent] || 0) + 5;
      }
      // If we matched some tokens
      else if (tokenMatches > 0) {
        scores[intent] = (scores[intent] || 0) + (tokenMatches / keywordTokens.length);
      }
    }
  }

  // Find the highest score
  let bestIntent: ChatbotIntent = 'UNKNOWN';
  let bestScore = 0;

  for (const intent in scores) {
    const score = scores[intent as ChatbotIntent];
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent as ChatbotIntent;
    }
  }

  if (bestScore >= 10) {
    return { intent: bestIntent, confidence: 'HIGH' };
  } else if (bestScore >= 2) {
    return { intent: bestIntent, confidence: 'MEDIUM' };
  } else {
    return { intent: 'UNKNOWN', confidence: 'LOW' };
  }
}
