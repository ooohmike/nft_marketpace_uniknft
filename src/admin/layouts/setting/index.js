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
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from  "admin/components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from  "admin/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from  "admin/examples/Navbars/DashboardNavbar";
import MDInput from "admin/components/MDInput";
import MDButton from "admin/components/MDButton";

import React, {useEffect, useState} from "react";

import { useMoralis } from "react-moralis";

// Billing page components

function Setting() {

  const { Moralis } = useMoralis();
  const [fee, setFee] = useState();
  const [wallet, setWallet] = useState("");
  const [setting, setSetting] = useState("");

  useEffect(() => {
    getSettings()
  }, [])
  
  const getSettings = async() => {
    const query = new Moralis.Query("Setting");
    let result = await query.first({useMasterKey: true});
    console.log(result);
    if(result) {
      setFee(result?.attributes.fee);
      setWallet(result?.attributes.wallet);
      setSetting(result);
    }
  }

  const handleSave = async() => {
    try {
      if(!setting) {
        const Setting = new Moralis.Object.extend("Setting");
        const query = new Setting();
        const data = {
          'wallet': wallet,
          'fee': Number(fee)
        };
        await query.save(data);
        alert('Success');
      }
      else {
        setting.set('fee', Number(fee));
        setting.set('wallet', wallet);
        await setting.save();
        alert("Success");
      }
    } catch (err) {
      alert(err?.message?err?.message:err);
    }

  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid item lg={6} style={{margin:'auto'}}>
                <MDInput label="Site Wallet address..." style={{width:'100%'}} value={wallet} onInput={e=>setWallet(e.target.value)}/>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid item lg={6} style={{margin:'auto'}}>
                <MDInput label="Site Fee %..."onKeyPress={(event) => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
      }} style={{width:'100%'}} min={1} step={1} type="number" value={fee} onInput={e=>setFee(e.target.value)}/>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid item lg={6} style={{margin:'auto'}}>
                <MDButton variant="contained" color="info" style={{float:'right'}} onClick={() => handleSave()}>Save</MDButton>
              </Grid>
            </Grid>
          </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Setting;
