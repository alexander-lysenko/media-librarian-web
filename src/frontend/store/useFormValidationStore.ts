import create from "zustand";

import { ValidatorInterface } from "../core/formValidation/validatiors";

export type ValuesList = Record<string, unknown>;

interface FormValidationState {
  values: ValuesList;
  rules: Record<keyof ValuesList, ValidatorInterface[]>;
  errors: Record<keyof ValuesList, string | undefined>;
  isFormValid: boolean;
  setValue: (property: string, value: unknown) => void;
  setRule: (property: keyof ValuesList, rules: ValidatorInterface[]) => void;
  setError: (property: keyof ValuesList, errorMessage: string) => void;
  getValue: (property: keyof ValuesList) => unknown;
  getRule: (property: keyof ValuesList) => ValidatorInterface[];
  getError: (property: keyof ValuesList) => string | undefined;
  setFormAsInvalid: () => void;
  resetFormAsValid: () => void;
}

export const useFormValidationStore = create<FormValidationState>((set, get) => ({
  values: get()?.values || {},
  rules: get()?.rules || {},
  errors: get()?.errors || {},
  isFormValid: true,
  setValue: (property, value) => set(() => ({ values: { ...get().values, [property]: value } })),
  setRule: (property, rules) => set(() => ({ rules: { ...get().rules, [property]: rules } })),
  setError: (property, errorMessage) => set(() => ({ errors: { ...get().errors, [property]: errorMessage } })),
  getValue: (property) => get()?.values[property],
  getRule: (property) => get()?.rules[property],
  getError: (property) => get()?.errors[property],
  setFormAsInvalid: () => set(() => ({ isFormValid: false })),
  resetFormAsValid: () => set(() => ({ isFormValid: true })),
}));
