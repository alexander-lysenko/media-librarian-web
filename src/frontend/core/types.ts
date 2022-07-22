export type Anchor = "top" | "left" | "bottom" | "right";

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;
