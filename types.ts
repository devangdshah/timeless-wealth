
export enum InvestorCategory {
  Value = "Legendary Value Investors",
  Growth = "Growth & Tech-Focused Investors",
  Quant = "Quant & Systematic Pioneers",
  HedgeFund = "Hedge Fund Titans",
  Portfolio = "Portfolio Theory & Indexing",
  PE_VC = "Private Equity & Venture Capital",
  WealthStudies = "Wealth Creation Studies (100x)",
  Memos = "Memos & Strategic Research"
}

export interface WisdomData {
  investorName: string;
  category: InvestorCategory | string;
  quote: string;
  wisdom: string; // The "simple investment wisdom" explanation
  sourceBook?: string; // Optional book title
}

export interface InvestorMap {
  display: string;
  query: string;
}

export interface Category {
  title: string;
  items: InvestorMap[];
}

export const CATEGORIES: Category[] = [
  { 
    title: "Legendary Value", 
    items: [
      { display: "Buffett", query: "Warren Buffett" },
      { display: "Graham", query: "Benjamin Graham" },
      { display: "Munger", query: "Charlie Munger" },
      { display: "Fisher", query: "Philip Fisher" }
    ]
  },
  { 
    title: "Growth & Tech", 
    items: [
      { display: "Lynch", query: "Peter Lynch" },
      { display: "Price", query: "T. Rowe Price" },
      { display: "Wood", query: "Cathie Wood" }
    ]
  },
  { 
    title: "Quant Titans", 
    items: [
      { display: "Simons", query: "Jim Simons" },
      { display: "Asness", query: "Cliff Asness" },
      { display: "Thorp", query: "Ed Thorp" }
    ]
  },
  { 
    title: "Hedge Funds", 
    items: [
      { display: "Soros", query: "George Soros" },
      { display: "Dalio", query: "Ray Dalio" },
      { display: "Druckenmiller", query: "Stanley Druckenmiller" },
      { display: "Jones", query: "Paul Tudor Jones" }
    ]
  },
  { 
    title: "Portfolio Theory", 
    items: [
      { display: "Bogle", query: "John Bogle" },
      { display: "Markowitz", query: "Harry Markowitz" },
      { display: "Sharpe", query: "William Sharpe" }
    ]
  },
  { 
    title: "PE & VC", 
    items: [
      { display: "Schwarzman", query: "Stephen Schwarzman" },
      { display: "Kravis", query: "Henry Kravis" },
      { display: "Thiel", query: "Peter Thiel" },
      { display: "Valentine", query: "Don Valentine (Sequoia Capital)" }
    ]
  },
  { 
    title: "100x Studies", 
    items: [
      { display: "Raamdeo Agrawal", query: "Raamdeo Agrawal" },
      { display: "Motilal Oswal", query: "Motilal Oswal Wealth Creation Studies" }
    ]
  },
  { 
    title: "Memos & Research", 
    items: [
      { display: "Howard Marks", query: "Howard Marks (Oaktree Memos)" },
      { display: "M. Mauboussin", query: "Michael Mauboussin" },
      { display: "Nick Sleep", query: "Nick Sleep (Nomad Partnership Letters)" }
    ]
  },
];

// Derive the flat roster list for the AI service to use
export const INVESTOR_ROSTER = CATEGORIES.flatMap(cat => cat.items.map(item => item.query));
