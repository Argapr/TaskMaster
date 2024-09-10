import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to My To-Do App</h1>
      <div>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </div>
    </div>
  );
}
