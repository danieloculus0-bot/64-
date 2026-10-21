# 64Δ | Playable Facility Operations Board

**Move the pieces. See what changed. Find what the timeclock missed.**

64Δ is evolving from a chess-adjacent operational research prototype into a **facility digital twin** for workforce positioning, machine assignments, activity evidence, timeclock reconciliation and management what-if planning.

**Pawn** = person. **Square** = operating area. **Move** = actual or proposed placement. **Assets and variables** = machines, work, constraints and supporting evidence.

## Current implementation (October 20, 2026)

Status: **browser proof of concept, not production HR, timekeeping, payroll or ERP software**.

The existing static 8×8 board, map overlay, movable Pawns and Python causal-law research remain intact. The new facility.js extension supports:

- Facility map overlay with opacity, scaling, positioning and locking.
- Named movable Pawns, using tap/click movement and desktop drag/drop.
- Equipment on squares as Asset variables, plus square operating states.
- **Scenario / what-if mode:** alternative positions do not change observed locations or create activity records.
- **Manager-observed mode:** a manual movement closes the previous area session, starts another, and creates a timestamped event.
- Sessions with employee, location, machine where uniquely identified, timestamps and event source.
- CSV timeclock import, separate clocked-hour totals, and overlap-based reconciliation candidates.
- Reported completed units and standard minutes per unit with a provisional earned-standard/time-in-area ratio.
- Browser-local save, JSON import/export and event ledger.

A manager can therefore move pieces to explore coverage, or explicitly record where someone was observed, including when the official timeclock lacks a corresponding record. **An observed location is not proof of actual paid work and never creates a payroll punch.** Discrepancies are review items.

### Run

Open index.html in a browser with facility.js alongside it. The prototype is client-side and needs no backend. Use a fictional or non-sensitive facility map, add machines with the Asset variable type, and add players. Switch modes before moving pieces.

Clock-import CSV requires these headers:

    employee,clock_in,clock_out
    Test Operator,2026-10-20T08:00:00-05:00,2026-10-20T16:00:00-05:00

Employee matching currently uses the exact displayed name, and clock intervals must overlap observed location sessions. Timestamps with explicit timezone offsets are recommended. All clock imports are read-only within the application and remain in browser data or exported JSON.

### Interpretation of the indicators

| Metric | Meaning | Limitation |
| --- | --- | --- |
| Manager-observed hours | Elapsed time recorded between manually reported placements | Approximate area occupancy, not verified work or paid hours |
| Imported clock hours | Sum of user-imported timeclock intervals | Only as complete as the imported CSV |
| Sessions lacking clock match | Sessions without overlapping clock interval for the same name | Reconciliation candidates, not confirmed missing punches |
| Provisional standard-time ratio | Reported units × entered standard minutes / observed time | Not validated productivity or efficiency |

A production implementation must align the employee, job, machine, work order, shift, standards, breaks and source evidence before computing actual utilization or efficiency. Presence is not performance.

## Target facility experience

Management should be able to click a machine to inspect occupancy and qualified coverage, or click an employee to inspect assignments and evidence-backed machine time. In a separate sandbox, management can move employees between stations to compare staffing, throughput constraints, training eligibility and projected bottlenecks.

The longer-term facility view can surface weighted compliance training, overdue corrective actions, equipment maintenance, quality trends, production utilization and operational risk. A serious safety blocker should stay visible even if an overall facility score is otherwise healthy.

## Intended integration boundaries

- **JERP / ERP:** source jobs, work orders, shift and labor transactions, employee IDs, timeclock and production records.
- **64Δ:** playable spatial operational model, evidence reconciliation, placements, what-if scenarios and explainable scoring.
- **BEAN:** interpretation, context-driven recommendations, variance investigation, and later low-priority learning.
- **Axiom modules / PM-Tracker / quality tools:** shared UI links, qualifications, maintenance and quality signals.

These are **proposed integrations**, not existing working connections.

## HR privacy and correctness

HR may eventually need access to pay, PTO, attendance, training and confidential personnel records. Such records require separate authorization, logging and retention controls. Bereavement, morale and sensitive personal circumstances must not be published on a general facility board or automatically turned into adverse employee scoring.

This repository is public and the prototype has no enterprise authentication or secure multi-user backend. **Do not publish real employee identities, compensation, payroll records or confidential HR data in the repository or a public demo.**

Never silently convert hypothetical movements, unverified observations or inferred occupancy into clocked work, payroll entries, disciplinary conclusions or legal compliance findings.

## Preserved research

The original chess-adjacent research, Python causal movement law, tests and doctrine remain in src/sixty4delta/, tests/ and doctrine/. The browser does not enforce the independent Python movement law, and its unconstrained movement is intentional for the current model.

- [Archived README immediately before facility pivot](docs/archive/README_2026-10-20_pre_facility_pivot.md)
- [Earlier full concept README](docs/archive/README_2026-10-20_before_refresh.md)

## Build next

1. Verify board behavior on desktop and touch, scenario isolation, event persistence, CSV import and JSON roundtrips.
2. Define stable employee, facility, job, equipment, shift, event and provenance IDs.
3. Add a private backend and first read-only ERP/timeclock adapter, without overriding authoritative records.
4. Add machine/job-level actual production and labor efficiency from validated inputs.
5. Add source-aware reconciliation workflows and configurable facility risk/compliance scores.
6. Build secure role-specific HR views before allowing any sensitive human data into the system.

**Design law:** The board must remain as easy to use as moving game pieces, while the underlying data must distinguish simulated, observed, imported and verified facts.
