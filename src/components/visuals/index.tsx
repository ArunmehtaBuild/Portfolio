import type { ComponentType } from "react";
import { AttackTimeline } from "./AttackTimeline";
import { BudgetBlitz } from "./BudgetBlitz";
import { Constellation } from "./Constellation";
import { DepthLayers } from "./DepthLayers";
import { PatchDiff } from "./PatchDiff";

// One illustration per region, keyed by slug.
export const visuals: Record<string, ComponentType> = {
  nexera: Constellation,
  okeanos: DepthLayers,
  netwm: AttackTimeline,
  finstar: BudgetBlitz,
  onyx: PatchDiff,
};
