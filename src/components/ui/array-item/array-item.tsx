
import styles from './array-item.module.css';

export type ArrayItemProps = {
  color: "default" | "changing" | "modified",
  height: number,
}

export const ArrayItem = ({ color, height }: ArrayItemProps) => {

  const colors = {
    default: '#0032FF',
    changing: '#D252E1',
    complete: '#7FE051'
  }

  const additionalStyle = {
    minHeight: `${height}px`,
    backgroundColor: `var(--${color}-color)`,
  };




  return (
    <div className={`${styles.arrayItem}`} style={additionalStyle} />
  );
}