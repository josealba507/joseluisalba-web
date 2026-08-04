---
title: "A copy doesn't have opinions"
description: "Why storing only balance changes isn't enough for month-end reporting — the fix isn't one table doing both jobs, it's two layers with different jobs: the one that copies and the one that answers."
pubDate: 2026-08-03
eyebrow: "Governance"
translationKey: "copia-no-opina-accrual"
draft: false
---

I needed to optimize storage. The obvious way to keep daily balances without blowing past capacity wasn't to store the balance every day — it was to store only when it changes. Same idea for inactive accounts: don't store them at all.

How I did it: first, I capture only active accounts and ignore the inactive ones; second, I compare the last balance I have against the source. If they match, I skip it; if they don't, I insert it. That way I store the changes, not the stillness.

The problem is that reporting and business analysis need something else: the balance at each month's close. Every month, whether or not the account moved.

Those two things look like they're at war. If an account didn't move all of February, storing only changes leaves me without a single row for February. For the daily average it doesn't matter — January's balance is still in effect and that's what the average uses. But for the month-end balance report, February comes up empty: every account that didn't move is missing, even though the account exists and holds money.

The temptation is to fix it in one layer. Either I store every account's balance at every month-end even when nothing changed — reinflating exactly what I was trying to compress — or I keep only the changes and tell the business to live with the gaps. Both are bad, and both come from the same mistake: believing one table solves this.

One table doesn't. Two layers do — two jobs, and therefore two tables.

The accrual table is a copy of the source. Its only job is to store the change. It keeps the delta and nothing else: if the balance didn't move, it doesn't write. It knows nothing about month-end, doesn't care about the report, fills in nothing. It's raw and minimal on purpose. Its measure of success is not having stored a single row the source didn't have.

The final table is a different animal. Its job isn't to store, it's to answer the business question. And that — only there — is where month-end close lives. When the final table is built, that process rebuilds what the layer below compressed: it carries the last balance forward, and at each month-end it forces a closing record, whether or not the account changed. February's gap gets filled here, in the layer that answers, not the one that copies.

What it cost wasn't code. It was discipline: resisting the urge to solve the reporting problem one layer earlier than it belongs. Putting month-end close in the accrual table is tempting — it's right there, it's easy. But the day you do it, that table stops being a copy of the source and becomes a copy with opinions. You've added rows the origin never had. And the day you need to audit it against the source, it won't reconcile — because it's no longer a mirror, it's an interpretation. A copy doesn't have opinions. That's what the final table is for.

When one of your accounts doesn't move all month, does your closing report know it — or does that month simply not exist?
