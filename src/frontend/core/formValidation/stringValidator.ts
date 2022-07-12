import { BaseValidator, ValidationRule, ValidatorInterface } from "./validatiors";

interface StringValidationRule extends ValidationRule {
  minLength?: number;
  maxLength?: number;
  exactLength?: number;
  tooShortErrorMsg?: string;
  tooLongErrorMsg?: string;
  notEqualErrorMsg?: string;
}

// noinspection JSUnusedGlobalSymbols
export class StringValidator extends BaseValidator implements ValidatorInterface {
  errorMessage = "This value should be a string";
  minLength?: number;
  maxLength?: number;
  exactLength?: number;
  tooShortErrorMsg = "This value should be contain at least {minLength} characters";
  tooLongErrorMsg = "This value should not contain more than {maxLength} characters";
  notEqualErrorMsg = "This value should contain {exactLength} characters";

  constructor(rule: StringValidationRule) {
    super(rule);
    rule.errorMessage && (this.errorMessage = rule.errorMessage);
    rule.tooShortErrorMsg && (this.tooShortErrorMsg = rule.tooShortErrorMsg);
    rule.tooLongErrorMsg && (this.tooLongErrorMsg = rule.tooLongErrorMsg);
    rule.notEqualErrorMsg && (this.notEqualErrorMsg = rule.notEqualErrorMsg);
    this.minLength = rule.minLength;
    this.maxLength = rule.maxLength;
    this.exactLength = rule.exactLength;
  }

  validate(value: unknown): string | undefined {
    switch (true) {
      case typeof value !== "string":
        return this.errorMessage;
      case this.minLength && (value as string).length < this.minLength:
        return this.tooShortErrorMsg;
      case this.maxLength && (value as string).length > this.maxLength:
        return this.tooLongErrorMsg;
      case this.exactLength && (value as string).length !== this.exactLength:
        return this.notEqualErrorMsg;
    }
  }
}
