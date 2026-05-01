# Inspo Example Template

Copy this `_template/` directory to create a new inspo eval example:

```bash
cp -r evals/inspo/_template evals/inspo/my-example-name
```

Then populate:

1. **screenshot.png** — Full-page screenshot of the inspo example
2. **source.sail** — The SAIL expression (if available; delete if not)
3. **assets/** — Any images used within the mockup (avatars, backgrounds, etc.)
4. **expected-structure.json** — Edit to reflect the actual components and layout
5. **prompt-variants/** — Adjust prompts if the example needs specific instructions

If no SAIL source is available, delete `source.sail` and `prompt-variants/sail-only.md`. The example will only run as S7 (image only).
