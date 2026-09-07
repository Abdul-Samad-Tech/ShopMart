export function getApiErrorMessage(err, fallback = 'Something went wrong') {
  if (err.response?.data?.message) return err.response.data.message;
  const raw = String(err.message || '');
  if (
    err.message === 'Network Error' ||
    err.code === 'ERR_NETWORK' ||
    raw.includes('ECONNRESET') ||
    err.code === 'ECONNRESET'
  ) {
    return 'Server restarting. Wait 3 seconds for “Demo users ready” in terminal, then try again.';
  }
  if (err.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
  if (err.response?.status === 503) {
    return err.response.data?.message || 'Database not ready. Wait for MongoDB connected in terminal.';
  }
  return err.message || fallback;
}
