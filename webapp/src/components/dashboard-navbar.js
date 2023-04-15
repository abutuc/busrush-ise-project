import { useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { AppBar, Avatar, Badge, Box, IconButton, Toolbar, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { UserCircle as UserCircleIcon } from "../icons/user-circle";
import { AccountPopover } from "./account-popover";
import BusAlertIcon from "@mui/icons-material/BusAlert";
import { NotificationPopover } from "./notification-popover";

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

export const DashboardNavbar = (props) => {
  const { onSidebarOpen, delayed_buses, ...other } = props;
  const settingsRef = useRef(null);
  const settingsRefado = useRef(null);
  const [openAccountPopover, setOpenAccountPopover] = useState(false);
  const [openNotificationPopover, setOpenNotificationPopover] = useState(false);

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280,
          },
          width: {
            lg: "calc(100% - 280px)",
          },
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: "inline-flex",
                lg: "none",
              },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            onClick={() => setOpenNotificationPopover(true)}
            ref={settingsRefado}
            sx={{
              cursor: "pointer",
              height: 40,
              width: 40,
              ml: 1,
            }}
          >
            {delayed_buses.size > 0 ? (
              <BusAlertIcon fontSize="medium" color="error" />
            ) : (
              <BusAlertIcon fontSize="medium" color="primary" />
            )}
          </IconButton>
        </Toolbar>
      </DashboardNavbarRoot>
      <NotificationPopover
        anchorEl={settingsRefado.current}
        open={openNotificationPopover}
        onClose={() => setOpenNotificationPopover(false)}
        delayed_bus={delayed_buses}
      />
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func,
};
