"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/reducers/authSlice";
import {
  ChevronDownIcon,
  GridIcon,
  EyeCloseIcon,
  UserIcon,
  HorizontaLDots,
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";
import { AlarmOffRounded, Hotel, MoneyOffCsredRounded } from "@mui/icons-material";
import RecentOrders from "@/components/ecommerce/RecentOrders";

// Role-based access
const routeAccess: Record<string, string[]> = {
  "/users": ["ADMIN"],
  "/hotels": ["ADMIN"],
  "/orders": ["ADMIN"],
  "/orderdetails": ["HOTEL"],
  "/hotelunavailable": ["HOTEL"],
  "/reservedHotelsSchedule": ["ADMIN"],
  '/HotelEdit': ["ADMIN"],
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: any = [
  { icon: <UserIcon />, name: "Users", path: "/users" },
  { icon: <Hotel />, name: "Hotels", path: "/hotels" },
  { icon: <AlarmOffRounded />, name: "Orders", path: "/orders" },
  { icon: <AlarmOffRounded />, name: "Ordersdetails", path: "/orderdetails" },
  { icon: <Hotel />, name: "hotelunavailable", path: "/hotelunavailable" },
  { icon: <Hotel />, name: "HotelEdit", path: "/hoteledit" },
  { icon: <Hotel />, name: "ReservedHotelsSchedule", path: "/reservedHotelsSchedule" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppSelector(selectUser);

  const filteredNavItems = navItems.filter((item) => {
    if (!item.path) return true;
    const allowedRoles = routeAccess[item.path];
    return !allowedRoles || allowedRoles.includes(user?.role);
  });

  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? filteredNavItems : filteredNavItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType as "main" | "others", index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, filteredNavItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index ? null : { type: menuType, index }
    );
  };

  const handleLogout = () => {
    localStorage.clear();          // Clear all localStorage data
    router.push("/signin ");         // Redirect to login page
  };

  const renderMenuItems = (navItems: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span
                className={`${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
              >
                <span className={`${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}
        </li>
      ))}

      {/* ✅ Logout Button */}
      <li>
        <button
          onClick={handleLogout}
          className="menu-item group text-red-600 hover:text-red-800"
        >
          <span className="menu-item-icon-inactive">
            <UserIcon /> {/* Or use any appropriate logout icon */}
          </span>
          {(isExpanded || isHovered || isMobileOpen) && (
            <span className="menu-item-text">Logout</span>
          )}
        </button>
      </li>
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image className="dark:hidden" src="/images/logo/logodata123.png" alt="Logo" width={150} height={40} />
              <Image className="hidden dark:block" src="/images/logo/logodata123.png" alt="Logo" width={150} height={40} />
            </>
          ) : (
            <Image src="/images/logo/logodata123.png" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
