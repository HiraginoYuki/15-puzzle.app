import React, { useState, useEffect } from "react";
import { FifteenPuzzle } from "./fifteen-puzzle";
import { FlexCenteringContainer, defineOnGlobal } from "./utils";

defineOnGlobal({ FifteenPuzzle });
export function App() {
  const [ puzzle, setPuzzle ] = useState(FifteenPuzzle.generateRandom(4));
  useEffect(() => defineOnGlobal({ puzzle }));

  return <>
    <FlexCenteringContainer>
      <FifteenPuzzle.Renderer puzzle={puzzle} />
    </FlexCenteringContainer>
  </>;
}
