import { Badge, Box, IconButton, Popover, Tooltip } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useCallback, useState } from "react";
import ListNotification from "./ListNotification";
import NotificationResponse from "../types/notification/notificationResponse";
type Props = {
  data: NotificationResponse[];
};
export default function Notification({ data }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const toggleMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setMenuAnchorEl(isMenuOpen ? null : event.currentTarget);
      setIsMenuOpen((previousIsMenuOpen) => !previousIsMenuOpen);
    },
    [isMenuOpen]
  );

  return (
    <Box>
      <Tooltip title="Settings" enterDelay={1000}>
        <div>
          <IconButton type="button" aria-label="settings" onClick={toggleMenu}>
            <Badge
              badgeContent={data.length}
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
          <ListNotification data={data} />
        </Box>
      </Popover>
    </Box>
  );
}
