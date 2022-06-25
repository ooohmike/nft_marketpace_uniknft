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
import { createTheme } from "@mui/material/styles";
// import Fade from "@mui/material/Fade";

// Material Dashboard 2 React base styles
import colors from  "admin/assets/theme-dark/base/colors";
import breakpoints from  "admin/assets/theme-dark/base/breakpoints";
import typography from  "admin/assets/theme-dark/base/typography";
import boxShadows from  "admin/assets/theme-dark/base/boxShadows";
import borders from  "admin/assets/theme-dark/base/borders";
import globals from  "admin/assets/theme-dark/base/globals";

// Material Dashboard 2 React helper functions
import boxShadow from  "admin/assets/theme-dark/functions/boxShadow";
import hexToRgb from  "admin/assets/theme-dark/functions/hexToRgb";
import linearGradient from  "admin/assets/theme-dark/functions/linearGradient";
import pxToRem from  "admin/assets/theme-dark/functions/pxToRem";
import rgba from  "admin/assets/theme-dark/functions/rgba";

// Material Dashboard 2 React components base styles for @mui material components
import sidenav from  "admin/assets/theme-dark/components/sidenav";
import list from  "admin/assets/theme-dark/components/list";
import listItem from  "admin/assets/theme-dark/components/list/listItem";
import listItemText from  "admin/assets/theme-dark/components/list/listItemText";
import card from  "admin/assets/theme-dark/components/card";
import cardMedia from  "admin/assets/theme-dark/components/card/cardMedia";
import cardContent from  "admin/assets/theme-dark/components/card/cardContent";
import button from  "admin/assets/theme-dark/components/button";
import iconButton from  "admin/assets/theme-dark/components/iconButton";
import input from  "admin/assets/theme-dark/components/form/input";
import inputLabel from  "admin/assets/theme-dark/components/form/inputLabel";
import inputOutlined from  "admin/assets/theme-dark/components/form/inputOutlined";
import textField from  "admin/assets/theme-dark/components/form/textField";
import menu from  "admin/assets/theme-dark/components/menu";
import menuItem from  "admin/assets/theme-dark/components/menu/menuItem";
import switchButton from  "admin/assets/theme-dark/components/form/switchButton";
import divider from  "admin/assets/theme-dark/components/divider";
import tableContainer from  "admin/assets/theme-dark/components/table/tableContainer";
import tableHead from  "admin/assets/theme-dark/components/table/tableHead";
import tableCell from  "admin/assets/theme-dark/components/table/tableCell";
import linearProgress from  "admin/assets/theme-dark/components/linearProgress";
import breadcrumbs from  "admin/assets/theme-dark/components/breadcrumbs";
import slider from  "admin/assets/theme-dark/components/slider";
import avatar from  "admin/assets/theme-dark/components/avatar";
import tooltip from  "admin/assets/theme-dark/components/tooltip";
import appBar from  "admin/assets/theme-dark/components/appBar";
import tabs from  "admin/assets/theme-dark/components/tabs";
import tab from  "admin/assets/theme-dark/components/tabs/tab";
import stepper from  "admin/assets/theme-dark/components/stepper";
import step from  "admin/assets/theme-dark/components/stepper/step";
import stepConnector from  "admin/assets/theme-dark/components/stepper/stepConnector";
import stepLabel from  "admin/assets/theme-dark/components/stepper/stepLabel";
import stepIcon from  "admin/assets/theme-dark/components/stepper/stepIcon";
import select from  "admin/assets/theme-dark/components/form/select";
import formControlLabel from  "admin/assets/theme-dark/components/form/formControlLabel";
import formLabel from  "admin/assets/theme-dark/components/form/formLabel";
import checkbox from  "admin/assets/theme-dark/components/form/checkbox";
import radio from  "admin/assets/theme-dark/components/form/radio";
import autocomplete from  "admin/assets/theme-dark/components/form/autocomplete";
import container from  "admin/assets/theme-dark/components/container";
import popover from  "admin/assets/theme-dark/components/popover";
import buttonBase from  "admin/assets/theme-dark/components/buttonBase";
import icon from  "admin/assets/theme-dark/components/icon";
import svgIcon from  "admin/assets/theme-dark/components/svgIcon";
import link from  "admin/assets/theme-dark/components/link";
import dialog from  "admin/assets/theme-dark/components/dialog";
import dialogTitle from  "admin/assets/theme-dark/components/dialog/dialogTitle";
import dialogContent from  "admin/assets/theme-dark/components/dialog/dialogContent";
import dialogContentText from  "admin/assets/theme-dark/components/dialog/dialogContentText";
import dialogActions from  "admin/assets/theme-dark/components/dialog/dialogActions";

export default createTheme({
  breakpoints: { ...breakpoints },
  palette: { ...colors },
  typography: { ...typography },
  boxShadows: { ...boxShadows },
  borders: { ...borders },
  functions: {
    boxShadow,
    hexToRgb,
    linearGradient,
    pxToRem,
    rgba,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ...globals,
        ...container,
      },
    },
    MuiDrawer: { ...sidenav },
    MuiList: { ...list },
    MuiListItem: { ...listItem },
    MuiListItemText: { ...listItemText },
    MuiCard: { ...card },
    MuiCardMedia: { ...cardMedia },
    MuiCardContent: { ...cardContent },
    MuiButton: { ...button },
    MuiIconButton: { ...iconButton },
    MuiInput: { ...input },
    MuiInputLabel: { ...inputLabel },
    MuiOutlinedInput: { ...inputOutlined },
    MuiTextField: { ...textField },
    MuiMenu: { ...menu },
    MuiMenuItem: { ...menuItem },
    MuiSwitch: { ...switchButton },
    MuiDivider: { ...divider },
    MuiTableContainer: { ...tableContainer },
    MuiTableHead: { ...tableHead },
    MuiTableCell: { ...tableCell },
    MuiLinearProgress: { ...linearProgress },
    MuiBreadcrumbs: { ...breadcrumbs },
    MuiSlider: { ...slider },
    MuiAvatar: { ...avatar },
    MuiTooltip: { ...tooltip },
    MuiAppBar: { ...appBar },
    MuiTabs: { ...tabs },
    MuiTab: { ...tab },
    MuiStepper: { ...stepper },
    MuiStep: { ...step },
    MuiStepConnector: { ...stepConnector },
    MuiStepLabel: { ...stepLabel },
    MuiStepIcon: { ...stepIcon },
    MuiSelect: { ...select },
    MuiFormControlLabel: { ...formControlLabel },
    MuiFormLabel: { ...formLabel },
    MuiCheckbox: { ...checkbox },
    MuiRadio: { ...radio },
    MuiAutocomplete: { ...autocomplete },
    MuiPopover: { ...popover },
    MuiButtonBase: { ...buttonBase },
    MuiIcon: { ...icon },
    MuiSvgIcon: { ...svgIcon },
    MuiLink: { ...link },
    MuiDialog: { ...dialog },
    MuiDialogTitle: { ...dialogTitle },
    MuiDialogContent: { ...dialogContent },
    MuiDialogContentText: { ...dialogContentText },
    MuiDialogActions: { ...dialogActions },
  },
});
