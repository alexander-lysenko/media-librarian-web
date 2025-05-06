import { Avatar } from '@mui/material';

import { stringToColor } from '../../core';

import type { AvatarProps } from '@mui/material';

type Props = Omit<AvatarProps, 'src'> & {
  username: string;
  src: string | null;
};

export const ProfileAvatar = ({ username, src, ...props }: Props) => {
  const nameTokens = username?.split(' ');
  const firstNameToken = nameTokens[0][0];
  const lastNameToken = nameTokens.length > 1 ? nameTokens[nameTokens.length - 1][0] : '';
  const initials = `${firstNameToken.toUpperCase()}${lastNameToken.toUpperCase()}`;

  const backgroundColor = stringToColor(username);

  return (
    <Avatar {...props} src={src || undefined} sx={{ ...props.sx, backgroundColor }}>
      <svg viewBox='0 0 256 256'>
        <text x='50%' y='50%' dy='5%' fontSize='128' dominantBaseline='middle' textAnchor='middle' fill='#ddd'>
          {initials}
        </text>
      </svg>
    </Avatar>
  );
};
