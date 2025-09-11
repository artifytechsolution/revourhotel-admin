// /* eslint-disable react-hooks/exhaustive-deps */
// "use client";
// import React, { useEffect } from "react";

// import { usePathname, useRouter } from "next/navigation";

// //Types imports
// type ChildrenProps = {
//   children: React.ReactNode;
// };
// //Component imports
// import useAuth from "@/hooks/useAuth";
// import { useAppSelector } from "@/redux/store";
// import { selectUser } from "@/redux/reducers/authSlice";

// const AuthLayoutMain: React.FC<ChildrenProps> = ({ children }) => {
//   const { isLoggedIn } = useAuth();
//   const user = useAppSelector(selectUser);
//   console.log("is logged in is heteteteeee !!")
//   console.log(user)
//   const router = useRouter();
//   const pathname = usePathname();

//   const noAuthRoutes = ["/login ", "/register", "/home"];
//   const authRoutes = ["/users"];

//   useEffect(() => {
//     if (isLoggedIn && noAuthRoutes.includes(pathname)) {
//       router.push("/");
//     } else if (!isLoggedIn && authRoutes.includes(pathname)) {
//       router.push("/login ");
//     }
//   }, [authRoutes, isLoggedIn, noAuthRoutes, pathname, router]);

//   return <>{children}</>;
// };

// export default AuthLayoutMain;


"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/reducers/authSlice";

// Centralized role-based route rules
const routeAccess: Record<string, string[]> = {
  "/users": ["ADMIN"],                     // only admin
  "/hotels": ["ADMIN"],        // manager & admin
  "/orders": ["ADMIN"],               // user & admin
  "/orderdetails": ["HOTEL"], // all logged-in users
  "/hotelunavailable": ["HOTEL"],
  "/reservedHotelsSchedule":["ADMIN"],
  "/login ":["ADMIN","HOTEL"],
  "/hoteledit":["ADMIN"]
};

type Props = { children: React.ReactNode };

export default function AuthLayoutMain({ children }: Props) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    const redirect = (path: string) => {
      if (pathname !== path) {
        router.replace(path);
      }
    };

    // 1️⃣ Not logged in → redirect to login
    if (!isLoggedIn) {
      redirect("/signin ");
      return;
    }
     
  console.log("is logged in is heteteteeee !!")
  console.log(user)
    // 2️⃣ Check if route is protected
    const matchedRoute = Object.keys(routeAccess).find(route =>
      pathname.startsWith(route)
    );

    // 3️⃣ If route found but role not allowed → redirect unauthorized
    if (matchedRoute && !routeAccess[matchedRoute].includes(user?.role)) {
      redirect("/unauthorized");
    }
  }, [isLoggedIn, user?.role, pathname, router]);

  return <>{children}</>;
}

