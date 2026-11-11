export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML string or plain text for mock purposes
  category: string;
  date: string;
  image: string;
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
      <p class="mb-4">When you invest in mutual funds through a Systematic Investment method (SIP), you aren't just earning returns on your principal amount. You are earning returns on the returns you've already accumulated. Over long periods, this creates a snowball effect that can turn a modest monthly investment into a substantial corpus.</p>
      <h3 class="text-2xl font-bold mt-8 mb-4 text-navy">The Cost of Delay</h3>
      <p class="mb-4">Let's look at a hypothetical scenario. Investor A starts investing ₹10,000 per month at age 25. Investor B waits until age 35 to start investing the exact same amount. Assuming a 12% annual return, by the time they both reach 60, Investor A will have accumulated approximately ₹6.5 Crores, while Investor B will have roughly ₹1.9 Crores.</p>
      <p class="mb-4">That 10-year head start resulted in a corpus more than three times larger, despite Investor A only contributing ₹12 Lakhs more out of pocket.</p>
      <p class="mb-4">The takeaway is simple: The best time to start investing was yesterday. The second best time is today.</p>
    `,
    category: "Mutual Funds",
    date: "August 12, 2026",
    image: "/images/blogs/sip-vs-lump-sum.png",
    readTime: "4 min read",
    author: {
      name: "Wealthy Step Editorial Desk",
      role: "Investor Education"
    }
  },
  {
    id: "2",
    slug: "nri-taxation-overview-2026",
    title: "Overview of NRI Taxation and Repatriation (2026)",
    excerpt: "Navigating the fundamentals of Indian taxation as a Non-Resident Indian. Key points regarding NRE, NRO, and DTAA.",
    content: `
      <p class="mb-4">Managing finances across borders requires clarity. For Non-Resident Indians (NRIs), understanding the tax implications of investments in India is helpful for avoiding double taxation and understanding repatriation procedures.</p>
      <h3 class="text-2xl font-bold mt-8 mb-4 text-navy">NRE vs NRO Accounts</h3>
      <p class="mb-4">The first step is distinguishing between Non-Resident External (NRE) and Non-Resident Ordinary (NRO) accounts.</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><strong>NRE Accounts:</strong> Used to park foreign earnings in India. The principal and interest are repatriable, and the interest earned is tax-exempt in India under current tax provisions.</li>
        <li><strong>NRO Accounts:</strong> Used to manage income earned within India (e.g., rent, dividends, pension). Interest earned is subject to TDS (Tax Deducted at Source), typically at applicable rates plus surcharge/cess.</li>
      </ul>
      <h3 class="text-2xl font-bold mt-8 mb-4 text-navy">Leveraging DTAA</h3>
      <p class="mb-4">India has Double Taxation Avoidance Agreements (DTAA) with multiple jurisdictions. If tax is deducted on your NRO income in India, investors can often evaluate tax relief or credit provisions in their country of tax residence.</p>
    `,
    category: "NRI Services",
    date: "July 28, 2026",
    image: "/images/blogs/understanding-risk.png",
    readTime: "6 min read",
    author: {
      name: "Wealthy Step Editorial Desk",
      role: "Investor Education"
    }
  },
  {
    id: "3",
    slug: "term-vs-whole-life-insurance",
    title: "Term vs. Whole Life Insurance: Key Differences Explained",
    excerpt: "Evaluating life insurance structures: A side-by-side comparison of pure term cover versus traditional endowment policies.",
    content: `
      <p class="mb-4">Life insurance is a foundational risk management instrument. The two primary categories in the market are Term Life and Whole Life (or Endowment) policies.</p>
      <h3 class="text-2xl font-bold mt-8 mb-4 text-navy">Term Life Insurance: Pure Risk Protection</h3>
      <p class="mb-4">Term insurance provides financial compensation to designated beneficiaries if an untimely demise occurs during the policy tenure. If the policyholder survives the term, standard policies offer no maturity payout.</p>
      <p class="mb-4"><strong>Key Characteristic:</strong> High sum assured at relatively lower premium outlays.</p>
      <h3 class="text-2xl font-bold mt-8 mb-4 text-navy">Whole Life Insurance: Combined Features</h3>
      <p class="mb-4">Whole life or endowment policies combine mortality cover with an internal investment or savings mechanism.</p>
      <p class="mb-4"><strong>Key Characteristic:</strong> Combines protection with a savings component, but typically carries significantly higher premium commitments for equivalent coverage levels.</p>
      <h3 class="text-2xl font-bold mt-8 mb-4 text-navy">Educational Perspective</h3>
      <p class="mb-4">In financial literature, evaluating term insurance alongside disciplined mutual fund investing is a widely discussed framework. Pure term insurance addresses mortality risk efficiently, while allocating surplus funds to mutual funds allows market-linked capital growth potential, subject to individual risk profiles.</p>
    `,
    category: "Insurance",
    date: "July 15, 2026",
    image: "/images/blogs/goal-investing.png",
    readTime: "5 min read",
    author: {
      name: "Wealthy Step Editorial Desk",
      role: "Investor Education"
    }
  }
];

export function getArticleBySlug(slug: string): Article | undefined {
  return mockArticles.find(article => article.slug === slug);
}
