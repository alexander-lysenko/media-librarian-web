import { BaseValidator, ValidationRule, ValidatorInterface } from "./validatiors";

interface BooleanValidationRule extends ValidationRule {
  strict?: boolean;
}

// noinspection JSUnusedGlobalSymbols
export class BooleanValidator extends BaseValidator implements ValidatorInterface {
  errorMessage = "this value should be boolean";
  strict?: boolean;

  constructor(rule: BooleanValidationRule) {
    super(rule);
    rule.errorMessage && (this.errorMessage = rule.errorMessage);
    this.strict = rule.strict;
  }

  validate(value: unknown): string | undefined {
    if (this.strict && typeof value !== "boolean") {
      return this.errorMessage;
    }
  }
}
