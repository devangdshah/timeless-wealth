
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WisdomData, INVESTOR_ROSTER } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const wisdomSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    investorName: {
      type: Type.STRING,
      description: "The name of the investor or author selected.",
    },
    category: {
      type: Type.STRING,
      description: "The category of the investor (e.g., 'Legendary Value Investor', 'Hedge Fund Titan', 'Wealth Creation Studies').",
    },
    quote: {
      type: Type.STRING,
      description: "A famous or insightful quote from this person or their book. For Motilal Oswal, use key findings like 'Value Migration' or 'SQGLP'.",
    },
    wisdom: {
      type: Type.STRING,
      description: "A simplified explanation of the quote and actionable investment advice for a normal person. Keep it under 3 sentences.",
    },
    sourceBook: {
      type: Type.STRING,
      description: "The name of the book or study (e.g., '25th Wealth Creation Study', 'Berkshire Shareholder Letter 1989'). If none, leave empty.",
      nullable: true,
    },
  },
  required: ["investorName", "category", "quote", "wisdom"],
};

export const fetchRandomWisdom = async (specificInvestor?: string, excludeQuotes: string[] = []): Promise<WisdomData> => {
  try {
    const model = "gemini-2.5-flash";
    
    // Common instructions for special complex topics
    // Now expanded with specific source material instructions to ensure depth (20+ quotes)
    const specialInstructions = `
      DEEP DIVE INSTRUCTIONS (Ensure variety and depth):
      
      SPECIAL INSTRUCTION FOR "Warren Buffett":
      Do NOT rely solely on "Rule No 1: Never lose money." 
      Source material: Berkshire Hathaway Shareholder Letters (1977-2024), Partnership Letters (1957-1969), and TV interviews.
      Look for insights on: Inflation, Moats, Management Integrity, Accounting Trickery, Float, and Temperament.

      SPECIAL INSTRUCTION FOR "Charlie Munger":
      In addition to general wisdom, frequently draw from:
      1. "Poor Charlie's Almanack" (Talks on Lollapalooza Effect, Inversion).
      2. "The Psychology of Human Misjudgment" lecture (Harvard, 1995).
      3. Daily Journal Annual Meeting transcripts.
      Focus on: Cognitive biases, Incentive-Caused Bias, Multidisciplinary thinking, and "The Art of Stock Picking".

      SPECIAL INSTRUCTION FOR "Peter Lynch":
      Source material: "One Up on Wall Street", "Beating the Street", and his columns in Worth magazine.
      Focus on: "Buy what you know", PEG ratio, Ten-baggers, Diworsification, and the difference between stock price and company value.

      SPECIAL INSTRUCTION FOR "Benjamin Graham":
      Source material: "The Intelligent Investor", "Security Analysis".
      Focus on: Margin of Safety, Mr. Market, Net-Nets, and Defensive vs Enterprising investors.

      SPECIAL INSTRUCTION FOR "Raamdeo Agrawal" or "Motilal Oswal":
      Focus specifically on the "Motilal Oswal Wealth Creation Studies" (1st to 25th studies). 
      Highlight concepts like:
      1. 100x Bagger (stocks that grow 100-fold).
      2. The SQGLP Framework (Size, Quality, Growth, Longevity, Price).
      3. Value Migration (profit pools moving from one sector to another).

      SPECIAL INSTRUCTION FOR "Howard Marks":
      Focus on his "Oaktree Memos" or the book "The Most Important Thing". 
      Key concepts: Second-Level Thinking, Market Cycles, Risk vs Volatility, Patient Opportunism.

      SPECIAL INSTRUCTION FOR "Michael Mauboussin":
      Focus on "Consilient Observer", "The Success Equation", or "Expectations Investing".
      Key concepts: Base Rates, Skill vs Luck, The Paradox of Skill, Return on Invested Capital (ROIC).

      SPECIAL INSTRUCTION FOR "Nick Sleep":
      Focus on the "Nomad Partnership Letters".
      Key concepts: Scale Economics Shared (cost sharing for long term moats), Destination Analysis, Information Decay (investing in things with long shelf life).
    `;

    // Logic to handle exclusions to prevent repetition
    let exclusionInstruction = "";
    if (excludeQuotes.length > 0) {
      // We take the last 25 to prevent repetition loops for a long time
      const recentExclusions = excludeQuotes.slice(-25);
      exclusionInstruction = `
        CRITICAL: Do NOT select the following quotes or very similar variations of them.
        The user has already seen these. Dig deeper into the author's work for something new.
        ${recentExclusions.map(q => `- "${q.substring(0, 60)}..."`).join("\n")}
      `;
    }

    let prompt = "";
    if (specificInvestor) {
      prompt = `
        Focus EXCLUSIVELY on the investor, book, or topic: "${specificInvestor}".
        Treat this as a query against the entire corpus of their public statements, books, and letters.
        Find a insightful quote or specific investment philosophy.
        
        ${specialInstructions}
        ${exclusionInstruction}

        Provide a piece of timeless investment wisdom based on this person's philosophy.
        The 'wisdom' field should be simple, clear advice for a beginner investor based on the quote.
      `;
    } else {
      prompt = `
        Select ONE random investor from the following list:
        ${INVESTOR_ROSTER.join(", ")}.
        
        Alternatively, you may select a quote from a legendary investment book written by one of these people (e.g., 'The Intelligent Investor', 'Common Stocks and Uncommon Profits', 'Beat the Market').

        ${specialInstructions}
        ${exclusionInstruction}

        Provide a piece of timeless investment wisdom based on this person's philosophy.
        The 'wisdom' field should be simple, clear advice for a beginner investor based on the quote.
        Ensure variety. Do not always pick Warren Buffett.
      `;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: wisdomSchema,
        temperature: 1.1, // Slightly higher temperature for better variety
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No text returned from Gemini");
    }

    return JSON.parse(text) as WisdomData;

  } catch (error) {
    console.error("Error fetching wisdom:", error);
    // Fallback in case of API failure to prevent app crash
    return {
      investorName: "John Bogle",
      category: "Portfolio Theory & Indexing",
      quote: "Don't look for the needle in the haystack. Just buy the haystack!",
      wisdom: "Instead of trying to pick individual winning stocks, invest in the entire market through low-cost index funds to guarantee your fair share of market returns.",
      sourceBook: "The Little Book of Common Sense Investing"
    };
  }
};
