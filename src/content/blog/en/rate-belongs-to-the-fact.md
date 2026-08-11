---
title: "The exchange rate isn't just a dimension. It's part of the fact."
description: "Converting currency at query time gives you the right number and is still the wrong architecture."
pubDate: 2026-08-10
eyebrow: "Decision"
translationKey: "rate-belongs-to-the-fact"
draft: false
---

Five countries, an SAP migration, and a requirement that sounded simple in the room: every sale recorded in its local currency, and in dollars.

The first half isn't up for debate. A sale in Colombia happens in pesos and gets recorded that way. Neither is the second: headquarters is in Panama, and comparing five countries means everyone has to speak one language. That language is the dollar.

Then there was a third condition, and it's the one that breaks what you'd do by default: the reports had to be comparable over time. What Colombia sold last year against what it's selling this year, each period at its own rate.

Store the sale in local currency only and convert it at today's rate when someone runs the query, and the past stops holding still. Last year's sales are worth one thing if you run the report today and something else if you run it in three months. Nobody touched a sale and the number moved anyway.

That much is obvious, and the fix is easy: look the rate up by transaction date instead of today's date. Almost any engine does this. A view in SQL Server joining the currency table by period gives you the right number without storing a thing.

Which is where the decision gets interesting, because that view works. The number is correct.

Both options are legitimate. The dollar can live as a column in the final table, or it can be resolved in the query against the currency table. What settles it isn't which one is cleaner. It's who's going to write that query.

An analyst who knows the model joins it correctly and doesn't need it handed over. Someone three weeks in opens the table, sees a column that says dollars, and moves on. Both of them get to the number. Only one of them can get to a different one.

Because whoever joins on posting date instead of transaction date, or carries last month's rate forward when one is missing, produces a number that looks fine and isn't. Nothing breaks. Nobody notices.

The turning point was realizing the exchange rate is both things, and that treating it as one was the mistake.

As a dimension it exists and has to be modeled: it has a currency, an effective period, and an owner who answers for it. That part isn't in question.

What can't stay on the dimension side is the converted value. That's a measure, and measures belong in the fact. Storing the dollar in the table isn't about making anyone's life easier. It's about taking the definition of a monetary figure out of the hands of whoever writes the query and putting it in the model, where it has one owner.

The decision was to settle it in the layer that builds, not the layer that answers. The raw layer holds the sale in its local currency and nothing more — it doesn't convert, it doesn't have opinions. The currency table comes in the same way: the business loads the rates in the source system, and the raw layer copies that table like it copies any other, without touching it and without filling in what's missing.

When the final table is built, that copy feeds the calculated columns. The rate for the transaction period is applied once and materialized: sales in dollars, cost in dollars, margin in dollars. Everything monetary the business is going to look at comes from there.

A report on March two years ago uses March's rate from two years ago — not because whoever ran it remembered to join correctly. It arrives already calculated.

What it cost was keeping the currency table alive and correct.

The whole model leans on it. If a rate is missing or goes in wrong, the table builds anyway and the error spreads quietly through every report for that period. Nothing breaks. The numbers are just wrong, and nobody finds out until someone compares against something printed.

That's why the business loads the rate and the pipeline doesn't. It isn't handing off work. It's putting the data under the owner who can answer for it.

Is the dollar in your reports defined by the model, or by whoever writes the query?
