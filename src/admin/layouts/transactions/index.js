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

import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Table, Space, Tag } from "antd";
import { Link } from "react-router-dom";
import Ethereum from "assets/img/Ethereum.png";
import { getEllipsisTxt } from "helpers/formatters";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "admin/components/MDBox";
// Material Dashboard 2 React example components
import DashboardLayout from "admin/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "admin/examples/Navbars/DashboardNavbar";

const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;

function Transaction() {
  const { Moralis, account } = useMoralis();

  const [transactions, setTransaction] = useState([]);

  const chain = {
    Binance: "https://bscscan.com/",
    Ethereum: "https://etherscan.io/",
    Fantom: "https://ftmscan.com/",
    Polygon: "https://polygonscan.com/",
    // "Binance": "https://testnet.bscscan.com/",
    // "Ethereum": "https://ropsten.etherscan.io/",
    // "Fantom": "https://testnet.ftmscan.com/",
    // "Mumbai": "https://explorer-mumbai.maticvigil.com/"
  };

  useEffect(() => {
    Moralis.start({ serverUrl, appId });
    getTransactions();
  }, []);

  const getTransactions = async () => {
    const query = new Moralis.Query("Transactions");
    query.descending("createdAt");
    let results = await query.find({ useMasterKey: true });
    let array = [];
    for (let result of results) {
      array.push(result.attributes);
    }
    setTransaction(array);
  };

  const transactionTbl = [
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => (
        <Space size="middle">
          <img src={Ethereum} style={{ width: "20px" }} alt="eth" />
          <span>&nbsp;&nbsp;{text} ETH</span>
        </Space>
      ),
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
      render: (text) => (
        <Link to={"/account/" + text}>{getEllipsisTxt(text)}</Link>
      ),
    },
    {
      title: "To",
      dataIndex: "to",
      key: "to",
      render: (text) => (
        <Link to={"/account/" + text}>{getEllipsisTxt(text)}</Link>
      ),
    },
    {
      title: "Contract",
      dataIndex: "contractAddress",
      key: "contractAddress",
      render: (text, record) => (
        <a href={chain[record.ChainType] + "address/" + text} target="_blank">
          {getEllipsisTxt(text)}
        </a>
      ),
    },
    {
      title: "Hash",
      dataIndex: "hash",
      key: "hash",
      render: (text, record) => (
        <a href={chain[record.ChainType] + "tx/" + text} target="_blank">
          {getEllipsisTxt(text)}
        </a>
      ),
    },
    // {
    //     title:"Type",
    //     dataIndex:"type",
    //     render:(text, record) => (
    //         <Tag color={record.to === account ? "geekblue" : 'green'}>
    //             {record.to === account ? "BUY":"SELL"}
    //         </Tag>
    //     )
    // }
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item lg={12}>
            <Table columns={transactionTbl} dataSource={transactions} />
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Transaction;
