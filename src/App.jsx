import "./App.css";
import NavBar from "./components/Navbar";
import Hero from "./components/HeyThere";
import SidebarWidgets from "./components/SidebarWidgets";

function App() {
  return (
    <>
      <NavBar />

      {/* overall content wrapper */}
      <main className="max-w-screen-xl mx-24 mt-16">
        {" "}
        {/* grid on lg+   ──►   |  HERO  |  WIDGETS  |                 */}
        <div className="grid lg:gap-x-32 gap-y-20 lg:grid-cols-[minmax(48rem,1fr)_auto]">
          {" "}
          {/* ---------------------------------------------------------------- */}
          {/*  HERO  –  min‑width 32 rem ⇒ the column never shrinks as text     */}
          {/*          types out, so nothing pushes the widgets sideways.      */}
          {/* ---------------------------------------------------------------- */}
          <div className="min-w-[56rem]">
            <Hero />
          </div>
          {/* ---------------------------------------------------------------- */}
          {/*  WIDGETS  –  auto‑sized column, but we justify it to the right   */}
          {/* ---------------------------------------------------------------- */}
          <div className="py-24">
            <SidebarWidgets />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
