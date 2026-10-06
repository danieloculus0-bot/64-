# 64Δ

**Chess-adjacent operational command analysis for real organizations.**

64Δ asks a simple question:

> Given the operating system as it exists right now, who can actually affect what happens next?

## Playable prototype

The first browser prototype is now in `index.html`.

It currently supports:

- a generic 8×8 board
- any user-supplied map or layout as an image overlay
- overlay pan, scale, opacity, and lock
- named Pawns placed on the board
- click-to-move Pawn play
- square operating states
- generic production variables attached to any square
- browser save
- JSON export/import

There are intentionally **no chess movement rules** in the prototype. Pawn movement remains unrestricted until the causal movement law is mature enough to deserve enforcement.

The prototype is a single static HTML file with no dependencies. Download the repository and open `index.html` in a browser.

## Human-facing base law

The interface stays deliberately small:

- **Pawn** = real person.
- **Square** = real operating space.
- **Move** = actual ability to affect outcome.
- **Everything else** = data.

If the human-facing system becomes harder to learn than chess, we fucked it up.

## Engine doctrine

The deeper analytical engine can become sophisticated without burdening the player.

Current research includes causal movement, human capacity and saturation, asset state, morale, external interfaces, traceable state changes, deterministic legal actions, and organizational stress testing.

The experimental 25 / 15 / 15 / 9 golden-ratio architecture remains background research. It is **not** currently a required player rule or fixed board layout.

Earlier executable doctrine experiments live under `src/sixty4delta/` and `doctrine/`. They should be treated as research code while the playable rules are simplified and pressure-tested.

## Direction

The board must remain universal.

A specific organization supplies its own map, people, assets, processes, variables, constraints, and conditions. None of those should be hard-coded into 64Δ itself.
