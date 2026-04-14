import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth, useUser, UserButton } from '@clerk/clerk-react';

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      void navigate({ to: '/login' });
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div style={{ color: 'var(--color-gray-600)' }}>Loading...</div>
      </div>
    );
  }

  if (!isSignedIn || !user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1
        style={{ color: 'var(--color-primary)' }}
        className="text-3xl font-bold mb-8"
      >
        My Profile
      </h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <UserButton />
          <div>
            <p className="font-semibold text-lg">
              {user.firstName} {user.lastName}
            </p>
            <p style={{ color: 'var(--color-gray-600)' }} className="text-sm">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex gap-2">
            <dt style={{ color: 'var(--color-gray-600)' }} className="w-24 shrink-0">
              User ID
            </dt>
            <dd className="font-mono text-xs break-all">{user.id}</dd>
          </div>
          {user.firstName && (
            <div className="flex gap-2">
              <dt style={{ color: 'var(--color-gray-600)' }} className="w-24 shrink-0">
                First Name
              </dt>
              <dd>{user.firstName}</dd>
            </div>
          )}
          {user.lastName && (
            <div className="flex gap-2">
              <dt style={{ color: 'var(--color-gray-600)' }} className="w-24 shrink-0">
                Last Name
              </dt>
              <dd>{user.lastName}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
