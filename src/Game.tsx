import React from "react";
import "./Game.css";
import { Help } from "./components/help";
import { useSokoban, Direction, State } from "./hooks/sokoban";
import { useKeyBoard } from "./hooks/keyboard";
import style from "./components/sokoban.module.css";
import { cn } from "./utils/classnames";
import { styleFrom } from "./utils/block-styles";

function Game() {
  const { index, level, state, move, next, restart } = useSokoban();
  useKeyBoard(
    (event) => {
      switch (event.code) {
        case "ArrowUp":
          move(Direction.Top);
          break;
        case "ArrowDown":
          move(Direction.Bottom);
          break;
        case "ArrowLeft":
          move(Direction.Left);
          break;
        case "ArrowRight":
          move(Direction.Right);
          break;
        case "Enter":
          next();
          break;
        case "Escape":
          restart();
          break;
      }
      event.preventDefault();
    },
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Escape"]
  );
  return (
    <div className="game">
      <div className={style.state}>
        <div className={style.levelPrefix}>Level {index + 1} :</div>
        <div className={style.levelTitle}>{level.name}</div>
      </div>

      <div className={style.board}>
        {level.shape.map((row) => (
          <div className={style.level}>
            {row.map((block) => (
              <div className={cn(style.element, styleFrom(block)!)} />
            ))}
          </div>
        ))}
      </div>
      <Help />
      {state === State.completed && (
        <div className={style.state}>
          <div className={style.levelState}>LEVEL completed </div>
          <div className={style.helpNext}>Press ENTER to load next LEVEL</div>
        </div>
      )}
    </div>
  );
}

export default Game;
