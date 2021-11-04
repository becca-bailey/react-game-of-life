import * as React from "react";
import useGameOfLife from "../hooks/useGameOfLife";
import Cell from "./Cell";
import {Cell as CellType, Coordinates} from "../types";

const WIDTH = 600;
const GRID_SIZE = 100;
const DELAY_MS = 0;

const FILL_COLOR = "#9a12b3";

type WorldProps = {
  gridSize?: number;
  width?: number;
};

type GridProps = WorldProps & {
  cells: CellType[];
  setLivingAt: (coordinates: Coordinates) => void;
};

const SVGGrid: React.FC<GridProps> = ({
  gridSize = GRID_SIZE,
  width = WIDTH,
  cells,
  setLivingAt,
}) => {
  return (
    <svg width={width} height={width} viewBox={`0 0 ${width} ${width}`}>
      {cells.map((cell) => {
        const {x, y} = cell;
        return (
          <Cell
            size={width / gridSize}
            cell={cell}
            fill={FILL_COLOR}
            key={`${x}-${y}`}
            onClick={() => {
              setLivingAt({x, y});
            }}
          />
        );
      })}
    </svg>
  );
};

const World: React.FC<WorldProps> = ({gridSize = GRID_SIZE, width = WIDTH}) => {
  const [running, setRunning] = React.useState(false);
  const {cells, setLivingAt, tick, reset, hasLivingCells} = useGameOfLife(
    gridSize,
    true
  );

  React.useEffect(() => {
    if (running && !hasLivingCells) {
      setRunning(false);
    }
    if (running && hasLivingCells) {
      setTimeout(() => {
        tick();
      }, DELAY_MS);
    }
  }, [running, setRunning, hasLivingCells, tick]);

  return (
    <>
      <SVGGrid cells={cells} setLivingAt={setLivingAt}></SVGGrid>
      <div>
        <button disabled={running} onClick={() => tick()}>
          Tick
        </button>
        <button disabled={running} onClick={() => reset()}>
          Reset
        </button>
        <button disabled={running} onClick={() => setRunning(true)}>
          Start
        </button>
        <button disabled={!running} onClick={() => setRunning(false)}>
          Stop
        </button>
      </div>
    </>
  );
};

export default World;
