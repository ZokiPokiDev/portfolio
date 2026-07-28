---
id: database-migration-zero-downtime
title: Zero-Downtime Database Migrations
excerpt: Moving 2TB of production data without users noticing.
slug: database-migration-zero-downtime
tags: Database, DevOps, Migration
order: 4
---

## Zero-Downtime Database Migrations

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
- Have a rollback plan
