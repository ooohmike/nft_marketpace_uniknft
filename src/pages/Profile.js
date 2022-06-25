import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Tab, Nav, Badge } from "react-bootstrap";
import { useMoralis } from "react-moralis";
import Fav from "./profile/favorite";
import Offers from "./profile/offers";
import Transactions from "./profile/transaction";
import Blockie from "components/Blockie";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/profile.css";
import Collect from "./profile/collect";

const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;

const Profile = (props) => {
  const {category} = props;
  const [collects, setCollect] = useState(0);
  const [favorites, setFavorite] = useState(0);
  const [userInfo, setUser] = useState({});
  const [offers, setOffers] = useState(0);
  const { Moralis, account } = useMoralis();
  const { address } = useParams();

  useEffect(() => {
    Moralis.start({ serverUrl, appId });
  }, []);

  useEffect(() => {
    collect();
    getUserData();
  }, [account]);

  const collect = async () => {
    const query = new Moralis.Query("NFTs");
    query.equalTo("currentOwner", address);
    let result = await query.count({ useMasterKey: true });
    console.log(result, "count");
    const queryFav = new Moralis.Query("NFTs");
    queryFav.containedIn("likers", [account]);
    let fav = await queryFav.count({ useMasterKey: true });
    const queryOffer = new Moralis.Query("Offers");
    queryOffer.equalTo("wallet", account);
    let offer = await queryOffer.count({ useMasterKey: true });
    setOffers(offer);
    setFavorite(fav);
    setCollect(result);
  };

  const getUserData = async () => {
    const params = { address: address };
    let userInfo = await Moralis.Cloud.run("getUserInfo", params);
    console.log(userInfo);
    setUser({ name: userInfo.name, profile: userInfo?.profile });
  };

  return (
    <>
      <Container className="font-family-2">
        {/* <div
          style={{
            backgroundImage:
              "url(" +
              require("assets/img/profile/fabio-mangione.jpg").default +
              ")",
          }}
          className="page-header page-header-xs"
        ></div> */}
        <div className="page-header page-header-xs">
         
            {userInfo?.profile ? (
              <img
                alt="..."
                className="img-no-padding img-responsive img-user-profile"
                src={userInfo?.profile}
              />
            ) : (
              <img
                alt=""
                className="img-no-padding img-responsive img-user-profile"
                src="../../avatar.jpg"
              />
            )}
            {/* <div className="name">
              <h4 className="title">
                {userInfo?.name} <br />
              </h4>
            </div> */}
          <div className="artist-label-name">
            {category === "artist" && <h1 className="artist-label">
              Artist
              <h2 className="artist-name">{userInfo?.name}</h2>
            </h1>}
            {category === "collector" && <h1 className="artist-label">
              Collector
              <h2 className="artist-name">{userInfo?.name}</h2>
            </h1>}
            
          </div>
        </div>
        <br />
        <Tab.Container defaultActiveKey="collect">
          <div className="nav-tabs-navigation">
            <div className="nav-tabs-wrapper">
              <Nav role="tablist" className="nav-tabs">
                <Nav.Item>
                  <Nav.Link eventKey="collect">
                    Collection&nbsp;
                    <Badge pill bg="dark">
                      {collects}
                    </Badge>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="favorite">
                    Favorite&nbsp;
                    <Badge pill bg="dark">
                      {favorites}
                    </Badge>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="offers">
                    My Offers&nbsp;
                    <Badge pill bg="dark">
                      {offers}
                    </Badge>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="transactions">Transactions</Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          </div>
          <Tab.Content>
            <Tab.Pane eventKey="collect">
              <Collect address={address} />
            </Tab.Pane>
            <Tab.Pane eventKey="favorite">
              <Fav />
            </Tab.Pane>
            <Tab.Pane eventKey="offers">
              <Offers />
            </Tab.Pane>
            <Tab.Pane eventKey="transactions">
              <Transactions />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </>
  );
};

export default Profile;
