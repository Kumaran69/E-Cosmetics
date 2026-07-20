import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

// Renders Google's official sign-in button. If VITE_GOOGLE_CLIENT_ID isn't
// configured, silently renders nothing rather than breaking the page -
// the app is fully usable via email/password without Google OAuth set up.
export default function GoogleAuthButton({ onSuccess }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) return null;

  return (
    <div className="google-btn-wrap">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            await onSuccess(credentialResponse.credential);
          } catch (err) {
            toast.error(err.message);
          }
        }}
        onError={() => toast.error('Google sign-in failed. Please try again.')}
        useOneTap={false}
        theme="outline"
        shape="pill"
        width="320"
      />
    </div>
  );
}
