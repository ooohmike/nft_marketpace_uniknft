import React, { useEffect, useState, useRef } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
// import { Carousel } from "react-responsive-carousel";
import Carousel from "react-multi-carousel";
// import {CarouselMulti} from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import cn from "classnames";
import { useMoralis } from "react-moralis";
import Blockie from "components/Blockie";
import { useHistory } from "react-router-dom";
import Countdown from "react-countdown";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Modal } from "react-responsive-modal";

import "react-responsive-modal/styles.css";
import "../assets/css/home.css";
import drops from "../assets/img/new_home/drops.png";
import tools from "../assets/img/new_home/tools.png";
import liveAuctions from "../assets/img/new_home/live-auction.png";
import featuredArt from "../assets/img/new_home/featured-art.png";
import printNft from "../assets/img/new_home/print-nft.png";
import learnMore from "../assets/img/new_home/learn-more.png";
import topArtists from "../assets/img/new_home/top-artists.png";
import topCollectors from "../assets/img/new_home/top-collectors.png";
import verticalCarousel from "../assets/img/new_home/vertical-carousel.png";
import verticalCarouselTopArrow from "../assets/img/new_home/vertical-carousel-top-arrow.png";
import verticalCarouselDownArrow from "../assets/img/new_home/vertical-carousel-down-arrow.png";
import verticalCarouselDesc from "../assets/img/new_home/vertical-carousel-des.png";

import carousel1 from "../assets/img/new_home/sec-carousel-1.png";
import carousel2 from "../assets/img/new_home/sec-carousel-2.png";
import carousel3 from "../assets/img/new_home/sec-carousel-3.png";
import carousel4 from "../assets/img/new_home/sec-carousel-4.png";
import carousel5 from "../assets/img/new_home/sec-carousel-5.png";
import featured1 from "../assets/img/home/photo1.png";

import slide1 from "../assets/img/new_home/header.png";
import home_feature_2 from "../assets/img/home/home-feature-2.png";
import Binance from "../assets/img/BSC.png";
import Polygon from "../assets/img/Polygon.png";
import Ethereum from "../assets/img/Ethereum.png";
import Fantom from "../assets/img/Fantom.png";
import smallUpDown from "../assets/img/market/small_up_down.png";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
    partialVisibilityGutter: 30,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    partialVisibilityGutter: 30,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    partialVisibilityGutter: 30,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    partialVisibilityGutter: 30,
  },
};

const responsive2 = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 592 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 592, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const chain = {
  Binance: Binance,
  Ethereum: Ethereum,
  Fantom: Fantom,
  Polygon: Polygon,
};

const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;
const BASE_URL = "https://api.coingecko.com/api/v3";
const ETH_USD_PRICE_URL = "/simple/price?ids=ethereum&vs_currencies=usd";

const Home = () => {
  const [dropItems, setDropItems] = useState([]);
  const [aucList, setAuccList] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [artists, setArtists] = useState([]);
  const [ethPrice, setPrice] = useState();
  const [showModal, setShowModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [featuredNFTs, setFeaturedNFTs] = useState([]);
  const { Moralis } = useMoralis();

  const history = useHistory();

  useEffect(() => {
    Moralis.start({ serverUrl, appId });
    getBuyableNFTs();
    getAuctions();
    getEthPrice();
    getArtists();
    getCollectors();
    getFeaturedNFTs();
  }, []);

  const getCallback = () => {
    history.go(0);
  };

  const getReturnValues = (countDown) => {
    // calculate time left
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return [days, hours, minutes, seconds];
  };

  const getBuyableNFTs = async () => {
    const q = new Moralis.Query("NFTs");
    q.equalTo("sellType", "now");
    q.descending("updatedAt");
    q.limit(4);
    let qresult = await q.find();
    setDropItems(qresult);
  };

  const getAuctions = async () => {
    const query = new Moralis.Query("Auctions");
    query.greaterThan("end", new Date());
    query.equalTo("active", true);
    query.ascending("price");
    query.limit(4);
    let results = await query.find();
    let array = [];
    // console.log("currentAuctions: ", results);
    for (let result of results) {
      const params = { address: result?.attributes?.owner };
      let userInfo = await Moralis.Cloud.run("getUserInfo", params);
      const subquery = new Moralis.Query("NFTs");
      subquery.equalTo("contractAddress", result?.attributes?.contractAddress);
      subquery.equalTo("nftId", result?.attributes?.nftId);
      let nft = await subquery.first();
      result.profile = userInfo?.profile;
      result.name = nft?.attributes?.name;
      result.imgpath = nft?.attributes?.imgpath;
      console.log(
        userInfo,
        nft,
        result?.attributes?.nftId,
        result?.attributes?.contractAddress
      );
      array.push(result);
    }
    setAuccList(array);
    // setAucDrop(array1);
  };

  const getFeaturedNFTs = async () => {
    const q = new Moralis.Query("NFTs");
    q.descending("likes");
    q.limit(2);
    let qresult = await q.find();
    setFeaturedNFTs(qresult);
  };

  const handleAccount = (address, category) => {
    history.push("/account-" + category + "/" + address);
  };

  const getEthPrice = async () => {
    // console.log("Here", ETH_USD_PRICE_URL)
    // console.log("Here", BASE_URL + ETH_USD_PRICE_URL)
    var ethPriceApi = BASE_URL + ETH_USD_PRICE_URL;
    const response = await fetch(ethPriceApi);
    const data = await response.json();
    let usdEthPrice = data.ethereum.usd;
    setPrice(usdEthPrice);
  }

  const handleAddress = (address, id) => {
    history.push("/asset/" + address + "/" + id);
  };

  const getArtists = async () => {
    const params = { counts: 3 };
    let results = await Moralis.Cloud.run("getArtists", params);
    console.log(results, "artists");
    if (results.length) setArtists(results);
  };

  const getCollectors = async () => {
    const params = { counts: 4 };
    let results = await Moralis.Cloud.run("getCollectors", params);
    console.log(results, "collectors");
    if (results.length) setCollectors(results);
  };

  const link2detail = (addr, id) => {
    console.log("address", addr, "id", id)
    history.push("/asset/" + addr + "/" + id);
  };

  const submitEmailAddress = async () => {
    console.log("+++++++++++++++++++++");
    const UserCapture = Moralis.Object.extend("_User");
    const query = new Moralis.Query(UserCapture);
    console.log("query", query);
    query.equalTo("ethAddress", window.localStorage.getItem("userAddress"));
    console.log("query", query);
    const user = await query.first();
    console.log("user0000", user);
    user.set("email", userEmail);
    try {
      await user.save();
    } catch (e) {
      alert(e);
    }
    setShowModal(false);
  };

  const renderDropItem = (props, index) => {
    return (
      <div
        className="product-item drop-item"
        onClick={() => {
          // console.log("props", props)
          link2detail(props?.contractAddress, props?.nftId);
        }}
        key={index}
      >
        {/* {console.log("item data:", props)} */}
        <div className="hear-score">
          <i className="fa fa-heart-o customize-heart" />
          <span className="socre-value">{props.likes}</span>
        </div>
        <div className="market-img-container">
          <img
            alt=""
            className="img-responsive"
            style={{ width: "100%" }}
            src={props?.imgpath}
          // placeholderSrc={loading}
          />
        </div>
        <div
          className={
            "market-detail market-detail-bg-" +
            ((Number(props?.nftId) % 12) + 1)
          }
        >
          <div className="market-item-title">
            <div className="title-info">{props?.name}</div>
            <div className="title-info">PRICE</div>
          </div>
          <div className="market-item-galaxy">
            <div className="galaxy-club">
              {/* {props?.attributes.name} */}
              {" #" + props?.nftId}{" "}
            </div>
            <div className="galaxy-price">
              <div className="cursorPointer">
                <img
                  className="img-responsive"
                  src={Ethereum}
                  alt="etherIcon"
                />
              </div>
              <div className="market-price">{props?.price}</div>
            </div>
          </div>
          <div className="market-offer">
            <div className="offer-for">
              <div className="cursorPointer">
                <img
                  className="img-responsive"
                  src={chain[props.chainType]}
                  alt=""
                />
              </div>
              <div>OFFER FOR</div>
            </div>
            <div className="offer-info">
              <div className="display-flex cursorPointer">
                <img className="img-responsive" src={smallUpDown} />
              </div>
              <div style={{ fontSize: "16px" }}>
                {props?.offerFor}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const render_auction_item = (props, index) => {
    let countDownDate =
      new Date(props?.attributes?.end).getTime() - new Date().getTime();

    // console.log("countdown date", countDownDate);
    // setInterval(() => {
    //    countDownDate =
    //   new Date(props?.attributes?.end).getTime() - new Date().getTime();
    // }, 1000);

    let down = getReturnValues(countDownDate);
    // console.log(down);
    return (
      <div className="auction-item" key={index}>
        <div className="reserve-met reserve-met-background">
          <div>RESERVE&nbsp;{props?.attributes?.reserve}</div>
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() =>
            handleAddress(
              props?.attributes?.contractAddress,
              props?.attributes?.nftId
            )
          }
        >
          <img
            className="auction-item-image img-responsive"
            src={props?.imgpath}
            alt=""
          />
        </div>
        <div className="auction-title">
          <div>{props?.attributes?.name}</div>
        </div>
        <div className="auction-detail reserve-met-background">
          <div className="author-avatar">
            {props?.profile ? (
              <img
                className="img-responsive"
                style={{ borderRadius: "50%", width: "45px", height: "45px" }}
                src={props?.profile}
                alt=""
              />
            ) : (
              <Blockie address={props?.attributes?.owner} scale={5} />
            )}
          </div>
          <div className="price">
            <span>{props?.attributes?.price}</span>
            <span className="real-price">
              [${(Number(props?.attributes?.price) * ethPrice).toFixed(3)}]
            </span>
          </div>
          <div className="end-block">
            AUCTION ENDS IN {props?.attributes?.end.toLocaleString()}
            {/* <i className="fa fa-exclamation-circle"></i> */}
          </div>
          <div className="auction-time">
            {/* <div className="time-item">
              <div className="time-value">{down[0]}</div>
              <div className="time-caption">DAYS</div>
            </div>
            <div className="time-item">
              <div className="time-value">{down[1]}</div>
              <div className="time-caption">HOURS</div>
            </div>
            <div className="time-item">
              <div className="time-value">{down[2]}</div>
              <div className="time-caption">MINUTES</div>
            </div>
            <div className="time-item">
              <div className="time-value">{down[3]}</div>
              <div className="time-caption">SECONDS</div>
            </div> */}

            {/* <Countdown date = {new Date(props?.attributes?.end).getTime()}></Countdown> */}
            {/* <Countdown date = {Date.now()+ 20000}></Countdown> */}

            <Countdown
              date={new Date(props?.attributes?.end).getTime()}
              renderer={render_countdown}
            />
          </div>
        </div>
      </div>
    );
  };

  const render_countdown = ({ days, hours, minutes, seconds }) => {
    return (
      <>
        <div className="time-item">
          <div className="time-value">{days}</div>
          <div className="time-caption">DAYS</div>
        </div>
        <div className="time-item">
          <div className="time-value">{hours}</div>
          <div className="time-caption">HOURS</div>
        </div>
        <div className="time-item">
          <div className="time-value">{minutes}</div>
          <div className="time-caption">MINS</div>
        </div>
        <div className="time-item">
          <div className="time-value">{seconds}</div>
          <div className="time-caption">SECS</div>
        </div>
      </>
    );
  };

  return (
    <div className="home font-family-2">
      <Carousel
        // showThumbs={false}
        // dynamicHeight={true}
        autoPlay={true}
        infinite={true}
        // showIndicators={false}
        // showArrows={false}
        responsive={{
          desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
          },
          tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
          },
          mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
          },
        }}
      >
        <div className="slide-item banner-item">
          <img className="img-responsive" src={slide1} alt="slide-image1" />
        </div>
        <div className="slide-item banner-item">
          <img className="img-responsive" src={slide1} alt="slide-image2" />
        </div>
        <div className="slide-item banner-item">
          <img className="img-responsive" src={slide1} alt="slide-image3" />
        </div>
      </Carousel>
      <div className="drop-subscription">
        <div className="img-container">
          <img className="img-responsive" src={drops} alt="dropImage" />
        </div>
        <div className="subscription">
          <button onClick={() => setShowModal(true)}>SUBSCRIBE</button>
        </div>
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <h2>Input your email address</h2>
        <form className="mt-4">
          <input
            type="email"
            className="email-address"
            id="user-email-address"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
          <button
            className="btn-submit"
            type="button"
            onClick={() => submitEmailAddress()}
          >
            submit
          </button>
        </form>
      </Modal>
      <div className="auction-content">
        <div className="container">
          {/* <div className="row" style={{ justifyContent: "space-between" }}> */}
          <Carousel responsive={responsive2}>
            {dropItems.map((drop, index) => {
              // console.log("drop", drop.attributes);
              return renderDropItem(drop?.attributes, index);
            })}
          </Carousel>
          {/* </div> */}
        </div>
      </div>
      <div className="live-auctions">
        <div className="img-container">
          <img className="img-responsive" src={liveAuctions} />
        </div>
      </div>
      {/* <div className="auction-content"> */}
      <Carousel
        className="auction-content"
        responsive={responsive2}
        infinite={true}
      >
        {aucList.map((auction, index) => {
          return render_auction_item(auction, index);
        })}
      </Carousel>

      {/* </div> */}
      <div className="tools">
        <div className="img-container">
          <img className="img-responsive" src={tools} />
        </div>
      </div>
      <div className="featured-art-title">
        <div className="img-container">
          <img className="img-responsive" src={featuredArt} />
        </div>
      </div>
      <div className="featured-content">
        {featuredNFTs.map((item, index) => {
          return (
            <div key={index} className="featured-item col-6" onClick={() => link2detail(item.attributes.contractAddress, item.attributes.nftId)}>
              <div>
                <img
                  className="img-responsive"
                  src={item?.attributes.imgpath}
                  alt="nftImage"
                />
              </div>
              <div className="color-light-yellow featured-art-name">
                {item?.attributes.name}
              </div>
            </div>
          );
        })}
        {/* <div className="featured-item">
          <div>
            <img className="img-responsive" src={home_feature_2} />
          </div>
          <div className="color-light-yellow featured-art-name">
            HACKATAO X CHRISTIE'S: HACK OF A BEAR
          </div>
        </div> */}
      </div>
      <div className="nfts">
        <div className="img-container">
          <img className="img-responsive" src={printNft} />
        </div>

        <Carousel responsive={responsive} arrows={true} autoPlay={true}>
          <div className="img-container carousel-colulmn">
            <img className="img-responsive width-100" src={carousel1} />
            <div className="carousel-name">
              <span>BITBONES</span>
            </div>
          </div>
          <div className="img-container carousel-colulmn">
            <img className="img-responsive width-100" src={carousel2} />
            <div className="carousel-name">
              <span>RIVERMEN</span>
            </div>
          </div>
          <div className="img-container carousel-colulmn">
            <img className="img-responsive width-100" src={carousel3} />
            <div className="carousel-name">
              <span>CRYPTOWHALEIS RISING</span>
            </div>
          </div>
          <div className="img-container carousel-colulmn">
            <img className="img-responsive width-100" src={carousel4} />
            <div className="carousel-name">
              <span>FOLIA</span>
            </div>
          </div>
          <div className="img-container carousel-colulmn">
            <img className="img-responsive width-100" src={carousel5} />
            <div className="carousel-name">
              <span>ATARI ZED</span>
            </div>
          </div>
          <div className="img-container carousel-colulmn">
            <img className="img-responsive width-100" src={carousel1} />
            <div className="carousel-name">
              <span>BITBONES</span>
            </div>
          </div>
          <div className="img-container carousel-colulmn">
            <img className="img-responsive width-100" src={carousel2} />
            <div className="carousel-name">
              <span>RIVERMEN</span>
            </div>
          </div>
          <div className="img-container carousel-colulmn">
            <img className="img-responsive width-100" src={carousel3} />
            <div className="carousel-name">
              <span>CRYPTOWHALEIS RISING</span>
            </div>
          </div>
          <div className="img-container carousel-colulmn">
            <img className="img-responsive width-100" src={carousel4} />
            <div className="carousel-name">
              <span>FOLIA</span>
            </div>
          </div>
          <div className="img-container carousel-colulmn">
            <img className="img-responsive width-100" src={carousel5} />
            <div className="carousel-name">
              <span>ATARI ZED</span>
            </div>
          </div>
        </Carousel>
      </div>
      <div className="top-artists">
        <div className="img-container">
          <img className="img-responsive" src={topArtists} />
        </div>
      </div>
      <div className="top-content container">
        <div className="row">
          {artists.map((artist, index) => (
            <div
              className="top-item col-12 col-sm-6 col-md-4"
              style={{ cursor: "pointer" }}
              onClick={() => handleAccount(artist?.creator, "artist")}
              key={index}
            >
              <div>
                {artist?.user[0]?.profile ? (
                  <img
                    className="img-responsive img-artist-profile"
                    src={artist?.user[0]?.profile}
                    alt="profileImage"
                  />
                ) : (
                  <img
                    className="img-responsive img-artist-profile"
                    src="../avatar.jpg"
                    alt=""
                  />
                )}
              </div>
              <div className="top-item-caption">
                <div>{artist?.user[0]?.username}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="learn-more">
        <div className="img-container">
          <img className="img-responsive" src={learnMore} alt="learnMore" />
        </div>
        <div className="learn-more-subscription">
          <button>LEARN MORE</button>
        </div>
      </div>
      <div className="top-collectors-title">
        <div className="img-container">
          <img className="img-responsive" src={topCollectors} />
        </div>
      </div>
      <div className="top-collectors-content container">
        <div className="row">

          {collectors.map((collector, index) => (
            <div
              className="collector-item col-12 col-sm-6 col-md-4"
              style={{ cursor: "pointer" }}
              onClick={() => handleAccount(collector?.creator, "collector")}
              key={index}
            >
              <div>
                {collector?.user[0]?.profile ? (
                  <img
                    className="img-responsive img-collector-profile"
                    src={collector?.user[0]?.profile}
                    alt="profileImage"
                  />
                ) : (
                  <img
                    className="img-responsive img-collector-profile"
                    src="../collectors6.png"
                    alt="profileImage"
                  />
                )}
              </div>
              <div className="collector-item-caption">
                <div>{collector?.user[0]?.username}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="create-nft">
        <div className="vertical-carousel">
          <div className="img-container">
            <img
              className="img-responsive"
              src={verticalCarousel}
              alt="nftImage"
            />
          </div>
          <div className="up-down">
            <button>
              <img
                className="img-responsive"
                src={verticalCarouselTopArrow}
                alt="carouselUpImage"
              />
            </button>
            <button>
              <img
                className="img-responsive"
                src={verticalCarouselDownArrow}
                alt="carouselDownImage"
              />
            </button>
          </div>
        </div>
        <div className="img-container">
          <img
            className="img-responsive"
            src={verticalCarouselDesc}
            alt="carouselDescImage"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
