#!/usr/bin/env node

/**
 * Auto-Blog Generator for Aspi
 *
 * Fetches Google Trends, uses Claude to find an angle connecting the trend
 * to Amazon/marketplace creative strategy, writes an SEO-rich blog post,
 * and commits it to the repo.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... node scripts/auto-blog.mjs
 *
 * Optional env vars:
 *   DRY_RUN=true        — Write the file but skip git commit/push
 *   TREND_OVERRIDE=...  — Skip Google Trends and use this topic instead
 */

import Anthropic from "@anthropic-ai/sdk";
import googleTrends from "google-trends-api";
import { writeFileSync, existsSync, readFileSync } from "fs";
import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const POSTS_DIR = resolve(ROOT, "src/blog/posts");
const SITE_URL = "https://goaspi.com";
const AUTHOR = "John Aspinall";

// ---------------------------------------------------------------------------
// 1. Fetch trending topics from Google Trends
// ---------------------------------------------------------------------------

async function getTrendingTopics() {
  if (process.env.TREND_OVERRIDE) {
    console.log(`Using override trend: "${process.env.TREND_OVERRIDE}"`);
    return [process.env.TREND_OVERRIDE];
  }

  console.log("Fetching Google Trends (US, daily)...");
  const raw = await googleTrends.dailyTrends({ geo: "US" });
  const data = JSON.parse(raw);
  const days = data.default.trendingSearchesDays;

  // Collect the top 20 trending queries across recent days
  const topics = [];
  for (const day of days) {
    for (const search of day.trendingSearches) {
      topics.push({
        title: search.title.query,
        traffic: search.formattedTraffic,
        articles: search.articles?.map((a) => a.title).slice(0, 2) || [],
      });
      if (topics.length >= 20) break;
    }
    if (topics.length >= 20) break;
  }

  console.log(`Found ${topics.length} trending topics`);
  return topics;
}

// ---------------------------------------------------------------------------
// 2. Get existing post slugs to avoid duplicates
// ---------------------------------------------------------------------------

function getExistingSlugsSync() {
  try {
    const files = execSync(`ls ${POSTS_DIR}/*.md 2>/dev/null`, {
      encoding: "utf-8",
    })
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((f) => f.split("/").pop().replace(".md", ""));
    return files;
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// 3. Use Claude to pick the best trend and write the post
// ---------------------------------------------------------------------------

async function generateBlogPost(trends) {
  const client = new Anthropic();
  const existingSlugs = getExistingSlugsSync();

  // Read existing posts for context on tone/style
  let existingPostSample = "";
  try {
    const samplePath = resolve(POSTS_DIR, "amazon-hero-image-mistakes.md");
    if (existsSync(samplePath)) {
      existingPostSample = readFileSync(samplePath, "utf-8").slice(0, 2000);
    }
  } catch {
    // ignore
  }

  const trendsFormatted =
    typeof trends[0] === "string"
      ? trends.map((t, i) => `${i + 1}. ${t}`).join("\n")
      : trends
          .map(
            (t, i) =>
              `${i + 1}. "${t.title}" (${t.traffic} searches) — Related headlines: ${t.articles.join("; ")}`
          )
          .join("\n");

  console.log("Asking Claude to pick a trend and write the post...");

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are a content strategist for Aspi (goaspi.com), a marketplace creative strategy agency that specializes in Amazon hero image optimization, image stack strategy, A+ content, and performance analysis. The founder is John Aspinall with 20+ years of e-commerce experience, 14,000+ hero images optimized, and 50,000+ listings reviewed.

## Your Task

Below are today's trending topics on Google. Pick the ONE topic that can most naturally be tied back to Amazon/marketplace creative strategy, listing optimization, or e-commerce selling. Then write a complete blog post that:

1. **Hooks the reader** with the trending topic (why it's relevant right now)
2. **Bridges** naturally to Amazon/marketplace creative strategy (how this trend connects to what sellers should be thinking about)
3. **Delivers educational value** — actionable tips sellers can implement on their listings
4. **Ends with a soft CTA** to get a free listing audit from Aspi

## Trending Topics

${trendsFormatted}

## Existing Post Slugs (do NOT duplicate these topics)

${existingSlugs.join(", ") || "none yet"}

## Example Post for Tone/Style Reference

${existingPostSample}

## Output Format

Respond with ONLY a JSON object (no markdown fences) with these exact keys:

{
  "slug": "short-keyword-focused-slug",
  "title": "Post Title With Target Keywords",
  "description": "Meta description, 150-160 chars, includes primary keyword",
  "keywords": "comma, separated, keyword, list, 6-10 keywords",
  "trend_used": "The trending topic you chose",
  "body": "The full markdown body of the post (no front matter, just content starting with the first paragraph). Use ## for h2 headings. Include 3-5 sections. Write 800-1200 words. Be specific and actionable, not generic. Reference real marketplace dynamics. End with a CTA paragraph mentioning the free audit."
}`,
      },
    ],
  });

  const text = response.content[0].text.trim();

  // Parse JSON — handle possible markdown fences
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      json = JSON.parse(match[0]);
    } else {
      throw new Error("Claude response was not valid JSON:\n" + text);
    }
  }

  return json;
}

// ---------------------------------------------------------------------------
// 4. Write the markdown file
// ---------------------------------------------------------------------------

function writePost(post) {
  const today = new Date().toISOString().split("T")[0];
  const filename = `${post.slug}.md`;
  const filepath = resolve(POSTS_DIR, filename);

  if (existsSync(filepath)) {
    console.log(`Post already exists: ${filename} — skipping`);
    return null;
  }

  const frontMatter = `---
title: "${post.title.replace(/"/g, '\\"')}"
description: "${post.description.replace(/"/g, '\\"')}"
date: ${today}
author: "${AUTHOR}"
keywords: "${post.keywords}"
permalink: /blog/${post.slug}/
---`;

  const content = `${frontMatter}\n\n${post.body}\n`;
  writeFileSync(filepath, content, "utf-8");
  console.log(`Wrote: ${filepath}`);
  return filepath;
}

// ---------------------------------------------------------------------------
// 5. Git commit & push
// ---------------------------------------------------------------------------

function gitCommitAndPush(filepath, post) {
  if (process.env.DRY_RUN === "true") {
    console.log("DRY_RUN enabled — skipping git commit/push");
    return;
  }

  const filename = filepath.split("/").pop();

  try {
    execSync(`git -C "${ROOT}" add "${filepath}"`, { stdio: "inherit" });
    execSync(
      `git -C "${ROOT}" commit -m "blog: ${post.title} (auto-generated from trending: ${post.trend_used})"`,
      { stdio: "inherit" }
    );

    // Push to current branch
    const branch = execSync(`git -C "${ROOT}" rev-parse --abbrev-ref HEAD`, {
      encoding: "utf-8",
    }).trim();
    execSync(`git -C "${ROOT}" push -u origin ${branch}`, {
      stdio: "inherit",
    });

    console.log(`Committed and pushed: ${filename}`);
  } catch (err) {
    console.error("Git operation failed:", err.message);
    console.log("The post file was still written — you can commit manually.");
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== Aspi Auto-Blog Generator ===\n");

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      "Error: ANTHROPIC_API_KEY environment variable is required.\n" +
        "Set it with: export ANTHROPIC_API_KEY=sk-ant-..."
    );
    process.exit(1);
  }

  // 1. Get trends
  const trends = await getTrendingTopics();
  if (!trends.length) {
    console.log("No trends found. Exiting.");
    return;
  }

  // 2. Generate post
  const post = await generateBlogPost(trends);
  console.log(`\nTrend chosen: "${post.trend_used}"`);
  console.log(`Post title:  "${post.title}"`);
  console.log(`Slug:        "${post.slug}"\n`);

  // 3. Write file
  const filepath = writePost(post);
  if (!filepath) return;

  // 4. Commit & push
  gitCommitAndPush(filepath, post);

  console.log("\nDone!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
