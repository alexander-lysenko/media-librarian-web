import { BaseValidator, ValidationRule, ValidatorInterface } from "./validatiors";

interface RequiredValidationRule extends ValidationRule {
  desiredValue?: never;
}

// noinspection JSUnusedGlobalSymbols
export class RequiredValidator extends BaseValidator implements ValidatorInterface {
  errorMessage = "Please fill out this field";
  desiredValue?: never;

  constructor(rule: RequiredValidationRule) {
    super(rule);
    rule.errorMessage && (this.errorMessage = rule.errorMessage);
    this.desiredValue = rule.desiredValue;
  }

  validate(value: unknown) {
    if (!value) {
      return this.errorMessage;
    }

    if (this.desiredValue && value !== this.desiredValue) {
      return this.errorMessage;
    }
  }
}
