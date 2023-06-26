import { forwardRef } from "react";
import { Control, FieldValues, UseFormSetValue } from "react-hook-form";

import { LibraryElementEnum } from "../../core/enums";
import { InputCustomProps } from "../../core/types";
import { CheckBoxedInput } from "./CheckBoxedInput";
import { ColoredRatingInput } from "./ColoredRatingInput";
import { DateTimeInput } from "./DateTimeInput";
import { PriorityInput } from "./PriorityInput";
import { TextInputMultiLine } from "./TextInputMultiLine";
import { TextInputSingleLine } from "./TextInputSingleLine";
import { UrlInputLine } from "./UrlInputLine";

type LibraryInputProps = InputCustomProps & {
  control: Control;
  setValue: UseFormSetValue<FieldValues>;
  type: keyof typeof LibraryElementEnum;
};

/**
 * Auto select input controls into Library Item Form
 * based on library schema object
 *
 * WARNING: The default values of the inputs (both initial and pre-filled)
 * must be controlled by React Hook Form
 */
export const LibraryItemInput = forwardRef((props: LibraryInputProps, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, control, ...inputProps } = props;

  switch (props.type) {
    case "line":
    default:
      return <TextInputSingleLine {...inputProps} ref={ref} />;
    case "text":
      return <TextInputMultiLine {...inputProps} ref={ref} />;
    case "priority":
      return <PriorityInput {...inputProps} control={control} />;
    case "url":
      return <UrlInputLine {...inputProps} ref={ref} />;
    case "switch":
      return <CheckBoxedInput {...inputProps} control={control} />;
    case "date":
      return <DateTimeInput {...inputProps} control={control} type="date" />;
    case "datetime":
      return <DateTimeInput {...inputProps} control={control} type="datetime" />;
    case "rating5":
      return <ColoredRatingInput {...inputProps} control={control} size={5} precision={1} />;
    case "rating5precision":
      return <ColoredRatingInput {...inputProps} control={control} size={5} precision={0.5} />;
    case "rating10":
      return <ColoredRatingInput {...inputProps} control={control} size={10} precision={1} />;
    case "rating10precision":
      return <ColoredRatingInput {...inputProps} control={control} size={10} precision={0.5} />;
  }
});
