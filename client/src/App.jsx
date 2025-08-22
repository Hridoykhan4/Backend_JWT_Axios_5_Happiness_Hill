import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <header className="sticky top-0 z-[999]">
        <Navbar></Navbar>
      </header>

      <main className="max-w-[1440px]  min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
        <Outlet></Outlet>
      </main>

      <>
        <Footer></Footer>
      </>
    </>
  );
}

export default App;
