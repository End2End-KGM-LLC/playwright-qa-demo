# Playwright QA Demo Suite

[![Playwright Tests](https://github.com/End2End-KGM-LLC/playwright-qa-demo/actions/workflows/playwright.yml/badge.svg)](https://github.com/End2End-KGM-LLC/playwright-qa-demo/actions/workflows/playwright.yml)

A working example of the test suite **End2End KGM** sets up for clients as part of the **Playwright QA Launch Kit**. It tests a demo e-commerce store ([saucedemo.com](https://www.saucedemo.com)) and a demo booking API ([restful-booker](https://restful-booker.herokuapp.com)) the same way we'd test your app:

- **15 UI tests** on the flows that cost money when they break: login, product list, cart, checkout
- **5 API tests** on create / read / update / delete, including auth checks
- **Chrome, Firefox and Safari (WebKit)** on every run
- **Runs automatically** on every pull request, every merge to `main`, and once a day, so you hear about a broken checkout before your customers do
- **HTML report** with screenshots, video and a step-by-step trace for every failure

## What's covered

| Area        | Tests                                                                                                           |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| Login       | Valid login; locked-out user; wrong password; protected pages redirect to login                                 |
| Products    | Full catalog shown; sort by price; sort by name; detail page matches list; logout                               |
| Cart        | Add items and badge count; remove items; cart survives reload                                                   |
| Checkout    | Full order end to end; **totals add up** (items + tax = total); missing details block the order                 |
| Booking API | Health check; created booking reads back; authorised update; delete without token is refused; authorised delete |

Tests tagged `@smoke` are the critical path: `npm run test:smoke` runs just those.

## How it's built

```
tests/e2e/    UI tests, one file per feature
tests/api/    API tests (no browser, fast)
pages/        Page objects: selectors and actions live here, not in tests
fixtures/     Logs in once and reuses the session; shared test data
config/       dev / staging / prod profiles (prod never runs data-changing tests)
```

A few things that keep it reliable as the app grows:

- **Logs in once per run** and reuses the session, so tests are fast and a login change only breaks one file.
- **Page objects**: when the UI changes, you fix one selector in `pages/`, not twenty tests.
- **Stable selectors** (`data-test` attributes and roles), not brittle CSS paths.
- **Lint rules that catch the classic flaky-test bugs**, like a missing `await`, before they're merged.
- **Every test is independent**: each one sets up its own data, so they run in parallel and in any order.

## Run it yourself

Requires Node.js 20 or later.

```bash
git clone https://github.com/End2End-KGM-LLC/playwright-qa-demo.git
cd playwright-qa-demo
npm ci
npx playwright install chromium
cp .env.example .env
npm test
npm run report     # opens the HTML report
```

To run all three browsers: `BROWSERS=chromium,firefox,webkit npm test` (install them first with `npx playwright install firefox webkit`).

## Want this for your app?

**End2End KGM** is a QA automation practice led by a QA Lead / SDET with about 10 years in QA (CSTE certified). We set up suites like this for startups, agencies and small businesses that ship without a dedicated QA team:

- **Smoke Suite**: the 10–15 tests that protect your critical paths, running on every PR, with a handoff call so your team can maintain it.
- **Full Setup**: a larger suite with API tests, cross-browser runs, Slack alerts on failure, and environment config.
- **Ongoing QA**: we keep the suite green and add tests as you ship features.

**Get in touch:** [itnmh3202@yahoo.com](mailto:itnmh3202@yahoo.com?subject=Playwright%20QA%20Launch%20Kit). Tell us what your app does and what keeps breaking.
