import { Link, NavLink } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px] bg-rose-50/50 pb-24 text-fuchsia-950 sm:border-x sm:border-rose-100">
      <header className="sticky top-0 z-10 border-b border-rose-200 bg-white/95 px-4 py-3 backdrop-blur">
        <Link to="/" className="text-lg font-semibold tracking-tight text-fuchsia-900">PharmaHome</Link>
        <p className="text-sm text-fuchsia-700">Control simple de medicamentos</p>
      </header>
      <main className="px-4 py-4">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 mx-auto flex w-full max-w-[430px] justify-around border-t border-rose-200 bg-white/95 p-2 backdrop-blur">
        <NavLink className="nav-btn" to="/">Inicio</NavLink>
        <NavLink className="nav-btn" to="/nuevo">Nuevo</NavLink>
        <NavLink className="nav-btn" to="/backup">Backup</NavLink>
      </nav>
    </div>
  );
}
