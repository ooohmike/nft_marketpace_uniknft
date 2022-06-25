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

// @mui material components
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "admin/components/MDBox";
import MDTypography from "admin/components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "admin/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "admin/examples/Navbars/DashboardNavbar";
import DataTable from "admin/examples/Tables/DataTable";

import MDAvatar from "admin/components/MDAvatar";
import MDBadge from "admin/components/MDBadge";
import { getEllipsisTxt } from "helpers/formatters";
import Binance from 'assets/img/BSC.png';
import Polygon from 'assets/img/Polygon.png';
import Ethereum from 'assets/img/Ethereum.png';
import Fantom from 'assets/img/Fantom.png';

const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;

// Data

function Listings() {

  const { Moralis } = useMoralis();
  const [rows, setRowTbls] = useState([]);

  useEffect(() => {
    getListings();
  }, []);

  const columns = [
    { Header: "items", accessor: "items", align: "left" },
    { Header: "author", accessor: "author", align: "left" },
    { Header: "owner", accessor: "owner", align: "left" },
    { Header: "price", accessor: "price", align: "center" },
    { Header: "likes", accessor: "likes", align: "center" },
    { Header: "contract", accessor: "contract", align: "left" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "network", accessor: "network", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

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
    "Binance": "https://bscscan.com/",
    "Ethereum": "https://etherscan.io/",
    "Fantom": "https://ftmscan.com/",
    "Mumbai": "https://polygonscan.com/"
  };
  // const chainUrl = {
  //   "Binance": "https://testnet.bscscan.com/",
  //   "Ethereum": "https://ropsten.etherscan.io/",
  //   "Fantom": "https://testnet.ftmscan.com/",
  //   "Mumbai": "https://explorer-mumbai.maticvigil.com/"
  // };

  const handleDel = async (nftId, contractAddress, sellType) => {
    if (sellType !== "") {
      alert("this item is selling so can not delete this item");
      return;
    }
    try {
      const query = new Moralis.Query("NFTs");
      query.equalTo('contractAddress', contractAddress);
      query.equalTo('nftId', nftId);
      let object = await query.first();
      await object.destroy();
      alert("success");
      getListings();

    } catch (err) {
      alert(err?.message ? err?.message : err);
    }
  }

  const getListings = async () => {
    Moralis.start({ serverUrl, appId });
    let listings = await Moralis.Cloud.run("getListings");
    let array = [];
    for (let listing of listings) {
      const rowData = {
        items: <Items image={listing.imgpath} name={listing.name} des={listing.description} />,
        author: <Man title={listing?.author[0].username} address={listing.creator} />,
        owner: <Man title={listing?.owner[0].username} address={listing.currentOwner} />,
        price: (<MDTypography component="div" variant="caption" color="text" fontWeight="medium">{listing?.price ? listing.price : "NO"}</MDTypography>),
        likes: (<MDTypography component="div" variant="caption" color="text" fontWeight="medium">{listing?.likes}</MDTypography>),
        contract: (<MDTypography component="a" target="_blank" href={chainUrl[listing?.chainType] + 'address/' + listing.contractAddress} variant="caption" color="text" fontWeight="medium">
          {getEllipsisTxt(listing.contractAddress)}
        </MDTypography>),
        status: (<MDBox ml={-1}>
          <MDBadge badgeContent={listing?.sellType === 'now' ? "buy now" : listing?.sellType} color={listing?.sellType === "now" ? "success" : "info"} variant="gradient" size="sm" />
        </MDBox>),
        network: <MDAvatar src={chain[listing?.chainType]} name="chain" size="sm" />,
        action: (<MDTypography component="a" onClick={() => handleDel(listing.nftId, listing.contractAddress, listing.sellType)} variant="caption" color="text" fontWeight="medium">
          Delete
        </MDTypography>)
      };
      array.push(rowData);
    }
    setRowTbls(array);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  NFT Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={true}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  canSearch={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
          {/* <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Projects Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid> */}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Listings;
