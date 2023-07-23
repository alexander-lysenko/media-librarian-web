import { Tooltip, TooltipProps } from "@mui/material";

/**
 * MUI Tooltip - preset with additional wrapping that help the tooltip appear over disabled items (optional).
 * If "title" is empty, the tooltip component won't be rendered - just the child node will appear
 * @param props
 * @constructor
 */
export const TooltipWrapper = (props: TooltipProps & { wrap?: boolean }) => {
  const { title, children, wrap, ...restProps } = props;
  return title ? (
    <Tooltip arrow title={title} {...restProps}>
      {wrap ? <span>{children}</span> : children}
    </Tooltip>
  ) : (
    children
  );
};
