import type { TurnstileInstance, TurnstileProps } from '@marsidev/react-turnstile';
import type { BaseSyntheticEvent, RefAttributes } from 'react';
import type { FieldValues, RegisterOptions, UseFormRegisterReturn, UseFormReturn } from 'react-hook-form';
import type { FieldPath } from 'react-hook-form';

export interface UseHookFormService<Form extends FieldValues = FieldValues> extends UseFormReturn<Form> {
  registerField: (fieldName: keyof Form) => UseFormRegisterReturn<FieldPath<Form>>;
  errors: UseFormReturn<Form>['formState']['errors'];
}

export interface UseFormService<Form extends FieldValues = FieldValues> {
  registerField: (fieldName: keyof Form) => UseFormRegisterReturn<FieldPath<Form>>;
  registerCaptcha?: () => RegisterCaptchaProps;
  handleSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  errors: UseFormReturn<Form>['formState']['errors'];
  dismissRootError: VoidFunction;
  isSubmitting: boolean;
}

export type FormValidationRules<Form extends FieldValues = FieldValues> = RegisterOptions<Form>;

export type RegisterCallback<Form extends FieldValues> = // prettier-ignore
  (fieldName: FieldPath<Form>) => UseFormRegisterReturn<FieldPath<Form>>;

export type RegisterCaptchaProps = Omit<TurnstileProps, 'siteKey'> & RefAttributes<TurnstileInstance | undefined>;
