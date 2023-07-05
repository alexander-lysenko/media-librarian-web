import { Typography } from "@mui/material";
import { JSX, memo, MemoExoticComponent } from "react";

import { LibraryElementEnum } from "../../core/enums";
import { ColoredRating } from "./ColoredRating";


type InlineComponent = ({ value, truncate }: LibraryItemCellProps) => JSX.Element;
type InlineComponentMemoized = MemoExoticComponent<InlineComponent>;

export type LibraryInlineComponent = InlineComponent | InlineComponentMemoized;

const Rating5Stars = memo(({ value }: LibraryItemCellProps) => (
  <ColoredRating value={value} size={5} readOnly precision={0.5} />
));
const Rating5StarsPrecision = memo(({ value }: LibraryItemCellProps) => (
  <ColoredRating value={value} size={5} readOnly precision={0.5} />
));
const Rating10Stars = memo(({ value }: LibraryItemCellProps) => <ColoredRating value={value} size={10} readOnly />);
const Rating10StarsPrecision = memo(({ value }: LibraryItemCellProps) => (
  <ColoredRating value={value} size={10} readOnly precision={0.5} />
));
const TextLine = memo(({ value, truncate }: LibraryItemCellProps) => (
  <Typography variant="body2" noWrap={truncate} children={value} />
));
const DateLine = memo(({ value, truncate }: LibraryItemCellProps) => (
  <Typography variant="body2" noWrap={truncate} children={value} textAlign="end" />
));

const LibraryInlineComponents: Record<LibraryElementEnum, LibraryInlineComponent> = {
  line: TextLine,
  text: TextLine,
  date: DateLine,
  datetime: DateLine,
  rating5: Rating5Stars,
  rating5precision: Rating5StarsPrecision,
  rating10: Rating10Stars,
  rating10precision: Rating10StarsPrecision,
  priority: () => <></>,
  switch: () => <></>,
};

export const LibraryItemCell = ({ type, value, truncate }: LibraryItemCellProps) => {
  switch (type) {
    case "line":
      return <Typography variant="body2" noWrap={truncate} children={value} />;
    case "text":
    case "url":
    case "date":
    case "datetime":
    case "rating5":
    case "rating5precision":
    case "rating10":
    case "rating10precision":
    case "priority":
    case "switch":
      return <Typography variant="body2" children={value} />;
  }
};
