---
title: "Average balance isn't calculated. It's captured."
description: "Why daily average balance in banking can't be rebuilt after the fact — the real decision was choosing which accrual tables to snapshot daily, knowing the cost is permanent."
pubDate: 2026-07-20
eyebrow: "Decision"
translationKey: "saldo-promedio-accrual"
draft: false
---

The business didn't want to know what a customer has today. It wanted to know what they have, on average, over time.

Sounds like the same number. It isn't. Two customers can close the month at the same balance and be completely different customers: one held it steady for 30 days; the other hit that number for one afternoon on payday, then drained it back down to almost nothing. The end-of-month snapshot shows them as identical. The daily average pulls them apart. And that gap is exactly what feeds behavioral and profitability models — average balance isn't just another field, it's one of the big input variables.

The problem is that this number can't be requested late, and it can't be recalculated.

The source system keeps no history. It shows you today's balance. Tomorrow it shows tomorrow's, and yesterday's is already overwritten. Daily average balance isn't something you rebuild at close — either you captured it the day it existed, or it's gone. Month-end close gives you twelve snapshots a year. A daily average needs three hundred and sixty-five.

That's the breaking point: the only way to have this number is to store it every day, and storing every day costs. If the server is physical, there's a ceiling. If it's in the cloud, every unnecessary row you keep has a price. Either way, it isn't free.

So the real decision wasn't "take a daily snapshot of everything." It was choosing which tables earn a daily snapshot. In banking, that answer has a name: the accrual tables — the ones that carry the balance detail, day by day. Those are the ones worth capturing every day; everything else gets one snapshot at month-end close. That's not a design preference, it's a budget: every table I snapshot daily is storage multiplied by 365, growing forever in proportion to the rows it holds.

If you work with data in banking, that's where you start: accrual is where the balance lives, and the balance is the thing you can't rebuild.

What it cost wasn't just disk, or cloud storage depending on the setup. It was deciding under a constraint that doesn't forgive: you can't test this and fix it later. If six months from now I find out I needed a daily snapshot of another table, that history doesn't exist — you can't backfill what the source already erased. The cost includes getting it right today, with incomplete information, permanently.

Does your source system still have yesterday's balance, or is it already gone?
