import { createFileRoute, Link } from '@tanstack/react-router';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section
        style={{ backgroundColor: 'var(--color-primary)' }}
        className="text-white py-24 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Car Show{' '}
            <span style={{ color: 'var(--color-accent)' }}>Preservation</span>{' '}
            Society
          </h1>
          <p className="text-lg sm:text-xl opacity-80 mb-10">
            Discover, Share, Preserve
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <Link
                to="/signup"
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)' }}
                className="px-8 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 rounded-lg font-semibold text-lg border border-white/40 hover:border-white/80 transition-colors"
              >
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                to="/events"
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)' }}
                className="px-8 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                Browse Events
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Feature Links */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            to="/events"
            title="Events"
            description="Find upcoming car shows, register your vehicle, and vote for your favorites."
            icon="🏁"
          />
          <FeatureCard
            to="/clubs"
            title="Clubs"
            description="Join or create a car club to host your own events and connect with enthusiasts."
            icon="🚗"
          />
          <FeatureCard
            to="/garage"
            title="My Garage"
            description="Manage your vehicles, track registrations, and view your show history."
            icon="🔧"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  to,
  title,
  description,
  icon,
}: {
  to: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Link
      to={to}
      className="block p-6 rounded-lg border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all group"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h2
        style={{ color: 'var(--color-primary)' }}
        className="text-xl font-semibold mb-2 group-hover:underline"
      >
        {title}
      </h2>
      <p style={{ color: 'var(--color-gray-600)' }} className="text-sm leading-relaxed">
        {description}
      </p>
    </Link>
  );
}
