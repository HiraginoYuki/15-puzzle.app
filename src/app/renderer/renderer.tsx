import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { useForceUpdate, joinClassNames as join, isMobile, style, defineOnGlobal, useConstant } from '../../utils';
import styles from './renderer.scss';
import { PuzzleManager } from '../../puzzle-manager';

type Point2D = [number, number];

const keyMap = {
  4:[0,0], 5:[1,0], 6:[2,0], 7:[3,0],
  r:[0,1], t:[1,1], y:[2,1], u:[3,1],
  f:[0,2], g:[1,2], h:[2,2], j:[3,2],
  v:[0,3], b:[1,3], n:[2,3], m:[3,3],
} as { [key: string]: Point2D };

const TAP_EVENT = isMobile ? "onTouchStart" : "onMouseDown";

export function FifteenPuzzleRenderer() {
  const forceUpdate = useForceUpdate();
  const listener = useRef<(event: KeyboardEvent) => any>();
  const puzzleManager = useConstant(() => new PuzzleManager().generate());
  const { isSolved } = puzzleManager;
  const { columns, rows } = puzzleManager.puzzleInstance;

  puzzleManager.setOnUpdate(forceUpdate);

  defineOnGlobal({ puzzleManager, forceUpdate });

  function reset() {
    puzzleManager.generate();
  }

  function onTap(point: Point2D) {
    puzzleManager.tap(point);
    forceUpdate();
  };

  function onKeyDown(key: string) {
    if (key == " ") reset();
    const point = keyMap[key];
    if (Array.isArray(point)) onTap(point);
  }

  useEffect(() => {
    document.removeEventListener("keydown", listener.current!);
    document.addEventListener("keydown", listener.current = ({ key }) => onKeyDown(key));
  });

  return (
    <div className={styles.fifteenPuzzleRenderer} style={style.var({ columns, rows })}>
      {
        puzzleManager.getNumbers().map(({ coord, number, isCorrect }) => {
          const isZero = number == 0;
          const content = isZero
                        ? <div className={styles.number}> R </div>
                        : <div className={styles.number}> {number} </div>;
          return (
            <Piece hidden={isZero && !isSolved} correct={isCorrect}
                   tapEvent={TAP_EVENT} onTap={isZero && isSolved ? reset : onTap}
                   coord={coord} key={number}>
              { content }
            </Piece>
          );
        })
      }
    </div>
  );
}

interface PieceProps {
  tapEvent: "onTouchStart" | "onMouseDown";
  onTap(point: Point2D): any;
  correct: boolean;
  hidden: boolean;
  coord: Point2D;
}
function Piece(props: PropsWithChildren<PieceProps>) {
  const [x, y] = props.coord;
  return (
    <div className={join(styles.piece,
                         props.correct && styles.correct,
                         props.hidden && styles.hidden)}
         style={style.var({ x, y })}
         {...{ [props.tapEvent]: () => props.onTap(props.coord) }}>
      { props.children }
    </div>
  );
}
