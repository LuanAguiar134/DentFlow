import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-blue-700 text-white flex flex-col p-5">
      <h1 className="text-2xl font-bold mb-8">DentiFlow</h1>

      <nav className="flex flex-col gap-4">
        <Link to="/" className="hover:bg-blue-600 p-2 rounded">
          Dashboard
        </Link>

        <Link to="/agenda" className="hover:bg-blue-600 p-2 rounded">
          Agenda
        </Link>

        <Link to="/patients" className="hover:bg-blue-600 p-2 rounded">
          Pacientes
        </Link>

        <Link to="/procedures" className="hover:bg-blue-600 p-2 rounded">
          Procedimentos
        </Link>

        <Link to="/financial" className="hover:bg-blue-600 p-2 rounded">
          Financeiro
        </Link>
      </nav>
    </div>
  );
}