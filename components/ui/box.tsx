import type { ElementType, ComponentPropsWithoutRef } from "react";

export type BoxProps<T extends ElementType = "div"> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

export function Box<T extends ElementType = "div">({
  as,
  ...props
}: BoxProps<T>) {
  const Tag = as ?? "div";
  return <Tag {...props} />;
}
