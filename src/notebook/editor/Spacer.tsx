import styles from './Spacer.module.css';

interface SpacerProps {
  handleClick: () => void;
  showHint: boolean;
}

export function Spacer({ handleClick, showHint }: SpacerProps) {
  return <div className={styles.spacer} onClick={handleClick}>{showHint ? 'Click to create the first paragraph.' : ''}</div>;
}
