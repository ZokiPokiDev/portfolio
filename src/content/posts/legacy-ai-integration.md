---
id: legacy-ai-integration
title: AI Integration Without Rewriting Legacy Systems
excerpt: How we added LLM capabilities to a 15-year-old ERP without downtime or data migration.
slug: legacy-ai-integration
tags: AI, Legacy, Integration
order: 1
---

## AI Integration Without Rewriting Legacy Systems

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

This pattern works for any legacy system with stable APIs or file-based interfaces.
