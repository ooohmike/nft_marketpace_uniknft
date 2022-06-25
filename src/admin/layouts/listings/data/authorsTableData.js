/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React components
import React, {useEffect, useState} from "react";
import {useMoralis} from "react-moralis";
import Tooltip from "@mui/material/Tooltip";

import MDBox from  "admin/components/MDBox";
import MDTypography from  "admin/components/MDTypography";
import MDAvatar from  "admin/components/MDAvatar";
import MDBadge from  "admin/components/MDBadge";
import { getEllipsisTxt } from "helpers/formatters";
import Binance from 'assets/img/BSC.png';
import Polygon from 'assets/img/Polygon.png';
import Ethereum from 'assets/img/Ethereum.png';
import Fantom from 'assets/img/Fantom.png';

const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;

export default function Data() {

  const { Moralis } = useMoralis();
  const {rows, setRows} = useState([]);

  useEffect(() => {
    getListings();
  }, [])

  const chain = {
    "Binance": Binance,
    "Ethereum": Ethereum,
    "Fantom": Fantom,
    "Polygon": Polygon
  };
  
  const Items = ({ image, name, des }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{des}</MDTypography>
      </MDBox>
    </MDBox>
  );
  
  const Man = ({ title, address }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <Tooltip key={address} title={address} placement="top">

        <MDTypography variant="caption">{getEllipsisTxt(address)}</MDTypography>
      </Tooltip>
    </MDBox>
  );

  const chainUrl = {
    // "Binance": "https://testnet.bscscan.com/",
    // "Ethereum": "https://ropsten.etherscan.io/",
    // "Fantom": "https://testnet.ftmscan.com/",
    // "Mumbai": "https://explorer-mumbai.maticvigil.com/",
    "Binance": "https://bscscan.com/",
    "Ethereum": "https://etherscan.io/",
    "Fantom": "https://ftmscan.com/",
    "Mumbai": "https://polygonscan.com/"
  };

  const handleDel = async(nftId, contractAddress, sellType) => {
    if(sellType !== "") {
      alert("this item is selling so can not delete this item");
      return;
    }
    const query = new Moralis.Query("NFTs");
    query.equalTo('contractAddress', contractAddress);
    query.equalTo('nftId', nftId);
    let object = await query.first();
    await object.destroy();
    getListings();
  }

  const getListings = async() => {
    Moralis.start({serverUrl, appId});
    let listings = await Moralis.Cloud.run("getListings");
    let array = [];
    for (let listing of listings) {
      const rowData = {
        items: <Items image={listing.imgpath} name={listing.name} des={listing.description} />,
        author: <Man title={listing?.author[0].username} address={listing.creator} />,
        owner: <Man title={listing?.owner[0].username} address={listing.currentOwner} />,
        price: <MDTypography component="div" variant="caption" color="text" fontWeight="medium">{listing?.price?listing.price:"NO"}</MDTypography>,
        likes: <MDTypography component="div" variant="caption" color="text" fontWeight="medium">{listings.likes}</MDTypography>,
        contract: <MDTypography component="a" href={chainUrl[listing?.ChainType]} variant="caption" color="text" fontWeight="medium">
                    {getEllipsisTxt(listing.contractAddress)}
                  </MDTypography>,
        status: <MDBox ml={-1}>
                  <MDBadge badgeContent={listing?.sellType === 'now'?"buy now":listing?.sellType} color={listing?.sellType === "now"?"success":"info"} variant="gradient" size="sm" />
                </MDBox>,
        network: <MDAvatar src={chain[listing?.ChainType]} name="chain" size="sm" />,
        action: <MDTypography component="a" onClick={() => handleDel()} variant="caption" color="text" fontWeight="medium">
                  Delete
                </MDTypography>
      };
      array.push(rowData);
    }
    setRows(array);
  };
  
  return {
    columns: [
      { Header: "items", accessor: "items", width: "35%", align: "left" },
      { Header: "author", accessor: "author", align: "left" },
      { Header: "owner", accessor: "owner", align: "center" },
      { Header: "price", accessor: "price", align: "center" },
      { Header: "likes", accessor: "likes", align: "center" },
      { Header: "contract", accessor: "contract", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "network", accessor: "network", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: rows
  };
}
