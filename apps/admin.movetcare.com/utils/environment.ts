const environment: string =
  typeof window !== 'undefined' &&
  window.location.hostname === 'admin.movetcare.com'
    ? 'production'
    : typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'development'
    : 'staging';

export default environment;
