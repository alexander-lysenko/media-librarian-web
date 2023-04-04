import { Typography } from "@mui/material";
import React, { MemoExoticComponent } from "react";

import { LibraryElementEnum } from "../../core/enums";
import { ColoredRating } from "./ColoredRating";

interface LibraryItemComponentProps {
  value: never;
  truncate?: boolean;
}

type InlineComponent = ({ value, truncate }: LibraryItemComponentProps) => JSX.Element;
type InlineComponentMemoized = MemoExoticComponent<InlineComponent>;

export type LibraryInlineComponent = InlineComponent | InlineComponentMemoized;

const Rating5Stars = React.memo(({ value }: LibraryItemComponentProps) => (
  <ColoredRating value={value} size={5} readOnly precision={0.5} />
));
const Rating5StarsPrecision = React.memo(({ value }: LibraryItemComponentProps) => (
  <ColoredRating value={value} size={5} readOnly precision={0.5} />
));
const Rating10Stars = React.memo(({ value }: LibraryItemComponentProps) => (
  <ColoredRating value={value} size={10} readOnly />
));
const Rating10StarsPrecision = React.memo(({ value }: LibraryItemComponentProps) => (
  <ColoredRating value={value} size={10} readOnly precision={0.5} />
));
const TextLine = React.memo(({ value, truncate }: LibraryItemComponentProps) => (
  <Typography variant="body2" noWrap={truncate} children={value} />
));
const DateLine = React.memo(({ value, truncate }: LibraryItemComponentProps) => (
  <Typography variant="body2" noWrap={truncate} children={value} textAlign="end" />
));

export const LibraryInlineComponents: Record<LibraryElementEnum, LibraryInlineComponent> = {
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
