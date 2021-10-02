import { useEffect, useState, useCallback } from "react";
import { Level, Block, useLevels } from "./levels";
import { cloneDeep } from "lodash";

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

type Board = Array<
  Level & {
    playerPosition: Position;
    playerDirection: Direction;
  }
>;

function getPlayerPosition<T extends Level>(level: T): Position {
  const row = level.shape.findIndex((blocks) =>
    blocks.some((block) =>
      [Block.player, Block.playerOnObjective].includes(block)
    )
  );
  if (row >= 0) {
    const column = level.shape[row].findIndex((block) =>
      [Block.player, Block.playerOnObjective].includes(block)
    );
    return { row, column };
  }
  throw new Error(`Invalid level, Player position not found : 
  ${level.shape}`);
}

export function useSokoban() {
  const { index, level, loadNext } = useLevels();
  const [state, setState] = useState<State>(State.playing);
  const initboard = useCallback(
    () => [
      {
        ...level,
        playerPosition: getPlayerPosition(level),
        playerDirection: Direction.Right,
      },
    ],
    [level]
  );
  const [board, setBoard] = useState<Board>(initboard);
  const move = useCallback(
    (direction: Direction) => {
      if (state === State.playing) {
        const dir = directionToPosition(direction);
        const last = board[board.length - 1];
        let next = cloneDeep(last);
        next.playerPosition = {
          row: last.playerPosition.row + dir.row,
          column: last.playerPosition.column + dir.column,
        };
        next.playerDirection = direction;
        // are we moving a block
        let movingBlock = false;
        if (
          [Block.box, Block.boxOnObjective].includes(
            last.shape[next.playerPosition.row][next.playerPosition.column]
          ) &&
          [Block.empty, Block.objective].includes(
            last.shape[next.playerPosition.row + dir.row][
              next.playerPosition.column + dir.column
            ]
          )
        ) {
          next.shape[next.playerPosition.row][next.playerPosition.column] -=
            Block.box;
          next.shape[next.playerPosition.row + dir.row][
            next.playerPosition.column + dir.column
          ] += Block.box;
          movingBlock = true;
        }
        //are we moving into an empty space
        if (
          [Block.empty, Block.objective].includes(
            next.shape[next.playerPosition.row][next.playerPosition.column]
          )
        ) {
          next.shape[last.playerPosition.row][last.playerPosition.column] -=
            Block.player;
          next.shape[next.playerPosition.row][next.playerPosition.column] +=
            Block.player;
          if (
            !next.shape.some((row) =>
              row.some((block) =>
                [Block.objective, Block.playerOnObjective].includes(block)
              )
            )
          )
            setState(State.completed);
          if (!movingBlock) board.pop();

          setBoard([...board, next]);
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
  const undo = useCallback(() => {
    if (state === State.playing && board.length > 1) {
      setBoard(board.slice(0, -1));
    }
  }, [state, board]);
  const restart = useCallback(() => {
    if (state === State.playing) {
      setBoard(initboard());
    }
  }, [state, initboard]);

  useEffect(() => {
    if (board[0].name !== level.name) setBoard(initboard());
  }, [board, state, level, loadNext, next, restart, initboard, move]);

  return {
    index,
    level: board[board.length - 1],
    state,
    move,
    next,
    undo,
    restart,
  };
}
