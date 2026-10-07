import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];

/**
 * google-auth-library ignores clockTolerance; PC clock behind Google breaks sign-in.
 */
export async function verifyGoogleIdToken(idToken, audience) {
  const oauth = new OAuth2Client();
  const { certs } = await oauth.getFederatedSignonCertsAsync();
  const decoded = jwt.decode(idToken, { complete: true });
  const kid = decoded?.header?.kid;
  if (!kid || !certs[kid]) {
    throw new Error('Invalid Google token (signing key not found)');
  }

  const clockTolerance = Number(process.env.GOOGLE_CLOCK_TOLERANCE_SEC) || 86400;

  return jwt.verify(idToken, certs[kid], {
    algorithms: ['RS256'],
    audience,
    issuer: ISSUERS,
    clockTolerance,
  });
}
