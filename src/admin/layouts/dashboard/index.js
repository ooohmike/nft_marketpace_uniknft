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
import {useEffect, useState} from "react";
import { useMoralis } from "react-moralis";

import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from  "admin/components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from  "admin/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from  "admin/examples/Navbars/DashboardNavbar";
import ReportsBarChart from  "admin/examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from  "admin/examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from  "admin/examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from  "admin/layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from  "admin/layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from  "admin/layouts/dashboard/components/Projects";
import OrdersOverview from  "admin/layouts/dashboard/components/OrdersOverview";

const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;

function Dashboard() {
  // const { sales, tasks } = reportsLineChartData;
  const [nfts, setNFTs] = useState(0);
  const [users, setUsers] = useState(0);
  const [trans, setTrans] = useState(0);
  const [auctions, setAuctions] = useState(0);

  const {Moralis} = useMoralis();

  useEffect(() => {
    getAllCounts();
  }, []);

  const getAllCounts = async() => {
    Moralis.start({serverUrl, appId});
    try {
      const query = new Moralis.Query('NFTs');
      let nftCounts = await query.count();
      setNFTs(nftCounts);
      const userCounts = await Moralis.Cloud.run('getUserCounts');
      setUsers(userCounts);
      const transQuery = new Moralis.Query('Transactions');
      let transCounts = await transQuery.count();
      setTrans(transCounts);
      const aucQuery = new Moralis.Query('Auctions');
      let aucCounts = await aucQuery.count();
      setAuctions(aucCounts);
    } catch (err) {
      alert(err);
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Total NFTs"
                count={nfts}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Users"
                count={users}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Transactions"
                count={trans}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Auctions"
                count={auctions}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        {/* <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox> */}
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
