import { useEffect, useRef, useState } from "react";
import styles from "./AnimateHeart.module.css";

type Props = {
  id: number;
};

function AnimateHeart({ id }: Props) {
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      setVisible(false);
    }, 900);
    return () => {
      window.clearTimeout(timeoutRef.current!);
    };
  }, []);

  return visible ? (
    <div
      key={id}
      className={
        id % 2 ? styles.likeHeartAnimationLeft : styles.likeHeartAnimationRight
      }
    >
      ♥
    </div>
  ) : null;
}

export default AnimateHeart;
