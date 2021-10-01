import { Block } from "../hooks/levels";
import style from "../components/sokoban.module.css";
import { Direction } from "../hooks/sokoban";

const styles = new Map<Block, string>();
styles.set(Block.empty, style.empty);
styles.set(Block.box, style.box);
styles.set(Block.boxOnObjective, style.boxjective);
styles.set(Block.objective, style.objective);
styles.set(Block.wall, style.wall);
styles.set(Block.player, style.player);
styles.set(Block.playerOnObjective, style.playerJective);

const dirStyles = new Map<Direction, string>();
dirStyles.set(Direction.Right, style.playerright);
dirStyles.set(Direction.Left, style.playerleft);
dirStyles.set(Direction.Bottom, style.playerdown);
dirStyles.set(Direction.Top, style.playerup);

export function styleFrom(block: Block) {
  return styles.get(block)!;
}

export function styleDirection(direction: Direction) {
  return dirStyles.get(direction)!;
}
