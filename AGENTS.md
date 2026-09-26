<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the Western Union reference landing page at `/` and its distinct transfer-tracking page at `/track-transfer`, with semantic styling in `src/styles.css` and existing asset pointers; this preserves the supplied visual references without embedding browser screenshots.
- Keep customer tracking history in `transfer_events` and present only verified, projected history through the public lookup; this prevents direct anonymous table reads and preserves status changes.
