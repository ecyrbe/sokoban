import { Block } from "../hooks/levels";
import style from "../components/sokoban.module.css";

const styles = new Map<Block, string>();
styles.set(Block.empty, style.empty);
styles.set(Block.box, style.box);
styles.set(Block.boxOnObjective, style.boxjective);
styles.set(Block.objective, style.objective);
styles.set(Block.wall, style.wall);
styles.set(Block.player, style.player);
styles.set(Block.playerOnObjective, style.playerJective);

export function styleFrom(block: Block) {
  return styles.get(block);
}
