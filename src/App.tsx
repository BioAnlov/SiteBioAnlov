import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Sectors from "./pages/Sectors";
import About from "./pages/About";
import Quote from "./pages/Quote";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Maintenance from "./pages/Maintenance";
import { maintenance } from "./maintenance";

export function App() {
  // Mode maintenance : toutes les adresses affichent la page d'entretien.
  // Les pages ci-dessous restent intactes et reviennent dès que `actif` repasse à false.
  if (maintenance.actif) {
    return (
      <Routes>
        <Route path="*" element={<Maintenance />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="secteurs" element={<Sectors />} />
        <Route path="a-propos" element={<About />} />
        <Route path="soumission" element={<Quote />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
