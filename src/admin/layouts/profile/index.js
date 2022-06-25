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
import {useState, useEffect} from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
// import FacebookIcon from "@mui/icons-material/Facebook";
// import TwitterIcon from "@mui/icons-material/Twitter";
// import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from  "admin/components/MDBox";
import MDInput from "admin/components/MDInput";
import MDButton from "admin/components/MDButton";
// import MDTypography from  "admin/components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from  "admin/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from  "admin/examples/Navbars/DashboardNavbar";
import { useMoralis } from "react-moralis";
// import Footer from  "admin/examples/Footer";
// import ProfileInfoCard from  "admin/examples/Cards/InfoCards/ProfileInfoCard";
// import ProfilesList from  "admin/examples/Lists/ProfilesList";
// import DefaultProjectCard from  "admin/examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from  "admin/layouts/profile/components/Header";
// import PlatformSettings from  "admin/layouts/profile/components/PlatformSettings";

// // Data
// import profilesListData from  "admin/layouts/profile/data/profilesListData";

// // Images
// import homeDecor1 from  "admin/assets/images/home-decor-1.jpg";
// import homeDecor2 from  "admin/assets/images/home-decor-2.jpg";
// import homeDecor3 from  "admin/assets/images/home-decor-3.jpg";
// import homeDecor4 from  "admin/assets/images/home-decor-4.jpeg";
// import team1 from  "admin/assets/images/team-1.jpg";
// import team2 from  "admin/assets/images/team-2.jpg";
// import team3 from  "admin/assets/images/team-3.jpg";
// import team4 from  "admin/assets/images/team-4.jpg";



function Overview() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cur_pwd, setCurPwd] = useState('');
  const [new_pwd, setNewPwd] = useState('');
  const [cfm_pwd, setCfmPwd] = useState('');

  const [data, setData] = useState();

  const {Moralis} = useMoralis();

  useEffect(() => {
    getAdminInfo();
  }, []);

  const getAdminInfo = async() => {
    try {
      const query = new Moralis.Query("AdminUser");
      let result = await query.first();
      setName(result?.attributes.username);
      setEmail(result?.attributes.email);
      setData(result);
    } catch(err) {
      alert(err?.message?err?.message:err);
    }
  }

  const handleSave = async(e) => {
    try {
      e.preventDefault();
      data.set('username', name);
      data.set('email', email);
      await data.save();
      alert("success");
    } catch(err) {
      alert(err?.message?err?.message:err);
    }
  }

  const handlePwdSave = async(e) => {
    try {
      e.preventDefault();
      if(cur_pwd !== data?.attributes.password) {
        alert("Password is not coorect!");
        return
      }
      if(new_pwd !== cfm_pwd) {
        alert("Please insert new password correctly");
        return
      }
      data.set('password', new_pwd);
      await data.save();
      alert("success");
    } catch(err) {
      alert(err?.message?err?.message:err);
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3} onSubmit={handleSave} component="form" role="form">
          <Grid container spacing={1}>
            {/* <Grid item xs={12} md={6} xl={4}>
              <PlatformSettings />
            </Grid> */}
            <Grid item xs={12} style={{margin:'auto'}}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <Grid item lg={6} style={{margin:'auto', marginBottom:'50px'}}>
                <MDInput value={name} style={{width:'100%'}} required onInput={(e) => setName(e.target.value)} label="Username"/>
              </Grid>
              <Grid item lg={6} style={{margin:'auto', marginBottom:'30px'}}>

              <MDInput value={email} style={{width:'100%'}} required onInput={(e) => setEmail(e.target.value)} label="Email Address" type="email"/>
              </Grid>
              <Grid item lg={6} style={{margin:'auto'}}>
                <MDButton variant="contained" color="info" style={{float:'right'}} type="submit">Save</MDButton>
              </Grid>
              {/* <MDInput value={pwd} style={{width:'100%'}} onInput={(e) => setPwd(e.target.value)} label="Password" type="password"/> */}
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            {/* <Grid item xs={12} xl={4}>
              <ProfilesList title="conversations" profiles={profilesListData} shadow={false} />
            </Grid> */}
          </Grid>
        </MDBox>
        <MDBox mt={5} mb={3} onSubmit={handlePwdSave} component="form" role="form">
          <Grid container spacing={1}>
            {/* <Grid item xs={12} md={6} xl={4}>
              <PlatformSettings />
            </Grid> */}
            <Grid item xs={12} style={{margin:'auto'}}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <Grid item lg={6} style={{margin:'auto', marginBottom:'50px'}}>
                <MDInput style={{width:'100%'}} required onInput={(e) => setCurPwd(e.target.value)} label="Current Password" type="password"/>
              </Grid>
              <Grid item lg={6} style={{margin:'auto', marginBottom:'50px'}}>

              <MDInput style={{width:'100%'}} required onInput={(e) => setNewPwd(e.target.value)} label="New Password" type="password"/>
              </Grid>
              <Grid item lg={6} style={{margin:'auto', marginBottom:'50px'}}>

              <MDInput style={{width:'100%'}} required onInput={(e) => setCfmPwd(e.target.value)} label="Confirm Password" type="password"/>
              </Grid>
              <Grid item lg={6} style={{margin:'auto'}}>
                <MDButton variant="contained" color="info" style={{float:'right'}} type="submit">Change</MDButton>
              </Grid>
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            {/* <Grid item xs={12} xl={4}>
              <ProfilesList title="conversations" profiles={profilesListData} shadow={false} />
            </Grid> */}
          </Grid>
        </MDBox>
      </Header>
    </DashboardLayout>
  );
}

export default Overview;
