import every from "lodash/every";
import filter from "lodash/filter";
import find from "lodash/find";
import flatten from "lodash/flatten";
import times from "lodash/times";
import * as React from "react";
import {Cell, Coordinates} from "../types";

type GameOfLifeConfig = {
  gridSize?: number;
  // Initial ratio is a number between 0 and 1 that determines how populated the board is initially
  initialRatio?: number;
};

function useGameOfLife({
  gridSize = 10,
  initialRatio = 0,
}: GameOfLifeConfig = {}) {
  const initialCells = flatten(
    times(gridSize, (i) => {
      const x = i + 1;
      return times(gridSize, (i2) => {
        const y = i2 + 1;
        // randomly determine whether the cell is initially populated depending on the ratio of populated cells
        const living = Math.random() < initialRatio;
        return {x, y, living};
      });
    })
  );

  const [cells, setCells] = React.useState(initialCells);

  const reset = React.useCallback(
    function reset() {
      setCells(initialCells);
    },
    [setCells, initialCells]
  );

  const hasLivingCells = !every(cells, {living: false});

  const livingCells = filter(cells, {living: true});

  function isAliveAt({x, y}: Coordinates) {
    const livingCells = filter(cells, {living: true});
    const cell = find(livingCells, {x, y});
    return !!cell;
  }

  const setCell = React.useCallback(
    function setCell({x, y, living = false}: Cell) {
      const updatedCells = cells.map((cell) => {
        if (cell.x === x && cell.y === y) {
          return {x, y, living};
        }
        return cell;
      });
      setCells(updatedCells);
    },
    [cells, setCells]
  );

  const setLivingAt = React.useCallback(
    function setLivingAt({x, y}: Coordinates) {
      setCell({x, y, living: true});
    },
    [setCell]
  );

  const getLivingNeighbors = React.useCallback(
    function getLivingNeighbors({x: x1, y: y1}: Coordinates) {
      return filter(livingCells, ({x: x2, y: y2}) => {
        const dx = Math.abs(x1 - x2);
        const dy = Math.abs(y1 - y2);
        const isSame = dx === 0 && dy === 0;
        return dx <= 1 && dy <= 1 && !isSame;
      });
    },
    [livingCells]
  );

  const isAliveInNextGeneration = React.useCallback(
    function isAliveInNextGeneration(cell: Cell) {
      const livingNeighbors = getLivingNeighbors(cell);
      const numberOfLivingNeighbors = livingNeighbors.length;
      if (cell.living) {
        return !(numberOfLivingNeighbors < 2 || numberOfLivingNeighbors > 3);
      } else {
        return numberOfLivingNeighbors === 3;
      }
    },
    [getLivingNeighbors]
  );

  const tick = React.useCallback(
    function tick() {
      setCells(
        cells.map((cell) => ({
          ...cell,
          living: isAliveInNextGeneration(cell),
        }))
      );
    },
    [setCells, cells, isAliveInNextGeneration]
  );

  return {
    cells,
    setLivingAt,
    tick,
    reset,
    hasLivingCells,
    isAliveAt,
    isAliveInNextGeneration,
  };
}

export default useGameOfLife;
