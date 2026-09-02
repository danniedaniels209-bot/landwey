import { useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import CommunityStrip from "./components/CommunityStrip";
import { useLenis } from "./lib/useLenis";

export default function App() {
  useLenis();
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      <Nav revealed={revealed} />
      <Hero revealed={revealed} onIntroComplete={() => setRevealed(true)} />
      <CommunityStrip />
    </div>
  );
}
