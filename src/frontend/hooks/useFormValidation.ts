import { ChangeEvent, FocusEvent, FormEvent, useMemo } from "react";

import { useFormValidationStore, ValuesList } from "../store/useFormValidationStore";

export const useFormValidation = () => {
  const {
    values,
    errors,
    isFormValid,
    getValue,
    setValue,
    getRule,
    setRule,
    setError,
    setFormAsInvalid,
    resetFormAsValid,
  } = useFormValidationStore((state) => state);

  // Internal methods

  const validate = useMemo(
    () =>
      (property: keyof ValuesList): void => {
        let errorMessage = undefined;
        const value = getValue(property);
        const rules = getRule(property) || [];

        for (const rule of rules) {
          errorMessage = rule.validate(value);
          if (errorMessage !== undefined) {
            setFormAsInvalid();
            break;
          }
        }

        setError(property, errorMessage as string);
      },
    [getRule, setError, getValue, setFormAsInvalid],
  );

  // Exportable methods

  const validateOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setValue(event.target.name, event.target.value);
    validate(event.target.name);
  };

  const validateOnBlur = (event: FocusEvent<HTMLInputElement>) => {
    event.preventDefault();

    setValue(event.target.name, event.target.value);
    validate(event.target.name);
  };

  const validateOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    // doesn't work
    for (const name in Object.keys(values)) {
      validate(name);
    }

    if (Object.values(errors).filter((item) => item !== undefined).length === 0) {
      resetFormAsValid();
    } else {
      setFormAsInvalid();
      event.preventDefault();
    }
  };

  return {
    errors,
    isFormValid,
    setValidationRule: setRule,
    validateOnChange,
    validateOnBlur,
    validateOnSubmit,
  };
};
