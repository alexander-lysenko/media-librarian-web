import type { TurnstileInstance, TurnstileProps } from '@marsidev/react-turnstile';
import type { RefAttributes } from 'react';
import type { FieldPath, FieldValues, RegisterOptions, UseFormRegisterReturn } from 'react-hook-form';

export type FormValidationRules<
  Form extends FieldValues = FieldValues,
  FieldName extends FieldPath<Form> = FieldPath<Form>,
> = RegisterOptions<Form, FieldName>;

export type RegisterCallback<Form extends FieldValues> = // prettier-ignore
  (fieldName: FieldPath<Form>) => UseFormRegisterReturn<FieldPath<Form>>;

export type RegisterCaptchaProps = Omit<TurnstileProps, 'siteKey'> & RefAttributes<TurnstileInstance | undefined>;
