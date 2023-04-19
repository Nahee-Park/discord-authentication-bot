export type HoldingType =
  | 'NO_ROLE'
  | 'SPORTS_FIGURE_HOLDER'
  | 'DUMBBELL_FIGURE_HOLDER'
  | 'BOTH_HOLDER';

export const getHoldingType = (sportsNftCount: number, dumbellNftCount: number): HoldingType => {
  if (sportsNftCount === 0 && dumbellNftCount === 0) {
    return 'NO_ROLE';
  } else if (dumbellNftCount === 0 && sportsNftCount >= 1) {
    return 'SPORTS_FIGURE_HOLDER';
  } else if (sportsNftCount === 0 && dumbellNftCount >= 1) {
    return 'DUMBBELL_FIGURE_HOLDER';
  } else {
    return 'BOTH_HOLDER';
  }
};
