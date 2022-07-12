import { BaseValidator, ValidationRule, ValidatorInterface } from "./validatiors";

interface EmailValidationRule extends ValidationRule {
  pattern?: RegExp;
}

// noinspection JSUnusedGlobalSymbols
export class EmailValidator extends BaseValidator implements ValidatorInterface {
  errorMessage = "This email address is not valid";
  pattern = /^[A-Z0-9._%+-]+@(?:[A-Z0-9]+[.-])+[A-Z]{2,}$/i;

  constructor(rule: EmailValidationRule) {
    super(rule);
    rule.errorMessage && (this.errorMessage = rule.errorMessage);
    // rule.pattern && (this.pattern = rule.pattern);
  }

  validate(value: unknown): string | undefined {
    switch (false) {
      case new RegExp(this.pattern).test(value as string):
        return this.errorMessage;
    }
  }
}
