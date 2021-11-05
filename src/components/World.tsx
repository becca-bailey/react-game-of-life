import * as React from "react";
import useGameOfLife from "../hooks/useGameOfLife";
import Cell from "./Cell";
import {Cell as CellType} from "../types";

const WIDTH = 600;
const GRID_SIZE = 100;
const DELAY_MS = 0;

const FILL_COLOR = "#9a12b3";

type GridProps = {
  cells: CellType[];
  gridSize?: number;
  width?: number;
};

type RenderMethod = "SVG" | "CANVAS";

const SVGGrid: React.FC<GridProps> = ({
  gridSize = GRID_SIZE,
  width = WIDTH,
  cells,
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
          />
        );
      })}
    </svg>
  );
};

const CanvasGrid: React.FC<GridProps> = ({
  gridSize = GRID_SIZE,
  width = WIDTH,
  cells,
}) => {
  const size = width / gridSize;

  const getBoardPosition = React.useCallback(
    function (value: number) {
      return value * size - size;
    },
    [size]
  );

  const canvasRef: React.RefObject<any> = React.useRef();

  React.useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, width, width);
    cells.forEach(({x, y, living}) => {
      if (living) {
        ctx.beginPath();
        ctx.fillStyle = FILL_COLOR;
        ctx.rect(getBoardPosition(x), getBoardPosition(y), size, size);
        ctx.fill();
      }
    });
  }, [cells, canvasRef, getBoardPosition, size, width]);

  return <canvas width={width} height={width} ref={canvasRef} />;
};

const World = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const gridSize = searchParams.has("gridSize")
    ? parseInt(searchParams.get("gridSize")!)
    : GRID_SIZE;
  const initialRatio = searchParams.has("initialRatio")
    ? parseFloat(searchParams.get("initialRatio")!)
    : 0.25;

  const [renderMethod, setRenderMethod] = React.useState<RenderMethod>("SVG");
  const [running, setRunning] = React.useState(false);
  const {cells, tick, reset, hasLivingCells} = useGameOfLife({
    gridSize,
    initialRatio,
  });

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
      {renderMethod === "SVG" && <SVGGrid cells={cells} gridSize={gridSize} />}
      {renderMethod === "CANVAS" && (
        <CanvasGrid cells={cells} gridSize={gridSize} />
      )}
      <div>
        <select
          value={renderMethod}
          onChange={(event) =>
            setRenderMethod(event.target.value as RenderMethod)
          }
        >
          <option value="SVG">SVG</option>
          <option value="CANVAS">Canvas</option>
        </select>
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
