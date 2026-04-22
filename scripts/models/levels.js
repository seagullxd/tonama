import { COLOUR } from "./entity-colours.js";

export const LevelStatus = {
  notStarted: 0,
  inProgress: 1,
  completed: 2,
}

export const LevelStatusToColour = {
  [LevelStatus.notStarted]: COLOUR.FRESH_SKY,
  [LevelStatus.inProgress]: COLOUR.AMBER_FLAME,
  [LevelStatus.completed]: COLOUR.JUNGLE_GREEN,
}