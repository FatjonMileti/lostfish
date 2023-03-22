import Avatar from "@mui/material/Avatar";
import { SxProps } from "@mui/system";
import React from "react";

const stringToColor = (name: string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < name.length; i += 1) {
    // tslint:disable-next-line: no-bitwise
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    // tslint:disable-next-line: no-bitwise
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

const stringAvatar = (name: string) => {
  const s = name.split(" ");
  const firstName = s[0];
  let lastName = "";
  if (s.length > 1) {
    lastName = s[s.length - 1];
  }
  return {
    sx: {
      // width: '30px',
      // height: '30px',
      bgcolor: stringToColor(name),
    },
    children: `${firstName[0]}${lastName ? lastName[0] : ""}`,
  };
};

export default React.forwardRef(
  (props: { name: string | null; style?: any }, ref: any) => {
    if (!props || !props.name) return null;
    return (
      <Avatar
        {...props}
        {...stringAvatar(props.name)}
        style={props.style}
        ref={ref}
      />
    );
  }
);
