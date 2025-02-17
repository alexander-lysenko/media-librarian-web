import { Avatar } from "@mui/material";

import { stringToColor } from "../../core";

import type { AvatarProps } from "@mui/material";

export const ProfileAvatar = ({ username, ...props }: AvatarProps & { username: string }) => {
  const nameTokens = username?.split(" ");
  const firstNameToken = nameTokens[0][0];
  const lastNameToken = nameTokens.length > 1 ? nameTokens[nameTokens.length - 1][0] : "";
  const initials = `${firstNameToken}${lastNameToken}`;

  const backgroundColor = stringToColor(username);

  return (
    <Avatar {...props} sx={{ ...props.sx, backgroundColor }}>
      <svg viewBox="0 0 256 256">
        <text x="50%" y="50%" dy="5%" fontSize="128" dominantBaseline="middle" textAnchor="middle" fill="#ddd">
          {initials}
        </text>
      </svg>
    </Avatar>
  );
};
