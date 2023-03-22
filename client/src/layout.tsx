import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Analytics, Logout } from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import { useNavigate, useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Avatar from "./components/avatar";
import LinearProgress from "@mui/material/LinearProgress";

import { logout } from "./actions/user";
import { showMessage } from "./actions/ui";
import { useUser } from "./context/user";
import { useUI } from "./context/ui";

export default (props: any) => {
  const userContext = useUser();
  const UIContext = useUI();

  if (!userContext || !UIContext) return null;

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      {UIContext.state.isLoading ? (
        <Box sx={{ width: "100%", position: "absolute", top: "0" }}>
          <LinearProgress />
        </Box>
      ) : null}
      <Box>
        {/* sidebar */}
        <Box>
          <Box>
            <IconButton
              onClick={() => showMessage(UIContext)("Not implemented!")}
            >
              <Avatar name={userContext.state.username} />
            </IconButton>
            <IconButton
              onClick={() => {
                logout(userContext)();
                navigate("/login");
              }}
            >
              <Logout sx={{ width: "15px", height: "15px" }} />
            </IconButton>
          </Box>
        </Box>
        <Box>{props.children}</Box>
      </Box>
    </>
  );
};
