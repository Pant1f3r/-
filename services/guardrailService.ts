
import { GuardrailResult, BLOCKED_KEYWORDS } from './types';

// This special category is the "apparition finder" for the user's SSPI concept.
// It now requires both a specific SEQUENCE of keywords AND a numerical pattern to be triggered.
const PARANORMAL_ACTIVITY_CONFIG = {
  category: 'Paranormal Digital Activity',
  requiredKeywordsInSequence: ['sub-semantic', 'pythagorean', 'ghostly imprint', 'apparition'],
};

// New non-blocking category to detect humor.
const HUMOR_KEYWORDS = {
  'Humane Humor Subroutine': [
    'tell me a joke', 'make me laugh', 'tell me something funny', 'knock knock',
    'a pun about', 'got any good jokes', 'what do you call', 'funny story'
  ],
};


/**
 * Escapes special characters in a string for use in a regular expression.
 */
const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Checks if an array of numbers contains a Pythagorean triple.
 * @param nums An array of numbers.
 * @returns True if a triple is found, otherwise false.
 */
const hasPythagoreanTriple = (nums: number[]): boolean => {
  if (nums.length < 3) {
    return false;
  }
  // Create a set of the squares for efficient lookup
  const squares = new Set(nums.map(n => n * n));

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      const aSq = nums[i] * nums[i];
      const bSq = nums[j] * nums[j];
      const cSq = aSq + bSq;
      if (squares.has(cSq)) {
        // We found a triple!
        return true;
      }
    }
  }
  return false;
};

/**
 * Checks if a set of keywords appear in a specific sequence within a prompt.
 * @param prompt The string to search within.
 * @param keywords The array of keywords that must appear in order.
 * @returns True if all keywords are found in sequence, otherwise false.
 */
const checkKeywordsInSequence = (prompt: string, keywords: string[]): boolean => {
    let lastIndex = -1;
    const lowerCasePrompt = prompt.toLowerCase();
    for (const keyword of keywords) {
        // Find the keyword starting from *after* the last one was found.
        const currentIndex = lowerCasePrompt.indexOf(keyword.toLowerCase(), lastIndex + 1);
        if (currentIndex === -1) {
            return false; // A keyword was not found in sequence.
        }
        lastIndex = currentIndex;
    }
    return true; // All keywords were found in the correct order.
};


// FIX: This function is essential for the guardrail demonstration and was correctly implemented.
/**
 * Analyzes a user's prompt against a set of predefined guardrail rules.
 * @param prompt The user-provided prompt string.
 * @returns A `GuardrailResult` object detailing if the prompt is allowed,
 *          if it's humorous, and which violation categories were matched.
 */
export const checkPrompt = (prompt: string): GuardrailResult => {
    const result: GuardrailResult = {
        isAllowed: true,
        isHumorous: false,
        matchedByCategory: {},
    };

    const lowerCasePrompt = prompt.toLowerCase();

    // 1. Check for blocked keywords
    for (const category in BLOCKED_KEYWORDS) {
        const keywords = BLOCKED_KEYWORDS[category];
        const matched: string[] = [];
        for (const keyword of keywords) {
            // A simple regex with word boundaries to avoid partial matches, consistent with GuardrailAnalysis.tsx
            // The placeholders like `[group]` are for demonstration and won't be matched by this simple logic.
            const regex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'i');
            if (regex.test(lowerCasePrompt)) {
                matched.push(keyword);
            }
        }
        if (matched.length > 0) {
            result.isAllowed = false;
            result.matchedByCategory[category] = matched;
        }
    }

    // 2. Check for Paranormal Activity
    const paranormalConfig = PARANORMAL_ACTIVITY_CONFIG;
    // Extract numbers from prompt for Pythagorean triple check
    const numbersInPrompt = prompt.match(/\d+/g)?.map(Number) || [];
    if (
        checkKeywordsInSequence(prompt, paranormalConfig.requiredKeywordsInSequence) &&
        hasPythagoreanTriple(numbersInPrompt)
    ) {
        result.isAllowed = false;
        result.matchedByCategory[paranormalConfig.category] = paranormalConfig.requiredKeywordsInSequence;
    }
    
    // 3. Check for humor, but only if not blocked.
    if (result.isAllowed) {
        for (const category in HUMOR_KEYWORDS) {
            const keywords = HUMOR_KEYWORDS[category];
            for (const keyword of keywords) {
                const regex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'i');
                if (regex.test(lowerCasePrompt)) {
                    result.isHumorous = true;
                    break;
                }
            }
            if (result.isHumorous) break;
        }
    }

    return result;
};
