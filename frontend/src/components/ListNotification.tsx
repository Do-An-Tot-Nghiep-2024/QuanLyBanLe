import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import React from "react";
import NotificationResponse from "../types/notification/notificationResponse";
import { readNotificationsService } from "../services/notification.service";

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
          onClick={() => readNotification(notification.id)}
        >
          <ListItem key={notification.id} alignItems="flex-start">
           
            <ListItemText
              primary={notification.content}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: "text.primary", display: "inline" }}
                  >
                    {notification.createdAt}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </Box>
      ))}
    </List>
  );
}
