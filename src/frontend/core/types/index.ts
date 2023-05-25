export * from "./_dataTable";
export * from "./_input";

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

export type Anchor = "top" | "left" | "bottom" | "right";
