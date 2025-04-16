// src/components/Navigation.tsx
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";

interface NavigationProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

const Navigation = ({ darkMode, toggleTheme }: NavigationProps) => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Task Manager
        </Typography>

        <Box sx={{ display: "flex" }}>
          <IconButton
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{ mr: 1 }}
            title="Home"
          >
            <HomeIcon />
          </IconButton>

          <IconButton
            color="inherit"
            component={RouterLink}
            to="/add"
            sx={{ mr: 1 }}
            title="Add New Task"
          >
            <AddIcon />
          </IconButton>

          <IconButton
            color="inherit"
            onClick={toggleTheme}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
