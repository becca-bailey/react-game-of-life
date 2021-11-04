import * as React from "react";
import {Cell as CellType} from "../types";

type CellProps = {
  cell: CellType;
  fill: string;
  size: number;
  onClick(): void;
};

const Cell: React.FunctionComponent<CellProps> = ({
  cell,
  fill,
  size,
  onClick,
  ...props
}) => {
  const getBoardPosition = React.useCallback(
    function (value: number) {
      return value * size - size;
    },
    [size]
  );

  const {x, y} = cell;

  return (
    <rect
      style={{cursor: "pointer"}}
      x={getBoardPosition(x)}
      y={getBoardPosition(y)}
      stroke={"black"}
      strokeWidth={"1px"}
      width={size}
      height={size}
      fill={fill}
      onClick={onClick}
      {...props}
    />
  );
};

export default Cell;
