import { ChangeEvent, FocusEvent, useRef, useState } from "react";

import { Validator } from "../core/formValidation/validatior";

type ValuesList = Record<string, unknown>;
type RulesList = Record<keyof ValuesList, Validator[]>;
type ErrorsList = Record<keyof ValuesList, string | undefined>;

export const useFormValidation = () => {
  const [values, setValues] = useState({} as ValuesList);
  const [rules, setRules] = useState({} as RulesList);
  const [errors, setErrors] = useState({} as ErrorsList);

  // Internal methods

  const validate = (property: keyof ValuesList): void => {
    const value = values[property];
    console.log("Validate:", value);
    // for (rule in rules[property]) {
    //   if ()
    // }
    //
    const errorMessage = value !== "" ? "validated" : undefined;
    setErrors({ ...errors, [property]: errorMessage });
  };

  // Exportable methods

  const setValidationRule = (property: string, ruleList: Validator[]) => {
    setRules({ ...rules, [property]: ruleList });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    console.log("change", { [event.target.name]: event.target.value });

    setValues({ ...values, [event.target.name]: event.target.value });
    validate(event.target.name);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    console.log("blur", { [event.target.name]: event.target.value });

    setValues({ ...values, [event.target.name]: event.target.value });
    validate(event.target.name);
  };

  return { values, errors, setValidationRule, handleChange, handleBlur };
};
