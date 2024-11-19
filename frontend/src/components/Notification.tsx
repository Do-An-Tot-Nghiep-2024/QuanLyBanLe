import { Badge, Box, IconButton, Popover, Tooltip } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
// import { ThemeSwitcher } from "@toolpad/core";
import { useCallback, useState } from "react";
import ListNotification from "./ListNotification";
export default function Notification(length: number) {
  // const { setMode } = useColorScheme();

  // const handleThemeChange = React.useCallback(
  //   (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setMode(event.target.value as "light" | "dark" | "system");
  //   },
  //   [setMode]
  // );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(
    null
  );

  const toggleMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setMenuAnchorEl(isMenuOpen ? null : event.currentTarget);
      setIsMenuOpen((previousIsMenuOpen) => !previousIsMenuOpen);
    },
    [isMenuOpen]
  );

  return (
    <Box sx={{ pt: "5px" }}>
      <Tooltip title="Settings" enterDelay={1000}>
        <div>
          <IconButton type="button" aria-label="settings" onClick={toggleMenu}>
            <Badge
              badgeContent={length}
              color="error"
              // onClick={toogleVisible}
              sx={{ cursor: "pointer" }}
            >
              <NotificationsActiveIcon />
            </Badge>
          </IconButton>
        </div>
      </Tooltip>
      <Popover
        open={isMenuOpen}
        anchorEl={menuAnchorEl}
        onClose={toggleMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        disableAutoFocus
      >
        <Box sx={{ p: 3 }}>
          <ListNotification/>
        </Box>
      </Popover>
    </Box>
  );
}
