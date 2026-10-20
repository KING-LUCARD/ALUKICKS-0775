import { useState } from "react";
import { Route, Switch } from "wouter";
import { Provider } from "./components/provider";
import { Nav } from "./components/nav";
import { Footer } from "./components/footer";
import { CartDrawer } from "./components/cart-drawer";
import { Cursor } from "./components/cursor";
import { Preloader } from "./components/preloader";
import { SmoothScroll } from "./components/smooth-scroll";
import { IntroContext } from "./lib/intro";
import Index from "./pages/index";
import ShopPage from "./pages/shop";
import ProductPage from "./pages/product";
import CheckoutPage from "./pages/checkout";
import StoryPage from "./pages/story";
import NotFound from "./pages/not-found";

function App() {
  const [ready, setReady] = useState(false);
  return (
    <Provider>
      <IntroContext.Provider value={ready}>
        <SmoothScroll />
        <Preloader onDone={() => setReady(true)} />
        <Nav />
        <main>
          <Switch>
            <Route path="/" component={Index} />
            <Route path="/shop" component={ShopPage} />
            <Route path="/product/:slug" component={ProductPage} />
            <Route path="/checkout" component={CheckoutPage} />
            <Route path="/story" component={StoryPage} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
        <CartDrawer />
        <Cursor />
        <div className="grain" aria-hidden />
      </IntroContext.Provider>
    </Provider>
  );
}

export default App;
