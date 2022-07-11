import { ValidationRule, Validator } from "./validatiors";

interface RequiredValidationRule extends ValidationRule {
  desiredValue?: never;
}

export class Required implements Validator {
  public errorMessage;
  public desiredValue?: never;
  public validateOn?: () => boolean;

  constructor(props: RequiredValidationRule) {
    this.errorMessage = props.errorMessage || "Required";
    this.desiredValue = props.desiredValue;
    this.validateOn = props.on;
  }

  public validate(value: unknown) {
    if (!value) {
      return this.errorMessage;
    }

    if (this.desiredValue && value !== this.desiredValue) {
      return this.errorMessage;
    }
  }
}
