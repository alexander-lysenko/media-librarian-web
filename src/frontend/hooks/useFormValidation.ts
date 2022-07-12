import { ChangeEvent, FocusEvent, useMemo } from "react";

import { useFormValidationStore, ValuesList } from "../store/useFormValidationStore";

export const useFormValidation = () => {
  const [getValue, setValue] = useFormValidationStore((state) => [state.getValue, state.setValue]);
  const [getRule, setRule] = useFormValidationStore((state) => [state.getRule, state.setRule]);
  const [errors, setError] = useFormValidationStore((state) => [state.errors, state.setError]);

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
            break;
          }
        }

        setError(property, errorMessage as string);
      },
    [getRule, setError, getValue],
  );

  // Exportable methods

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setValue(event.target.name, event.target.value);
    validate(event.target.name);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    event.preventDefault();

    setValue(event.target.name, event.target.value);
    validate(event.target.name);
  };

  return { errors, setValidationRule: setRule, handleChange, handleBlur };
};
