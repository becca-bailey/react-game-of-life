import * as React from "react";
import useGameOfLife from "../hooks/useGameOfLife";
import Cell from "./Cell";

const WIDTH = 600;
const GRID_SIZE = 80;
const DELAY_MS = 0;

const FILL_COLOR = "#9a12b3";
const FILL_COLOR_LIGHT = "#bf55ec";
const BACKGROUND = "#FFFFFF";

type WorldProps = {
  gridSize?: number;
  width?: number;
};

const World: React.FC<WorldProps> = ({gridSize = GRID_SIZE, width = WIDTH}) => {
  const [running, setRunning] = React.useState(false);
  const {
    cells,
    setLivingAt,
    tick,
    reset,
    isAliveInNextGeneration,
    hasLivingCells,
  } = useGameOfLife(gridSize, true);

  if (running && hasLivingCells) {
    setTimeout(() => {
      tick();
    }, DELAY_MS);
  }

  React.useEffect(() => {
    if (running && !hasLivingCells) {
      setRunning(false);
    }
  }, [running, setRunning, hasLivingCells]);

  const getFill = React.useCallback(
    function (cell) {
      const {living} = cell;
      let fill = BACKGROUND;
      if (living) {
        fill = isAliveInNextGeneration(cell) ? FILL_COLOR_LIGHT : FILL_COLOR;
      }
      return fill;
    },
    [isAliveInNextGeneration]
  );

  return (
    <>
      <svg width={width} height={width} viewBox={`0 0 ${width} ${width}`}>
        {cells.map((cell) => {
          const {x, y} = cell;
          return (
            <Cell
              size={width / gridSize}
              cell={cell}
              fill={getFill(cell)}
              key={`${x}-${y}`}
              onClick={() => {
                setLivingAt({x, y});
              }}
            />
          );
        })}
      </svg>
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
