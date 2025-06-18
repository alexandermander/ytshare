export const metadata = {
  title: "About",
};

import Counter from "./counter";

export default function AboutPage() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">About</h1>
      <p className="mb-4">This page demonstrates a server component using a client component.</p>
      <Counter />
    </main>
  );
}
