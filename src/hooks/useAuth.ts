"use client";

import { selectAuthToken, selectUser } from "@/redux/reducers/authSlice";
import { useAppSelector } from "@/redux/store"; 

const useAuth = () => {
  const authToken = useAppSelector(selectAuthToken);
  const user = useAppSelector(selectUser);
  console.log("user is commminggggggg ------------------------")
  console.log(user)
  console.log("select auth token is heerererer")
  console.log(authToken)

  const isLoggedIn = !!authToken;
  console.log("hello login is here");
  //const modelType = user?.modelType ?? null;

  return { isLoggedIn, user };
};

export default useAuth;
