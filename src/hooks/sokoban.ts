import { useEffect, useState, useCallback } from "react";
import { Level, Block, useLevels } from "./levels";

export enum Direction {
  Left,
  Top,
  Right,
  Bottom,
}

export enum State {
  playing,
  completed,
}

type Position = {
  row: number;
  column: number;
};

const dirPositions = new Map<Direction, Position>();
dirPositions.set(Direction.Left, { row: 0, column: -1 });
dirPositions.set(Direction.Top, { row: -1, column: 0 });
dirPositions.set(Direction.Right, { row: 0, column: 1 });
dirPositions.set(Direction.Bottom, { row: 1, column: 0 });

function directionToPosition(direction: Direction) {
  return dirPositions.get(direction)!;
}

type Board = Level & {
  playerPosition: Position;
};

function getPlayerPosition<T extends Level>(level: T): Position {
  const row = level.shape.findIndex((blocks) =>
    blocks.some((block) => block === Block.player)
  );
  if (row >= 0) {
    const column = level.shape[row].findIndex(
      (block) => block === Block.player
    );
    return { row, column };
  }
  throw new Error("Invalid level, Player position not found");
}

export function useSokoban() {
  const { index, level, loadNext } = useLevels();
  const [state, setState] = useState<State>(State.playing);
  const initboard = useCallback(
    () => ({
      ...level,
      playerPosition: getPlayerPosition(level),
    }),
    [level]
  );
  const [board, setBoard] = useState<Board>(initboard);
  const move = useCallback(
    (direction: Direction) => {
      if (state === State.playing) {
        const dir = directionToPosition(direction);
        const position = { ...board.playerPosition };
        const nextPosition: Position = {
          row: board.playerPosition.row + dir.row,
          column: board.playerPosition.column + dir.column,
        };
        let next = {
          ...board,
        };
        if (
          [Block.box, Block.boxjective].includes(
            board.shape[nextPosition.row][nextPosition.column]
          ) &&
          [Block.empty, Block.objective].includes(
            board.shape[nextPosition.row + dir.row][
              nextPosition.column + dir.column
            ]
          )
        ) {
          next.shape = next.shape.map((line, row) =>
            line.map((block, column) =>
              nextPosition.row === row && nextPosition.column === column
                ? block - Block.box
                : block
            )
          );
          next.shape = next.shape.map((line, row) =>
            line.map((block, column) =>
              nextPosition.row + dir.row === row &&
              nextPosition.column + dir.column === column
                ? block + Block.box
                : block
            )
          );
        }
        if (
          [Block.empty, Block.objective].includes(
            next.shape[nextPosition.row][nextPosition.column]
          )
        ) {
          next.shape[position.row][position.column] -= Block.player;
          next.playerPosition = nextPosition;
          next.shape[nextPosition.row][nextPosition.column] += Block.player;
          setBoard(next);
          if (
            !next.shape.some((row) =>
              row.some((block) =>
                [Block.objective, Block.playerJective].includes(block)
              )
            )
          )
            setState(State.completed);
        }
      }
    },
    [board, state]
  );

  const next = useCallback(() => {
    if (state === State.completed) {
      loadNext();
      setState(State.playing);
    }
  }, [state, loadNext]);
  const restart = useCallback(() => {
    if (state === State.playing) {
      setBoard(initboard());
    }
  }, [state, initboard]);

  useEffect(() => {
    if (board.name !== level.name) setBoard(initboard());
  }, [board, state, level, loadNext, next, restart, initboard, move]);

  return { index, level: board, state, move, next, restart };
}
