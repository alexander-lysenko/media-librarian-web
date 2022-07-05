export interface PropValuePair {
  label: string;
  value: unknown;
}

export interface Validator {
  errorMessage?: string;
  on?: () => boolean;
  except?: () => boolean;
}

interface BooleanValidator extends Validator {
  strict?: boolean;
}

interface NumberValidator extends Validator {
  min?: number;
  max?: number;
  integerOnly?: boolean;
  integerErrorMsg?: string;
  tooBigErrorMsg?: string;
  tooSmallErrorMsg?: string;
}

interface RangeValidator extends Validator {
  range: Array<never>;
  notIn: boolean;
  strict: boolean;
}

interface RequiredValidator extends Validator {
  desiredValue?: never;
}

interface StringValidator extends Validator {
  minLength?: number;
  maxLength?: number;
  exactLength: number;
  tooShortErrorMsg: string;
  tooLongErrorMsg: string;
  notEqualErrorMsg: string;
}

export class FormValidation {
  label: PropValuePair["label"];
  value: PropValuePair["value"];
  errorMessage: string | undefined;

  constructor({ label, value }: PropValuePair) {
    this.label = label;
    this.value = value;
    this.errorMessage = undefined;

    return this;
  }

  public boolean(rules: BooleanValidator): this {
    if (rules.strict && typeof this.value !== "boolean") {
      this.errorMessage = rules.errorMessage;
    }

    return this;
  }

  public number(rules: NumberValidator): this {
    switch (true) {
      case typeof this.value !== "number":
        this.errorMessage = rules.errorMessage;
        break;
      case rules.integerOnly && !Number.isInteger(this.value):
        this.errorMessage = rules.integerErrorMsg;
        break;
      case rules.min && (this.value as number) < rules.min:
        this.errorMessage = rules.tooSmallErrorMsg;
        break;
      case rules.max && (this.value as number) > rules.max:
        this.errorMessage = rules.tooBigErrorMsg;
        break;
    }

    return this;
  }

  public oneOf(rules: RangeValidator): this {
    if (rules.range.includes(this.value as never)) {
      const index = rules.range.findIndex(this.value as never);
      if (typeof this.value !== typeof rules.range[index]) {
        this.errorMessage = rules.errorMessage;
      }
    } else {
      this.errorMessage = rules.errorMessage;
    }

    return this;
  }

  public required(rules: RequiredValidator): this {
    if (this.value) {
      this.errorMessage = rules.errorMessage;
    }

    return this;
  }

  public string(rules: StringValidator): this {
    switch (true) {
      case typeof this.value !== "string":
        this.errorMessage = rules.errorMessage;
        break;
      case rules.minLength && (this.value as string).length < rules.minLength:
        this.errorMessage = rules.tooShortErrorMsg;
        break;
      case rules.maxLength && (this.value as string).length > rules.maxLength:
        this.errorMessage = rules.tooLongErrorMsg;
        break;
      case rules.exactLength && (this.value as string).length !== rules.exactLength:
        this.errorMessage = rules.notEqualErrorMsg;
        break;
    }

    return this;
  }
}
