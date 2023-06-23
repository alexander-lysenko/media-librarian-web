import { forwardRef, JSX } from "react";

import { LibraryInputProps } from "../../core/types";
import { CheckBoxedInput } from "./CheckBoxedInput";
import { ColoredRatingInput } from "./ColoredRatingInput";
import { DateTimeInput } from "./DateTimeInput";
import { PriorityInput } from "./PriorityInput";
import { TextInputMultiLine } from "./TextInputMultiLine";
import { TextInputSingleLine } from "./TextInputSingleLine";
import { UrlInputLine } from "./UrlInputLine";

export const LibraryItemInput = forwardRef((props: LibraryInputProps, ref) => {
  switch (props.variant) {
    case "line":
    default:
      return <TextInputSingleLine {...props} ref={ref} />;
    case "text":
      return <TextInputMultiLine {...props} ref={ref} />;
    case "date":
      return <DateTimeInput {...props} type="date" ref={ref} />;
    case "datetime":
      return <DateTimeInput {...props} type="datetime-local" ref={ref} />;
    case "rating5":
      return <ColoredRatingInput {...props} size={5} precision={1} ref={ref} />;
    case "rating5precision":
      return <ColoredRatingInput {...props} size={5} precision={0.5} ref={ref} />;
    case "rating10":
      return <ColoredRatingInput {...props} size={10} precision={1} ref={ref} />;
    case "rating10precision":
      return <ColoredRatingInput {...props} size={10} precision={0.5} ref={ref} />;
    case "priority":
      return <PriorityInput {...props} ref={ref} />;
    case "switch":
      return <CheckBoxedInput {...props} ref={ref} />;
    case "url":
      return <UrlInputLine {...props} ref={ref} />;
  }
});
