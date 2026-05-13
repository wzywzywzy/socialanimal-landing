import { Hero } from "@/components/sections/Hero";
import { Navbar } from "@/components/Navbar";
import { Problem } from "@/components/sections/Problem";
import { Product } from "@/components/sections/Product";
import { Purpose } from "@/components/sections/Purpose";

// overflow-x: clip on the wrapper contains horizontal overflow from
// the 1920px design canvas on narrower viewports, without turning
// <main> into a scroll container (which would break window-scroll
// listeners). 'clip' is preferred over 'hidden' precisely because
// it does NOT establish a scroll context.
export default function Home() {
  return (
    <main style={{ overflowX: "clip" }}>
      <Navbar />
      <Hero />
      <Problem />
      <Product />
      <Purpose />
    </main>
  );
}
