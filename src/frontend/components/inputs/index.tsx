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

export const LibraryItemInput = forwardRef((props: LibraryInputProps, ref) => {
  const { control, setValue, ...inputProps } = props;

  switch (props.type) {
    case "line":
    default:
      return <TextInputSingleLine {...inputProps} ref={ref} />;
    case "text":
      return <TextInputMultiLine {...inputProps} ref={ref} />;
    case "date":
      return <DateTimeInput {...inputProps} type="date" ref={ref} />;
    case "datetime":
      return <DateTimeInput {...inputProps} type="datetime-local" ref={ref} />;
    case "rating5":
      return <ColoredRatingInput {...props} setValue={setValue} size={5} precision={1} ref={ref} />;
    case "rating5precision":
      return <ColoredRatingInput {...props} setValue={setValue} size={5} precision={0.5} ref={ref} />;
    case "rating10":
      return <ColoredRatingInput {...props} setValue={setValue} size={10} precision={1} ref={ref} />;
    case "rating10precision":
      return <ColoredRatingInput {...props} setValue={setValue} size={10} precision={0.5} ref={ref} />;
    case "priority":
      return <PriorityInput {...inputProps} ref={ref} />;
    case "switch":
      return <CheckBoxedInput {...inputProps} control={control} ref={ref} />;
    case "url":
      return <UrlInputLine {...inputProps} ref={ref} />;
  }
});
