import unittest

from src.sixty4delta.law import (
    Activation,
    BoardState,
    CausalLink,
    GOLDEN_ARCHITECTURE,
    MoveRequest,
    Pawn,
    SquareState,
    legal_pawn_move,
    validate_golden_architecture,
)


class CoreLawTests(unittest.TestCase):
    def make_board(self):
        squares = {
            f"S{i:02d}": SquareState(f"S{i:02d}", f"Operation {i}", morale=0.0)
            for i in range(1, 65)
        }
        board = BoardState(
            squares=squares,
            causal_links={
                CausalLink("S01", "S02", "trained response changes the downstream state")
            },
        )
        board.validate()
        return board

    def test_golden_architecture_is_law(self):
        self.assertEqual(sum(GOLDEN_ARCHITECTURE.values()), 64)
        self.assertTrue(validate_golden_architecture(GOLDEN_ARCHITECTURE))

    def test_uninformed_person_cannot_be_a_pawn(self):
        with self.assertRaises(ValueError):
            Pawn("Operator A", False, {"inspect"}, {"stop"}, {"S01"})

    def test_move_requires_causality(self):
        board = self.make_board()
        pawn = Pawn("Operator A", True, {"inspect"}, {"stop"}, {"S01"})
        req = MoveRequest(
            "Operator A", "S01", "S03", Activation.PROGRAMMED,
            "inspect", "stop", "inspection trigger"
        )
        legal, reason = legal_pawn_move(board, pawn, req)
        self.assertFalse(legal)
        self.assertIn("causal", reason)

    def test_programmed_move_can_be_legal(self):
        board = self.make_board()
        pawn = Pawn("Operator A", True, {"inspect"}, {"stop"}, {"S01"})
        req = MoveRequest(
            "Operator A", "S01", "S02", Activation.PROGRAMMED,
            "inspect", "stop", "inspection trigger"
        )
        self.assertEqual(legal_pawn_move(board, pawn, req), (True, "legal programmed move"))

    def test_saturation_blocks_move(self):
        board = self.make_board()
        pawn = Pawn("Operator A", True, {"inspect"}, {"stop"}, {"S01"}, capacity=1, active_load=1)
        req = MoveRequest(
            "Operator A", "S01", "S02", Activation.DISCRETIONARY,
            "inspect", "stop", "abnormal condition recognized"
        )
        self.assertEqual(legal_pawn_move(board, pawn, req), (False, "pawn saturated"))


if __name__ == "__main__":
    unittest.main()
