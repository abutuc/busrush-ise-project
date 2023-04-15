import { useContext } from "react";
import Router from "next/router";
import PropTypes from "prop-types";
import { Box, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import { AuthContext } from "../contexts/auth-context";
import { auth, ENABLE_AUTH } from "../lib/auth";
import { List, ListItem } from "@mui/material";

export const NotificationPopover = (props) => {
  const { anchorEl, onClose, open, delayed_bus, ...other } = props;
  const authContext = useContext(AuthContext);

  const handleSignOut = async () => {
    onClose?.();

    // Check if authentication with Zalter is enabled
    // If not enabled, then redirect is not required
    if (!ENABLE_AUTH) {
      return;
    }

    // Check if auth has been skipped
    // From sign-in page we may have set "skip-auth" to "true"
    // If this has been skipped, then redirect to "sign-in" directly
    const authSkipped = globalThis.sessionStorage.getItem("skip-auth") === "true";

    if (authSkipped) {
      // Cleanup the skip auth state
      globalThis.sessionStorage.removeItem("skip-auth");

      // Redirect to sign-in page
      Router.push("/sign-in").catch(console.error);
      return;
    }

    try {
      // This can be call inside AuthProvider component, but we do it here for simplicity
      await auth.signOut();

      // Update Auth Context state
      authContext.signOut();

      // Redirect to sign-in page
      Router.push("/sign-in").catch(console.error);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: { width: "300px" },
      }}
      {...other}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="overline">Delayed Bus</Typography>
        <List>
          {Array.from(delayed_bus).map(([bus, delay]) => (
            <ListItem key={bus}>
              {bus} ({Math.round(delay, 2)} min.)
            </ListItem>
          ))}
        </List>
      </Box>
    </Popover>
  );
};

NotificationPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
