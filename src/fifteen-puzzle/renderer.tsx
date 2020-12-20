import React, { CSSProperties } from 'react';
import { FifteenPuzzle } from './fifteen-puzzle';
import { useForceUpdate, joinClassNames, range, isMobile } from '../utils';
import styles from './renderer.module.scss';

const EVENT = isMobile ? "onTouchStart" : "onMouseDown";

export interface FifteenPuzzleRendererProps {
  puzzle: FifteenPuzzle;
}
export function FifteenPuzzleRenderer(props: FifteenPuzzleRendererProps) {
  const forceUpdate = useForceUpdate();
  const numbers = props.puzzle.getNumbers();
  return (
    <div className={styles.fifteenPuzzleRenderer}
         style={{ "--columns": props.puzzle.columns, "--rows": props.puzzle.rows } as CSSProperties}>
      { range(numbers.length).map((number) => {
        const point = props.puzzle.getPointFromValue(number);
        const index = props.puzzle.convertPointToIndex(point);
        const onTap = () => (props.puzzle.tap(point), console.log("tapped", point), forceUpdate());
        return <div className={joinClassNames(styles.piece, number === index + 1 && styles.correct, number === 0 && styles.zero)}
                    style={{ "--x": point[0], "--y": point[1] } as CSSProperties}
                    key={number}
                    {...{ [EVENT]: onTap }}>
          <div className={styles.number}> {number} </div>
        </div>;
      }) }
    </div>
  );
}
