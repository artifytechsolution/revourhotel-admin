"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useAnavilableList, useCreateunAnavilableHotels } from "@/hooks/apiHooks";
import { useModal } from "@/hooks/useModal";
import { PlusIcon } from "@/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [totalDays, setTotalDays] = useState<number>(0);

  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const user = useAppSelector(selectUser)
  const { isError, isLoading, data: hotelData, error, mutate: hotelMutation } = useAnavilableList();
  const selectedHotelId = user.hotel_id
    console.log("hotel id is here")
    console.log(selectedHotelId)

  const {
    isError: createError,
    isLoading: createLoading,
    data: createUnavilableData,
    error: createUnavilableError,
    mutate: createUnavilableMutation,
  } = useCreateunAnavilableHotels();

  useEffect(() => {
    hotelMutation({
      hotel_id:selectedHotelId
    });
  }, [hotelMutation]);

  useEffect(() => {
    if (isError && !isLoading) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      router.push("/login");
    }
    if (Array.isArray(hotelData?.data)) {
      setHotelList(hotelData.data);
    }
  }, [isError, isLoading, error, hotelData, router]);

  // Calculate total days when date changes
  useEffect(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate.setHours(0, 0, 0, 0));
      const end = new Date(toDate.setHours(0, 0, 0, 0));
      const diffTime = end.getTime() - start.getTime();
      const days = diffTime >= 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 : 0;
      setTotalDays(days);
    } else {
      setTotalDays(0);
    }
  }, [fromDate, toDate]);

  const handleUnavailableHotel = () => {
    setFromDate(null);
    setToDate(null);
    openModal();
  };

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

  const handleSaveUnavailable = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both dates.");
      return;
    }

    if (fromDate > toDate) {
      toast.error("From Date cannot be later than To Date.");
      return;
    }
    console.log("____------------")
    console.log(fromDate)
    console.log(toDate)
    

    
    if (!selectedHotelId) {
      toast.error("No hotel selected.");
      return;
    }
    console.log("api called start---------->")
    try {
      await createUnavilableMutation(
        {
          hotel_id: selectedHotelId,
          check_in_datetime: fromDate,
          check_out_datetime: toDate,
          total_days: totalDays,
        },
        {
          onSuccess: (res: any) => {
            toast.success(
              `Hotel marked unavailable from ${fromDate.toLocaleDateString()} to ${toDate.toLocaleDateString()} (${totalDays} days)`
            );

            // Update local state with new unavailable hotel entry
            setHotelList((prev) => [
              ...prev,
              {
                hotel_id: selectedHotelId,
                check_in_datetime: fromDate,
                check_out_datetime: toDate,
                total_days: totalDays,
              },
            ]);

            closeModal();
          },
          onError: (err: any) => {
            toast.error(
              err instanceof Error ? err.message : "Failed to mark hotel as unavailable"
            );
          },
        }
      );
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Hotel Table" />
      <ComponentCard title="Hotel List">
        <div className="flex justify-end mb-4">
          <Button size="sm" onClick={handleUnavailableHotel} className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" /> Hotel is Unavailable
          </Button>
        </div>
        {isLoading ? (
          <p>Loading hotels...</p>
        ) : (
          <BasicTableOne columns={columns} data={hotelList} />
        )}
      </ComponentCard>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6">
          <h4 className="mb-4 text-xl font-semibold">Mark Hotel as Unavailable</h4>

          <div className="space-y-4">
            <Label>From Date</Label>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="dd/MM/yyyy"
              className="w-full border p-2 rounded-md dark:bg-gray-800"
              placeholderText="Select start date"
            />

            <Label>To Date</Label>
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              dateFormat="dd/MM/yyyy"
              className="w-full border p-2 rounded-md dark:bg-gray-800"
              placeholderText="Select end date"
            />

            {totalDays > 0 && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Total days: <strong>{totalDays}</strong>
              </p>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button disabled={createLoading} className="ml-2" onClick={handleSaveUnavailable}>
              {createLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
