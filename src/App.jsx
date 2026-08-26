import { Routes, Route } from "react-router-dom";

import BtmHeader from "./components/BtmHeader/BtmHeader";
import TopHeader from "./components/TopHeader/TopHeader";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";

function App() {
  return (
    <>
      <header>
        <TopHeader />
        <BtmHeader />
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

export default App;