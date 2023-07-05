export * from "./_dataTable";
export * from "./_dialogs";
export * from "./_input";
export * from "./_library";
export * from "./_requests";

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;
