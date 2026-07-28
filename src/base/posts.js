export const posts = [
  {
    id: 'legacy-ai-integration',
    title: 'AI Integration Without Rewriting Legacy Systems',
    excerpt: 'How we added LLM capabilities to a 15-year-old ERP without downtime or data migration.',
    content: `## AI Integration Without Rewriting Legacy Systems

The challenge was clear: a manufacturing client running a 15-year-old SAP-based ERP needed AI-powered document processing, but rewriting the entire system was out of scope. Budget constraints and zero tolerance for operational disruption meant we needed a surgical approach.

### The Solution: Wrapper Pattern

Instead of touching the legacy code, we built a lightweight Node.js service that:

1. Intercepts document uploads via API gateway
2. Processes through LLM pipelines (extract, classify, enrich)
3. Returns structured data back to SAP via existing interfaces

The legacy system never knew AI was involved. From its perspective, it was just receiving richer data than before.

### Key Technical Decisions

- Used FastAPI for the processing layer (Python ecosystem for AI/ML)
- Redis for caching frequent document types
- RabbitMQ for async processing to avoid timeouts
- SAP integration via IDoc and BAPI - no database changes required

### Result

- 42% reduction in manual data entry time
- Zero downtime during implementation
- Legacy system retirement pushed from "urgent" to "when convenient"

This pattern works for any legacy system with stable APIs or file-based interfaces.`,
    slug: 'legacy-ai-integration',
    tags: ['AI', 'Legacy', 'Integration']
  },
  {
    id: 'microservices-boundary',
    title: 'Where to Draw Microservice Boundaries',
    excerpt: 'The art of service decomposition is knowing when to stop splitting.',
    content: `## Where to Draw Microservice Boundaries

After consulting on 12 different microservice architectures over 5 years, I have seen the pattern: teams that split too fine-grained create operational nightmares, while teams that keep monoliths miss the agility benefits entirely.

### The Goldilocks Rule

A service boundary should be defined by:

1. Rate of change - If two capabilities change for different business reasons, they likely belong in different services
2. Data consistency requirements - If multiple operations must be atomic, they likely share a boundary
3. Team cognitive load - If a single developer cannot understand the entire service in a day, it is too big

### Practical Heuristics

Too Small:
- UserProfileService, UserSettingsService, UserPreferencesService - these change together, deploy together, and fail together

Just Right:
- UserService (handles all user data) and BillingService (handles all financial operations)

Too Big:
- EverythingService that handles users, products, orders, payments - back to monolith territory

### Real-World Example

For an e-commerce platform, we settled on:
- CatalogService (product data, search)
- OrderService (order lifecycle, inventory)
- PaymentService (payment processing, refunds)
- UserService (authentication, profiles)
- NotificationService (emails, push, SMS)

Each has its own database, deployment pipeline, and team. Each can be rewritten independently.`,
    slug: 'microservices-boundary',
    tags: ['Architecture', 'Microservices']
  },
  {
    id: 'react-performance-2024',
    title: 'React Performance in 2024',
    excerpt: 'Modern React is fast by default, but you still need to understand the rules.',
    content: `## React Performance in 2024

The React team has done incredible work. Server Components, automatic batching, transitions - the framework is optimizing itself. But misunderstanding the mental model still causes problems.

### What You Need to Know

Re-renders are not the enemy.

React is designed to re-render. The cost of reconciliation is often less than the cost of premature optimization. Measure before you memo.

**useMemo vs useCallback**

- useMemo: Memoize the value (expensive calculation result)
- useCallback: Memoize the function (for stable props to child components)

90% of useMemo calls I see are unnecessary. Profile first.

**The Real Bottlenecks in 2024**

In modern apps, the slow parts are:
- Large bundle sizes (code splitting, lazy loading)
- Unoptimized images (use next/image or similar)
- Blocking network requests (use Suspense, streaming)
- Layout thrashing (CSS containment, proper sizing)

React rendering is rarely the issue.

### Quick Wins

Bad approach: recomputes on every render
const sorted = expensiveSort(data);

Good approach: only when data changes
const sorted = useMemo(() => expensiveSort(data), [data]);

Better approach: often not needed at all
const [sortConfig, setSortConfig] = useState(null);
const sorted = sortConfig ? [...data].sort(...) : data;

### Recommendation

Spend your optimization time on:
1. Bundle analysis (webpack-bundle-analyzer)
2. Image optimization
3. Data fetching patterns
4. CSS performance (avoid layout shifts)

Let React handle the re-renders.`,
    slug: 'react-performance-2024',
    tags: ['React', 'Performance', 'Frontend']
  },
  {
    id: 'database-migration-zero-downtime',
    title: 'Zero-Downtime Database Migrations',
    excerpt: 'Moving 2TB of production data without users noticing.',
    content: `## Zero-Downtime Database Migrations

We had a PostgreSQL database serving a SaaS platform with:
- 2TB of data
- 40,000 active users
- 99.95% uptime SLA
- A requirement to add a NOT NULL column with a non-trivial default

### The Problem

Adding a NOT NULL column to a table with 150 million rows typically requires locking the table, which causes downtime.

### Solution: The 4-Step Dance

Step 1: Add nullable column
ALTER TABLE orders ADD COLUMN customer_segment VARCHAR(50);
No lock, instant. But it is nullable.

Step 2: Deploy application code that writes to new column
All new/updated records get the value. Existing records remain NULL.

Step 3: Backfill in batches
UPDATE orders SET customer_segment = calculate_segment(id) WHERE customer_segment IS NULL LIMIT 1000;
Run during low-traffic periods. Can take days.

Step 4: Add NOT NULL constraint
ALTER TABLE orders ALTER COLUMN customer_segment SET NOT NULL;
Once all rows have values, this is instant.

### Advanced: For Large Tables

For tables too large to backfill:
1. Create new table with desired schema
2. Set up triggers to sync writes to both tables
3. Backfill incrementally using a cursor
4. Swap tables via atomic rename
5. Drop old table

We used pg_repack for the heavy lifting on our largest tables.

### Lessons Learned

- Always test migrations on production-scale data
- Use pt-table-checksum (MySQL) or custom scripts to verify data consistency
- Monitor replication lag during long-running migrations
- Have a rollback plan`,
    slug: 'database-migration-zero-downtime',
    tags: ['Database', 'DevOps', 'Migration']
  },
  {
    id: 'saas-pricing-psychology',
    title: 'SaaS Pricing Psychology',
    excerpt: 'Why your pricing page is leaking revenue and how to fix it.',
    content: `## SaaS Pricing Psychology

After auditing 50+ SaaS pricing pages and A/B testing variations, patterns emerge. The difference between good and great pricing is not the numbers - it is the framing.

### The 5 Most Common Mistakes

1. Leading with price, not value
Bad: user sees price first
99 USD/month

Good: user sees value first
Automate your entire invoice processing pipeline
99 USD/month

2. Too many options - The paradox of choice: more options equals lower conversion. Ideal: 3 tiers (Good, Better, Best).

3. Using monthly pricing only - Annual pre-pay increases perceived value and improves cash flow. Display both:
- 99 USD/month
- 990 USD/year (save 118 USD)

4. Hiding the enterprise option - Contact us for enterprise sounds like a sales call. Better: Enterprise - Custom pricing as a clear fourth option.

5. Feature lists without context - Do not just list features. Explain what they enable.

### High-Converting Structure

1. Hero: Clear value proposition + CTA
2. Tiers: 3-4 options, left to right
3. Feature comparison: Checkmark matrix
4. FAQ: Address objections
5. Testimonials: Social proof
6. CTA: Final push

### Pricing Page That Works

We implemented this structure for a document management SaaS and saw:
- 34% increase in free trial starts
- 22% increase in paid conversions
- 45% reduction in support questions about pricing

The best pricing pages do not feel like pricing pages - they feel like the solution to a problem.`,
    slug: 'saas-pricing-psychology',
    tags: ['SaaS', 'Business', 'Pricing']
  },
  {
    id: 'security-audit-checklist',
    title: 'Security Audit Checklist for Startups',
    excerpt: 'The minimum viable security posture for a seed-stage company.',
    content: `## Security Audit Checklist for Startups

You do not need enterprise-grade security on day one, but you do need the basics. This checklist covers what a seed-stage startup should have in place before first customer data touches your systems.

### Access Control

- MFA on all accounts (GitHub, AWS, database, etc.)
- Principle of least privilege - no root/admin access by default
- Password manager required for all team members
- SSH keys instead of passwords where possible
- Device management - know what devices have access

### Data Protection

- Encryption at rest for all customer data
- Encryption in transit (TLS 1.2+) everywhere
- Secrets management - never in code, never in Git
- Database backups with tested restore procedure
- Data retention policy - know what you keep and why

### Application Security

- Dependency scanning in CI/CD (Snyk, Dependabot)
- Container scanning if using Docker
- Input validation on all API endpoints
- Rate limiting on auth endpoints
- CORS configured appropriately
- Security headers (CSP, HSTS, etc.)

### Monitoring and Response

- Centralized logging (can be simple - even a shared Slack channel)
- Error tracking (Sentry, Rollbar, etc.)
- Incident response plan - who to call at 2am
- Security contact published (security@company.com)
- Breach notification procedure (legal requirement in most jurisdictions)

### Compliance Basics

- Privacy policy published and accurate
- Terms of service with clear liability limits
- GDPR compliance if serving EU users
- Data processing agreement template ready

### Quick Wins (30 minutes each)

1. Enable MFA on AWS root account
2. Run dependabot on your main repo
3. Add CSP header
4. Create a security@ email address
5. Document your incident response contacts

### When to Get Help

Hire a security consultant when:
- You handle sensitive data (health, financial, PII)
- You are about to raise Series A
- You have had a security incident
- Your team lacks security expertise

Security is not a feature - it is a foundational practice.`,
    slug: 'security-audit-checklist',
    tags: ['Security', 'Startup', 'DevOps']
  }
];

export function getPostBySlug(slug) {
  return posts.find(post => post.slug === slug);
}

export function getPosts() {
  return posts;
}
