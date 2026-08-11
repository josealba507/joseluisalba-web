---
title: "The model migrates. The reasoning doesn't."
description: "The same table that was right on-premises turns expensive in the cloud, and the model never changed."
pubDate: 2026-08-10
eyebrow: "Decision"
translationKey: "reasoning-does-not-migrate"
draft: false
---

In "Average balance isn't calculated. It's captured." the choice was to store the change, not the stillness. It was the right call. But it was right on-premises. That same table, built in the cloud, gets designed differently — not because the data model changed, but because the way a data warehouse gets billed changed.

On-premises you already paid for the infrastructure. That cost is fixed: you bought it once and there it sits, whether you use it or not. The limit is disk space — it fills up, and when it fills up you buy more. Processing doesn't fill up. It gets fought over: you compete for a window, you run at three in the morning, you reorder the queue. Between a limit that won't move and one that will, the one that won't move wins. Compressing wasn't elegant. It was forced.

In the cloud the cost is variable, and it's charged by usage at both ends of the process: building the table, and consuming what you built. Nothing is paid for in advance. And the two ends don't weigh the same, because the free allowance each service gives you — for reads or for processing — is different. Rebuilding the current balance every time someone queries it gets charged every time. Forty queries against the same table are forty rebuilds and forty charges for the same answer.

So you can't migrate the model as-is. The structure travels. The reasoning doesn't.

The deciding variable isn't on-premises or cloud. It's how many times that data gets queried. If that table gets queried once a month, you compress and rebuild: the recalculation is cheap because it almost never happens. If forty dashboards and processes query it every day, that same recalculation stops being a savings strategy and becomes an expense. The table didn't change. What changed is how often it gets queried.

And because the cost structures are different, the optimization strategies are too. On-premises the infrastructure is the limit and the work is getting the most out of it. In the cloud you optimize to spend less: there's no physical limit, there's a pricing structure — and the strategy comes out of reading that structure, for the provider you're actually on, because every provider and every service inside that provider prices differently. There's no optimizing for "the cloud" in general.

The decision, then: one daily run that rebuilds, groups, and leaves the day's net balance already resolved. That table answers the forty queries. Nobody recalculates again to ask the same thing.

What it cost was how current the data is. The answer is a snapshot of the last run, and that has to be said out loud. When someone asks at two in the afternoon for that afternoon's balance, I don't have it.

But here's what I learned: how current your data is isn't decided by your architecture or your budget. It's decided by the source. You can want two extractions a day and not be able to have them, because the core system only lets you copy after close. While the day is running there are locked balances, staging tables in flight, transactions that haven't landed yet. What you'd read at mid-afternoon isn't a reliable balance — it's a balance half-built. T-1 isn't a concession to cost there. It's the only thing that produces a number you can defend.

And that forces a conversation with the business that's more uncomfortable than any technical decision: explaining why you won't hand over a number that looks more current and isn't trustworthy.

The way out isn't to force the report. It's to recognize that each system has a job. If you want a client's balance right now, go into the tool that manages it — it's there, on screen, in real time. The data warehouse isn't for that. The data warehouse answers the historical, the comparable, the already-closed.

When someone asks you for today's number in yesterday's report, do you explain why it isn't there, or do you calculate it for them anyway?
