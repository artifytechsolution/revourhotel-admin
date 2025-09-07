"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import {
  useAnavilableList,
  useUnAnavilableHotelsList,
} from "@/hooks/apiHooks";
import { formatDateTime } from "../orders/page";
import { useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/reducers/authSlice";

interface Hotel {
  hotel_id: number;
  id?: number;
  name?: string;
  isHourly?: boolean;
  email?: string;
  phone?: string;
  description?: string;
  city?: string;
  isVerified?: boolean;
  check_in_datetime?: Date | string;
  check_out_datetime?: Date | string;
  total_days?: number;
}

export default function HotelTablePage() {
  const [hotelList, setHotelList] = useState<Hotel[]>([]);
  const router = useRouter();
  const user = useAppSelector(selectUser)

  const {
    isError,
    isLoading,
    data: hotelData,
    error,
    mutate: hotelMutation,
  } = useUnAnavilableHotelsList();

  useEffect(() => {
    hotelMutation({});
  }, [hotelMutation]);

  useEffect(() => {
    if (isError && !isLoading) {
      toast.error(
        error instanceof Error ? error.message : "An error occurred"
      );
      router.push("/login ");
    }
    if (Array.isArray(hotelData?.data)) {
      setHotelList(hotelData.data);
    }
  }, [isError, isLoading, error, hotelData, router]);

  const columns = [
    { key: "id", label: "ID" },
    { key: "hotel_id", label: "Hotel Id" },
    {
      key: "check_in_datetime",
      label: "Check In",
      render: (row: any) => formatDateTime(row.check_in_datetime),
    },
    {
      key: "check_out_datetime",
      label: "Check Out",
      render: (row: any) => formatDateTime(row.check_out_datetime),
    },
    { key: "total_days", label: "Total Days" },
  ];

  return (
    <>
      <PageBreadcrumb pageTitle="Hotel Table" />
      <ComponentCard title="Hotel List">
        {isLoading ? (
          <p>Loading hotels...</p>
        ) : (
          <BasicTableOne columns={columns} data={hotelList} />
        )}
      </ComponentCard>
    </>
  );
}
