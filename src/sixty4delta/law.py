from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, FrozenSet, Iterable, List, Mapping, Optional, Set, Tuple


BOARD_SIZE = 64
GOLDEN_ARCHITECTURE = {
    "productive": 25,
    "protective": 15,
    "responsive": 15,
    "strategic_reserve": 9,
}


class Activation(str, Enum):
    PROGRAMMED = "programmed"
    DISCRETIONARY = "discretionary"


class AssetState(str, Enum):
    OPERATIONAL = "operational"
    CONSTRAINED = "constrained"
    BLOCKED = "blocked"
    UNSAFE = "unsafe"
    STARVED = "starved"
    OVERLOADED = "overloaded"
    SUSPECT = "suspect"


@dataclass(frozen=True)
class CausalLink:
    source: str
    target: str
    mechanism: str

    def __post_init__(self) -> None:
        if not self.mechanism.strip():
            raise ValueError("Every causal link must answer the 'because' test.")


@dataclass
class SquareState:
    square_id: str
    operation: str
    morale: float
    asset_state: AssetState = AssetState.OPERATIONAL

    def __post_init__(self) -> None:
        if not -1.0 <= self.morale <= 1.0:
            raise ValueError("morale must be between -1.0 and 1.0")


@dataclass
class Pawn:
    name: str
    acknowledges_role: bool
    skills: Set[str]
    authority: Set[str]
    assigned_territory: Set[str]
    capacity: int = 1
    active_load: int = 0

    def __post_init__(self) -> None:
        if not self.acknowledges_role:
            raise ValueError("A person cannot be deployed as a Pawn without informed acknowledgement.")
        if self.capacity < 1:
            raise ValueError("Pawn capacity must be at least 1.")
        if self.active_load < 0:
            raise ValueError("Pawn active load cannot be negative.")

    @property
    def saturated(self) -> bool:
        return self.active_load >= self.capacity


@dataclass(frozen=True)
class MoveRequest:
    pawn_name: str
    source: str
    target: str
    activation: Activation
    required_skill: str
    required_authority: str
    trigger: str


@dataclass(frozen=True)
class Event:
    sequence: int
    kind: str
    square_id: Optional[str]
    description: str


@dataclass
class BoardState:
    squares: Dict[str, SquareState]
    causal_links: Set[CausalLink] = field(default_factory=set)
    external_interfaces: Set[str] = field(default_factory=set)
    events: List[Event] = field(default_factory=list)

    def validate(self) -> None:
        if len(self.squares) != BOARD_SIZE:
            raise ValueError(f"64Δ requires exactly {BOARD_SIZE} mapped squares.")
        if sum(GOLDEN_ARCHITECTURE.values()) != BOARD_SIZE:
            raise AssertionError("Golden architecture must total 64.")

    def has_causal_path(self, source: str, target: str) -> bool:
        return any(link.source == source and link.target == target for link in self.causal_links)

    def record_event(self, kind: str, description: str, square_id: Optional[str] = None) -> Event:
        event = Event(len(self.events) + 1, kind, square_id, description)
        self.events.append(event)
        return event


def legal_pawn_move(board: BoardState, pawn: Pawn, request: MoveRequest) -> Tuple[bool, str]:
    """
    64Δ Law:
    A Pawn moves only when a real causal mechanism connects the source to the target,
    the Pawn has the capability and authority to act, a valid trigger exists, and
    finite human capacity remains.
    """
    if request.pawn_name != pawn.name:
        return False, "wrong pawn"

    if pawn.saturated:
        return False, "pawn saturated"

    if not request.trigger.strip():
        return False, "missing trigger"

    if request.required_skill not in pawn.skills:
        return False, "required skill absent"

    if request.required_authority not in pawn.authority:
        return False, "required authority absent"

    if not board.has_causal_path(request.source, request.target):
        return False, "no demonstrated causal mechanism"

    if request.activation is Activation.PROGRAMMED:
        return True, "legal programmed move"

    if request.activation is Activation.DISCRETIONARY:
        return True, "legal discretionary move within granted authority"

    return False, "unknown activation"


def deterministic_legal_targets(
    board: BoardState,
    pawn: Pawn,
    source: str,
    required_skill: str,
    required_authority: str,
) -> Tuple[str, ...]:
    """
    Identical state must produce identical legal options.
    Sorting is deliberate so callers receive a stable, auditable result.
    """
    if pawn.saturated:
        return ()

    if required_skill not in pawn.skills or required_authority not in pawn.authority:
        return ()

    targets = {
        link.target
        for link in board.causal_links
        if link.source == source
    }
    return tuple(sorted(targets))


def validate_golden_architecture(values: Mapping[str, int]) -> bool:
    required = set(GOLDEN_ARCHITECTURE)
    return set(values) == required and dict(values) == GOLDEN_ARCHITECTURE and sum(values.values()) == BOARD_SIZE
