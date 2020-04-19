import { useState, useMemo, useCallback } from "react";
import Atlas01 from "../datas/Atlas01.json";
import Atlas02 from "../datas/Atlas02.json";
import Atlas03 from "../datas/Atlas03.json";
import Atlas04 from "../datas/Atlas04.json";

export type Level = {
  name: string;
  shape: Block[][];
  width: number;
  height: number;
};

export interface SokobanLevels {
  Title: string;
  Description: string;
  Email: string;
  LevelCollection: LevelCollection;
}

export interface LevelCollection {
  Level: SokobanLevel[];
}

export interface SokobanLevel {
  Id: string;
  Width: string;
  Height: string;
  L: string[];
}

export enum Block {
  empty,
  box,
  objective,
  boxjective,
  wall,
  player,
  playerJective = 7,
}

const levelBlocks = {
  " ": Block.empty,
  $: Block.box,
  ".": Block.objective,
  "*": Block.boxjective,
  "#": Block.wall,
  "@": Block.player,
};

type LevelBlock = keyof typeof levelBlocks;

const SOKOBAN_LEVEL_KEY = "SokobanLevel";

function loadLevels() {
  const AllLevels = [Atlas01, Atlas02, Atlas03, Atlas04] as SokobanLevels[];
  return AllLevels.reduce<Level[]>(
    (acc, levels) => [
      ...acc,
      ...levels.LevelCollection.Level.map((level) => ({
        name: level.Id,
        shape: level.L.map((row) =>
          Array.from(row).map((item) => levelBlocks[item as LevelBlock])
        ),
        width: Number(level.Width),
        height: Number(level.Height),
      })),
    ],
    []
  );
}

export function useLevels() {
  const [levels] = useState<Level[]>(loadLevels);
  const [index, setIndex] = useState(() =>
    Number(localStorage.getItem(SOKOBAN_LEVEL_KEY))
  );
  const level = useMemo(() => levels[index], [levels, index]);
  const loadNext = useCallback(() => {
    setIndex(index + 1);
    localStorage.setItem(SOKOBAN_LEVEL_KEY, String(index + 1));
  }, [index]);

  return { index, level, loadNext };
}
