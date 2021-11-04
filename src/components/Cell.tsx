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

  const {x, y, living} = cell;

  if (!living) {
    return null;
  }

  return (
    <rect
      x={getBoardPosition(x)}
      y={getBoardPosition(y)}
      width={size}
      height={size}
      fill={fill}
      onClick={onClick}
      {...props}
    />
  );
};

export default Cell;
