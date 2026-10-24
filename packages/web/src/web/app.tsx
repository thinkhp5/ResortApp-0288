import { Route, Switch, useLocation } from "wouter";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";
import { Provider } from "./components/provider";
import { Footer, Nav, ScrollToTop } from "./components/layout";
import { ChatWidget } from "./components/chat/chat-widget";
import Index from "./pages/index";
import RoomsPage from "./pages/rooms";
import RoomDetail from "./pages/room-detail";
import DiningPage from "./pages/dining";
import SpaPage from "./pages/spa";
import ExperiencesPage from "./pages/experiences";
import OffersPage from "./pages/offers";
import GalleryPage from "./pages/gallery";
import ContactPage from "./pages/contact";
import BookPage from "./pages/book";
import AdminPage from "./pages/admin";
import NotFound from "./pages/not-found";

function Shell() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");
  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Nav />}
      <main>
        <Switch>
          <Route path="/" component={Index} />
          <Route path="/rooms" component={RoomsPage} />
          <Route path="/rooms/:slug" component={RoomDetail} />
          <Route path="/dining" component={DiningPage} />
          <Route path="/spa" component={SpaPage} />
          <Route path="/experiences" component={ExperiencesPage} />
          <Route path="/offers" component={OffersPage} />
          <Route path="/gallery" component={GalleryPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/book" component={BookPage} />
          <Route path="/admin" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isAdmin && <Footer />}
      <ChatWidget />
    </>
  );
}

function App() {
  return (
    <Provider>
      <Shell />
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
      {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
