import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CCTech from "../images/CCTech.png";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

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
          variant="h4"
          sx={{ fontWeight: "bold", fontSize: 30, color: "#2563EB", m: 1 }}
        >
          Performance Assistant
        </Typography>
        <div style={{ marginLeft: "auto" }}>
          <IconButton
            sx={{ color: "#2563EB" }}
            onClick={() => navigate("/homepage")}
          >
            <HomeIcon sx={{ fontSize: "30px" }} />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
