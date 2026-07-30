import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

export function Layout({ children }) {
  return (
    <>
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}
