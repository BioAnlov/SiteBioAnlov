import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollManager } from "./ScrollManager";

export function Layout() {
  return (
    <main>
      <a className="skip-link" href="#contenu">
        Aller au contenu principal
      </a>
      <ScrollManager />
      <Header />
      <div id="contenu">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}
