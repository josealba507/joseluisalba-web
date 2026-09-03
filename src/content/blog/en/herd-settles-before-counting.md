---
title: "You don't count the herd while it's moving. You count it once it settles."
description: "A reconciliation test kept flagging mismatches that weren't data errors — it was measuring the gap between when the data was copied and when it was checked."
pubDate: 2026-09-02
eyebrow: "Decision"
translationKey: "herd-settles-before-counting"
draft: false
---

RanchOS's data warehouse starts with a copy. A daily replica of the operational system into BigQuery, and on top of that replica a test that asks one question: did everything get copied? It counts the rows in all 26 source tables and checks them, one by one, against the origin. It matches exactly, or it doesn't.

That test reported three mismatches.

None of them were real. All three disappeared on their own in the next run, without anyone touching anything. That alone tells you the problem wasn't in the data — a bad copy doesn't fix itself just because you check it again.

What was actually happening was simpler than I thought. The replica ran on its own schedule, three times a day. The `dbt build` got triggered by hand. Hours could pass between the two, and during those hours someone was still capturing in the app. If a record came in after the last sync and before the run, the replica was behind, and the test flagged a difference — correctly, because at that instant there really were rows in the source that weren't in the copy yet.

The turning point was realizing what that test was actually measuring. It wasn't measuring a flaw in the data. It was measuring the distance between two moments: when the data got copied, and when I checked it.

The first decision was technical, and it's the obvious one once you see it that way. The Workflow that triggers the sync now waits for it to finish — it polls the status until the copy closes — and only then kicks off the dbt job. The window went from hours down to the seconds between the copy closing and the next real write touching that data. And if the copy fails or doesn't finish within the timeout, the Workflow doesn't run dbt at all — it fails and stops right there. There's no point running tests against a replica you already know is stale, or that failed. That just produces noise.

That ended the false positives. With no new writes at the exact moment of the sync, there's nothing to report a difference on.

The second decision wasn't technical, and it's the one I care more about.

It was still running three times a day: eight in the morning, one in the afternoon, eight at night. That schedule didn't come from anywhere in particular. I set it when I first built the pipeline, before I knew how the operation actually moved, and "three times a day" sounded thorough.

Syncing three times while the workday is still running doesn't give you three better snapshots. It gives you three snapshots of a herd that's still moving. The count doesn't fail because the data is wrong — it fails because the day isn't over yet, and plenty can still change: an animal that went out with the wrong group and only gets corrected later, among other things.

And there's something deeper here: nobody needs that midday snapshot. A farm's operational decisions get made in the morning, about what's going to happen that day. A snapshot taken once the herd has settled serves just as well, and doesn't argue with anyone.

So it moved to once a day, at ten at night. It's written right into the Workflow's header, so that a year from now nobody reads it as arbitrary: it runs at night on purpose, because with the day's capture already done, the reconciliation test stops competing against writes still in flight.

The data wasn't wrong. The timing was.

What it cost has two parts, and the second one is the uncomfortable one.

The first is freshness, and I made that trade knowing exactly what I was giving up. I went from three snapshots a day to one. If someone needs to make a call at two in the afternoon using data captured at noon, this schedule won't serve them. The day that need shows up, it gets revisited. Today it doesn't exist, and scheduling for a need that doesn't exist is exactly what got me here in the first place.

The second is what the nighttime window doesn't fix. Each record's timestamp comes from the device's clock, not the server — there isn't a single call to `serverTimestamp()` in the app. A record captured out in a field with no signal reaches BigQuery whenever the phone gets connection back, not when I scheduled the sync.

The schedule is genuinely tuned to the farm's rhythm — it runs once the operational day is over. What it doesn't cover is the particular reality of fieldwork, where signal is intermittent depending on coverage. A record captured on one day might not report until hours, or even days, later, whenever the phone finally reconnects. This isn't unique to a farm — retail has the same problem: a sale captured offline gets loaded on its posting date, not on the moment it actually happened. Business date and system date don't always line up, and no sync schedule closes that gap.

When you scheduled your pipeline's frequency, did it come from the rhythm of the business, or from what sounded reasonable that day?
