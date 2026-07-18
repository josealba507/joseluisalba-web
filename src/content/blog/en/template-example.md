---
title: "[Sample] What a post looks like in this template"
description: "This post exists only to validate the layout — replace it with real content and delete it once it's no longer useful."
pubDate: 2026-07-18
eyebrow: "Decision"
translationKey: "ejemplo-plantilla"
draft: true
---

This is a sample post, generated to visually test the article template (typography, code block, pull quote, next-post navigation) — not real content. With `draft: true` it won't show up in the blog index or RSS feed; it's only reachable by navigating directly to this URL in development.

## A sample subtitle

This is what a normal body paragraph looks like, set in Source Serif 4, with line width capped at `760px` for comfortable reading.

> A pull quote looks like this — useful for calling out a key sentence within the post's argument.

And this is what a code block looks like:

```python
stages = (exposures
    .join(delinquency_history, "contract_id")
    .withColumn("stage", stage_rules("sicr_flag", "dpd_bucket")))
```

Replace this file with your first real post and delete it, or keep it with `draft: true` as a formatting reference.
