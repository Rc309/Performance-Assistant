import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CCTech from "../../images/CCTech.png";

const Navbar: React.FC = () => {
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "white",
        margin: 0,
        padding: 0,
      }}
    >
      <Toolbar
        sx={{ display: "flex", alignItems: "center", minHeight: "64px" }}
      >
        <img
          src={CCTech}
          alt="CCTech Logo"
          style={{ width: "50px", height: "50px", marginRight: "10px" }}
        />
        <Typography
          variant="h2"
          sx={{ fontWeight: "bold", fontSize: 30, color: "#2563EB", m: 1 }}
        >
          Performance Assistant
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
