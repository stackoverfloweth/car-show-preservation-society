import { useState } from 'react';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header style={{ backgroundColor: 'var(--color-primary)' }} className="text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-lg tracking-wide hover:opacity-90 transition-opacity"
            >
              <span style={{ color: 'var(--color-accent)' }}>CSPS</span>
              <span className="hidden sm:inline text-sm font-normal opacity-80">
                Car Show Preservation Society
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/events">Events</NavLink>
              <NavLink to="/clubs">Clubs</NavLink>
              <NavLink to="/garage">Garage</NavLink>
            </nav>

            {/* User Controls */}
            <div className="flex items-center gap-4">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Link
                  to="/login"
                  className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)' }}
                  className="text-sm font-semibold px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </Link>
              </SignedOut>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-1 rounded opacity-80 hover:opacity-100 transition-opacity"
                onClick={() => setMobileMenuOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 flex flex-col gap-3 border-t border-white/20 pt-4 mt-1">
              <MobileNavLink to="/events" onClick={() => setMobileMenuOpen(false)}>
                Events
              </MobileNavLink>
              <MobileNavLink to="/clubs" onClick={() => setMobileMenuOpen(false)}>
                Clubs
              </MobileNavLink>
              <MobileNavLink to="/garage" onClick={() => setMobileMenuOpen(false)}>
                Garage
              </MobileNavLink>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer
        style={{ backgroundColor: 'var(--color-primary)', color: 'rgba(255,255,255,0.6)' }}
        className="text-sm py-6 mt-auto"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          © {new Date().getFullYear()} Car Show Preservation Society
        </div>
      </footer>
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
      activeProps={{ style: { opacity: 1, color: 'var(--color-accent)' } }}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity py-1"
    >
      {children}
    </Link>
  );
}
