import { Link, NavLink } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-slate-50 pb-24 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">
        <Link to="/" className="text-lg font-semibold">PharmaHome</Link>
        <p className="text-sm text-slate-600">Control simple de medicamentos</p>
      </header>
      <main className="px-4 py-4">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 mx-auto flex max-w-md justify-around border-t border-slate-200 bg-white p-2">
        <NavLink className="nav-btn" to="/">Inicio</NavLink>
        <NavLink className="nav-btn" to="/nuevo">Nuevo</NavLink>
        <NavLink className="nav-btn" to="/backup">Backup</NavLink>
      </nav>
    </div>
  );
}
