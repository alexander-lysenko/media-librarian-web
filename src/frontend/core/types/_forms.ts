import type { TurnstileInstance, TurnstileProps } from '@marsidev/react-turnstile';
import type { BaseSyntheticEvent, RefAttributes, SyntheticEvent } from 'react';
import type {
  ArrayPath,
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFieldArrayReturn,
  UseFormRegisterReturn,
  UseFormReturn,
} from 'react-hook-form';

export interface UseFormService<Form extends FieldValues = FieldValues> {
  registerField: (fieldName: keyof Form) => UseFormRegisterReturn<FieldPath<Form>>;
  handleSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  errors: UseFormReturn<Form>['formState']['errors'];
  isSubmitting: boolean;
  dismissRootError?: VoidFunction;
  registerCaptcha?: () => RegisterCaptchaProps;
  handleClose?: (event: SyntheticEvent | Event, reason?: string) => boolean | undefined;
  handleAddNewField?: VoidFunction;
}

export interface UseFormWatchService<Form extends FieldValues = FieldValues> {
  watchingFields: unknown;
  handleAddNewField: VoidFunction;
  appendField: UseFieldArrayReturn<Form, ArrayPath<Form>>['append'];
  removeField: UseFieldArrayReturn<Form, ArrayPath<Form>>['remove'];
}

export type FormValidationRules<Form extends FieldValues = FieldValues> = RegisterOptions<Form>;

export type RegisterCallback<Form extends FieldValues> = // prettier-ignore
  (fieldName: FieldPath<Form>) => UseFormRegisterReturn<FieldPath<Form>>;

export type RegisterCaptchaProps = Omit<TurnstileProps, 'siteKey'> & RefAttributes<TurnstileInstance | undefined>;
