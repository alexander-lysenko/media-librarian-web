import type { LibraryElementEnum } from "../enums";

export type LibraryElement = keyof typeof LibraryElementEnum;

export type LibraryFields = Record<string, LibraryElement>;

/**
 * Represents the schema of a library with its core properties.
 *
 * This interface defines the structure of a library object, including a unique identifier,
 * the title of the library, and its associated fields. It is used to ensure that library data
 * conforms to a specific format.
 *
 * Properties:
 * - `id`: A unique numerical identifier for the library.
 * - `title`: The title or name of the library.
 * - `fields`: An object defining additional structured data relevant to the library.
 */
export interface LibrarySchema {
  id: number;
  title: string;
  fields: LibraryFields;
}

export type LibraryItemFormValues = Record<keyof LibraryFields, string | number | boolean>;

/**
 * Represents an item in a Library.
 *
 * Properties:
 * - id: A unique identifier for the library item.
 *
 * The `LibraryItem` combines existing form values with a unique identifier to manage library inventory more effectively.
 */
export type LibraryItem = {
  id: number;
} & LibraryItemFormValues;
