/**
 * Mutual Funds Account Creation - Types & Validation
 * Re-exports & Aliases for clean architectural naming
 */
export * from "./bse-star-validation";
export {
  type BseStarAccountOpeningInput as MutualFundAccountOpeningInput,
  type BseStarNominee as MutualFundNominee,
  type BseStarFileMeta as MutualFundFileMeta,
  validateBseStarAccountOpening as validateMutualFundAccountOpening,
} from "./bse-star-validation";

