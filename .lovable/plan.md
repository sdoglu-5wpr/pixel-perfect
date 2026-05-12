I confirmed the live URL is still looping:

```text
?amp -> 301 Location: /crisis-pr-gone-wrong-in-2025-...?amp
       -> repeats forever
```

I also tested `/research?amp` and a fake URL with `?amp`; both loop the same way, so this is not article-specific.

Likely cause: Netlify is preserving/re-attaching the original query string on relative redirect `Location` values, so even when the app tries to redirect to `/slug`, the deployed response becomes `/slug?amp` again.

Plan:

1. Add a Netlify Edge Function canonicalizer
   - Runs before static HTML, SSR, and normal Netlify redirects.
   - Detects `amp`, `noamp`, `utm_*`, `fbclid`, `gclid`, etc.
   - Deletes those params from the request URL.
   - Returns a 301 with an absolute clean URL, e.g.
     `https://everything-pr.com/crisis-pr-gone-wrong-in-2025-when-silence-spin-and-misreading-the-moment-make-things-worse`

2. Configure it in `netlify.toml`
   - Add `[[edge_functions]]` for `path = "/*"`.
   - Remove or disable the current query-param `[[redirects]]` rules because they are still producing self-redirect behavior.

3. Harden existing server canonical redirects
   - Change app/server canonical redirects from relative `Location: /slug` to absolute clean URLs.
   - This prevents Netlify from appending the original query string if a request reaches SSR/function handling.

4. Verification after deploy
   - Check:
     ```bash
     curl -I "https://everything-pr.com/crisis-pr-gone-wrong-in-2025-when-silence-spin-and-misreading-the-moment-make-things-worse?amp"
     ```
   - Expected:
     ```text
     HTTP/2 301
     Location: https://everything-pr.com/crisis-pr-gone-wrong-in-2025-when-silence-spin-and-misreading-the-moment-make-things-worse
     ```
   - Then `curl -IL --max-redirs 3 ...?amp` should end at `200` with no redirect loop.