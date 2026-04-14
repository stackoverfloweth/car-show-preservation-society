import { createFileRoute, Link } from '@tanstack/react-router';
import { SignIn, useAuth } from '@clerk/clerk-react';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p style={{ color: 'var(--color-gray-600)' }} className="mb-4">
            You are already signed in.
          </p>
          <Link
            to="/"
            style={{ color: 'var(--color-primary)' }}
            className="font-medium underline hover:opacity-80"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/signup"
          forceRedirectUrl="/profile"
        />
      </div>
    </div>
  );
}
