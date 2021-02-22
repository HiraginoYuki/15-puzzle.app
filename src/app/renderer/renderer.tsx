import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { FifteenPuzzle, Point2D } from '../../fifteen-puzzle';
import { useForceUpdate, joinClassNames, range, isMobile, style, useComputedState, defineOnGlobal } from '../../utils';
import styles from './renderer.scss';

const keyMap = {
  4:[0,0], 5:[1,0], 6:[2,0], 7:[3,0],
  r:[0,1], t:[1,1], y:[2,1], u:[3,1],
  f:[0,2], g:[1,2], h:[2,2], j:[3,2],
  v:[0,3], b:[1,3], n:[2,3], m:[3,3],
} as { [key: string]: Point2D };

function forceSolve(puzzle: FifteenPuzzle): FifteenPuzzle {
  puzzle.numbers = [...Array(puzzle.columns * puzzle.rows - 1)].map((_, i) => i + 1).concat(0);
  return puzzle;
}
defineOnGlobal({ forceSolve });

export function FifteenPuzzleRenderer() {
  const [ puzzle, setPuzzle ] = useState(FifteenPuzzle.generateRandom(4));
  const TAP_EVENT = isMobile ? "onTouchStart" : "onMouseDown";
  const forceUpdate = useForceUpdate();
  const listener = useRef<(event: KeyboardEvent) => any>();

  function reset() {
    setPuzzle(FifteenPuzzle.generateRandom());
  }

  function onTap(point: Point2D) {
    puzzle.tap(point);
    console.log("tapped", point);
    forceUpdate();
  };

  function onKeyDown(key: string) {
    if (key == " ") reset();
    const point = keyMap[key];
    console.log(key, point);
    if (Array.isArray(point)) onTap(point);
  }

  useEffect(() => defineOnGlobal({ puzzle, setPuzzle, forceUpdate }));
  useEffect(() => {
    document.removeEventListener("keydown", listener.current!);
    document.addEventListener("keydown", listener.current = ({ key }) => onKeyDown(key));
  }, [puzzle]);

  return (
    <div className={styles.fifteenPuzzleRenderer}
         style={style.var({ columns: puzzle.columns, rows: puzzle.rows })}
    >
      { range(puzzle.numbers.length).map((number) => {
        const point = puzzle.getPointFromValue(number);
        const index = puzzle.pointUtil.convertPointToIndex(point);
        const isZero = number == 0;
        const isSolved = useComputedState(() => puzzle.isSolved());
        return <Piece key={number} hidden={isZero && !isSolved.value} correct={number == index + 1}
                      tapEvent={TAP_EVENT} onTap={isZero && isSolved.value ? reset : onTap}
                      x={point[0]} y={point[1]}>
          { isZero
            ? <div className={styles.number}> R </div>
            : <div className={styles.number}> {number} </div>
          }
        </Piece>;
      }) }
    </div>
  );
}

interface PieceProps {
  x: number;
  y: number;
  hidden: boolean;
  tapEvent: "onTouchStart" | "onMouseDown";
  onTap(point: Point2D): any;
  key: string | number;
  correct: boolean;
}
function Piece({ x, y, hidden, tapEvent, onTap, key, correct, children }: PropsWithChildren<PieceProps>) {
  return <div className={joinClassNames(styles.piece, correct && styles.correct, hidden && styles.hidden)}
              style={style.var({ x, y })}
              key={key}
              {...{ [tapEvent]: () => onTap([x, y]) }}> { children } </div>;
}
