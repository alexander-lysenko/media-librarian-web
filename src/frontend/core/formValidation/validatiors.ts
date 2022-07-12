/**
 * Basic validation interface
 */
export interface ValidatorInterface {
  /**
   * A standard error message when validation fails
   */
  errorMessage: string;

  /**
   * The validation is run only when there is a positive result
   */
  validateWhen?: () => boolean;

  /**
   * The validation is disabled only when there is a positive result
   */
  validateExcept?: () => boolean;

  /**
   * Validation entry point
   */
  validate: (value: unknown) => string | undefined;
}

/**
 * Basic interface of a validation rule to configure a Validator instance
 */
export interface ValidationRule {
  /**
   * A custom error message when validation fails. If undefined, the standard error message will be used
   */
  errorMessage?: string;

  /**
   * A payload to run validation for a specific case only
   */
  validateWhen?: () => boolean;

  /**
   * A payload to disable validation for a specific case only
   */
  validateExcept?: () => boolean;
}

/**
 * Basic validator class template. Any custom validator must extend it
 */
export abstract class BaseValidator implements ValidatorInterface {
  /**
   * A standard error message when validation fails
   */
  abstract errorMessage: string;

  /**
   * A payload to run validation for a specific case only
   * @returns {boolean}
   */
  validateWhen?: () => boolean;

  /**
   * A payload to disable validation for a specific case only
   * @returns {boolean}
   */
  validateExcept?: () => boolean;

  /**
   * Constructor for the validation instance
   * @param {ValidationRule} rule - The set of properties to configure the validation instance
   */
  protected constructor(rule: ValidationRule) {
    this.validateWhen = rule.validateWhen;
    this.validateExcept = rule.validateExcept;
  }

  /**
   * Main payload for a validation instance
   * @param {unknown} value - The value to be validated
   * @returns {string | undefined} - An error message when validation failed, undefined - when validation passed.
   */
  public abstract validate(value: unknown): string | undefined;
}
