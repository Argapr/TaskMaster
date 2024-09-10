import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to TaskMaster</h1>
        <p className="text-gray-600 mb-8">Manage your tasks efficiently with TaskMaster.</p>
        <div className="space-x-4">
            <Link href="/login" className="bg-indigo-500 text-white px-6 py-2 rounded-md shadow hover:bg-indigo-600">
              Login
            </Link>
            <Link href="/register" className="bg-green-500 text-white px-6 py-2 rounded-md shadow hover:bg-green-600">
              Register
            </Link>
        </div>
      </div>
    </div>
  );
}
