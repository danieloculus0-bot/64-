# 64Δ

**Chess-adjacent operational command analysis for real organizations.**

Six Sigma was neat. 64Δ asks a different question: given the whole operating system as it exists right now, what can actually move, what is exposed, and what action changes the board most?

## Core architecture

The board contains exactly 64 mapped spaces.

- 25 productive
- 15 protective
- 15 responsive
- 9 strategic reserve

That 25 / 15 / 15 / 9 structure is the current golden-ratio-inspired operating architecture.

## Core law

64Δ is not chess and it is not a party game.

- Movement is based on demonstrated causality.
- Pawns are informed, honored frontline fighting leaders.
- A Pawn must know they are a Pawn.
- Pawns have finite capacity and can saturate.
- Pawn strength and organizational dependency on that Pawn are separate facts.
- Pawn activation can be programmed or discretionary within granted authority.
- Machines and assets change board state; they do not move like people.
- External failures enter through defined interfaces.
- Morale is mapped as seriously as plant layout.
- Every important state change is traceable through events.
- Identical state and rules must produce the same set of legal actions.
- Uncertainty is explicit. There are no magic moves.

The executable implementation of these rules begins in `src/sixty4delta/law.py`.

## Design constraint

If the human-facing rules become harder to learn than chess, we fucked it up.

The engine may be sophisticated. The operating language must remain simple enough for real people to use under pressure.
