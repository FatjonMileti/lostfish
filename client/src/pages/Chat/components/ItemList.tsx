import {useUser} from "../../../context/user";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useGlobalState } from "../../../globalState";

function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

export const ItemList = (props: {rows: any[], joinRoom: (roomId?: string) => void}) => {

    const { rows, joinRoom } = props

    let {
        user: [user]
    } = useGlobalState();

    const { userDetails } = user

    return (
        <List key={1} sx={{ width: '100%', bgcolor: '#CED5CEFF', cursor: 'pointer' }}>
            {rows.map((row: any) => {

                const fullName = userDetails?.user_id === row.author._id
                  ? `${row.participant.first_name} ${row.participant.last_name}`
                  : `${row.author.first_name} ${row.author.last_name}`;

                return (<div key={row._id}>
                    <ListItem key={row._id} alignItems="flex-start" onClick={() => joinRoom(row)}>
                        <ListItemAvatar>
                            <Avatar  {...stringAvatar(fullName)} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={fullName}
                          secondary={
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                  {`${row?.last_message?.message.substring(0,20)}`}
                              </Typography>
                          }
                        />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </div>)
            })}
        </List>
    );
}