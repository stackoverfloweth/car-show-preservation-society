import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/clubs')({
  component: ClubsPage,
});

function ClubsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 style={{ color: 'var(--color-primary)' }} className="text-3xl font-bold mb-6">
        Clubs
      </h1>
      <p style={{ color: 'var(--color-gray-600)' }}>Coming soon.</p>
    </div>
  );
}
