import os from 'os';

export default function ServerInfo() {
  const host = os.hostname();
  const platform = os.platform();
  const time = new Date().toLocaleString();
  return (
    <p className="mb-4 text-sm text-gray-600">Server {host} on {platform} at {time}</p>
  );
}
