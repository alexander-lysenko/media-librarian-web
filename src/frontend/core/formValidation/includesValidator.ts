import { BaseValidator, ValidationRule, ValidatorInterface } from "./validatiors";

interface RangeValidationRule extends ValidationRule {
  range: Array<never>;
  notIn?: boolean;
  strict?: boolean;
}

// noinspection JSUnusedGlobalSymbols
export class IncludesValidator extends BaseValidator implements ValidatorInterface {
  errorMessage = "";
  range: Array<never>;
  notIn: boolean;
  strict: boolean;

  constructor(rule: RangeValidationRule) {
    super(rule);
    rule.errorMessage && (this.errorMessage = rule.errorMessage);
    this.range = rule.range;
    this.notIn = rule.notIn || false;
    this.strict = rule.strict || false;
  }

  validate(value: unknown): string | undefined {
    // Standard validation
    if (this.range.includes(value as never)) {
      const index = this.range.findIndex(value as never);
      // Strict validation
      if (this.strict && typeof value !== typeof this.range[index]) {
        return this.errorMessage;
      }
    } else {
      return this.errorMessage;
    }
  }
}
