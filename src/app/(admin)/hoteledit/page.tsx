"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import Badge from "@/components/ui/badge/Badge";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useHotels } from "@/hooks/apiHooks";

interface RoomType {
  id: string;
  room_type_id: number;
  hotel_id: number;
  room_img?: string;
  type_name: string;
  description: string;
  base_price: string;
  max_occupancy: number;
}

interface HourlyRate {
  id: string;
  hourly_rate_id: number;
  hotel_id: number;
  duration_hours: number;
  rate_per_hour: string;
}

interface Hotel {
  id: string;
  hotel_id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  email: string;
  description: string;
  star_rating: number;
  isHourly: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  hotel_images: any[];
  room_hourly_rates: HourlyRate[];
  hotel_ratings: any[];
  room_types: RoomType[];
}

export default function HotelManagementPage() {
  const router = useRouter();
  const [hotelList, setHotelList] = useState<Hotel[]>([]);
  const [currentHotel, setCurrentHotel] = useState<Hotel | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editRoomId, setEditRoomId] = useState<string | null>(null);
  const [editRateId, setEditRateId] = useState<string | null>(null);
  const prevEditRoomIdRef = useRef<string | null>(null);
  const prevEditRateIdRef = useRef<string | null>(null);

  const { isError, isLoading, data: hotelData, error, mutate: hotelMutation } = useHotels();

  // Forms for room and rate editing
  const {
    control: roomControl,
    handleSubmit: handleRoomSubmit,
    reset: resetRoom,
    setValue,
    watch,
    formState: { errors: roomErrors },
  } = useForm<RoomType & { base_price: number }>();

  const {
    control: rateControl,
    handleSubmit: handleRateSubmit,
    reset: resetRate,
    setValue: setRateValue,
    watch: watchRate,
    formState: { errors: rateErrors },
  } = useForm<HourlyRate & { rate_per_hour: number }>();

  // Reset forms when switching to a different card
  useEffect(() => {
    if (editRoomId !== prevEditRoomIdRef.current) {
      resetRoom();
      prevEditRoomIdRef.current = editRoomId;
    }
    if (editRateId !== prevEditRateIdRef.current) {
      resetRate();
      prevEditRateIdRef.current = editRateId;
    }
  }, [editRoomId, editRateId, resetRoom, resetRate]);

  // Load hotels
  useEffect(() => {
    hotelMutation({});
  }, [hotelMutation]);

  // Handle API responses
  useEffect(() => {
    if (isError && !isLoading) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while fetching hotels",
        { duration: 5000, position: "top-center" },
      );
    }
    if (Array.isArray(hotelData?.data?.hotels)) {
      setHotelList(hotelData.data.hotels);
      if (hotelData.data.hotels.length > 0) {
        toast.success(`✅ Loaded ${hotelData.data.hotels.length} hotels`, {
          duration: 3000,
          position: "top-center",
        });
      }
    }
  }, [isError, isLoading, error, hotelData]);

  // Open hotel details modal
  const openHotelView = (hotel: Hotel) => {
    setCurrentHotel(hotel);
    setEditRoomId(null);
    setEditRateId(null);
    toast.loading("🔄 Loading hotel details...", { position: "top-center" });
    setTimeout(() => toast.dismiss(), 1000);
  };

  // API Handler for updating a single room
  const updateHotelRoom = async (hotelId: number, room: RoomType) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${"/hotels/updaterooms2"}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
        
            id: room.id,
            room_type_id: room.room_type_id,
            hotel_id: room.hotel_id,
            type_name: room.type_name,
            description: room.description,
            base_price: room.base_price,
            max_occupancy: room.max_occupancy,
            room_img: room.room_img || null,
          
        }),
      });
      if (!res.ok) throw new Error("Failed to update room");
      const response = await res.json();
      const updatedHotel = response.hotel || response;
      
      setHotelList((prev) =>
        prev.map((h) => (h.hotel_id === updatedHotel.hotel_id ? updatedHotel : h)),
      );
      if (currentHotel?.hotel_id === updatedHotel.hotel_id) {
        setCurrentHotel(updatedHotel);
      }
      return updatedHotel;
    } catch (error) {
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  // API Handler for updating a single hourly rate
  const updateHotelHourlyRate = async (hotelId: number, rate: HourlyRate) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${"/hotels/updaterooms"}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            id: editRateId,
            hourly_rate_id: rate.hourly_rate_id,
            hotel_id: rate.hotel_id,
            duration_hours: rate.duration_hours,
            rate_per_hour: rate.rate_per_hour,
          
        }),
      });
      if (!res.ok) throw new Error("Failed to update hourly rate");
      const response = await res.json();
      const updatedHotel = response.hotel || response;
      
      setHotelList((prev) =>
        prev.map((h) => (h.hotel_id === updatedHotel.hotel_id ? updatedHotel : h)),
      );
      if (currentHotel?.hotel_id === updatedHotel.hotel_id) {
        setCurrentHotel(updatedHotel);
      }
      return updatedHotel;
    } catch (error) {
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  // Begin editing a room
  const startRoomEdit = (room: RoomType) => {
    setEditRoomId(room.id);
    setEditRateId(null);
    // Prefill the form with all room details, including IDs
    setValue("id", room.id);
    setValue("room_type_id", room.room_type_id);
    setValue("hotel_id", room.hotel_id);
    setValue("type_name", room.type_name);
    setValue("description", room.description);
    setValue("base_price", parseFloat(room.base_price));
    setValue("max_occupancy", room.max_occupancy);
    if (room.room_img) setValue("room_img", room.room_img);
  };

  // Begin editing a rate
  const startRateEdit = (rate: HourlyRate) => {
    setEditRateId(rate.id);
    setEditRoomId(null);
    // Prefill the form with all rate details, including IDs
    setRateValue("id", rate.id);
    setRateValue("hourly_rate_id", rate.hourly_rate_id);
    setRateValue("hotel_id", rate.hotel_id);
    setRateValue("duration_hours", rate.duration_hours);
    setRateValue("rate_per_hour", parseFloat(rate.rate_per_hour));
  };

  // Cancel the current edit
  const cancelEdit = () => {
    setEditRoomId(null);
    setEditRateId(null);
  };

  // Called when a room form is submitted
  const onRoomSubmit = (data: RoomType & { base_price: number }) => {
    if (!currentHotel) return;
    (async () => {
      try {
        // Prepare the payload: all fields, IDs included, and formatted values
        const room = {
          id: editRoomId,
          room_type_id: data.room_type_id,
          hotel_id: data.hotel_id || currentHotel.hotel_id,
          type_name: data.type_name,
          description: data.description,
          base_price: data.base_price.toString(),
          max_occupancy: data.max_occupancy,
          room_img: data.room_img || null,
        } as RoomType;
        
        await updateHotelRoom(currentHotel.hotel_id, room);
        setEditRoomId(null);
        toast.success(`✅ Room '${data.type_name}' updated for ${currentHotel.name}!`);
      } catch (error) {
        toast.error(
          `❌ Failed to update room: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    })();
  };

  // Called when a rate form is submitted
  const onRateSubmit = (data: HourlyRate & { rate_per_hour: number }) => {
    if (!currentHotel) return;
    (async () => {
      try {
        // Prepare the payload: all fields, IDs included, and formatted values
        const rate = {
          id: editRateId,
          hourly_rate_id: data.hourly_rate_id,
          hotel_id: data.hotel_id || currentHotel.hotel_id,
          duration_hours: data.duration_hours,
          rate_per_hour: data.rate_per_hour.toString(),
        } as HourlyRate;

        console.log("main rate is comming----------->")
        console.log(rate)
        
        await updateHotelHourlyRate(currentHotel.hotel_id, rate);
        setEditRateId(null);
        toast.success(`✅ Hourly rate package (${data.duration_hours} hours) updated for ${currentHotel.name}!`);
      } catch (error) {
        toast.error(
          `❌ Failed to update rate: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    })();
  };

  // Table columns
  const columns = [
    { key: "hotel_id", label: "ID" },
    { key: "name", label: "Hotel Name" },
    {
      key: "isHourly",
      label: "Type",
      render: (row: Hotel) => (
        <Badge size="sm" color={row.isHourly ? "info" : "success"}>
          {row.isHourly ? "Hourly" : "Regular"}
        </Badge>
      ),
    },
    { key: "email", label: "Email" },
    { key: "city", label: "City" },
    {
      key: "deletedAt",
      label: "Status",
      render: (row: Hotel) => (
        <Badge size="sm" color={row.deletedAt === null ? "success" : "warning"}>
          {row.deletedAt === null ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "rooms_count",
      label: "Rooms",
      render: (row: Hotel) => (
        <span className="font-semibold text-blue-600">{row.room_types?.length || 0}</span>
      ),
    },
    {
      key: "hours_count",
      label: "Hour Rates",
      render: (row: Hotel) => (
        <span className="font-semibold text-orange-600">{row.room_hourly_rates?.length || 0}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Hotel) => (
        <button
          onClick={() => openHotelView(row)}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Hotel Management" />
      <ComponentCard title="Hotel Management">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-2" />
            <p className="text-gray-600">Loading hotels...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            <BasicTableOne columns={columns} data={hotelList} />
          </div>
        )}
      </ComponentCard>

      {/* HOTEL DETAILS MODAL */}
      {currentHotel && (
        <Modal
          isOpen={Boolean(currentHotel)}
          onClose={() => {
            setCurrentHotel(null);
            setEditRoomId(null);
            setEditRateId(null);
            toast.success("🏨 Details closed.", { position: "top-center" });
          }}
          className="max-w-6xl mx-4"
        >
          <div className="bg-white rounded-lg max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">🏨 Hotel Details</h3>
                  <p className="text-blue-100 text-lg">{currentHotel.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <Badge size="sm" color={currentHotel.isHourly ? "info" : "success"}>
                      {currentHotel.isHourly ? "⏰ Hourly Hotel" : "🏨 Regular Hotel"}
                    </Badge>
                    <span className="bg-blue-500 px-2 py-1 rounded text-xs">
                      {currentHotel.star_rating} ⭐ Rating
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCurrentHotel(null);
                    setEditRoomId(null);
                    setEditRateId(null);
                    toast.success("🏨 Details closed.", { position: "top-center" });
                  }}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[75vh] overflow-y-auto">
             
              {/* ===== ROOMS SECTION ===== */}
              <div className="mb-8">
                <h4 className="font-bold text-xl border-b border-indigo-300 pb-3 mb-4">
                  🛏️ Available Room Types ({currentHotel.room_types?.length || 0})
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {currentHotel.room_types?.map((room) => (
                    <div key={room.id} className="bg-white p-5 rounded-lg border border-indigo-200 shadow-sm">
                      {editRoomId === room.id ? (
                        <form onSubmit={handleRoomSubmit(onRoomSubmit)} className="space-y-3">
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="font-bold text-xl text-indigo-800">Editing {room.type_name}</h5>
                            <div className="flex gap-1">
                             
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label>Room Type Name *</Label>
                              <Controller
                                name="type_name"
                                control={roomControl}
                                rules={{ required: "Room type name required" }}
                                render={({ field }) => <Input {...field} placeholder="Deluxe Suite" />}
                              />
                              {roomErrors.type_name && (
                                <p className="text-red-500 text-xs mt-1">{roomErrors.type_name.message}</p>
                              )}
                            </div>
                           
                            <div>
                              <Label>Base Price </Label>
                              <Controller
                                name="base_price"
                                control={roomControl}
                                rules={{ required: "Price required", min: { value: 0, message: "Min $0" } }}
                                render={({ field }) => (
                                  <Input
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    placeholder="150"
                                  />
                                )}
                              />
                              {roomErrors.base_price && (
                                <p className="text-red-500 text-xs mt-1">{roomErrors.base_price.message}</p>
                              )}
                            </div>
                            
                          </div>
                        
                          <div className="flex justify-end gap-2 mt-4">
                            <Button onClick={cancelEdit} variant="outline" type="button" disabled={isUpdating}>
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={isUpdating}
                              className={`bg-indigo-600 hover:bg-indigo-700 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {isUpdating ? "Saving..." : "Save Changes"}
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="font-bold text-lg text-indigo-800">{room.type_name}</h5>
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex gap-1">
                               
                              </div>
                              <span className="text-2xl font-bold text-green-600">${room.base_price}</span>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm mb-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-600">👥 Max Occupancy:</span>
                              <span className="bg-gray-100 px-2 py-1 rounded font-semibold">
                                {room.max_occupancy} guests
                              </span>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded border">
                            <span className="font-medium text-gray-600 block mb-1">📝 Description:</span>
                            <p className="text-gray-700 text-sm leading-relaxed">{room.description}</p>
                          </div>
                          
                          <div className="mt-3 flex justify-end">
                            <Button
                              onClick={() => startRoomEdit(room)}
                              variant="outline"
                              size="sm"
                              className="text-indigo-600"
                            >
                              Edit Room
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ===== HOUR RATES SECTION ===== */}
              {currentHotel.isHourly && (
                <div className="mb-8">
                  <h4 className="font-bold text-xl border-b border-orange-300 pb-3 mb-4">
                    ⏰ Hourly Rate Packages ({currentHotel.room_hourly_rates?.length || 0})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentHotel.room_hourly_rates?.map((rate, idx) => (
                      <div key={rate.id} className="bg-white p-5 rounded-lg border border-orange-200 shadow-sm">
                        {editRateId === rate.id ? (
                          <form onSubmit={handleRateSubmit(onRateSubmit)} className="space-y-3">
                           
                            <div className="space-y-3">
                              <div>
                                <Label>Duration (Hours) *</Label>
                                <Controller
                                  name="duration_hours"
                                  control={rateControl}
                                  rules={{ required: "Hours required", min: { value: 1, message: "Min 1 hour" } }}
                                  render={({ field }) => (
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                      placeholder="1"
                                    />
                                  )}
                                />
                                {rateErrors.duration_hours && (
                                  <p className="text-red-500 text-xs mt-1">{rateErrors.duration_hours.message}</p>
                                )}
                              </div>
                              <div>
                                <Label>Rate per Hour  *</Label>
                                <Controller
                                  name="rate_per_hour"
                                  control={rateControl}
                                  rules={{ required: "Rate required", min: { value: 0, message: "Min 0" } }}
                                  render={({ field }) => (
                                    <Input
                                      type="number"
                                      step="0.01"
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                      placeholder="50"
                                    />
                                  )}
                                />
                                {rateErrors.rate_per_hour && (
                                  <p className="text-red-500 text-xs mt-1">{rateErrors.rate_per_hour.message}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button onClick={cancelEdit} variant="outline" type="button" disabled={isUpdating}>
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                disabled={isUpdating}
                                className={`bg-orange-600 hover:bg-orange-700 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {isUpdating ? "Saving..." : "Save Changes"}
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div className="flex justify-between items-center mb-4">
                              <h5 className="font-bold text-lg text-orange-800">Package {idx + 1}</h5>
                              <div className="flex gap-1">
                              
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center p-3 bg-orange-50 rounded border border-orange-200">
                                <span className="font-medium text-gray-600">⏱️ Duration:</span>
                                <span className="font-bold text-orange-700">{rate.duration_hours} hours</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-orange-50 rounded border border-orange-200">
                                <span className="font-medium text-gray-600">💰 Rate/Hour:</span>
                                <span className="font-bold text-green-600">${rate.rate_per_hour}</span>
                              </div>
                            </div>
                            <div className="mt-3 flex justify-end">
                              <Button
                                onClick={() => startRateEdit(rate)}
                                variant="outline"
                                size="sm"
                                className="text-orange-600"
                              >
                                Edit Rate
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
