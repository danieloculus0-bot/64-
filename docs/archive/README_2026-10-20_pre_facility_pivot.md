# 64Δ

Independent chess-adjacent operational mapping prototype and deterministic causal-movement research project. It is not a validated organizational optimizer or an Axiom production module.

## Current build state

**Reviewed:** 2026-10-20 · **Inspected main:** `ea1a7e88f841`.

**No GitHub Actions runs found** at inspection. Local functionality is described below; hosted CI is unverified.

[Live workflow history](https://github.com/danieloculus0-bot/64-/actions) is the source for newer results.

## Implemented features

- Static browser `index.html` maps an 8×8 board with person/Pawn placement, map overlay, state display and JSON export/import.
- Separate Python causal-rule code under `src/sixty4delta/` and its tests explores stricter movement logic.
- The browser UI intentionally allows unconstrained Pawn movement; the Python causal law is not enforced by the browser.

## Run or test

Open `index.html` in a browser to use the independent prototype. For Python rule checks, run `python -m unittest discover -s tests -v` after installing the necessary project dependencies.

## Boundaries

- No GitHub Actions CI run was visible at inspection; this is **untested in hosted CI**, not a passing workflow.
- Chess-like board behavior is a modeling metaphor, not a mathematically verified organizational decision engine.

## Next step

Add explicit causal-constraints-to-browser bridge and a hosted smoke test. Keep simulation clearly distinct from real organizational authority.

## Documentation


- [Complete earlier README, including historical development notes](docs/archive/README_2026-10-20_before_refresh.md)
