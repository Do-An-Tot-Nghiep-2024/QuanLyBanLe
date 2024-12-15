import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Avatar,
  ListItemAvatar,
} from "@mui/material";
import NotificationResponse from "../types/notification/notificationResponse";
import { readNotificationsService } from "../services/notification.service";
import logo from "../assets/images/logo.png";
type Props = {
  data: NotificationResponse[];
};

export default function ListNotification({ data }: Props) {
  const readNotification = async (id: number) => {
    try {
      const response = await readNotificationsService(id);
      if (response.message !== "success") {
        throw new Error(response.message);
      }
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {data.map((notification) => (
        <Box
          key={notification.id}
          sx={{
            cursor: "pointer",
          }}
          onClick={() => readNotification(notification.id)}
        >
          <ListItem key={notification.id} alignItems="flex-start">
           
           <ListItemAvatar>
              <Avatar src={logo}></Avatar>
           </ListItemAvatar>
           <ListItemText primary={notification.content} secondary={notification.createdAt} />
            {/* <ListItemText
              primary={notification.content}
              secondary={
                <Stack flexDirection="row">
                  <Avatar src={logo}></Avatar>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: "text.primary", display: "inline" }}
                  >
                    {notification.createdAt}
                  </Typography>
                </Stack>
              }
            /> */}
          </ListItem>
          <Divider variant="inset" component="li" />
        </Box>
      ))}
    </List>
  );
}
