import React from "react";
import style from "./sokoban.module.css";

function HelpImpl() {
  return (
    <div className={style.help}>
      <div className={style.descriptions}>
        <div>&uarr;</div>
        <div>&larr;&nbsp;&rarr;</div>
        <div>&darr;</div>
        <div>escape</div>
      </div>
      <div className={style.instructions}>
        <div> Move</div>
        <div> Move</div>
        <div> Move</div>
        <div> restart level</div>
      </div>
    </div>
  );
}

export const Help = React.memo(HelpImpl);
