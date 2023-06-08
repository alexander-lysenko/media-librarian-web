export * from "./_dataTable";
export * from "./_input";
export * from "./_requests";
export * from "./_userprofile";

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

