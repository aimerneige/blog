---
name: write-blog
description: Draft, rewrite, review, translate, and polish posts for the current AimerNeige Hugo/PaperMod blog. Use when Codex needs to work on this repository's blog prose, including `content/post/**`, `content/about.*.md`, Hugo frontmatter, titles, summaries, technical tutorials, troubleshooting notes, bilingual zh/en post pairs, or personal essays. Preserve the author's voice, Hugo structure, code blocks, commands, links, shortcodes, and factual claims while improving readability and removing AI-like wording.
---

# Write Blog

## Overview

Use this skill only for the current blog project. It adapts the Waza `write` skill's stance to AimerNeige's blog: preserve intent and author voice first, then remove formulaic prose, improve technical clarity, and keep Hugo/PaperMod mechanics intact.

For any drafting, rewriting, translating, or review task, read [references/aimerneige-blog-style.md](references/aimerneige-blog-style.md) before changing prose.

## Workflow

1. Identify the task mode: new post, polish existing post, translate zh/en pair, review only, or frontmatter/title/summary cleanup.
2. Read the target file before editing. For a new post, read `archetypes/default.md` and one or two existing posts in the same language/category as style references.
3. Preserve Hugo structure: frontmatter keys, `cover`, `ShowToc`, headings, links, code fences, footnotes, and shortcodes such as `{{< notice tip >}}`.
4. Preserve facts and author experience. Do not invent personal anecdotes, test results, version claims, screenshots, or "official" recommendations. Ask or leave an explicit gap when source material is missing.
5. Edit from large to small: structure, missing prerequisites or warnings, paragraph flow, sentence-level AI taste, then punctuation.
6. Keep procedural content scannable. Lists, numbered steps, code blocks, and known-issue sections are normal for this blog; do not prose-merge real instructions just to look less list-like.

## Mode Rules

### New Post

Create only the requested article. Match existing paths and naming conventions:

- Chinese posts usually use `content/post/<Category>/<slug>.zh.md`.
- English posts usually use `content/post/<Category>/<slug>.en.md`.
- Paired translations share the same slug, date, categories, tags, and cover unless the user asks otherwise.

Use the project archetype as the frontmatter baseline. Add `description`, `categories`, `tags`, and `cover` only when they are known or clearly useful. Default `draft: true` unless the user asks for a publish-ready post.

### Polish Existing Post

Edit in place only when the user asks to modify files. Otherwise return review notes or rewritten text according to the request. Keep commands, config snippets, file paths, links, and shortcode blocks exact unless the requested improvement requires changing them.

For long posts with many sections, map the headings first and propose large cuts or section moves before applying them. Sentence-level polish must not silently delete a paragraph that contains a unique technical fact.

### Translation Pair

Keep the two language versions equivalent in meaning, not word-for-word identical. Preserve technical names that are normally written in English. Improve obvious English spelling or grammar, but keep the direct tutorial tone instead of turning it into marketing copy.

### Review Only

Lead with concrete findings and file references. Prioritize factual gaps, unsafe commands without warning, outdated version-sensitive claims, broken Hugo structure, unclear prerequisites, and places where AI-like wording weakens the author's voice.

## Output Rules

- When producing prose only, return the prose without a change log unless the user asks for explanation.
- When editing files, summarize changed files and any checks run.
- Do not add decorative emoji, marketing slogans, corporate tone, or generic "future outlook" endings.
- Do not use em dashes or en dashes in generated prose. Use commas, periods, colons, parentheses, or hyphen-minus where appropriate.
