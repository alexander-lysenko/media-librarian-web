import { BaseValidator, ValidationRule, ValidatorInterface } from "./validatiors";

interface NumericValidationRule extends ValidationRule {
  min?: number;
  max?: number;
  integerOnly?: boolean;
  integerErrorMsg?: string;
  tooBigErrorMsg?: string;
  tooSmallErrorMsg?: string;
}

// noinspection JSUnusedGlobalSymbols
export class NumberValidator extends BaseValidator implements ValidatorInterface {
  errorMessage = "This value should be a number";
  min?: number;
  max?: number;
  integerOnly?: boolean;
  tooSmallErrorMsg = "This value should not be less than {min}";
  tooBigErrorMsg = "This value should not be more than {max}";
  integerErrorMsg = "This value should be a whole number";

  constructor(rule: NumericValidationRule) {
    super(rule);
    rule.errorMessage && (this.errorMessage = rule.errorMessage);
    rule.integerErrorMsg && (this.integerErrorMsg = rule.integerErrorMsg);
    rule.tooBigErrorMsg && (this.tooBigErrorMsg = rule.tooBigErrorMsg);
    rule.tooSmallErrorMsg && (this.tooSmallErrorMsg = rule.tooSmallErrorMsg);
    this.min = rule.min;
    this.max = rule.max;
    this.integerOnly = rule.integerOnly;
  }

  validate(value: unknown): string | undefined {
    switch (true) {
      case typeof value !== "number":
        return this.errorMessage;
      case this.integerOnly && !Number.isInteger(value):
        return this.integerErrorMsg;
      case this.min && (value as number) < this.min:
        return this.tooSmallErrorMsg;
      case this.max && (value as number) > this.max:
        return this.tooBigErrorMsg;
    }
  }
}
