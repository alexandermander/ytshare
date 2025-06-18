export const metadata = {
  title: "About",
};

import Counter from "./counter";
import ServerInfo from "./server-info";

export default function AboutPage() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">About</h1>
      <p className="mb-2">This page demonstrates how server and client components can work together.</p>
      <ServerInfo />
      <Counter />
    </main>
  );
}
