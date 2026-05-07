---
title: "Branded vs Non-Branded CTR/CVR: How to Isolate Real Hero Image Lift"
description: "After 14,000+ hero image tests, here's how to split branded vs non-branded CTR/CVR so you stop attributing brand-search halo to your new creative."
date: 2026-05-07
author: John Aspinall
keywords: "amazon branded vs non-branded ctr, hero image ab test isolation, amazon search query performance, amazon creative measurement, branded search halo, amazon cvr lift measurement, sqp branded non-branded split, amazon hero image testing methodology"
permalink: /blog/amazon-branded-vs-non-branded-ctr-cvr-isolation/
---

I've optimized 14,000+ Amazon hero images and the most common mistake in creative measurement isn't sample size, isn't seasonality, isn't even ad-spend confound. It's that brands measure CTR and CVR as one blended number and then claim a hero image lift that was actually a branded search lift.

If your brand-search volume moved during your test window — because you ran an influencer drop, a podcast spot, a TikTok hit, a Prime Day mention, anything — the blended CTR/CVR delta you're staring at is contaminated. The hero image may have done nothing. Or it may have done a lot more than you think and the non-branded segment is hiding the real story.

The fix is a **branded vs non-branded split** on every creative test. Below is the exact methodology I now run on every hero image test, the data I require, the thresholds I use, and the way I report results to brand teams so they stop overclaiming.

## Why Blended CTR/CVR Lies

A typical hero image test on a $1.2M/year SKU pulls roughly 18,000-32,000 sessions across the 14-day Manage Your Experiments window. Of those sessions, anywhere from **22% to 71% are branded** depending on category and brand maturity.

That spread is the problem. Branded sessions:

- Convert at 3-7x the rate of non-branded sessions
- Click at 2-4x the rate on SERP
- Are almost completely unaffected by hero image changes (the shopper already decided)
- Move weekly based on off-Amazon activity you don't control

So if your branded session share drifts from 38% to 44% during a test — say, because a creator posted about you in week 2 — your blended CVR will jump 8-12% with zero creative cause. I've watched brands celebrate hero image wins that were 100% attributable to a TikTok creator they forgot they paid.

The reverse is uglier: a hero image that drives a +18% CVR lift on **non-branded traffic** can show up as -2% blended if branded share collapses during the same window. The image worked. The team killed it.

## The Data You Need to Run This

Three reports, all native to Seller Central or Brand Analytics:

1. **Search Query Performance (SQP) — ASIN view** by week, for the SKU under test
2. **Manage Your Experiments** session and conversion data, by treatment
3. **Brand Analytics → Top Search Terms**, filtered to your branded variants list

You'll need a branded keyword list maintained per brand. Mine includes brand name, common misspellings, brand+category ("aspi grill brush"), and trademarked product names. Anything else is non-branded — generic category, problem, or feature queries.

Tag every keyword in your SQP export as branded or non-branded with a simple lookup column. This takes 10 minutes the first time, 90 seconds every time after.

## The Isolation Protocol

I run this exact protocol on every hero image test now. Five windows, 35 days total.

### Window 1 — Baseline branded share (7 days, pre-test)

Pull the 7 days before the test starts. Compute:

- Branded session share (branded sessions ÷ total sessions)
- Branded CVR
- Non-branded CVR
- Blended CVR

This is your baseline. Anything that drifts more than ±15% during the test window invalidates the blended number.

### Window 2 — Test runs (14 days)

Manage Your Experiments runs the 50/50 split on the listing detail page. **Critical: MYE doesn't split by branded vs non-branded out of the box.** You have to reconstruct it.

For each treatment (control vs variant), pull SQP for the test window. Tag branded vs non-branded. Compute:

- Branded sessions and CVR per treatment
- Non-branded sessions and CVR per treatment
- Branded share per treatment

If branded share is roughly equal across both treatments (within 3 percentage points), the split is clean and your randomization worked. If it's lopsided, you have a bug — usually a dayparted ad campaign that ran during one variant's exposure window only.

### Window 3 — Read non-branded CVR delta (the real signal)

This is the number that matters: **non-branded CVR variant minus non-branded CVR control.**

Thresholds I use:

- **<3% delta**: noise. Don't ship.
- **3-7% delta**: real but small. Ship if creative cost was low; otherwise iterate.
- **7-14% delta**: meaningful win. Ship and re-test against next-best variant in 30 days.
- **>14% delta**: outlier. Verify with a second 14-day run before celebrating.

### Window 4 — Read branded CVR delta (sanity check)

Branded CVR should move very little. If it moves more than 4-5%, something other than the hero image is happening — usually a price change, a stock issue, or a review-count shift. Investigate before trusting any number from this test.

### Window 5 — Settle (7 days, post-test)

After ramp to the winner, watch non-branded CVR for 7 days. Real lifts hold. Halo effects collapse. If your non-branded CVR drops back to baseline within a week, the test was contaminated and you need to re-run.

## What This Looks Like in Practice

Real example from a kitchen accessories brand I worked with last quarter. SKU running ~$340K/year, $48 price point.

Blended CVR before test: 14.2%
Blended CVR variant: 16.1% (+13.4% lift)

Looks like a winner. Most teams ship this. Here's the split:

- Branded share before test: 41%
- Branded share during test: 53% (a creator partnership launched mid-test)
- **Branded CVR**: control 38.2% → variant 39.1% (+2.4%, noise)
- **Non-branded CVR**: control 5.8% → variant 5.6% (-3.4%)

The hero image **lost on real signal**. The blended lift was 100% creator-driven branded share growth. Shipping this hero would have nuked non-branded conversion at the moment they had peak top-of-funnel interest.

We killed the variant, ran a second test 21 days later (after creator effect decayed), and the original control beat the variant by another -5.1% on non-branded. The hero was a clear loser. Blended numbers said winner.

## Where Brands Get This Wrong

A few common mistakes I see when I audit a brand's testing protocol:

**Using MYE's built-in winner declaration**. MYE does a Bayesian probability calculation on blended sessions. It doesn't know about your branded share drift. Treat it as a starting point, not a verdict.

**Ignoring the 3-percentage-point check on branded share parity between treatments**. If one variant got more branded traffic than the other, the test isn't valid regardless of the deltas.

**Running creative tests during launches, promotions, or PR pushes**. Don't. Your branded share will move 20+ percentage points and corrupt every number.

**Reading week 1 of the test**. Branded share is most volatile in week 1 because the algorithm is still routing test traffic. Always read the full 14 days.

**Splitting by paid vs organic instead of branded vs non-branded**. Paid traffic includes a huge branded chunk (Sponsored Brands defense). Branded vs non-branded is the cleaner split.

## What About Low-Volume SKUs?

If your SKU runs under 250 daily sessions, MYE won't generate a usable confidence interval and the branded/non-branded split makes the sample even thinner. For low-volume SKUs I run **time-based testing** instead: 21 days variant, 21 days control, 21 days variant again, with branded share normalization across all three blocks. It's slower but produces a usable read on creative I can't get any other way.

I covered the math on this in my [A/B test statistical significance breakdown](/blog/amazon-ab-test-statistical-significance/) if you want the sample size formula.

## The Reporting Format I Use With Brand Teams

One slide per test. Three numbers stacked:

1. Non-branded CVR delta (the headline)
2. Branded CVR delta (the sanity check)
3. Branded share drift % (the validity gate)

If the validity gate exceeds 15%, the slide says "test invalid, re-running." That's it. No blended numbers anywhere on the slide.

This format killed about 30% of "wins" the first quarter we used it across our roster. Brand teams hated it for two months and then started catching contamination themselves before tests even launched.

## FAQ

**Can I run this isolation protocol on Sponsored Products creative tests?**
Partly. Sponsored Products doesn't expose branded vs non-branded as cleanly as SQP, but you can use search term reports as a proxy. Not as clean. Use it for directional reads only.

**How do I handle seasonal SKUs where branded share moves naturally?**
Match your test window to a stable share period (compare year-over-year branded share by week first). For category SKUs that are inherently seasonal — outdoor, holiday, fitness — push tests to off-peak windows where branded share is flatter.

**Does this matter for new brands with low branded search?**
Less. If your branded share is under 10%, the blended number is mostly non-branded already and the contamination risk is low. Once branded share crosses ~20%, you need this protocol.

**What if I'm using third-party testing tools instead of MYE?**
Same protocol applies. The tool only changes how you serve the variants, not how you measure them. SQP is the source of truth for branded/non-branded splits regardless.

---

If you're testing creative without splitting branded vs non-branded, you're guessing. Get the SQP export, build the lookup once, and never trust a blended CVR number again. For more on the measurement stack, see my [5-week CTR/CVR isolation protocol](/blog/amazon-creative-ctr-cvr-measurement-protocol/) and the [SQP creative optimization workflow](/blog/amazon-search-query-performance-creative-optimization/).
