import { createContext } from 'react';
import { Id } from '../convex/_generated/dataModel';

interface UserDetail {
  _id: Id<'userTable'>;
  name: string;
  email: string;
  imageUrl: string;
  subscription?: string;
}

interface UserDetailContextType {
  userDetail: UserDetail | null;
  setUserDetail: (userDetail: UserDetail | null) => void;
}

export const UserDetailContext = createContext<UserDetailContextType | undefined>(undefined);