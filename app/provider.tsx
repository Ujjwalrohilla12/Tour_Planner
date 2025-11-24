'use client';
import React, { useEffect, useCallback, useState, useContext } from 'react'
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '../context/UserDetailContext';
import Header from './_components/Header';
import { TripContextType, TripDetailContext } from '@/context/TripDetailContext';
import { TripInfo } from './create-new-trip/_components/ChatBox';

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const CreateUser = useMutation(api.user.createUser)
  const [userDetail, setUserDetail] = useState<any>();
  const [tripDetailInfo,setTripDetailInfo] = useState<TripInfo | null>(null);

  const { user, isLoaded } = useUser();

  const CreateNewUser = useCallback(async () => {
    if (user && isLoaded) {
      const result = await CreateUser({
        name: user.fullName ?? '',
        email: user?.primaryEmailAddress?.emailAddress ??'',
        imageUrl: user?.imageUrl ?? ''
      });
      setUserDetail(result);
    }
  }, [user, isLoaded, CreateUser]);

  useEffect(() => {
    CreateNewUser();
  }, [CreateNewUser]);

  return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
      <TripDetailContext.Provider value={{tripDetailInfo,setTripDetailInfo}}>
      <div>
          {children}</div>
      </TripDetailContext.Provider>
    </UserDetailContext.Provider>
  )
}

export default Provider

export const useUserDetail = () => {
  return useContext(UserDetailContext);
}

export const useTripDetail = ():TripContextType | undefined => {
  return useContext(TripDetailContext);
}