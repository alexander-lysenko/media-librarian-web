import { debounce } from "lodash";
import {
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormTrigger,
} from "react-hook-form";

export const registerFieldWithDebounceValidation = <TFieldValues extends FieldValues>(
  name: FieldPath<TFieldValues>,
  delay: number,
  trigger: UseFormTrigger<TFieldValues>,
  register: UseFormRegister<TFieldValues>,
  options?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>,
) => {
  const useFormRegisterReturn: UseFormRegisterReturn = register(name, options);
  const { onChange } = useFormRegisterReturn;
  const debouncedValidate = debounce(() => {
    console.log(name, delay);
    trigger(name);
  }, delay);
  return {
    ...useFormRegisterReturn,
    onChange: (e: any) => {
      onChange(e);
      debouncedValidate();
    },
  };
};
