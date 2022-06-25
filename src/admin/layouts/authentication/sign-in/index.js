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

import { useState, useEffect } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
// import Grid from "@mui/material/Grid";
// import MuiLink from "@mui/material/Link";

// @mui icons
// import FacebookIcon from "@mui/icons-material/Facebook";
// import GitHubIcon from "@mui/icons-material/GitHub";
// import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from  "admin/components/MDBox";
import MDTypography from  "admin/components/MDTypography";
import MDInput from  "admin/components/MDInput";
import MDButton from  "admin/components/MDButton";

import { useMoralis } from "react-moralis";
import { useHistory } from "react-router";

// Authentication layout components
import BasicLayout from  "admin/layouts/authentication/components/BasicLayout";
import useToken from "admin/layouts/authentication/components/useToken";

// Images
import bgImage from  "admin/assets/images/bg-sign-in-basic.jpeg";

const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const {setToken} = useToken();
  let history = useHistory();
  
  const { Moralis } = useMoralis();

  useEffect(() => {
    Moralis.start({serverUrl, appId});
  }, [])

  const checked = async(e) => {
    e.preventDefault();
    const query = new Moralis.Query("AdminUser");
    console.log("!!!!!!!!!!!!!!!!!")
    console.log(await query.first())
    query.equalTo('email', email);
    query.equalTo('password', pwd);
    const admin = await query.first();
    if(!admin) {
      alert("Email or Password is not correct...")
      return
    }
    setToken(admin.id);
    history.go(0);
    // setToken("9879asdkwusjsujs");
  }


  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          {/* <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid> */}
        </MDBox>
        <MDBox pt={4} pb={3} px={3} onSubmit={checked}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput type="email" label="Email" fullWidth required onInput={e=>setEmail(e.target.value)} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" label="Password" required fullWidth onInput={e=>setPwd(e.target.value)} />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" type="submit" color="info" fullWidth>
                sign in
              </MDButton>
            </MDBox>
            {/* <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox> */}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
