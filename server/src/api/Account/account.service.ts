import { UserDocument } from '../../data/interfaces/user.interface';
import jwt from 'jsonwebtoken';

const generateTokens = (
  user: UserDocument
): { token: string; refresh: string } => {

  const token = jwt.sign(
    {
      iss: 'lost.fish',
      aud: 'lost.fish:api',
      sub: user._id.toString(),
      fname: user.first_name,
      user_id: user._id.toString(),
      username: user.username,
      role: user.role
    },
    <jwt.Secret>process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE_SECONDS + 's',
      algorithm: 'HS256'
    }
  );
  const refresh = jwt.sign(
    {
      iss: 'lost.fish',
      aud: 'lost.fish:token',
      sub: user._id.toString()
    },
    <jwt.Secret>process.env.REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_EXPIRE_SECONDS + 's',
      algorithm: 'HS256'
    }
  );

  return { token, refresh };
};

export default { generateTokens };
