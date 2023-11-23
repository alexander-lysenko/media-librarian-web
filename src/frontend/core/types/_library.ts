import type { LibraryElementEnum } from "../enums";

export type LibraryElement = keyof typeof LibraryElementEnum;

export type LibraryFields = Record<string, LibraryElement>;

export type LibrarySchema = {
  id: number;
  title: string;
  fields: LibraryFields;
};

export type LibraryItemFormValues = Record<keyof LibraryFields, string | number | boolean>;

export type LibraryItem = {
  id: number;
} & LibraryItemFormValues;
