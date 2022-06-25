import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Secondary from './pages/Secondary';
import Detail from "./pages/Detail";
import Collector from './pages/Collector';
import Artists from './pages/Artists';
import Primary from './pages/Primary';
import Home from './pages/Home';
import Create from './pages/Create';
import Profile from './pages/Profile';
import ItemSell from './pages/ItemSell';
import Setting from './pages/Setting';



const HomePage = () => {
  return (
    <div style={{ flexDirection: "column", display: 'flex' }}>
      <Router basename="/home">
        <Header />
        <div>
          <Switch>
            <Route path="/artist">
              <Artists />
            </Route>
            <Route path="/collector">
              <Collector />
            </Route>
            <Route path="/secondary">
              <Secondary />
            </Route>
            <Route path="/primary">
              <Primary />
              {/* <NFTTokenIds /> */}
            </Route>
            <Route path="/create">
              <Create />
            </Route>
            <Route path="/asset/:address/:nftId">
              <Detail />
            </Route>
            <Route path="/account-artist/:address">
              <Profile category="artist" />
            </Route>
            <Route path="/account-collector/:address">
              <Profile category="collector" />
            </Route>
            <Route path="/settings">
              <Setting />
            </Route>
            <Route path="/sell/:ownerAddress/:uniqueId">
              <ItemSell />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
      <Footer />
    </div>
  )
}

export default HomePage;
