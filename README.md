# Eclipse Theme Hub

Community themes for the Eclipse animator. Every theme in this repo shows up in the in-game Theme Hub.

## Submitting a theme

1. Fork this repo.
2. Add a new file in `themes/` named after your theme in lowercase with dashes, e.g. `themes/digital-hands.json`.
3. Use this format:

```json
{
  "name": "Digital Hands",
  "artist": "@yourname",
  "theme": { "PASTE": "your exported theme JSON here, as-is" }
}
```

- `name`: theme name (max 40 characters)
- `artist`: your name or @handle (max 40 characters)
- `theme`: paste the JSON you copied from the animator. Paste it as an object, **not** in quotes.
  The preview image is taken from the `Img` field automatically.

4. Open a pull request. A check runs automatically and tells you if something is wrong.
   After the PR is merged, the theme appears in the hub within a few minutes.

## How it works

`scripts/build-index.js` validates every file in `themes/` and builds `index.json`.
GitHub Actions runs it on every PR (validate only) and on every push to `main` (rebuild and commit `index.json`).
The plugin downloads only `index.json`.
