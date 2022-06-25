import React, { Component, useEffect, useState } from "react";
import {Link} from 'react-router-dom';
import { useMoralis } from "react-moralis";
import "../assets/css/filter.css";

function Filter(props) {
  const { items } = props;
  const [status, setStatus] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [chains, setChains] = useState([]);
  const { Moralis } = useMoralis();
  const [topArtists, setTopArtists] = useState([]);

  const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
  const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;

  const filterNFTs = () => {
    let newItems = [];
    if (items && items.length > 0) {
      if (items && items.length > 0) {
        newItems = items.filter(
          (item) =>
            item.attributes.price >= minPrice &&
            item.attributes.price <= maxPrice
        );
      }
      if (status !== "") {
        newItems = newItems.filter(
          (item) => item.attributes.sellType === status
        );
      }
    }
    if (chains.length > 0) {
      newItems = newItems.filter((item) =>
        chains.includes(item.attributes.ChainType.toLowerCase())
      );
    }
    props.func(newItems);
  };

  useEffect(() => {
    getArtists();
  }, []);

  const getArtists = async () => {
    Moralis.start({ serverUrl, appId });
    const params = { counts: 24 };
    let artists = await Moralis.Cloud.run("getArtists", params);
    console.log("&&&&&&&&&&&&&&&&&&&&&&", artists);
    let array = [];
    for (let artist of artists) {
      const params = { address: artist.creator };
      let result = await Moralis.Cloud.run("getArtistInfo", params);
      console.log(result);
      const data = {
        profile: artist?.user[0].profile,
        address: artist.creator,
        name: artist?.user[0]?.username,
        count: artist?.count,
        total: result[0]?.total ? result[0]?.total : 0,
        sale: result[0]?.count ? result[0]?.count : 0,
      };
      array.push(data);
    }
    array.sort((a, b) => b.total - a.total);
    if (array.length > 5) {
      array.slice(0.5);
    }
    setTopArtists(array);
  };

  const toggleChanins = (chain, chainStatus) => {
    let chainTemp = JSON.parse(JSON.stringify(chains));
    if (chainStatus === true) {
      if (!chainTemp.includes(chain)) {
        chainTemp = [...chainTemp, chain];
      }
    } else {
      let index = chainTemp.findIndex((item) => item === chain);
      if (index >= 0) {
        chainTemp.splice(index, 1);
      }
    }
    setChains(chainTemp);
  };
  useEffect(() => {
    filterNFTs();
  }, [status, chains]);

  return (
    <div className="filter font-family-1">
      <div className="title">FILTER</div>

      <div className="status-filter">
        <div className="status-title">STATUS</div>
        <div className="status-grid-system">
          <div className="status-left">
            {status !== "now" ? (
              <button
                className="btn btn-now-available status-property"
                onClick={() => setStatus("now")}
              >
                BUY NOW
              </button>
            ) : (
              <button
                className="btn btn-now-available status-property active"
                onClick={() => setStatus("now")}
              >
                BUY NOW
              </button>
            )}
          </div>
          <div className="status-right">
            {status !== "auction" ? (
              <button
                className="btn btn-auction-available status-property"
                onClick={() => setStatus("auction")}
              >
                AUCTION
              </button>
            ) : (
              <button
                className="btn btn-auction-available status-property active"
                onClick={() => setStatus("auction")}
              >
                AUCTION
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="price-filter">
        <div className="market-price">PRICE</div>
        <div className="price-grid-system">
          <div className="filter-price-range">
            <input
              className="price-property min-price font-family-2"
              placeholder="min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              className="price-property max-price font-family-2"
              placeholder="max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div className="btn  btn-apply-price" onClick={() => filterNFTs()}>
            APPLY
          </div>
        </div>
      </div>

      <div className="chain-filter">
        <div className="filter-chains-title">CHAINS</div>
        <div className="chain-filter-options">
          <div className="filter-chain-option">
            <input
              type="checkbox"
              id="filter-chain-ethereum"
              className="filter-chain-check"
              onChange={(e) => toggleChanins("ethereum", e.target.checked)}
            ></input>
            <label for="filter-chain-ethereum">Ethereum</label>
          </div>
          <div className="filter-chain-option">
            <input
              type="checkbox"
              id="filter-chain-polygon"
              className="filter-chain-check"
              onChange={(e) => toggleChanins("polygon", e.target.checked)}
            ></input>
            <label for="filter-chain-polygon">Polygon</label>
          </div>
          <div className="filter-chain-option">
            <input
              type="checkbox"
              id="filter-chain-BSC"
              className="filter-chain-check"
              onChange={(e) => toggleChanins("binance", e.target.checked)}
            ></input>
            <label for="filter-chain-BSC">BSC</label>
          </div>
          <div className="filter-chain-option">
            <input
              type="checkbox"
              id="filter-chain-Fantom"
              className="filter-chain-check"
              onChange={(e) => toggleChanins("fantom", e.target.checked)}
            ></input>
            <label for="filter-chain-Fantom">Fantom</label>
          </div>
        </div>
      </div>
      {/* 
      <div className="market-chain-property">ETHEREUM</div>
      <div className="market-chain-property">POLYGON</div>
      <div className="market-chain-property">KLAYTN</div> */}

      <div className="aside-top-artists">
        <div className="aside-top-artists-title">TOP ARTISTS</div>

        {topArtists.map((artist, index) => {
          return (
            <div className="aside-top-artist">
              <div className="aside-top-artist-label font-family-2">
                TOP SELLER {index + 1}
              </div>

              <div className="top-artist-name">
                <Link to={`/account-artist/`+artist.address}>{artist.name}</Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* <div className="status-property font-family-2 mt-17">TOP SELLER 2</div>
      <div className="collection-horizontal-line"></div>
      <div className="force-letter">CATLAND METAVERSE</div>
      <div className="status-property mt-17">TOP SELLER 3</div>
      <div className="collection-horizontal-line"></div>
      <div className="force-letter">ZEEKAY7</div>
      <div className="status-property mt-17">TOP SELLER 4</div>
      <div className="collection-horizontal-line"></div>
      <div className="force-letter">DCRYPTO88</div>
      <div className="status-property mt-17">TOP SELLER 5</div>
      <div className="collection-horizontal-line"></div>
      <div className="force-letter">NOT BORED LIONS</div> */}
    </div>
  );
}

export default Filter;
