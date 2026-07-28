---
id: microservices-boundary
title: Where to Draw Microservice Boundaries
excerpt: The art of service decomposition is knowing when to stop splitting.
slug: microservices-boundary
tags: Architecture, Microservices
order: 2
---

## Where to Draw Microservice Boundaries

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

Each has its own database, deployment pipeline, and team. Each can be rewritten independently.
