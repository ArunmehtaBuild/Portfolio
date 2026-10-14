import type { ComponentType } from "react";
import { AttackTimeline } from "./AttackTimeline";
import { BudgetBlitz } from "./BudgetBlitz";
import { DepthLayers } from "./DepthLayers";
import { IssueTracker } from "./IssueTracker";
import { PatchDiff } from "./PatchDiff";

// One illustration per region, keyed by slug.
export const visuals: Record<string, ComponentType> = {
  okeanos: DepthLayers,
  netwm: AttackTimeline,
  finstar: BudgetBlitz,
  onyx: PatchDiff,
  "civic-setu": IssueTracker,
};
