export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML string or plain text for mock purposes
  category: string;
  date: string;
  updatedAt?: string;
  readTime: string;
  author: {
    name: string;
    role: string;
  };
}

export const mockArticles: Article[] = [
  {
    id: "1",
    slug: "power-of-compounding-in-mutual-funds",
    title: "The Power of Compounding: Why Early Investing Matters",
    excerpt: "Discover how starting your SIP just 5 years earlier can drastically change your retirement corpus thanks to the magic of compounding.",
    content: `
      <p class="mb-4">Albert Einstein famously called compound interest the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.</p>
      <p class="mb-4">When you invest in mutual funds through a Systematic Investment Plan (SIP), you aren't just earning returns on your principal amount. You are earning returns on the returns you've already accumulated. Over long periods, this creates a snowball effect that can turn a modest monthly investment into a substantial corpus.</p>
      <h3 class="text-2xl font-bold mt-8 mb-4 text-navy">The Cost of Delay</h3>
      <p class="mb-4">Let's look at a hypothetical scenario. Investor A starts investing ₹10,000 per month at age 25. Investor B waits until age 35 to start investing the exact same amount. Assuming a 12% annual return, by the time they both reach 60, Investor A will have accumulated approximately ₹6.5 Crores, while Investor B will have roughly ₹1.9 Crores.</p>
      <p class="mb-4">That 10-year head start resulted in a corpus more than three times larger, despite Investor A only contributing ₹12 Lakhs more out of pocket.</p>
      <p class="mb-4">The takeaway is simple: The best time to start investing was yesterday. The second best time is today.</p>
    `,
    category: "Mutual Funds",
    date: "August 12, 2026",
    readTime: "4 min read",
    author: {
      name: "Rajesh Kumar",
      role: "Mutual Fund Distribution Professional"
    }
  },
  {
    id: "2",
    slug: "nri-taxation-guide-2026",
    title: "Complete Guide to NRI Taxation and Repatriation (2026)",
    excerpt: "Navigating the complexities of Indian taxation as a Non-Resident Indian. Everything you need to know about NRE, NRO, and DTAA.",
    content: `
      <p class="mb-4">Managing finances across borders can be daunting. For Non-Resident Indians (NRIs), understanding the tax implications of investments back home is crucial to avoiding double taxation and ensuring seamless repatriation of funds.</p>
      <h3 class="text-2xl font-bold mt-8 mb-4 text-navy">NRE vs NRO Accounts</h3>
      <p class="mb-4">The first step is distinguishing between Non-Resident External (NRE) and Non-Resident Ordinary (NRO) accounts.</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><strong>NRE Accounts:</strong> Used to park foreign earnings in India. The principal and interest are fully repatriable, and the interest earned is completely tax-free in India.</li>
        <li><strong>NRO Accounts:</strong> Used to manage income earned within India (e.g., rent, dividends, pension). Interest earned is subject to TDS (Tax Deducted at Source), typically at 30% plus surcharge/cess.</li>
      </ul>
      <h3 class="text-2xl font-bold mt-8 mb-4 text-navy">Leveraging DTAA</h3>
      <p class="mb-4">India has Double Taxation Avoidance Agreements (DTAA) with over 80 countries. If you are taxed on your NRO income in India, you can often claim a tax credit in your country of residence, preventing you from paying tax twice on the same income.</p>
    `,
    category: "NRI Services",
    date: "July 28, 2026",
    readTime: "6 min read",
    author: {
      name: "Sneha Patel",
      role: "Financial Writer"
    }
  },
  {
    id: "3",
    slug: "term-vs-whole-life-insurance",
    title: "Term vs. Whole Life Insurance: Making the Right Choice",
    excerpt: "Confused about which life insurance policy is right for you? We break down the pros, cons, and use cases for both.",
    content: `
      <p class="mb-4">Life insurance is the bedrock of any solid protection approach. However, with so many products on the market, choosing the right type of coverage can be overwhelming. The two primary categories are Term Life and Whole Life (or Endowment) insurance.</p>
      <h3 class="text-2xl font-bold mt-8 mb-4 text-navy">Term Life Insurance: Pure Protection</h3>
      <p class="mb-4">Term insurance is straightforward: you pay a premium for a specific period (the "term"), and if you pass away during that time, your beneficiaries receive a payout. If you outlive the policy, there is no payout.</p>
      <p class="mb-4"><strong>Pros:</strong> Highly affordable, allowing you to buy substantial coverage for a low premium.</p>
      <h3 class="text-2xl font-bold mt-8 mb-4 text-navy">Whole Life Insurance: Protection + Investment</h3>
      <p class="mb-4">Whole life policies provide coverage for your entire life, and they typically include a savings or investment component (cash value).</p>
      <p className="mb-4"><strong>Pros:</strong> Fixed payout eventually, forced savings component.</p>
      <p class="mb-4"><strong>Cons:</strong> Premiums are significantly higher than term insurance for the same amount of coverage.</p>
      <h3 class="text-2xl font-bold mt-8 mb-4 text-navy">The Wealthy Step Verdict</h3>
      <p class="mb-4">For most young professionals and families, we recommend "Buy Term and Invest the Rest." A robust term plan provides the necessary safety net, while investing the premium difference in a diversified mutual fund portfolio typically yields much higher long-term returns than a whole life policy.</p>
    `,
    category: "Insurance",
    date: "July 15, 2026",
    readTime: "5 min read",
    author: {
      name: "Amit Sharma",
      role: "Insurance Specialist"
    }
  }
];

export function getArticleBySlug(slug: string): Article | undefined {
  return mockArticles.find(article => article.slug === slug);
}
