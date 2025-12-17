import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "../ui/ScrollToTop";

export default function Layout() {
  return (
    <div className=" bg-perejil-100 dark:bg-perejil-800 min-h-screen">
      <Header />
      <main className="flex-1 min-h-screen">
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
