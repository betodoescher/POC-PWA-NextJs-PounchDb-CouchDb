import styles from 'styles/Home.module.css';
import User from 'components/user';
import Nav from 'components/nav';

export default function Home() {
  return (
    <div className={styles.container}>
      <Nav />
      <User />
    </div>
  );
}
