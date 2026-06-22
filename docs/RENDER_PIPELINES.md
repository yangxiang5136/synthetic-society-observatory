# Render Pipelines

Synthetic Society Observatory can use several visual-generation paths. These paths should stay modular: generated images and rendered scenes are viewport assets, not proof of a live runtime.

## 1. Fast Concept Path

Use image generation or selected concept renders to explore visual language quickly.

Good for:

- street-level cinematic mood;
- observer-deck mood;
- public-video look development;
- rapid visual A/B decisions.

Current integrated assets:

- `assets/cyberpunk-observatory-viewport.png` - high-level overview.
- `assets/street-event-wide.png` - street-level cinematic view.
- `assets/street-event-cinematic.webp` - alternate street-level view.
- `assets/observer-deck-view.png` - observer-deck cinematic UI view.

## 2. Hugging Face MCP Path

Hugging Face MCP or similar model endpoints can be used as a render lane for concept images when the goal is fast exploration.

Recommended use:

1. Generate 3-6 candidates for the same event.
2. Keep each candidate neutral: no private brands or project-specific terms.
3. Select one image per perspective type: overview, street, deck.
4. Copy selected assets into `assets/`.
5. Document the role of the asset in `assets/README.md`.

This path is useful because it can produce cinematic scene variety faster than a full 3D scene build.

## 3. Windows Blender Render Node

The Windows render node should be used when the scene needs to become reproducible, animated, or tied to future `observer_slices -> render_shotlist` output.

Recommended use:

1. Treat selected concept images as look-development references.
2. Build or generate a Blender shotlist from an observer slice.
3. Render overview, street, or deck shots through the Windows node.
4. Return stills or clips as viewport assets.

Use this path for:

- repeatable 3D stills;
- camera moves;
- public-video sequences;
- future observer-slice-to-shot workflows.

## Boundary

Do not claim that any concept image or Blender render is a live simulation. Until runtime integration exists, the UI should keep labels such as `staged observer UI`, `public-safe seed`, and `render asset`.
