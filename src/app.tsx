import React, { useState, useEffect } from "react";
import { FifteenPuzzle } from "./fifteen-puzzle";
import { FlexCenteringContainer, defineOnGlobal } from "./utils";
import styles from './app.scss';

defineOnGlobal({ FifteenPuzzle });
export function App() {
  const [ puzzle, setPuzzle ] = useState(FifteenPuzzle.generateRandom(4));
  useEffect(() => defineOnGlobal({ puzzle }));

  return <>
    <FlexCenteringContainer>
      <FifteenPuzzle.Renderer puzzle={puzzle} />
      <div style={{backgroundColor:"#fff",width:"100px",height:"100px"}} onClick={() => setPuzzle(FifteenPuzzle.generateRandom(4))}>reset</div>
    </FlexCenteringContainer>
    <div className={styles.name}>Made by Yuki Hiragino</div>
  </>;
}
