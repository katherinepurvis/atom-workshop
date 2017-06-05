export default function configurePresence(domain, user) {
  const endpoint = `wss://${domain}/socket`;
  return window.presenceClient(endpoint, user);
}
