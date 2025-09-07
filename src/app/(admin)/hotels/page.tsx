//thiis is backupcode

// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import ComponentCard from "@/components/common/ComponentCard";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import BasicTableOne from "@/components/tables/BasicTableOne";
// import Badge from "@/components/ui/badge/Badge";
// import { Modal } from "@/components/ui/modal";
// import Input from "@/components/form/input/InputField";
// import Label from "@/components/form/Label";
// import Button from "@/components/ui/button/Button";
// import { useCreateHotel, useHotels } from "@/hooks/apiHooks";
// import { useModal } from "@/hooks/useModal";
// import { PencilIcon, TrashBinIcon, PlusIcon } from "@/icons";

// interface Room {
//   room_name: string;
//   description: string;
//   price: number;
//   max_occupancy: number;
// }

// interface HotelUser {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }

// interface Hotel {
//   id: number;
//   name: string;
//   isHourly: boolean;
//   email: string;
//   phone: string;
//   description: string;
//   city: string;
//   isVerified?: boolean;
//   hours?: number;
//   price?: number;
//   rooms?: Room[];
//   hotelUser?: HotelUser;
// }

// export default function HotelTablePage() {
//   const [hotelList, setHotelList] = useState<Hotel[]>([]);
//   const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [hotelType, setHotelType] = useState<"hourly" | "normal">("hourly");
//   const [images, setImages] = useState<File[]>([]);

//   const router = useRouter();
//   const { isOpen, openModal, closeModal } = useModal();

//   const {
//     isError,
//     isLoading,
//     data: hotelData,
//     error,
//     mutate: hotelMutation,
//   } = useHotels();

//   const {
//     isError:createhotelisError,
//     isLoading:createhotelloading,
//     data: createhotelData,
//     error:createHotelError,
//     mutate: createHotel,
//   } = useCreateHotel();

//   useEffect(() => {
//     hotelMutation({});
//   }, [hotelMutation]);

//   useEffect(() => {
//     if (isError && !isLoading) {
//       toast.error(error instanceof Error ? error.message : "An error occurred");
//       router.push("/login ");
//     }
//     if (Array.isArray(hotelData?.data?.hotels)) {
//       setHotelList(hotelData.data.hotels);
//     }
//   }, [isError, isLoading, error, hotelData, router]);

//   // Image handlers
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     const newFiles = Array.from(e.target.files);
//     const merged = [...images, ...newFiles].slice(0, 6);
//     setImages(merged);
//     e.target.value = "";
//   };

//   const handleRemoveImage = (index: number) => {
//     const updated = [...images];
//     updated.splice(index, 1);
//     setImages(updated);
//   };

//   const handleAddHotel = () => {
//     setIsEditing(false);
//     setCurrentStep(1);
//     setHotelType("hourly");
//     setImages([]);
//     setSelectedHotel({
//       id: 0,
//       name: "",
//       isHourly: true,
//       email: "",
//       phone: "",
//       description: "",
//       city: "",
//       isVerified: false,
//       hours: 1,
//       price: 0,
//       rooms: [
//         { room_name: "", description: "", price: 0, max_occupancy: 0 },
//         { room_name: "", description: "", price: 0, max_occupancy: 0 },
//       ],
//       hotelUser: {
//         firstName: "",
//         lastName: "",
//         email: "",
//         password: "",
//       },
//     });
//     openModal();
//   };

//   const handleEdit = (hotel: Hotel) => {
//     setIsEditing(true);
//     setSelectedHotel({ ...hotel });
//     setCurrentStep(1);
//     openModal();
//   };

//   const handleDelete = (hotel: Hotel) => {
//     console.log("Delete:", hotel);
//   };

//   const handleSave = () => {
//     if (!selectedHotel) return;

//     // Step 4 validation
//     if (!isEditing && currentStep === 4) {
//       const user = selectedHotel.hotelUser;
//       if (!user?.firstName || !user.lastName || !user.email || !user.password) {
//         toast.error("Please fill in all user registration fields.");
//         return;
//       }
//     }

//     const formData = new FormData();
//     formData.append("hotel", JSON.stringify(selectedHotel));
//     images.forEach((img) => formData.append("images", img));

//     console.log("Form data ready to send:", selectedHotel, images);
//     toast.success(isEditing ? "Hotel updated!" : "Hotel added!");
//     closeModal();
//   };

//   const columns = [
//     { key: "id", label: "ID" },
//     { key: "name", label: "Hotel Name" },
//     {
//       key: "isHourly",
//       label: "Is Hourly",
//       render: (row: Hotel) => (row.isHourly ? "Yes" : "No"),
//     },
//     { key: "email", label: "Email" },
//     { key: "phone", label: "Phone" },
//     { key: "city", label: "City" },
//     {
//       key: "isVerified",
//       label: "Status",
//       render: (row: Hotel) => (
//         <Badge size="sm" color={row.isVerified ? "success" : "warning"}>
//           {row.isVerified ? "Verified" : "Pending"}
//         </Badge>
//       ),
//     },
//     {
//       key: "edit",
//       label: "Edit",
//       render: (row: Hotel) => (
//         <PencilIcon
//           className="w-5 h-5 cursor-pointer text-blue-500"
//           onClick={() => handleEdit(row)}
//         />
//       ),
//     },
//     {
//       key: "delete",
//       label: "Delete",
//       render: (row: Hotel) => (
//         <TrashBinIcon
//           className="w-5 h-5 cursor-pointer text-red-500"
//           onClick={() => handleDelete(row)}
//         />
//       ),
//     },
//   ];

//   return (
//     <>
//       <PageBreadcrumb pageTitle="Hotel Table" />
//       <ComponentCard title="Hotel List">
//         <div className="flex justify-end mb-4">
//           <Button size="sm" onClick={handleAddHotel} className="flex items-center gap-2">
//             <PlusIcon className="w-4 h-4" /> Add Hotel
//           </Button>
//         </div>
//         {isLoading ? (
//           <p>Loading hotels...</p>
//         ) : (
//           <BasicTableOne columns={columns} data={hotelList} />
//         )}
//       </ComponentCard>

//       {/* Modal */}
//       <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
//         {selectedHotel && (
//           <div className="bg-white dark:bg-gray-900 rounded-3xl p-6">
//             <h4 className="mb-4 text-xl font-semibold">
//               {isEditing ? "Edit Hotel" : "Add New Hotel"}
//             </h4>

//             {isEditing && (
//               <div className="space-y-4">
//                 <Label>Hotel Name</Label>
//                 <Input
//                   value={selectedHotel.name}
//                   onChange={(e) => setSelectedHotel({ ...selectedHotel, name: e.target.value })}
//                 />
//                 <Label>Email</Label>
//                 <Input
//                   value={selectedHotel.email}
//                   onChange={(e) => setSelectedHotel({ ...selectedHotel, email: e.target.value })}
//                 />
//                 <Label>Phone</Label>
//                 <Input
//                   value={selectedHotel.phone}
//                   onChange={(e) => setSelectedHotel({ ...selectedHotel, phone: e.target.value })}
//                 />
//                 <Label>Description</Label>
//                 <Input
//                   value={selectedHotel.description}
//                   onChange={(e) =>
//                     setSelectedHotel({ ...selectedHotel, description: e.target.value })
//                   }
//                 />
//               </div>
//             )}

//             {!isEditing && (
//               <>
//                 {/* Step 1 */}
//                 {currentStep === 1 && (
//                   <div className="space-y-4">
//                     <Label>Hotel Name</Label>
//                     <Input
//                       value={selectedHotel.name}
//                       onChange={(e) => setSelectedHotel({ ...selectedHotel, name: e.target.value })}
//                     />
//                     <Label>Email</Label>
//                     <Input
//                       value={selectedHotel.email}
//                       onChange={(e) => setSelectedHotel({ ...selectedHotel, email: e.target.value })}
//                     />
//                     <Label>Phone</Label>
//                     <Input
//                       value={selectedHotel.phone}
//                       onChange={(e) => setSelectedHotel({ ...selectedHotel, phone: e.target.value })}
//                     />
//                     <Label>City</Label>
//                     <Input
//                       value={selectedHotel.city}
//                       onChange={(e) => setSelectedHotel({ ...selectedHotel, city: e.target.value })}
//                     />
//                     <Label>Description</Label>
//                     <Input
//                       value={selectedHotel.description}
//                       onChange={(e) =>
//                         setSelectedHotel({ ...selectedHotel, description: e.target.value })
//                       }
//                     />
//                   </div>
//                 )}

//                 {/* Step 2 */}
//                 {currentStep === 2 && (
//                   <div className="space-y-4">
//                     <Label>Upload Images (Min 2, Max 6)</Label>
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="border p-2 rounded-md"
//                     />
//                     {images.length > 0 && (
//                       <div className="grid grid-cols-3 gap-4 mt-4">
//                         {images.map((file, idx) => {
//                           const previewUrl = URL.createObjectURL(file);
//                           return (
//                             <div key={idx} className="relative w-full h-28">
//                               <img
//                                 src={previewUrl}
//                                 alt={`Preview ${idx + 1}`}
//                                 className="w-full h-full object-cover rounded-md border"
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() => handleRemoveImage(idx)}
//                                 className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
//                               >
//                                 ✕
//                               </button>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Step 3 */}
//                 {currentStep === 3 && (
//                   <div className="space-y-4">
//                     <Label>Hotel Type</Label>
//                     <div className="flex gap-4">
//                       <Button
//                         variant={hotelType === "hourly" ? "primary" : "outline"}
//                         onClick={() => {
//                           setHotelType("hourly");
//                           setSelectedHotel({ ...selectedHotel, isHourly: true });
//                         }}
//                       >
//                         Hourly
//                       </Button>
//                       <Button
//                         variant={hotelType === "normal" ? "primary" : "outline"}
//                         onClick={() => {
//                           setHotelType("normal");
//                           setSelectedHotel({ ...selectedHotel, isHourly: false });
//                         }}
//                       >
//                         Normal
//                       </Button>
//                     </div>

//                     {hotelType === "hourly" && (
//                       <>
//                         <Label>How Many Hours</Label>
//                         <Input
//                           type="number"
//                           value={selectedHotel.hours || ""}
//                           onChange={(e) =>
//                             setSelectedHotel({ ...selectedHotel, hours: Number(e.target.value) })
//                           }
//                         />
//                         <Label>Price</Label>
//                         <Input
//                           type="number"
//                           value={selectedHotel.price || ""}
//                           onChange={(e) =>
//                             setSelectedHotel({ ...selectedHotel, price: Number(e.target.value) })
//                           }
//                         />
//                       </>
//                     )}

//                     {hotelType === "normal" &&
//                       selectedHotel.rooms?.map((room, idx) => (
//                         <div key={idx} className="border p-3 rounded-lg space-y-2">
//                           <h5 className="font-medium">Room {idx + 1}</h5>
//                           <Label>Room Name</Label>
//                           <Input
//                             value={room.room_name}
//                             onChange={(e) => {
//                               const updatedRooms = [...selectedHotel.rooms!];
//                               updatedRooms[idx].room_name = e.target.value;
//                               setSelectedHotel({ ...selectedHotel, rooms: updatedRooms });
//                             }}
//                           />
//                           <Label>Description</Label>
//                           <Input
//                             value={room.description}
//                             onChange={(e) => {
//                               const updatedRooms = [...selectedHotel.rooms!];
//                               updatedRooms[idx].description = e.target.value;
//                               setSelectedHotel({ ...selectedHotel, rooms: updatedRooms });
//                             }}
//                           />
//                           <Label>Price</Label>
//                           <Input
//                             type="number"
//                             value={room.price}
//                             onChange={(e) => {
//                               const updatedRooms = [...selectedHotel.rooms!];
//                               updatedRooms[idx].price = Number(e.target.value);
//                               setSelectedHotel({ ...selectedHotel, rooms: updatedRooms });
//                             }}
//                           />
//                           <Label>Max Occupancy</Label>
//                           <Input
//                             type="number"
//                             value={room.max_occupancy}
//                             onChange={(e) => {
//                               const updatedRooms = [...selectedHotel.rooms!];
//                               updatedRooms[idx].max_occupancy = Number(e.target.value);
//                               setSelectedHotel({ ...selectedHotel, rooms: updatedRooms });
//                             }}
//                           />
//                         </div>
//                       ))}
//                   </div>
//                 )}

//                 {/* Step 4 */}
//                 {currentStep === 4 && (
//                   <div className="space-y-4">
//                     <h5 className="font-medium">Register as a User</h5>
//                     <Label>First Name</Label>
//                     <Input
//                       value={selectedHotel.hotelUser?.firstName || ""}
//                       onChange={(e) =>
//                         setSelectedHotel({
//                           ...selectedHotel,
//                           hotelUser: { ...selectedHotel.hotelUser!, firstName: e.target.value },
//                         })
//                       }
//                     />
//                     <Label>Last Name</Label>
//                     <Input
//                       value={selectedHotel.hotelUser?.lastName || ""}
//                       onChange={(e) =>
//                         setSelectedHotel({
//                           ...selectedHotel,
//                           hotelUser: { ...selectedHotel.hotelUser!, lastName: e.target.value },
//                         })
//                       }
//                     />
//                     <Label>Email</Label>
//                     <Input
//                       type="email"
//                       value={selectedHotel.hotelUser?.email || ""}
//                       onChange={(e) =>
//                         setSelectedHotel({
//                           ...selectedHotel,
//                           hotelUser: { ...selectedHotel.hotelUser!, email: e.target.value },
//                         })
//                       }
//                     />
//                     <Label>Password</Label>
//                     <Input
//                       type="password"
//                       value={selectedHotel.hotelUser?.password || ""}
//                       onChange={(e) =>
//                         setSelectedHotel({
//                           ...selectedHotel,
//                           hotelUser: { ...selectedHotel.hotelUser!, password: e.target.value },
//                         })
//                       }
//                     />
//                   </div>
//                 )}
//               </>
//             )}

//             {/* Navigation */}
//             <div className="flex justify-between mt-6">
//               {!isEditing && currentStep > 1 && (
//                 <Button variant="outline" onClick={() => setCurrentStep((s) => s - 1)}>
//                   Back
//                 </Button>
//               )}
//               {!isEditing && currentStep < 4 && (
//                 <Button
//                   onClick={() => {
//                     if (currentStep === 2) {
//                       if (images.length < 2) {
//                         toast.error("Please upload at least 2 images.");
//                         return;
//                       }
//                       if (images.length > 6) {
//                         toast.error("Maximum 6 images allowed.");
//                         return;
//                       }
//                     }
//                     setCurrentStep((s) => s + 1);
//                   }}
//                 >
//                   Next
//                 </Button>
//               )}
//               {(isEditing || currentStep === 4) && (
//                 <Button onClick={handleSave}>{isEditing ? "Save Changes" : "Submit"}</Button>
//               )}
//             </div>
//           </div>
//         )}
//       </Modal>
//     </>
//   );
// }


//second main component

// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useForm, Controller, useFieldArray } from "react-hook-form";
// import toast from "react-hot-toast";
// import ComponentCard from "@/components/common/ComponentCard";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import BasicTableOne from "@/components/tables/BasicTableOne";
// import Badge from "@/components/ui/badge/Badge";
// import { Modal } from "@/components/ui/modal";
// import Input from "@/components/form/input/InputField";
// import Label from "@/components/form/Label";
// import Button from "@/components/ui/button/Button";
// import { useAddHours, useAddRooms, useCreateHotel, useHotels, useRegisterUser } from "@/hooks/apiHooks";
// import { useModal } from "@/hooks/useModal";
// import { PencilIcon, TrashBinIcon, PlusIcon } from "@/icons";

// interface Room {
//   room_name: string;
//   description: string;
//   price: number;
//   max_occupancy: number;
// }

// interface HourlyRate {
//   hours: number;
//   price: number;
// }

// interface HotelUser {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }

// interface Hotel {
//   id: number;
//   name: string;
//   isHourly: boolean;
//   email: string;
//   phone: string;
//   description: string;
//   country:string,
//   address?:string,
//   city: string;
//   isVerified?: boolean;
//   hourlyRates?: HourlyRate[];
//   rooms?: Room[];
//   hotelUser?: HotelUser;
// }

// export default function HotelTablePage() {
//   const [hotelList, setHotelList] = useState<Hotel[]>([]);
//   const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [hotelType, setHotelType] = useState<"hourly" | "normal">("hourly");
//   const [images, setImages] = useState<File[]>([]);

//   const router = useRouter();
//   const { isOpen, openModal, closeModal } = useModal();
//   console.log("hotel Type is herere-----!!!")
//   console.log(hotelType)
//   const {
//     isError,
//     isLoading,
//     data: hotelData,
//     error,
//     mutate: hotelMutation,
//   } = useHotels();

//   const {
//     isError: createHotelIsError,
//     isLoading: createHotelLoading,
//     data: createHotelData,
//     error: createHotelError,
//     mutate: createHotel,
//   } = useCreateHotel();

//   const {
//     isError: createhourlyIsError,
//     isLoading: createhourlyLoading,
//     data: createhourlyData,
//     error: createhourlyError,
//     mutate: createhourlyHotel,
//   } =  useAddHours();

//   const {
//     isError: createRoomsIsError,
//     isLoading: createRoomsLoading,
//     data: createRoomsData,
//     error: createRoomsError,
//     mutate: createRooms,
//   } =  useAddRooms();

//   const {
//     isError: regiterError,
//     isLoading: registerisLoading,
//     data: registerisLoadingData,
//     error: registerisLoadingError,
//     mutate: registerisLoadingMutation,
//   } = useRegisterUser()



//   const {
//     control,
//     handleSubmit,
//     reset,
//     setValue,
//     getValues,
//     formState: { errors },
//   } = useForm<Hotel>({
//     defaultValues: {
//       id: 0,
//       name: "",
//       isHourly: true,
//       email: "",
//       phone: "",
//       description: "",
//       city: "",
//       country:"",
//       address:"",
//       isVerified: false,
//       hourlyRates: [{ hours: 1, price: 0 }],
//       rooms: [{ room_name: "", description: "", price: 0, max_occupancy: 0 }],
//       hotelUser: {
//         firstName: "",
//         lastName: "",
//         email: "",
//         password: "",
//       },
//     },
//   });

//   const { fields: roomFields, append: appendRoom, remove: removeRoom } = useFieldArray({
//     control,
//     name: "rooms",
//   });

//   const { fields: hourlyFields, append: appendHourly, remove: removeHourly } = useFieldArray({
//     control,
//     name: "hourlyRates",
//   });

//   useEffect(() => {
//     hotelMutation({});
//   }, [hotelMutation]);

//   useEffect(() => {
//     if (isError && !isLoading) {
//       toast.error(error instanceof Error ? error.message : "An error occurred while fetching hotels");
//       router.push("/login ");
//     }
//     if (Array.isArray(hotelData?.data?.hotels)) {
//       setHotelList(hotelData.data.hotels);
//     }
//   }, [isError, isLoading, error, hotelData, router]);

//   useEffect(() => {
//     if (createHotelData) {
//       toast.success(isEditing ? "Hotel updated successfully!" : "Hotel created successfully!");
//       closeModal();
//       reset();
//       setImages([]);
//       hotelMutation({}); // Refresh hotel list
//     }
//     if (createHotelIsError && !createHotelLoading) {
//       toast.error(createHotelError instanceof Error ? createHotelError.message : "An error occurred while saving the hotel");
//     }
//   }, [createHotelData, createHotelIsError, createHotelError, createHotelLoading, isEditing, closeModal, hotelMutation, reset]);

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     const newFiles = Array.from(e.target.files);
//     const merged = [...images, ...newFiles].slice(0, 6);
//     setImages(merged);
//     e.target.value = "";
//   };

//   const handleRemoveImage = (index: number) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleAddHotel = () => {
//     setIsEditing(false);
//     setCurrentStep(1);
//     setHotelType("hourly");
//     setImages([]);
//     reset({
//       id: 0,
//       name: "",
//       isHourly: true,
//       email: "",
//       phone: "",
//       description: "",
//       city: "",
//       country:"",
//       address:"",
//       isVerified: false,
//       hourlyRates: [{ hours: 1, price: 0 }],
//       rooms: [{ room_name: "", description: "", price: 0, max_occupancy: 0 }],
//       hotelUser: {
//         firstName: "",
//         lastName: "",
//         email: "",
//         password: "",
//       },
//     });
//     openModal();
//   };

//   const handleEdit = (hotel: Hotel) => {
//     setIsEditing(true);
//     setSelectedHotel({ ...hotel });
//     setCurrentStep(1);
//     setHotelType(hotel.isHourly ? "hourly" : "normal");
//     reset({
//       ...hotel,
//       hourlyRates: hotel.isHourly ? (hotel.hourlyRates?.length ? hotel.hourlyRates : [{ hours: 1, price: 0 }]) : [],
//       rooms: !hotel.isHourly ? (hotel.rooms?.length ? hotel.rooms : [{ room_name: "", description: "", price: 0, max_occupancy: 0 }]) : [],
//     });
//     openModal();
//   };

//   const handleDelete = (hotel: Hotel) => {
//     console.log("Delete:", hotel);
//     // Implement actual delete logic here
//   };

//   const onSubmit = (data: Hotel) => {
//   console.log("📢 onSubmit is called!");

//   // Prepare hotel details for logging/debugging
//   const hotelDetails = {
//     id: data.id,
//     name: data.name,
//     isHourly: data.isHourly,
//     email: data.email,
//     phone: data.phone,
//     description: data.description,
//     city: data.city,
//     isVerified: data.isVerified,
//     hourlyRates: data.hourlyRates,
//     rooms: data.rooms,
//   };

//   console.log("🏨 Hotel Details:", JSON.stringify(hotelDetails, null, 2));
//   console.log("🖼 Images:", images.map((img) => img.name));

//   // Validate user details if adding a new hotel on step 4
//   if (!isEditing && currentStep === 4) {
//     const user = data.hotelUser;
//     if (!user?.firstName || !user.lastName || !user.email || !user.password) {
//       toast.error("Please fill in all user registration fields.");
//       return;
//     }
//   }

//   // Prepare form data for API
//   const formData = new FormData();
//   formData.append("hotel", JSON.stringify(data));
//   images.forEach((img) => formData.append("images", img));

//   // Handle hotel creation on step 4
//   if (currentStep === 4) {
//     createHotel(
//       {
//         name: getValues("name"),
//         address: getValues("address"),
//         city: getValues("city"),
//         country: getValues("country"),
//         phone: getValues("phone"),
//         email: getValues("email"),
//         star_rating: 5,
//         description: getValues("description"),
//       },
//       {
//         onSuccess: (hotelResponse) => {
//           console.log("✅ Hotel created successfully:", hotelResponse);
//           console.log("🏷 Hotel Type:", hotelType);

//           const hotelId = hotelResponse?.data?.id;
//           if (!hotelId) {
//             console.error("❌ Hotel ID missing from response");
//             return;
//           }

//           // Handle hourly hotel creation
//           if (hotelType === "hourly") {
//             const hourlyData = getValues("hourlyRates")?.map((item) => ({
//               ...item,
//               hotel_id: hotelId,
//             }));

//             console.log("📌 Hourly rates payload:", hourlyData);

//             createhourlyHotel(hourlyData, {
//               onSuccess: (hoursResponse) => {
//                 console.log("✅ Hourly rates added successfully:", hoursResponse);
//               },
//               onError: (err) => {
//                 console.error("❌ Error adding hourly rates:", err);
//               },
//             });
//           }

//           // Handle normal hotel creation
//           else if (hotelType === "normal") {
//             console.log("🏨 Creating normal hotel rooms...");
//             const roomData = getValues("rooms")?.map((item) => ({
//               ...item,
//               hotel_id: hotelId,
//             }));

//             console.log("📌 Rooms payload:", roomData);

//             createRooms(roomData, {
//               onSuccess: (roomsResponse) => {
//                 console.log("✅ Rooms added successfully:", roomsResponse);
//               },
//               onError: (err) => {
//                 console.error("❌ Error adding rooms:", err);
//               },
//             });
//           }

//           console.log("🎯 Final step completed");
//         },
//         onError: (err) => {
//           console.error("❌ Error creating hotel:", err);
//         },
//       }
//     );

//     // Register hotel user
//     registerisLoadingMutation({
//       ...data.hotelUser,
//       role:"HOTEL",
//       isVerified: true
//     });
//   }
// };


//   const columns = [
//     { key: "id", label: "ID" },
//     { key: "name", label: "Hotel Name" },
//     {
//       key: "isHourly",
//       label: "Is Hourly",
//       render: (row: Hotel) => (row.isHourly ? "Yes" : "No"),
//     },
//     { key: "email", label: "Email" },
//     { key: "phone", label: "Phone" },
//     { key: "city", label: "City" },
//     {
//       key: "isVerified",
//       label: "Status",
//       render: (row: Hotel) => (
//         <Badge size="sm" color={row.isVerified ? "success" : "warning"}>
//           {row.isVerified ? "Verified" : "Pending"}
//         </Badge>
//       ),
//     },
//     {
//       key: "edit",
//       label: "Edit",
//       render: (row: Hotel) => (
//         <PencilIcon
//           className="w-5 h-5 cursor-pointer text-blue-500"
//           onClick={() => handleEdit(row)}
//         />
//       ),
//     },
//     {
//       key: "delete",
//       label: "Delete",
//       render: (row: Hotel) => (
//         <TrashBinIcon
//           className="w-5 h-5 cursor-pointer text-red-500"
//           onClick={() => handleDelete(row)}
//         />
//       ),
//     },
//   ];

//   return (
//     <React.Fragment>
//       <PageBreadcrumb pageTitle="Hotel Table" />
//       <ComponentCard title="Hotel List">
//         <div className="flex justify-end mb-4">
//           <Button size="sm" onClick={handleAddHotel} className="flex items-center gap-2">
//             <PlusIcon className="w-4 h-4" /> Add Hotel
//           </Button>
//         </div>
//         {isLoading ? (
//           <p>Loading hotels...</p>
//         ) : (
//           <BasicTableOne columns={columns} data={hotelList} />
//         )}
//       </ComponentCard>

//       <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
//         <div className="bg-white dark:bg-gray-900 rounded-3xl p-6">
//           <h4 className="mb-4 text-xl font-semibold">
//             {isEditing ? "Edit Hotel" : "Add New Hotel"}
//           </h4>

//           <form onSubmit={handleSubmit(onSubmit)}>
//             {isEditing && (
//               <div className="space-y-4">
//                 <div>
//                   <Label>Hotel Name</Label>
//                   <Controller
//                     name="name"
//                     control={control}
//                     rules={{ required: "Hotel name is required" }}
//                     render={({ field }) => <Input {...field} />}
//                   />
//                   {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
//                 </div>
//                 <div>
//                   <Label>Email</Label>
//                   <Controller
//                     name="email"
//                     control={control}
//                     rules={{ required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } }}
//                     render={({ field }) => <Input type="email" {...field} />}
//                   />
//                   {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//                 </div>
//                 <div>
//                   <Label>Phone</Label>
//                   <Controller
//                     name="phone"
//                     control={control}
//                     rules={{ required: "Phone is required" }}
//                     render={({ field }) => <Input {...field} />}
//                   />
//                   {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
//                 </div>
//                 <div>
//                   <Label>Description</Label>
//                   <Controller
//                     name="description"
//                     control={control}
//                     rules={{ required: "Description is required" }}
//                     render={({ field }) => <Input {...field} />}
//                   />
//                   {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
//                 </div>
//               </div>
//             )}

//             {!isEditing && (
//               <>
//                 {currentStep === 1 && (
//                   <div className="space-y-4">
//                     <div>
//                       <Label>Hotel Name</Label>
//                       <Controller
//                         name="name"
//                         control={control}
//                         rules={{ required: "Hotel name is required" }}
//                         render={({ field }) => <Input {...field} />}
//                       />
//                       {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
//                     </div>
//                     <div>
//                       <Label>Email</Label>
//                       <Controller
//                         name="email"
//                         control={control}
//                         rules={{ required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } }}
//                         render={({ field }) => <Input type="email" {...field} />}
//                       />
//                       {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//                     </div>
//                     <div>
//                       <Label>Phone</Label>
//                       <Controller
//                         name="phone"
//                         control={control}
//                         rules={{ required: "Phone is required" }}
//                         render={({ field }) => <Input {...field} />}
//                       />
//                       {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
//                     </div>
//                      <div>
//                       <Label>Address</Label>
//                       <Controller
//                         name="address"
//                         control={control}
//                         rules={{ required: "country is required" }}
//                         render={({ field }) => <Input {...field} />}
//                       />
//                       {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
//                     </div>
//                     <div>
//                       <Label>City</Label>
//                       <Controller
//                         name="city"
//                         control={control}
//                         rules={{ required: "City is required" }}
//                         render={({ field }) => <Input {...field} />}
//                       />
//                       {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
//                     </div>
//                      <div>
//                       <Label>county</Label>
//                       <Controller
//                         name="country"
//                         control={control}
//                         rules={{ required: "country is required" }}
//                         render={({ field }) => <Input {...field} />}
//                       />
//                       {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
//                     </div>
//                     <div>
//                       <Label>Description</Label>
//                       <Controller
//                         name="description"
//                         control={control}
//                         rules={{ required: "Description is required" }}
//                         render={({ field }) => <Input {...field} />}
//                       />
//                       {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
//                     </div>
//                   </div>
//                 )}

//                 {currentStep === 2 && (
//                   <div className="space-y-4">
//                     <Label>Upload Images (Min 2, Max 6)</Label>
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="border p-2 rounded-md w-full"
//                     />
//                     {images.length > 0 && (
//                       <div className="grid grid-cols-3 gap-4 mt-4">
//                         {images.map((file, idx) => (
//                           <div key={idx} className="relative w-full h-28">
//                             <img
//                               src={URL.createObjectURL(file)}
//                               alt={`Preview ${idx + 1}`}
//                               className="w-full h-full object-cover rounded-md border"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => handleRemoveImage(idx)}
//                               className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
//                             >
//                               ✕
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {currentStep === 3 && (
//                   <div className="space-y-4">
//                     <Label>Hotel Type</Label>
//                     <div className="flex gap-4">
//                       <Button
//                         variant={hotelType === "hourly" ? "primary" : "outline"}
//                         onClick={() => {
//                           setHotelType("hourly");
//                           setValue("isHourly", true);
//                           setValue("rooms", []);
//                           if (hourlyFields.length === 0) {
//                             appendHourly({ hours: 1, price: 0 });
//                           }
//                         }}
//                       >
//                         Hourly
//                       </Button>
//                       <Button
//                         variant={hotelType === "normal" ? "primary" : "outline"}
//                         onClick={() => {
//                           setHotelType("normal");
//                           setValue("isHourly", false);
//                           setValue("hourlyRates", []);
//                           if (roomFields.length === 0) {
//                             appendRoom({ room_name: "", description: "", price: 0, max_occupancy: 0 });
//                           }
//                         }}
//                       >
//                         Normal
//                       </Button>
//                     </div>

//                     {hotelType === "hourly" && (
//                       <div className="space-y-4">
//                         {hourlyFields.map((hourly, idx) => (
//                           <div key={hourly.id} className="border p-3 rounded-lg space-y-2">
//                             <div className="flex justify-between items-center">
//                               <h5 className="font-medium">Hourly Rate {idx + 1}</h5>
//                               {hourlyFields.length > 1 && (
//                                 <Button
//                                   variant="danger"
//                                   size="sm"
//                                   onClick={() => removeHourly(idx)}
//                                 >
//                                   Remove Rate
//                                 </Button>
//                               )}
//                             </div>
//                             <div>
//                               <Label>How Many Hours</Label>
//                               <Controller
//                                 name={`hourlyRates.${idx}.hours`}
//                                 control={control}
//                                 rules={{ required: "Hours is required", min: { value: 1, message: "Hours must be at least 1" } }}
//                                 render={({ field }) => (
//                                   <Input
//                                     type="number"
//                                     {...field}
//                                     value={field.value ?? ""}
//                                     onChange={(e) => field.onChange(Number(e.target.value))}
//                                   />
//                                 )}
//                               />
//                               {errors.hourlyRates?.[idx]?.hours && (
//                                 <p className="text-red-500 text-sm">{errors.hourlyRates[idx].hours?.message}</p>
//                               )}
//                             </div>
//                             <div>
//                               <Label>Price</Label>
//                               <Controller
//                                 name={`hourlyRates.${idx}.price`}
//                                 control={control}
//                                 rules={{ required: "Price is required", min: { value: 0, message: "Price cannot be negative" } }}
//                                 render={({ field }) => (
//                                   <Input
//                                     type="number"
//                                     {...field}
//                                     value={field.value ?? ""}
//                                     onChange={(e) => field.onChange(Number(e.target.value))}
//                                   />
//                                 )}
//                               />
//                               {errors.hourlyRates?.[idx]?.price && (
//                                 <p className="text-red-500 text-sm">{errors.hourlyRates[idx].price?.message}</p>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                         {hourlyFields.length < 5 && (
//                           <Button
//                             size="sm"
//                             onClick={() => appendHourly({ hours: 1, price: 0 })}
//                             className="flex items-center gap-2"
//                           >
//                             <PlusIcon className="w-4 h-4" /> Add Hourly Rate
//                           </Button>
//                         )}
//                       </div>
//                     )}

//                     {hotelType === "normal" && (
//                       <div className="space-y-4">
//                         {roomFields.map((room, idx) => (
//                           <div key={room.id} className="border p-3 rounded-lg space-y-2">
//                             <div className="flex justify-between items-center">
//                               <h5 className="font-medium">Room {idx + 1}</h5>
//                               {roomFields.length > 1 && (
//                                 <Button
//                                   variant="danger"
//                                   size="sm"
//                                   onClick={() => removeRoom(idx)}
//                                 >
//                                   Remove Room
//                                 </Button>
//                               )}
//                             </div>
//                             <div>
//                               <Label>Room Name</Label>
//                               <Controller
//                                 name={`rooms.${idx}.room_name`}
//                                 control={control}
//                                 rules={{ required: "Room name is required" }}
//                                 render={({ field }) => <Input {...field} />}
//                               />
//                               {errors.rooms?.[idx]?.room_name && (
//                                 <p className="text-red-500 text-sm">{errors.rooms[idx].room_name?.message}</p>
//                               )}
//                             </div>
//                             <div>
//                               <Label>Description</Label>
//                               <Controller
//                                 name={`rooms.${idx}.description`}
//                                 control={control}
//                                 rules={{ required: "Description is required" }}
//                                 render={({ field }) => <Input {...field} />}
//                               />
//                               {errors.rooms?.[idx]?.description && (
//                                 <p className="text-red-500 text-sm">{errors.rooms[idx].description?.message}</p>
//                               )}
//                             </div>
//                             <div>
//                               <Label>Price</Label>
//                               <Controller
//                                 name={`rooms.${idx}.price`}
//                                 control={control}
//                                 rules={{ required: "Price is required", min: { value: 0, message: "Price cannot be negative" } }}
//                                 render={({ field }) => (
//                                   <Input
//                                     type="number"
//                                     {...field}
//                                     value={field.value ?? ""}
//                                     onChange={(e) => field.onChange(Number(e.target.value))}
//                                   />
//                                 )}
//                               />
//                               {errors.rooms?.[idx]?.price && (
//                                 <p className="text-red-500 text-sm">{errors.rooms[idx].price?.message}</p>
//                               )}
//                             </div>
//                             <div>
//                               <Label>Max Occupancy</Label>
//                               <Controller
//                                 name={`rooms.${idx}.max_occupancy`}
//                                 control={control}
//                                 rules={{ required: "Max occupancy is required", min: { value: 1, message: "Max occupancy must be at least 1" } }}
//                                 render={({ field }) => (
//                                   <Input
//                                     type="number"
//                                     {...field}
//                                     value={field.value ?? ""}
//                                     onChange={(e) => field.onChange(Number(e.target.value))}
//                                   />
//                                 )}
//                               />
//                               {errors.rooms?.[idx]?.max_occupancy && (
//                                 <p className="text-red-500 text-sm">{errors.rooms[idx].max_occupancy?.message}</p>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                         {roomFields.length < 5 && (
//                           <Button
//                             size="sm"
//                             onClick={() =>
//                               appendRoom({
//                                 room_name: "",
//                                 description: "",
//                                 price: 0,
//                                 max_occupancy: 0,
//                               })
//                             }
//                             className="flex items-center gap-2"
//                           >
//                             <PlusIcon className="w-4 h-4" /> Add Room
//                           </Button>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {currentStep === 4 && (
//                   <div className="space-y-4">
//                     <h5 className="font-medium">Register as a User</h5>
//                     <div>
//                       <Label>First Name</Label>
//                       <Controller
//                         name="hotelUser.firstName"
//                         control={control}
//                         rules={{ required: "First name is required" }}
//                         render={({ field }) => <Input {...field} />}
//                       />
//                       {errors.hotelUser?.firstName && (
//                         <p className="text-red-500 text-sm">{errors.hotelUser.firstName.message}</p>
//                       )}
//                     </div>
//                     <div>
//                       <Label>Last Name</Label>
//                       <Controller
//                         name="hotelUser.lastName"
//                         control={control}
//                         rules={{ required: "Last name is required" }}
//                         render={({ field }) => <Input {...field} />}
//                       />
//                       {errors.hotelUser?.lastName && (
//                         <p className="text-red-500 text-sm">{errors.hotelUser.lastName.message}</p>
//                       )}
//                     </div>
//                     <div>
//                       <Label>Email</Label>
//                       <Controller
//                         name="hotelUser.email"
//                         control={control}
//                         rules={{ required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } }}
//                         render={({ field }) => <Input type="email" {...field} />}
//                       />
//                       {errors.hotelUser?.email && (
//                         <p className="text-red-500 text-sm">{errors.hotelUser.email.message}</p>
//                       )}
//                     </div>
//                     <div>
//                       <Label>Password</Label>
//                       <Controller
//                         name="hotelUser.password"
//                         control={control}
//                         rules={{ required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } }}
//                         render={({ field }) => <Input type="password" {...field} />}
//                       />
//                       {errors.hotelUser?.password && (
//                         <p className="text-red-500 text-sm">{errors.hotelUser.password.message}</p>
//                       )}
//                     </div>
//                     <div className="mt-6">
//                       <Label>Hotel Details Preview (JSON)</Label>
//                       <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm overflow-auto max-h-60">
//                         {JSON.stringify(
//                           {
//                             id: getValues("id"),
//                             name: getValues("name"),
//                             isHourly: getValues("isHourly"),
//                             email: getValues("email"),
//                             phone: getValues("phone"),
//                             description: getValues("description"),
//                             city: getValues("city"),
//                             isVerified: getValues("isVerified"),
//                             hourlyRates: getValues("hourlyRates"),
//                             rooms: getValues("rooms"),
//                           },
//                           null,
//                           2
//                         )}
//                       </pre>
//                       <Label>Uploaded Images</Label>
//                       <ul className="list-disc pl-5">
//                         {images.length > 0 ? (
//                           images.map((img, idx) => (
//                             <li key={idx} className="text-sm">
//                               {img.name}
//                             </li>
//                           ))
//                         ) : (
//                           <li className="text-sm">No images uploaded</li>
//                         )}
//                       </ul>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}

//             <div className="flex justify-between mt-6">
//               {!isEditing && currentStep > 1 && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setCurrentStep((s) => s - 1)}
//                 >
//                   Back
//                 </Button>
//               )}
//               {!isEditing && currentStep < 4 && (
//                 <Button
//                   type="button"
//                   onClick={() => {
//                     if (currentStep === 2) {
//                       if (images.length < 2) {
//                         toast.error("Please upload at least 2 images.");
//                         return;
//                       }
//                       if (images.length > 6) {
//                         toast.error("Maximum 6 images allowed.");
//                         return;
//                       }
//                     }
//                     if (currentStep === 3) {
//                       if (hotelType === "hourly" && hourlyFields.length === 0) {
//                         toast.error("Please add at least one hourly rate.");
//                         return;
//                       }
//                       if (hotelType === "normal" && roomFields.length === 0) {
//                         toast.error("Please add at least one room.");
//                         return;
//                       }
//                     }
//                     setCurrentStep((s) => s + 1);
//                   }}
//                 >
//                   Next
//                 </Button>
//               )}
//               {(isEditing || currentStep === 4) && (
//                 <Button type="submit">
//                   {isEditing ? "Save Changes" : "Submit"}
//                 </Button>
//               )}
//             </div>
//           </form>
//         </div>
//       </Modal>
//     </React.Fragment>
//   );
// }


// latest code 2
// "use client";

// import React, { useEffect, useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { useForm, Controller, useFieldArray } from "react-hook-form";
// import toast from "react-hot-toast";
// import Editor from 'react-simple-wysiwyg';
// import ComponentCard from "@/components/common/ComponentCard";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import BasicTableOne from "@/components/tables/BasicTableOne";
// import Badge from "@/components/ui/badge/Badge";
// import { Modal } from "@/components/ui/modal";
// import Input from "@/components/form/input/InputField";
// import Label from "@/components/form/Label";
// import Button from "@/components/ui/button/Button";
// import { useAddHours, useAddRooms, useCreateHotel, useHotels, useRegisterUser } from "@/hooks/apiHooks";
// import { useModal } from "@/hooks/useModal";

// // Filter Interface
// interface HotelFilters {
//   search: string;
//   status: string;
//   type: string;
//   city: string;
// }

// // Simple Text Editor Component
// const SimpleTextEditor = ({ value, onChange, placeholder, label }) => {
//   return (
//     <div className="space-y-3">
//       <Label className="text-sm font-medium">{label}</Label>
//       <textarea
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full min-h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical"
//         rows={6}
//       />
//       <div className="text-xs text-gray-500">
//         {value ? value.length : 0} characters
//       </div>
//     </div>
//   );
// };

// // Rich Text Editor Component
// const RichTextEditor = ({
//   value,
//   onChange,
//   placeholder,
//   label,
// }: {
//   value: string;
//   onChange: (e: any) => void;
//   placeholder?: string;
//   label?: string;
// }) => {
//   return (
//     <div className="space-y-3">
//       <Label className="text-sm font-medium">{label}</Label>

//       <div className="border border-gray-300 rounded-md overflow-hidden">
//         <Editor
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           containerProps={{ style: { minHeight: "200px" } }}
//           buttons={[
//             "title",
//             "bold",
//             "italic",
//             "underline",
//             "list-ul",
//             "list-ol",
//             "link",
//             "image",
//           ]}
//         />
//       </div>
//     </div>
//   );
// };

// interface Room {
//   room_name: string;
//   description: string;
//   price: number;
//   max_occupancy: number;
// }

// interface HourlyRate {
//   hours: number;
//   price: number;
// }

// interface Amenity {
//   name: string;
//   description?: string;
// }

// interface PrivacyPolicy {
//   title: string;
//   description: string;
// }

// interface HotelUser {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }

// interface Hotel {
//   id: number;
//   name: string;
//   isHourly: boolean;
//   email: string;
//   phone: string;
//   description: string;
//   country: string;
//   address?: string;
//   city: string;
//   latitude?: number;
//   longitude?: number;
//   isVerified?: boolean;
//   privacyPolicy?: string;
//   amenities?: Amenity[];
//   hourlyRates?: HourlyRate[];
//   rooms?: Room[];
//   hotelUser?: HotelUser;
// }

// export default function HotelTablePage() {
//   const [hotelList, setHotelList] = useState<Hotel[]>([]);
//   const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [hotelType, setHotelType] = useState<"hourly" | "normal">("hourly");
//   const [images, setImages] = useState<File[]>([]);
//   const [viewDetailsModal, setViewDetailsModal] = useState<Hotel | null>(null);
//   const [isUploadingImages, setIsUploadingImages] = useState(false);
  
//   // New modal states
//   const [amenitiesModal, setAmenitiesModal] = useState<Hotel | null>(null);
//   const [privacyPolicyModal, setPrivacyPolicyModal] = useState<Hotel | null>(null);
  
//   // Loading states
//   const [isAmenitiesSubmitting, setIsAmenitiesSubmitting] = useState(false);
//   const [isPrivacySubmitting, setIsPrivacySubmitting] = useState(false);
  
//   // Filter States
//   const [filters, setFilters] = useState<HotelFilters>({
//     search: "",
//     status: "",
//     type: "",
//     city: ""
//   });

//   const router = useRouter();
//   const { isOpen, openModal, closeModal } = useModal();
  
//   // API hooks
//   const { isError, isLoading, data: hotelData, error, mutate: hotelMutation } = useHotels();
//   const { isError: createHotelIsError, isLoading: createHotelLoading, data: createHotelData, error: createHotelError, mutate: createHotel } = useCreateHotel();
//   const { isError: createhourlyIsError, isLoading: createhourlyLoading, data: createhourlyData, error: createhourlyError, mutate: createhourlyHotel } = useAddHours();
//   const { isError: createRoomsIsError, isLoading: createRoomsLoading, data: createRoomsData, error: createRoomsError, mutate: createRooms } = useAddRooms();
//   const { isError: regiterError, isLoading: registerisLoading, data: registerisLoadingData, error: registerisLoadingError, mutate: registerisLoadingMutation } = useRegisterUser();

//   const { control, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<Hotel>({
//     defaultValues: {
//       id: 0, name: "", isHourly: true, email: "", phone: "", description: "", city: "", country: "", address: "", latitude: undefined, longitude: undefined, isVerified: false, privacyPolicy: "",
//       amenities: [{ name: "", description: "" }], hourlyRates: [{ hours: 1, price: 0 }], 
//       rooms: [{ room_name: "", description: "", price: 0, max_occupancy: 0 }], 
//       hotelUser: { firstName: "", lastName: "", email: "", password: "" }
//     },
//   });

//   // Form controls for amenities modal
//   const { control: amenitiesControl, handleSubmit: handleAmenitiesSubmit, reset: resetAmenities, formState: { errors: amenitiesErrors } } = useForm({
//     defaultValues: {
//       amenities: [{ name: "", description: "" }]
//     }
//   });

//   // Form controls for privacy policy modal
//   const { control: privacyControl, handleSubmit: handlePrivacySubmit, reset: resetPrivacy, formState: { errors: privacyErrors } } = useForm({
//     defaultValues: {
//       privacyPolicies: [{ title: "", description: "" }]
//     }
//   });

//   const { fields: roomFields, append: appendRoom, remove: removeRoom } = useFieldArray({ control, name: "rooms" });
//   const { fields: hourlyFields, append: appendHourly, remove: removeHourly } = useFieldArray({ control, name: "hourlyRates" });
//   const { fields: amenityFields, append: appendAmenity, remove: removeAmenity } = useFieldArray({ control, name: "amenities" });
  
//   // Field arrays for new modals
//   const { fields: modalAmenityFields, append: appendModalAmenity, remove: removeModalAmenity } = useFieldArray({ control: amenitiesControl, name: "amenities" });
//   const { fields: modalPrivacyFields, append: appendModalPrivacy, remove: removeModalPrivacy } = useFieldArray({ control: privacyControl, name: "privacyPolicies" });

//   // Filter Logic
//   const filteredHotels = useMemo(() => {
//     return hotelList.filter(hotel => {
//       const matchesSearch = hotel.name.toLowerCase().includes(filters.search.toLowerCase()) ||
//                            hotel.email.toLowerCase().includes(filters.search.toLowerCase()) ||
//                            hotel.city.toLowerCase().includes(filters.search.toLowerCase());
      
//       const matchesStatus = filters.status === "" || 
//                            (filters.status === "verified" && hotel.isVerified) ||
//                            (filters.status === "pending" && !hotel.isVerified);
      
//       const matchesType = filters.type === "" || 
//                          (filters.type === "hourly" && hotel.isHourly) ||
//                          (filters.type === "normal" && !hotel.isHourly);
      
//       const matchesCity = filters.city === "" || hotel.city.toLowerCase() === filters.city.toLowerCase();
      
//       return matchesSearch && matchesStatus && matchesType && matchesCity;
//     });
//   }, [hotelList, filters]);

//   const uniqueCities = useMemo(() => {
//     return [...new Set(hotelList.map(hotel => hotel.city))].filter(Boolean);
//   }, [hotelList]);

//   useEffect(() => { hotelMutation({}); }, [hotelMutation]);

//   useEffect(() => {
//     if (isError && !isLoading) {
//       toast.error(error instanceof Error ? error.message : "An error occurred while fetching hotels");
//       router.push("/login ");
//     }
//     if (Array.isArray(hotelData?.data?.hotels)) {
//       setHotelList(hotelData.data.hotels);
//     }
//   }, [isError, isLoading, error, hotelData, router]);

//   // **FIXED: Corrected useEffect for hotel creation and image upload**
//   useEffect(() => {
//     if (createHotelData) {
//       const hotelId = createHotelData?.data?.id;
      
//       if (hotelId) {
//         toast.success(isEditing ? "Hotel updated successfully!" : "Hotel created successfully!");
        
//         // Create an async function inside useEffect to handle image upload
//         const handleImageUpload = async () => {
//           if (images.length > 0) {
//             try {
//               setIsUploadingImages(true);
              
//               const formData = new FormData();
//               images.forEach((image) => {
//                 formData.append('images', image);
//               });
//               formData.append('serviceName', 'hotel');
//               formData.append('hotel_id', hotelId.toString());

//               console.log('Uploading images for hotel ID:', hotelId); // Debug log

//               const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/hotels/upload`, {
//                 method: 'POST',
//                 body: formData,
//               });

//               console.log('Upload response status:', response.status); // Debug log

//               if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//               }

//               const result = await response.json();
//               console.log('Upload result:', result); // Debug log
              
//               if (result.success) {
//                 toast.success("Images uploaded successfully!");
//               } else {
//                console.log(result.message || "Image upload failed");
//               }
              
//             } catch (error) {
//               console.error("Image upload error:", error);
//               toast.error("Failed to upload images. Please try again.");
//             } finally {
//               setIsUploadingImages(false);
//             }
//           }
          
//           // Always cleanup after upload attempt (success or failure)
//           handleSuccessCleanup();
//         };

//         // Call the async function
//         handleImageUpload();
//       }
//     }
    
//     if (createHotelIsError && !createHotelLoading) {
//       toast.error(createHotelError instanceof Error ? createHotelError.message : "An error occurred while saving the hotel");
//     }
//   }, [createHotelData, createHotelIsError, createHotelError, createHotelLoading]); // Removed 'images' from dependency array

//   // Helper function to clean up after successful hotel creation
//   const handleSuccessCleanup = () => {
//     closeModal(); 
//     reset(); 
//     setImages([]);
//     setCurrentStep(1);
//     hotelMutation({});
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     const newFiles = Array.from(e.target.files);
//     const merged = [...images, ...newFiles].slice(0, 6);
//     setImages(merged); 
//     e.target.value = "";
//   };

//   const handleRemoveImage = (index: number) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleAddHotel = () => {
//     setIsEditing(false); 
//     setCurrentStep(1); 
//     setHotelType("hourly"); 
//     setImages([]);
//     reset({
//       id: 0, name: "", isHourly: true, email: "", phone: "", description: "", city: "", country: "", address: "", latitude: undefined, longitude: undefined, isVerified: false, privacyPolicy: "",
//       amenities: [{ name: "", description: "" }], hourlyRates: [{ hours: 1, price: 0 }],
//       rooms: [{ room_name: "", description: "", price: 0, max_occupancy: 0 }],
//       hotelUser: { firstName: "", lastName: "", email: "", password: "" }
//     });
//     openModal();
//   };

//   const handleEdit = (hotel: Hotel) => {
//     setIsEditing(true); 
//     setSelectedHotel({ ...hotel }); 
//     setCurrentStep(1); 
//     setHotelType(hotel.isHourly ? "hourly" : "normal");
//     setImages([]);
//     reset({
//       ...hotel,
//       amenities: hotel.amenities?.length ? hotel.amenities : [{ name: "", description: "" }],
//       hourlyRates: hotel.isHourly ? (hotel.hourlyRates?.length ? hotel.hourlyRates : [{ hours: 1, price: 0 }]) : [],
//       rooms: !hotel.isHourly ? (hotel.rooms?.length ? hotel.rooms : [{ room_name: "", description: "", price: 0, max_occupancy: 0 }]) : []
//     });
//     openModal();
//   };

//   const handleDelete = (hotel: Hotel) => {
//     console.log("Delete:", hotel);
//   };

//   // New handlers for amenities modal
//   const handleAddAmenities = (hotel: Hotel) => {
//     setAmenitiesModal(hotel);
//     resetAmenities({
//       amenities: hotel.amenities?.length ? hotel.amenities : [{ name: "", description: "" }]
//     });
//   };

//   const onAmenitiesSubmit = async (data) => {
//     if (!amenitiesModal) return;
    
//     try {
//       setIsAmenitiesSubmitting(true);

//       // Transform form data to API format - array of objects with hotel_id, name, description
//       const amenitiesPayload = data.amenities
//         .filter((amenity: any) => amenity.name.trim() !== '') // Filter out empty amenities
//         .map((amenity: any) => ({
//           hotel_id: amenitiesModal.id.toString(), // Convert to string as API expects
//           name: amenity.name.trim(),
//           description: amenity.description?.trim() || ""
//         }));

//       console.log("Sending amenities payload:", amenitiesPayload);

//       // Make API call to the specified endpoint
//       const response = await fetch('http://localhost:8000/hotels/addAmenities', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token if needed
//         },
//         body: JSON.stringify(amenitiesPayload)
//       });

//       console.log('API Response Status:', response.status);

//       if (!response.ok) {
//         const errorData = await response.text();
//         console.error('API Error:', errorData);
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('API Response:', result);

//       // Success
//       toast.success("Amenities saved successfully!");
//       setAmenitiesModal(null);
//       // Refresh hotel data
//       hotelMutation({});

//     } catch (error) {
//       console.error("Amenities submission error:", error);
//       toast.error(error instanceof Error ? error.message : "Failed to save amenities. Please try again.");
//     } finally {
//       setIsAmenitiesSubmitting(false);
//     }
//   };

//   // New handlers for privacy policy modal
//   const handleAddPrivacyPolicy = (hotel: Hotel) => {
//     setPrivacyPolicyModal(hotel);
//     resetPrivacy({
//       privacyPolicies: [{ title: "", description: hotel.privacyPolicy || "" }]
//     });
//   };

//   // Updated privacy policy submission with correct API endpoint
//   const onPrivacySubmit = async (data) => {
//     if (!privacyPolicyModal) return;
    
//     try {
//       setIsPrivacySubmitting(true);
      
//       // Filter out empty policies
//       const validPolicies = data.privacyPolicies.filter((policy: any) => 
//         policy.title.trim() !== '' && policy.description.trim() !== ''
//       );

//       // Send each policy separately as per the API format
//       for (const policy of validPolicies) {
//         const policyPayload = {
//           hotel_id: privacyPolicyModal.id.toString(),
//           title: policy.title.trim(),
//           description: policy.description.trim()
//         };

//         console.log("Sending policy payload:", policyPayload);

//         const response = await fetch('http://localhost:8000/hotels/addpolicy', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           },
//           body: JSON.stringify(policyPayload)
//         });

//         console.log('Policy API Response Status:', response.status);

//         if (!response.ok) {
//           const errorData = await response.text();
//           console.error('Policy API Error:', errorData);
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log('Policy API Response:', result);
//       }
      
//       toast.success("Privacy policy saved successfully!");
//       setPrivacyPolicyModal(null);
//       hotelMutation({});
      
//     } catch (error) {
//       console.error("Privacy policy error:", error);
//       toast.error(error instanceof Error ? error.message : "Failed to save privacy policy. Please try again.");
//     } finally {
//       setIsPrivacySubmitting(false);
//     }
//   };

//   const onSubmit = (data: Hotel) => {
//     if (!isEditing && currentStep === 4) {
//       const user = data.hotelUser;
//       if (!user?.firstName || !user.lastName || !user.email || !user.password) {
//         toast.error("Please fill in all user registration fields.");
//         return;
//       }
//     }

//     if (currentStep === 4) {
//       // Create hotel first
//       createHotel(
//         {
//           name: getValues("name"),
//           address: getValues("address"),
//           city: getValues("city"),
//           country: getValues("country"),
//           phone: getValues("phone"),
//           email: getValues("email"),
//           star_rating: 5,
//           isHourly: hotelType === "hourly", // ✅ clean boolean check
//           description: getValues("description"),
//           latitude: getValues("latitude"),
//           longitude: getValues("longitude"),
//         },
//         {
//           onSuccess: (hotelResponse) => {
//             const hotelId = hotelResponse?.data?.id;
//             if (!hotelId) return;

//             // Create rooms or hourly rates after hotel creation
//             if (hotelType === "hourly") {
//               const hourlyData = getValues("hourlyRates")?.map((item) => ({
//                 ...item,
//                 hotel_id: hotelId,
//               }));
//               createhourlyHotel(hourlyData);
//             } else if (hotelType === "normal") {
//               const roomData = getValues("rooms")?.map((item) => ({
//                 ...item,
//                 hotel_id: hotelId,
//               }));
//               createRooms(roomData);
//             }

//             // Register user
//             registerisLoadingMutation({
//               ...data.hotelUser,
//               role: "HOTEL",
//               isVerified: true,
//             });

//             // Images will be handled in the useEffect above
//           },
//         }
//       );
//     }
//   };

//   const getStepTitle = () => {
//     switch (currentStep) {
//       case 1: return "Hotel Information";
//       case 2: return "Upload Images";
//       case 3: return "Hotel Type & Details";
//       case 4: return "User Registration";
//       default: return "Hotel Setup";
//     }
//   };

//   const columns = [
//     { key: "id", label: "ID" },
//     { key: "name", label: "Hotel Name" },
//     {
//       key: "isHourly", label: "Type",
//       render: (row: Hotel) => <Badge size="sm" color={row.isHourly ? "info" : "success"}>{row.isHourly ? "Hourly" : "Regular"}</Badge>
//     },
//     { key: "email", label: "Email" },
//     { key: "city", label: "City" },
//     {
//       key: "isVerified", label: "Status",
//       render: (row: Hotel) => <Badge size="sm" color={row.isVerified ? "success" : "warning"}>{row.isVerified ? "Verified" : "Pending"}</Badge>
//     },
//     {
//       key: "actions", label: "Actions",
//       render: (row: Hotel) => (
//         <div className="flex gap-2 flex-wrap">
//           <button 
//             onClick={() => setViewDetailsModal(row)} 
//             className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
//           >
//             View
//           </button>
        
//           <button 
//             onClick={() => handleAddAmenities(row)} 
//             className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
//           >
//             Add Amenities
//           </button>
//           <button 
//             onClick={() => handleAddPrivacyPolicy(row)} 
//             className="px-3 py-1 text-xs bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors"
//           >
//             Add Privacy Policy
//           </button>
//           <button 
//             onClick={() => handleDelete(row)} 
//             className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
//           >
//             Delete
//           </button>
//         </div>
//       )
//     }
//   ];

//   return (
//     <React.Fragment>
//       <PageBreadcrumb pageTitle="Hotel Management" />
      
//       <ComponentCard title="Hotel Management">
//         {/* Simple Filters Section */}
//         <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
//           <h3 className="text-lg font-medium mb-4">Search & Filter</h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//             <div>
//               <Label className="text-sm font-medium mb-1 block">Search</Label>
//               <Input
//                 placeholder="Search hotels..."
//                 value={filters.search}
//                 onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
//               />
//             </div>
//             <div>
//               <Label className="text-sm font-medium mb-1 block">Status</Label>
//               <select
//                 value={filters.status}
//                 onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
//                 className="w-full p-2 text-sm border rounded-md"
//               >
//                 <option value="">All Status</option>
//                 <option value="verified">Verified</option>
//                 <option value="pending">Pending</option>
//               </select>
//             </div>
//             <div>
//               <Label className="text-sm font-medium mb-1 block">Type</Label>
//               <select
//                 value={filters.type}
//                 onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
//                 className="w-full p-2 text-sm border rounded-md"
//               >
//                 <option value="">All Types</option>
//                 <option value="hourly">Hourly</option>
//                 <option value="normal">Regular</option>
//               </select>
//             </div>
//             <div>
//               <Label className="text-sm font-medium mb-1 block">City</Label>
//               <select
//                 value={filters.city}
//                 onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
//                 className="w-full p-2 text-sm border rounded-md"
//               >
//                 <option value="">All Cities</option>
//                 {uniqueCities.map(city => (
//                   <option key={city} value={city}>{city}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
          
//           <div className="flex gap-2">
//             <Button
//               size="sm"
//               onClick={() => setFilters({ search: "", status: "", type: "", city: "" })}
//               variant="outline"
//               className="px-4"
//             >
//               Clear Filters
//             </Button>
//             <Button 
//               size="sm" 
//               onClick={handleAddHotel} 
//               className="px-4 bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               Add New Hotel
//             </Button>
//           </div>
          
//           <div className="mt-3 text-sm text-gray-600">
//             Showing {filteredHotels.length} of {hotelList.length} hotels
//           </div>
//         </div>
        
//         {isLoading ? (
//           <div className="text-center py-8">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-2"></div>
//             <p className="text-gray-600">Loading hotels...</p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg border overflow-hidden">
//             <BasicTableOne columns={columns} data={filteredHotels} />
//           </div>
//         )}
//       </ComponentCard>

//       {/* Amenities Modal */}
//       {amenitiesModal && (
//         <Modal isOpen={!!amenitiesModal} onClose={() => setAmenitiesModal(null)} className="max-w-4xl mx-4">
//           <div className="bg-white rounded-lg max-h-90vh overflow-hidden">
//             <div className="p-6 border-b bg-green-600 text-white">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-xl font-bold">Manage Amenities</h3>
//                   <p className="text-green-100 text-sm">{amenitiesModal.name}</p>
//                 </div>
//                 <button 
//                   onClick={() => setAmenitiesModal(null)} 
//                   className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6 max-h-96 overflow-y-auto">
//               <form onSubmit={handleAmenitiesSubmit(onAmenitiesSubmit)}>
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <h4 className="text-lg font-semibold">Hotel Amenities</h4>
//                     {modalAmenityFields.length < 20 && (
//                       <Button 
//                         type="button" 
//                         size="sm" 
//                         onClick={() => appendModalAmenity({ name: "", description: "" })} 
//                         className="bg-green-500 hover:bg-green-600"
//                       >
//                         Add Amenity
//                       </Button>
//                     )}
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {modalAmenityFields.map((amenity, idx) => (
//                       <div key={amenity.id} className="bg-green-50 p-4 rounded-lg border border-green-200">
//                         <div className="flex justify-between items-center mb-3">
//                           <h5 className="font-semibold">Amenity {idx + 1}</h5>
//                           {modalAmenityFields.length > 1 && (
//                             <Button 
//                               type="button" 
//                               variant="outline" 
//                               size="sm" 
//                               onClick={() => removeModalAmenity(idx)}
//                               className="text-red-600 border-red-200 hover:bg-red-50"
//                             >
//                               Remove
//                             </Button>
//                           )}
//                         </div>
//                         <div className="space-y-3">
//                           <div>
//                             <Label className="text-xs font-medium mb-1 block">Amenity Name *</Label>
//                             <Controller 
//                               name={`amenities.${idx}.name`} 
//                               control={amenitiesControl} 
//                               rules={{ required: "Amenity name required" }} 
//                               render={({ field }) => <Input {...field} placeholder="e.g., Free WiFi, Swimming Pool" />} 
//                             />
//                             {amenitiesErrors.amenities?.[idx]?.name && (
//                               <p className="text-red-500 text-xs mt-1">{amenitiesErrors.amenities[idx].name?.message}</p>
//                             )}
//                           </div>
//                           <div>
//                             <Label className="text-xs font-medium mb-1 block">Description</Label>
//                             <Controller 
//                               name={`amenities.${idx}.description`} 
//                               control={amenitiesControl} 
//                               render={({ field }) => (
//                                 <textarea 
//                                   {...field} 
//                                   className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 resize-none" 
//                                   rows={2} 
//                                   placeholder="Brief description of this amenity..." 
//                                 />
//                               )} 
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {modalAmenityFields.length === 0 && (
//                     <div className="text-center py-12 border-2 border-dashed border-green-200 rounded-lg bg-green-50/50">
//                       <p className="text-gray-600 mb-4 text-lg">No amenities added yet</p>
//                       <p className="text-gray-500 mb-6">Add amenities to showcase what makes your hotel special</p>
//                       <Button 
//                         type="button" 
//                         onClick={() => appendModalAmenity({ name: "", description: "" })} 
//                         className="bg-green-500 hover:bg-green-600"
//                       >
//                         Add Your First Amenity
//                       </Button>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex justify-end gap-3 pt-6 border-t mt-6">
//                   <Button 
//                     variant="outline" 
//                     onClick={() => setAmenitiesModal(null)}
//                     disabled={isAmenitiesSubmitting}
//                   >
//                     Cancel
//                   </Button>
//                   <Button 
//                     type="submit" 
//                     disabled={isAmenitiesSubmitting}
//                     className={`bg-green-600 hover:bg-green-700 ${isAmenitiesSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   >
//                     {isAmenitiesSubmitting ? 'Saving...' : 'Save Amenities'}
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* Privacy Policy Modal */}
//       {privacyPolicyModal && (
//         <Modal isOpen={!!privacyPolicyModal} onClose={() => setPrivacyPolicyModal(null)} className="max-w-5xl mx-4">
//           <div className="bg-white rounded-lg max-h-95vh overflow-hidden">
//             <div className="p-6 border-b bg-purple-600 text-white">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-xl font-bold">Manage Privacy Policy</h3>
//                   <p className="text-purple-100 text-sm">{privacyPolicyModal.name}</p>
//                 </div>
//                 <button 
//                   onClick={() => setPrivacyPolicyModal(null)} 
//                   className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 180px)' }}>
//               <form onSubmit={handlePrivacySubmit(onPrivacySubmit)}>
//                 <div className="space-y-6">
//                   <div className="flex justify-between items-center">
//                     <h4 className="text-lg font-semibold">Privacy Policies</h4>
//                     {modalPrivacyFields.length < 5 && (
//                       <Button 
//                         type="button" 
//                         size="sm" 
//                         onClick={() => appendModalPrivacy({ title: "", description: "" })} 
//                         className="bg-purple-500 hover:bg-purple-600"
//                       >
//                         Add Policy Section
//                       </Button>
//                     )}
//                   </div>
                  
//                   <div className="space-y-6">
//                     {modalPrivacyFields.map((policy, idx) => (
//                       <div key={policy.id} className="bg-purple-50 p-6 rounded-lg border border-purple-200">
//                         <div className="flex justify-between items-center mb-4">
//                           <h5 className="font-semibold text-lg">Policy Section {idx + 1}</h5>
//                           {modalPrivacyFields.length > 1 && (
//                             <Button 
//                               type="button" 
//                               variant="outline" 
//                               size="sm" 
//                               onClick={() => removeModalPrivacy(idx)}
//                               className="text-red-600 border-red-200 hover:bg-red-50"
//                             >
//                               Remove Section
//                             </Button>
//                           )}
//                         </div>
                        
//                         <div className="space-y-4">
//                           <div>
//                             <Label className="text-sm font-medium mb-2 block">Section Title *</Label>
//                             <Controller 
//                               name={`privacyPolicies.${idx}.title`} 
//                               control={privacyControl} 
//                               rules={{ required: "Title is required" }} 
//                               render={({ field }) => (
//                                 <Input 
//                                   {...field} 
//                                   placeholder="e.g., Data Collection, Guest Rights, Security Measures" 
//                                   className="text-base"
//                                 />
//                               )} 
//                             />
//                             {privacyErrors.privacyPolicies?.[idx]?.title && (
//                               <p className="text-red-500 text-xs mt-1">{privacyErrors.privacyPolicies[idx].title?.message}</p>
//                             )}
//                           </div>
                          
//                           <div>
//                             <Label className="text-sm font-medium mb-2 block">Description *</Label>
//                             <Controller 
//                               name={`privacyPolicies.${idx}.description`} 
//                               control={privacyControl} 
//                               rules={{ required: "Description is required" }} 
//                               render={({ field }) => (
//                                 <RichTextEditor
//                                   value={field.value}
//                                   onChange={(e) => field.onChange(e.target.value)}
//                                   placeholder="Enter detailed privacy policy information..."
//                                   label=""
//                                 />
//                               )} 
//                             />
//                             {privacyErrors.privacyPolicies?.[idx]?.description && (
//                               <p className="text-red-500 text-xs mt-1">{privacyErrors.privacyPolicies[idx].description?.message}</p>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {modalPrivacyFields.length === 0 && (
//                     <div className="text-center py-12 border-2 border-dashed border-purple-200 rounded-lg bg-purple-50/50">
//                       <p className="text-gray-600 mb-4 text-lg">No privacy policy sections added yet</p>
//                       <p className="text-gray-500 mb-6">Add privacy policy sections to inform guests about data handling</p>
//                       <Button 
//                         type="button" 
//                         onClick={() => appendModalPrivacy({ title: "", description: "" })} 
//                         className="bg-purple-500 hover:bg-purple-600"
//                       >
//                         Add First Policy Section
//                       </Button>
//                     </div>
//                   )}
                  
//                   <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0">
//                         <span className="text-blue-600 text-lg">i</span>
//                       </div>
//                       <div className="ml-3">
//                         <h4 className="text-sm font-medium text-blue-800">Privacy Policy Guidelines</h4>
//                         <div className="mt-1 text-sm text-blue-700">
//                           <p>Your privacy policy should include information about:</p>
//                           <ul className="list-disc list-inside mt-2 space-y-1">
//                             <li>Data collection and usage</li>
//                             <li>Guest rights and preferences</li>
//                             <li>Security measures and data protection</li>
//                             <li>Contact information for privacy concerns</li>
//                             <li>Cookie and tracking policies</li>
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex justify-end gap-3 pt-6 border-t mt-6">
//                   <Button 
//                     variant="outline" 
//                     onClick={() => setPrivacyPolicyModal(null)}
//                     disabled={isPrivacySubmitting}
//                   >
//                     Cancel
//                   </Button>
//                   <Button 
//                     type="submit" 
//                     disabled={isPrivacySubmitting}
//                     className={`bg-purple-600 hover:bg-purple-700 ${isPrivacySubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   >
//                     {isPrivacySubmitting ? 'Saving...' : 'Save Privacy Policy'}
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* Hotel Details Modal - Simplified */}
//       {viewDetailsModal && (
//         <Modal isOpen={!!viewDetailsModal} onClose={() => setViewDetailsModal(null)} className="max-w-4xl mx-4">
//           <div className="bg-white rounded-lg max-h-90vh overflow-hidden">
//             <div className="p-6 border-b">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-xl font-bold">Hotel Details</h3>
//                   <p className="text-gray-600">{viewDetailsModal.name}</p>
//                 </div>
//                 <button onClick={() => setViewDetailsModal(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
//               </div>
//             </div>
            
//             <div className="p-6 max-h-96 overflow-y-auto">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <h4 className="font-semibold border-b pb-2 mb-4">Basic Information</h4>
//                   <div className="space-y-2 text-sm">
//                     <div><span className="font-medium">Name:</span> {viewDetailsModal.name}</div>
//                     <div><span className="font-medium">Email:</span> {viewDetailsModal.email}</div>
//                     <div><span className="font-medium">Phone:</span> {viewDetailsModal.phone}</div>
//                     <div><span className="font-medium">Type:</span> {viewDetailsModal.isHourly ? "Hourly Hotel" : "Regular Hotel"}</div>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <h4 className="font-semibold border-b pb-2 mb-4">Location</h4>
//                   <div className="space-y-2 text-sm">
//                     <div><span className="font-medium">City:</span> {viewDetailsModal.city}</div>
//                     <div><span className="font-medium">Country:</span> {viewDetailsModal.country}</div>
//                     {viewDetailsModal.latitude && (
//                       <div><span className="font-medium">Latitude:</span> {viewDetailsModal.latitude}</div>
//                     )}
//                     {viewDetailsModal.longitude && (
//                       <div><span className="font-medium">Longitude:</span> {viewDetailsModal.longitude}</div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex justify-end gap-3 p-6 border-t">
//               <Button variant="outline" onClick={() => setViewDetailsModal(null)}>Close</Button>
//               <Button onClick={() => { setViewDetailsModal(null); handleEdit(viewDetailsModal); }}>Edit Hotel</Button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* Create/Edit Hotel Modal - 4 Step Process */}
//       <Modal isOpen={isOpen} onClose={closeModal} className="max-w-5xl mx-4 my-8">
//         <div className="bg-white rounded-lg max-h-95vh overflow-hidden">
//           {/* Header with Progress */}
//           <div className="p-6 border-b bg-blue-600 text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h4 className="text-xl font-bold">{isEditing ? "Edit Hotel" : "Create New Hotel"}</h4>
//                 <p className="text-blue-100 text-sm">{getStepTitle()}</p>
//                 {isUploadingImages && (
//                   <p className="text-yellow-200 text-sm mt-1">Uploading images...</p>
//                 )}
//               </div>
//               <button 
//                 onClick={closeModal} 
//                 disabled={isUploadingImages}
//                 className="text-white hover:bg-white/20 p-2 rounded-full transition-colors disabled:opacity-50"
//               >
//                 ×
//               </button>
//             </div>
            
//             {/* Step Progress Bar */}
//             {!isEditing && (
//               <div className="mt-4">
//                 <div className="flex justify-between text-xs text-blue-100 mb-2">
//                   <span>Step {currentStep} of 4</span>
//                   <span>{Math.round((currentStep / 4) * 100)}% Complete</span>
//                 </div>
//                 <div className="w-full bg-blue-800/30 rounded-full h-2">
//                   <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Content */}
//           <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 200px)' }}>
//             <form onSubmit={handleSubmit(onSubmit)}>
              
//               {/* Step 1: Hotel Information */}
//               {!isEditing && currentStep === 1 && (
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold mb-4">Hotel Information</h3>
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Hotel Name *</Label>
//                       <Controller name="name" control={control} rules={{ required: "Hotel name is required" }} render={({ field }) => <Input {...field} placeholder="Grand Plaza Hotel" />} />
//                       {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Email *</Label>
//                       <Controller name="email" control={control} rules={{ required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } }} render={({ field }) => <Input type="email" {...field} placeholder="contact@hotel.com" />} />
//                       {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Phone *</Label>
//                       <Controller name="phone" control={control} rules={{ required: "Phone is required" }} render={({ field }) => <Input {...field} placeholder="+1 (555) 123-4567" />} />
//                       {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Address</Label>
//                       <Controller name="address" control={control} render={({ field }) => <Input {...field} placeholder="123 Main Street" />} />
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">City *</Label>
//                       <Controller name="city" control={control} rules={{ required: "City is required" }} render={({ field }) => <Input {...field} placeholder="New York" />} />
//                       {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Country *</Label>
//                       <Controller name="country" control={control} rules={{ required: "Country is required" }} render={({ field }) => <Input {...field} placeholder="United States" />} />
//                       {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Latitude</Label>
//                       <Controller 
//                         name="latitude" 
//                         control={control} 
//                         rules={{ 
//                           min: { value: -90, message: "Latitude must be between -90 and 90" },
//                           max: { value: 90, message: "Latitude must be between -90 and 90" }
//                         }} 
//                         render={({ field }) => (
//                           <Input 
//                             {...field} 
//                             type="number" 
//                             step="any" 
//                             placeholder="40.7128" 
//                             value={field.value ?? ""} 
//                             onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
//                           />
//                         )} 
//                       />
//                       {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Longitude</Label>
//                       <Controller 
//                         name="longitude" 
//                         control={control} 
//                         rules={{ 
//                           min: { value: -180, message: "Longitude must be between -180 and 180" },
//                           max: { value: 180, message: "Longitude must be between -180 and 180" }
//                         }} 
//                         render={({ field }) => (
//                           <Input 
//                             {...field} 
//                             type="number" 
//                             step="any" 
//                             placeholder="-74.0060" 
//                             value={field.value ?? ""} 
//                             onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
//                           />
//                         )} 
//                       />
//                       {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude.message}</p>}
//                     </div>
//                   </div>
//                   <div>
//                     <Controller name="description" control={control} rules={{ required: "Description is required" }} render={({ field }) => (
//                       <SimpleTextEditor value={field.value} onChange={field.onChange} placeholder="Describe your hotel's unique features, location, and what makes it special..." label="Hotel Description *" />
//                     )} />
//                     {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
//                   </div>
//                 </div>
//               )}

//               {/* Step 2: Images */}
//               {!isEditing && currentStep === 2 && (
//                 <div className="space-y-6">
//                   <div className="text-center">
//                     <h3 className="text-lg font-semibold mb-2">Upload Hotel Images</h3>
//                     <p className="text-gray-600 text-sm mb-6">Upload 2-6 high-quality images to showcase your hotel</p>
//                   </div>
//                   <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 bg-blue-50 text-center">
//                     <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="upload" />
//                     <label htmlFor="upload" className="cursor-pointer block">
//                       <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
//                         <span className="text-2xl text-blue-600">📷</span>
//                       </div>
//                       <p className="text-lg font-semibold text-gray-700 mb-2">Click to upload images</p>
//                       <p className="text-sm text-gray-500">PNG, JPG up to 5MB each • Min 2, Max 6 images</p>
//                     </label>
//                   </div>
//                   {images.length > 0 && (
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                       {images.map((file, idx) => (
//                         <div key={idx} className="relative group bg-white rounded-lg overflow-hidden border">
//                           <img src={URL.createObjectURL(file)} alt={`Preview ${idx + 1}`} className="w-full h-32 object-cover" />
//                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                             <button type="button" onClick={() => handleRemoveImage(idx)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
//                               Remove
//                             </button>
//                           </div>
//                           <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
//                             Image {idx + 1}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Step 3: Hotel Type & Details */}
//               {!isEditing && currentStep === 3 && (
//                 <div className="space-y-6">
//                   <div>
//                     <h3 className="text-lg font-semibold mb-4">Select Hotel Type</h3>
//                     <div className="grid grid-cols-2 gap-4 mb-6">
//                       <button 
//                         type="button" 
//                         className={`p-6 border-2 rounded-lg text-center transition-all ${hotelType === "hourly" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"}`} 
//                         onClick={() => { 
//                           setHotelType("hourly"); 
//                           setValue("isHourly", true); 
//                           setValue("rooms", []); 
//                           if (hourlyFields.length === 0) appendHourly({ hours: 1, price: 0 }); 
//                         }}
//                       >
//                         <div className="text-4xl mb-3">⏰</div>
//                         <div className="text-lg font-semibold mb-2">Hourly Hotel</div>
//                         <p className="text-sm text-gray-600">Perfect for short stays • Flexible pricing</p>
//                       </button>
//                       <button 
//                         type="button" 
//                         className={`p-6 border-2 rounded-lg text-center transition-all ${hotelType === "normal" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`} 
//                         onClick={() => { 
//                           setHotelType("normal"); 
//                           setValue("isHourly", false); 
//                           setValue("hourlyRates", []); 
//                           if (roomFields.length === 0) appendRoom({ room_name: "", description: "", price: 0, max_occupancy: 0 }); 
//                         }}
//                       >
//                         <div className="text-4xl mb-3">🛏️</div>
//                         <div className="text-lg font-semibold mb-2">Regular Hotel</div>
//                         <p className="text-sm text-gray-600">Traditional rooms • Overnight stays</p>
//                       </button>
//                     </div>

//                     {/* Hourly Rates */}
//                     {hotelType === "hourly" && (
//                       <div className="space-y-4">
//                         <div className="flex justify-between items-center">
//                           <h4 className="text-lg font-semibold">Hourly Rate Packages</h4>
//                           {hourlyFields.length < 5 && (
//                             <Button type="button" size="sm" onClick={() => appendHourly({ hours: 1, price: 0 })} className="bg-orange-500 hover:bg-orange-600">
//                               Add Rate
//                             </Button>
//                           )}
//                         </div>
//                         {hourlyFields.map((hourly, idx) => (
//                           <div key={hourly.id} className="bg-orange-50 p-4 rounded-lg border border-orange-200">
//                             <div className="flex justify-between items-center mb-3">
//                               <h5 className="font-semibold">Package {idx + 1}</h5>
//                               {hourlyFields.length > 1 && (
//                                 <Button type="button" variant="outline" size="sm" onClick={() => removeHourly(idx)}>
//                                   Remove
//                                 </Button>
//                               )}
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                               <div>
//                                 <Label className="text-xs font-medium mb-1 block">Duration (Hours)</Label>
//                                 <Controller name={`hourlyRates.${idx}.hours`} control={control} rules={{ required: "Hours required", min: { value: 1, message: "Min 1 hour" } }} render={({ field }) => <Input type="number" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value))} placeholder="1" />} />
//                                 {errors.hourlyRates?.[idx]?.hours && <p className="text-red-500 text-xs mt-1">{errors.hourlyRates[idx].hours?.message}</p>}
//                               </div>
//                               <div>
//                                 <Label className="text-xs font-medium mb-1 block">Price ($)</Label>
//                                 <Controller name={`hourlyRates.${idx}.price`} control={control} rules={{ required: "Price required", min: { value: 0, message: "Min $0" } }} render={({ field }) => <Input type="number" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value))} placeholder="50" />} />
//                                 {errors.hourlyRates?.[idx]?.price && <p className="text-red-500 text-xs mt-1">{errors.hourlyRates[idx].price?.message}</p>}
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}

//                     {/* Rooms */}
//                     {hotelType === "normal" && (
//                       <div className="space-y-4">
//                         <div className="flex justify-between items-center">
//                           <h4 className="text-lg font-semibold">Hotel Rooms</h4>
//                           {roomFields.length < 10 && (
//                             <Button type="button" size="sm" onClick={() => appendRoom({ room_name: "", description: "", price: 0, max_occupancy: 0 })} className="bg-blue-500 hover:bg-blue-600">
//                               Add Room
//                             </Button>
//                           )}
//                         </div>
//                         {roomFields.map((room, idx) => (
//                           <div key={room.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                             <div className="flex justify-between items-center mb-3">
//                               <h5 className="font-semibold">Room {idx + 1}</h5>
//                               {roomFields.length > 1 && (
//                                 <Button type="button" variant="outline" size="sm" onClick={() => removeRoom(idx)}>
//                                   Remove
//                                 </Button>
//                               )}
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div>
//                                 <Label className="text-xs font-medium mb-1 block">Room Name</Label>
//                                 <Controller name={`rooms.${idx}.room_name`} control={control} rules={{ required: "Room name required" }} render={({ field }) => <Input {...field} placeholder="Deluxe Suite" />} />
//                                 {errors.rooms?.[idx]?.room_name && <p className="text-red-500 text-xs mt-1">{errors.rooms[idx].room_name?.message}</p>}
//                               </div>
//                               <div>
//                                 <Label className="text-xs font-medium mb-1 block">Max Guests</Label>
//                                 <Controller name={`rooms.${idx}.max_occupancy`} control={control} rules={{ required: "Max occupancy required", min: { value: 1, message: "Min 1 guest" } }} render={({ field }) => <Input type="number" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value))} placeholder="2" />} />
//                                 {errors.rooms?.[idx]?.max_occupancy && <p className="text-red-500 text-xs mt-1">{errors.rooms[idx].max_occupancy?.message}</p>}
//                               </div>
//                               <div>
//                                 <Label className="text-xs font-medium mb-1 block">Price/Night ($)</Label>
//                                 <Controller name={`rooms.${idx}.price`} control={control} rules={{ required: "Price required", min: { value: 0, message: "Min $0" } }} render={({ field }) => <Input type="number" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value))} placeholder="150" />} />
//                                 {errors.rooms?.[idx]?.price && <p className="text-red-500 text-xs mt-1">{errors.rooms[idx].price?.message}</p>}
//                               </div>
//                               <div>
//                                 <Label className="text-xs font-medium mb-1 block">Description</Label>
//                                 <Controller name={`rooms.${idx}.description`} control={control} rules={{ required: "Description required" }} render={({ field }) => <Input {...field} placeholder="Spacious room with city view" />} />
//                                 {errors.rooms?.[idx]?.description && <p className="text-red-500 text-xs mt-1">{errors.rooms[idx].description?.message}</p>}
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Step 4: User Registration */}
//               {!isEditing && currentStep === 4 && (
//                 <div className="space-y-6">
//                   <div className="text-center mb-6">
//                     <h3 className="text-xl font-semibold mb-2">Create Hotel Manager Account</h3>
//                     <p className="text-gray-600">Set up the account that will manage this hotel</p>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">First Name *</Label>
//                       <Controller name="hotelUser.firstName" control={control} rules={{ required: "First name required" }} render={({ field }) => <Input {...field} placeholder="John" />} />
//                       {errors.hotelUser?.firstName && <p className="text-red-500 text-xs mt-1">{errors.hotelUser.firstName.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Last Name *</Label>
//                       <Controller name="hotelUser.lastName" control={control} rules={{ required: "Last name required" }} render={({ field }) => <Input {...field} placeholder="Doe" />} />
//                       {errors.hotelUser?.lastName && <p className="text-red-500 text-xs mt-1">{errors.hotelUser.lastName.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Email Address *</Label>
//                       <Controller name="hotelUser.email" control={control} rules={{ required: "Email required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } }} render={({ field }) => <Input type="email" {...field} placeholder="john@hotel.com" />} />
//                       {errors.hotelUser?.email && <p className="text-red-500 text-xs mt-1">{errors.hotelUser.email.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Password *</Label>
//                       <Controller name="hotelUser.password" control={control} rules={{ required: "Password required", minLength: { value: 6, message: "Min 6 characters" } }} render={({ field }) => <Input type="password" {...field} placeholder="••••••••" />} />
//                       {errors.hotelUser?.password && <p className="text-red-500 text-xs mt-1">{errors.hotelUser.password.message}</p>}
//                     </div>
//                   </div>

//                   {/* Final Review */}
//                   <div className="mt-8 bg-purple-50 rounded-lg p-6 border border-purple-200">
//                     <h4 className="text-lg font-semibold mb-4">Final Review</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                       <div><strong>Hotel:</strong> <span className="text-gray-600">{getValues("name") || "Not set"}</span></div>
//                       <div><strong>Type:</strong> <span className="text-gray-600">{hotelType === "hourly" ? "Hourly Hotel" : "Regular Hotel"}</span></div>
//                       <div><strong>Location:</strong> <span className="text-gray-600">{getValues("city")}, {getValues("country")}</span></div>
//                       <div><strong>Images:</strong> <span className="text-gray-600">{images.length} uploaded</span></div>
//                       <div><strong>{hotelType === "hourly" ? "Packages:" : "Rooms:"}</strong> <span className="text-gray-600">{hotelType === "hourly" ? hourlyFields.length : roomFields.length} configured</span></div>
//                       {(getValues("latitude") || getValues("longitude")) && (
//                         <div><strong>Coordinates:</strong> <span className="text-gray-600">{getValues("latitude") || 'N/A'}, {getValues("longitude") || 'N/A'}</span></div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Edit Mode - All fields in one view */}
//               {isEditing && (
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-semibold mb-4">Edit Hotel Information</h3>
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Hotel Name *</Label>
//                       <Controller name="name" control={control} rules={{ required: "Hotel name is required" }} render={({ field }) => <Input {...field} placeholder="Grand Plaza Hotel" />} />
//                       {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Email *</Label>
//                       <Controller name="email" control={control} rules={{ required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } }} render={({ field }) => <Input type="email" {...field} placeholder="contact@hotel.com" />} />
//                       {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Phone *</Label>
//                       <Controller name="phone" control={control} rules={{ required: "Phone is required" }} render={({ field }) => <Input {...field} placeholder="+1 (555) 123-4567" />} />
//                       {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">City *</Label>
//                       <Controller name="city" control={control} rules={{ required: "City is required" }} render={({ field }) => <Input {...field} placeholder="New York" />} />
//                       {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Latitude</Label>
//                       <Controller 
//                         name="latitude" 
//                         control={control} 
//                         rules={{ 
//                           min: { value: -90, message: "Latitude must be between -90 and 90" },
//                           max: { value: 90, message: "Latitude must be between -90 and 90" }
//                         }} 
//                         render={({ field }) => (
//                           <Input 
//                             {...field} 
//                             type="number" 
//                             step="any" 
//                             placeholder="40.7128" 
//                             value={field.value ?? ""} 
//                             onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
//                           />
//                         )} 
//                       />
//                       {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Longitude</Label>
//                       <Controller 
//                         name="longitude" 
//                         control={control} 
//                         rules={{ 
//                           min: { value: -180, message: "Longitude must be between -180 and 180" },
//                           max: { value: 180, message: "Longitude must be between -180 and 180" }
//                         }} 
//                         render={({ field }) => (
//                           <Input 
//                             {...field} 
//                             type="number" 
//                             step="any" 
//                             placeholder="-74.0060" 
//                             value={field.value ?? ""} 
//                             onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
//                           />
//                         )} 
//                       />
//                       {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude.message}</p>}
//                     </div>
//                   </div>
//                   <div>
//                     <Controller name="description" control={control} rules={{ required: "Description is required" }} render={({ field }) => (
//                       <SimpleTextEditor value={field.value} onChange={field.onChange} placeholder="Describe your hotel..." label="Description *" />
//                     )} />
//                     {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
//                   </div>
//                 </div>
//               )}

//               {/* Navigation Buttons */}
//               <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
//                 {!isEditing && currentStep > 1 && (
//                   <Button 
//                     type="button" 
//                     variant="outline" 
//                     onClick={() => setCurrentStep(s => s - 1)}
//                     disabled={isUploadingImages}
//                   >
//                     ← Previous
//                   </Button>
//                 )}
//                 <div className="flex-1"></div>
//                 {!isEditing && currentStep < 4 && (
//                   <Button 
//                     type="button" 
//                     onClick={() => {
//                       if (currentStep === 2 && (images.length < 2 || images.length > 6)) { 
//                         toast.error("Please upload 2-6 images."); 
//                         return; 
//                       }
//                       if (currentStep === 3) {
//                         if (hotelType === "hourly" && hourlyFields.length === 0) { 
//                           toast.error("Add at least one hourly rate."); 
//                           return; 
//                         }
//                         if (hotelType === "normal" && roomFields.length === 0) { 
//                           toast.error("Add at least one room."); 
//                           return; 
//                         }
//                       }
//                       setCurrentStep(s => s + 1);
//                     }}
//                     disabled={isUploadingImages}
//                   >
//                     Next Step →
//                   </Button>
//                 )}
//                 {(isEditing || currentStep === 4) && (
//                   <Button 
//                     type="submit" 
//                     disabled={createHotelLoading || isUploadingImages} 
//                     className={createHotelLoading || isUploadingImages ? 'opacity-50 cursor-not-allowed' : ''}
//                   >
//                     {createHotelLoading ? 'Creating Hotel...' : isUploadingImages ? 'Uploading Images...' : (isEditing ? 'Save Changes' : 'Create Hotel')}
//                   </Button>
//                 )}
//               </div>
//             </form>
//           </div>
//         </div>
//       </Modal>
//     </React.Fragment>
//   );
// }

//full latest code with comprehensive toast notifications and delete functionality
// "use client";

// import React, { useEffect, useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { useForm, Controller, useFieldArray } from "react-hook-form";
// import toast from "react-hot-toast";
// import Editor from 'react-simple-wysiwyg';
// import ComponentCard from "@/components/common/ComponentCard";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import BasicTableOne from "@/components/tables/BasicTableOne";
// import Badge from "@/components/ui/badge/Badge";
// import { Modal } from "@/components/ui/modal";
// import Input from "@/components/form/input/InputField";
// import Label from "@/components/form/Label";
// import Button from "@/components/ui/button/Button";
// import { useAddHours, useAddRooms, useCreateHotel, useHotels, useRegisterUser } from "@/hooks/apiHooks";
// import { useModal } from "@/hooks/useModal";

// // Filter Interface
// interface HotelFilters {
//   search: string;
//   status: string;
//   type: string;
//   city: string;
// }

// // Simple Text Editor Component
// const SimpleTextEditor = ({ value, onChange, placeholder, label }) => {
//   return (
//     <div className="space-y-3">
//       <Label className="text-sm font-medium">{label}</Label>
//       <textarea
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full min-h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical"
//         rows={6}
//       />
//       <div className="text-xs text-gray-500">
//         {value ? value.length : 0} characters
//       </div>
//     </div>
//   );
// };

// // Rich Text Editor Component
// const RichTextEditor = ({
//   value,
//   onChange,
//   placeholder,
//   label,
// }: {
//   value: string;
//   onChange: (e: any) => void;
//   placeholder?: string;
//   label?: string;
// }) => {
//   return (
//     <div className="space-y-3">
//       <Label className="text-sm font-medium">{label}</Label>

//       <div className="border border-gray-300 rounded-md overflow-hidden">
//         <Editor
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           containerProps={{ style: { minHeight: "200px" } }}
//           buttons={[
//             "title",
//             "bold",
//             "italic",
//             "underline",
//             "list-ul",
//             "list-ol",
//             "link",
//             "image",
//           ]}
//         />
//       </div>
//     </div>
//   );
// };

// interface Room {
//   room_name: string;
//   description: string;
//   price: number;
//   max_occupancy: number;
// }

// interface HourlyRate {
//   hours: number;
//   price: number;
// }

// interface Amenity {
//   name: string;
//   description?: string;
// }

// interface PrivacyPolicy {
//   title: string;
//   description: string;
// }

// interface HotelUser {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   password: string;
// }

// interface Hotel {
//   id: number;
//   name: string;
//   isHourly: boolean;
//   email: string;
//   phone: string;
//   description: string;
//   country: string;
//   address?: string;
//   city: string;
//   latitude?: number;
//   longitude?: number;
//   isVerified?: boolean;
//   privacyPolicy?: string;
//   amenities?: Amenity[];
//   hourlyRates?: HourlyRate[];
//   rooms?: Room[];
//   hotelUser?: HotelUser;
// }

// export default function HotelTablePage() {
//   const [hotelList, setHotelList] = useState<Hotel[]>([]);
//   const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [hotelType, setHotelType] = useState<"hourly" | "normal">("hourly");
//   const [images, setImages] = useState<File[]>([]);
//   const [viewDetailsModal, setViewDetailsModal] = useState<Hotel | null>(null);
//   const [isUploadingImages, setIsUploadingImages] = useState(false);
  
//   // Modal states
//   const [amenitiesModal, setAmenitiesModal] = useState<Hotel | null>(null);
//   const [privacyPolicyModal, setPrivacyPolicyModal] = useState<Hotel | null>(null);
//   const [deleteModal, setDeleteModal] = useState<Hotel | null>(null);
  
//   // Loading states
//   const [isAmenitiesSubmitting, setIsAmenitiesSubmitting] = useState(false);
//   const [isPrivacySubmitting, setIsPrivacySubmitting] = useState(false);
//   const [isCreatingHotel, setIsCreatingHotel] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
  
//   // Filter States
//   const [filters, setFilters] = useState<HotelFilters>({
//     search: "",
//     status: "",
//     type: "",
//     city: ""
//   });

//   const router = useRouter();
//   const { isOpen, openModal, closeModal } = useModal();
  
//   // API hooks
//   const { isError, isLoading, data: hotelData, error, mutate: hotelMutation } = useHotels();
//   const { isError: createHotelIsError, isLoading: createHotelLoading, data: createHotelData, error: createHotelError, mutate: createHotel } = useCreateHotel();
//   const { isError: createhourlyIsError, isLoading: createhourlyLoading, data: createhourlyData, error: createhourlyError, mutate: createhourlyHotel } = useAddHours();
//   const { isError: createRoomsIsError, isLoading: createRoomsLoading, data: createRoomsData, error: createRoomsError, mutate: createRooms } = useAddRooms();
//   const { isError: regiterError, isLoading: registerisLoading, data: registerisLoadingData, error: registerisLoadingError, mutate: registerisLoadingMutation } = useRegisterUser();

//   const { control, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<Hotel>({
//     defaultValues: {
//       id: 0, name: "", isHourly: true, email: "", phone: "", description: "", city: "", country: "", address: "", latitude: undefined, longitude: undefined, isVerified: false, privacyPolicy: "",
//       amenities: [{ name: "", description: "" }], hourlyRates: [{ hours: 1, price: 0 }], 
//       rooms: [{ room_name: "", description: "", price: 0, max_occupancy: 0 }], 
//       hotelUser: { firstName: "", lastName: "", email: "", phone: "", password: "" }
//     },
//   });

//   // Form controls for amenities modal
//   const { control: amenitiesControl, handleSubmit: handleAmenitiesSubmit, reset: resetAmenities, formState: { errors: amenitiesErrors } } = useForm({
//     defaultValues: {
//       amenities: [{ name: "", description: "" }]
//     }
//   });

//   // Form controls for privacy policy modal
//   const { control: privacyControl, handleSubmit: handlePrivacySubmit, reset: resetPrivacy, formState: { errors: privacyErrors } } = useForm({
//     defaultValues: {
//       privacyPolicies: [{ title: "", description: "" }]
//     }
//   });

//   const { fields: roomFields, append: appendRoom, remove: removeRoom } = useFieldArray({ control, name: "rooms" });
//   const { fields: hourlyFields, append: appendHourly, remove: removeHourly } = useFieldArray({ control, name: "hourlyRates" });
//   const { fields: amenityFields, append: appendAmenity, remove: removeAmenity } = useFieldArray({ control, name: "amenities" });
  
//   // Field arrays for modals
//   const { fields: modalAmenityFields, append: appendModalAmenity, remove: removeModalAmenity } = useFieldArray({ control: amenitiesControl, name: "amenities" });
//   const { fields: modalPrivacyFields, append: appendModalPrivacy, remove: removeModalPrivacy } = useFieldArray({ control: privacyControl, name: "privacyPolicies" });

//   // Filter Logic
//   const filteredHotels = useMemo(() => {
//     return hotelList.filter(hotel => {
//       const matchesSearch = hotel.name.toLowerCase().includes(filters.search.toLowerCase()) ||
//                            hotel.email.toLowerCase().includes(filters.search.toLowerCase()) ||
//                            hotel.city.toLowerCase().includes(filters.search.toLowerCase());
      
//       const matchesStatus = filters.status === "" || 
//                            (filters.status === "verified" && hotel.isVerified) ||
//                            (filters.status === "pending" && !hotel.isVerified);
      
//       const matchesType = filters.type === "" || 
//                          (filters.type === "hourly" && hotel.isHourly) ||
//                          (filters.type === "normal" && !hotel.isHourly);
      
//       const matchesCity = filters.city === "" || hotel.city.toLowerCase() === filters.city.toLowerCase();
      
//       return matchesSearch && matchesStatus && matchesType && matchesCity;
//     });
//   }, [hotelList, filters]);

//   const uniqueCities = useMemo(() => {
//     return [...new Set(hotelList.map(hotel => hotel.city))].filter(Boolean);
//   }, [hotelList]);

//   // Enhanced useEffect with proper toast notifications for hotel loading
//   useEffect(() => { 
//     const loadingToast = toast.loading("🔄 Loading hotels...", {
//       duration: 0,
//       position: 'top-center',
//     });
    
//     hotelMutation({});
    
//     setTimeout(() => {
//       toast.dismiss(loadingToast);
//     }, 1000);
//   }, [hotelMutation]);

//   // Enhanced error and success handling with detailed toast notifications
//   useEffect(() => {
//     if (isError && !isLoading) {
//       const errorMessage = error instanceof Error ? error.message : "An error occurred while fetching hotels";
      
//       toast.error(`❌ ${errorMessage}`, {
//         duration: 5000,
//         position: 'top-center',
//       });
      
//       if (errorMessage.toLowerCase().includes('unauthorized') || errorMessage.toLowerCase().includes('token')) {
//         toast.error("🔐 Session expired. Redirecting to login...", {
//           duration: 3000,
//           position: 'top-center',
//         });
//         setTimeout(() => {
//           router.push("/login ");
//         }, 2000);
//       }
//     }
    
//     if (Array.isArray(hotelData?.data?.hotels)) {
//       setHotelList(hotelData.data.hotels);
      
//       if (hotelData.data.hotels.length > 0) {
//         toast.success(`✅ Successfully loaded ${hotelData.data.hotels.length} hotels`, {
//           duration: 3000,
//           position: 'top-center',
//         });
//       }
//     }
//   }, [isError, isLoading, error, hotelData, router]);

//   // Helper function to clean up after successful hotel creation
//   const handleSuccessCleanup = () => {
//     closeModal(); 
//     reset(); 
//     setImages([]);
//     setCurrentStep(1);
//     setIsCreatingHotel(false);
    
//     const refreshToast = toast.loading("🔄 Refreshing hotel list...", {
//       position: 'top-center',
//     });
    
//     hotelMutation({});
    
//     setTimeout(() => {
//       toast.dismiss(refreshToast);
//       toast.success("📋 Hotel list updated successfully!", {
//         duration: 2000,
//         position: 'top-center',
//       });
//     }, 1000);
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
    
//     const newFiles = Array.from(e.target.files);
//     const merged = [...images, ...newFiles].slice(0, 12);
    
//     if (newFiles.length > 0) {
//       toast.success(`📷 ${newFiles.length} image(s) selected successfully!`, {
//         duration: 2000,
//         position: 'top-center',
//       });
//     }
    
//     if (merged.length === 12 && newFiles.length > (12 - images.length)) {
//       toast.warning("⚠️ Maximum 12 images allowed. Extra images were not added.", {
//         duration: 3000,
//         position: 'top-center',
//       });
//     }
    
//     setImages(merged); 
//     e.target.value = "";
//   };

//   const handleRemoveImage = (index: number) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//     toast.success("🗑️ Image removed successfully!", {
//       duration: 2000,
//       position: 'top-center',
//     });
//   };

//   const handleAddHotel = () => {
//     toast.success("➕ Opening hotel creation form...", {
//       duration: 2000,
//       position: 'top-center',
//     });
    
//     setIsEditing(false); 
//     setCurrentStep(1); 
//     setHotelType("hourly"); 
//     setImages([]);
//     reset({
//       id: 0, name: "", isHourly: true, email: "", phone: "", description: "", city: "", country: "", address: "", latitude: undefined, longitude: undefined, isVerified: false, privacyPolicy: "",
//       amenities: [{ name: "", description: "" }], hourlyRates: [{ hours: 1, price: 0 }],
//       rooms: [{ room_name: "", description: "", price: 0, max_occupancy: 0 }],
//       hotelUser: { firstName: "", lastName: "", email: "", phone: "", password: "" }
//     });
//     openModal();
//   };

//   const handleEdit = (hotel: Hotel) => {
//     toast.success(`✏️ Opening edit form for "${hotel.name}"...`, {
//       duration: 2000,
//       position: 'top-center',
//     });
    
//     setIsEditing(true); 
//     setSelectedHotel({ ...hotel }); 
//     setCurrentStep(1); 
//     setHotelType(hotel.isHourly ? "hourly" : "normal");
//     setImages([]);
//     reset({
//       ...hotel,
//       amenities: hotel.amenities?.length ? hotel.amenities : [{ name: "", description: "" }],
//       hourlyRates: hotel.isHourly ? (hotel.hourlyRates?.length ? hotel.hourlyRates : [{ hours: 1, price: 0 }]) : [],
//       rooms: !hotel.isHourly ? (hotel.rooms?.length ? hotel.rooms : [{ room_name: "", description: "", price: 0, max_occupancy: 0 }]) : []
//     });
//     openModal();
//   };

//   // Enhanced delete functionality with comprehensive toast notifications
//   const handleDelete = (hotel: Hotel) => {
//     toast.loading("🔍 Preparing to delete hotel...", {
//       duration: 1000,
//       position: 'top-center',
//     });
    
//     setTimeout(() => {
//       setDeleteModal(hotel);
//     }, 500);
//   };

//   // Enhanced delete confirmation with detailed toast notifications
//   const confirmDelete = async () => {
//     if (!deleteModal) return;
    
//     const loadingToast = toast.loading(`🗑️ Deleting "${deleteModal.name}"...`, {
//       duration: 0,
//       position: 'top-center',
//     });
    
//     try {
//       setIsDeleting(true);
      
//       console.log("🗑️ Deleting hotel:", deleteModal.name, "ID:", deleteModal.id);
      
//       const response = await fetch('http://localhost:8000/hotels/delete', {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({
//           ids: [deleteModal.id.toString()]
//         })
//       });

//       console.log('Delete API Response Status:', response.status);

//       if (!response.ok) {
//         const errorData = await response.text();
//         console.error('Delete API Error:', errorData);
//         throw new Error(`HTTP error! status: ${response.status} - ${errorData}`);
//       }

//       const result = await response.json();
//       console.log('Delete API Response:', result);

//       toast.dismiss(loadingToast);

//       toast.success(`🎉 Hotel "${deleteModal.name}" deleted successfully!`, {
//         duration: 4000,
//         position: 'top-center',
//       });
      
//       setDeleteModal(null);
      
//       const refreshToast = toast.loading("🔄 Updating hotel list...", {
//         position: 'top-center',
//       });
      
//       hotelMutation({});
      
//       setTimeout(() => {
//         toast.dismiss(refreshToast);
//         toast.success("📋 Hotel list refreshed!", {
//           duration: 2000,
//           position: 'top-center',
//         });
//       }, 1000);

//     } catch (error) {
//       console.error("❌ Hotel deletion error:", error);
      
//       toast.dismiss(loadingToast);
      
//       let errorMessage = "Failed to delete hotel. Please try again.";
      
//       if (error instanceof Error) {
//         errorMessage = error.message;
//       } else if (typeof error === 'string') {
//         errorMessage = error;
//       }

//       toast.error(`❌ Delete Failed: ${errorMessage}`, {
//         duration: 6000,
//         position: 'top-center',
//       });
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   // Enhanced amenities modal handlers with toast notifications
//   const handleAddAmenities = (hotel: Hotel) => {
//     toast.success(`🏨 Opening amenities manager for "${hotel.name}"...`, {
//       duration: 2000,
//       position: 'top-center',
//     });
    
//     setAmenitiesModal(hotel);
//     resetAmenities({
//       amenities: hotel.amenities?.length ? hotel.amenities : [{ name: "", description: "" }]
//     });
//   };

//   // Enhanced amenities submission with comprehensive toast notifications
//   const onAmenitiesSubmit = async (data) => {
//     if (!amenitiesModal) return;
    
//     const loadingToast = toast.loading(`💎 Saving amenities for "${amenitiesModal.name}"...`, {
//       duration: 0,
//       position: 'top-center',
//     });
    
//     try {
//       setIsAmenitiesSubmitting(true);

//       const amenitiesPayload = data.amenities
//         .filter((amenity: any) => amenity.name.trim() !== '')
//         .map((amenity: any) => ({
//           hotel_id: amenitiesModal.id.toString(),
//           name: amenity.name.trim(),
//           description: amenity.description?.trim() || ""
//         }));

//       if (amenitiesPayload.length === 0) {
//         toast.dismiss(loadingToast);
//         toast.warning("⚠️ Please add at least one amenity before saving.", {
//           duration: 3000,
//           position: 'top-center',
//         });
//         return;
//       }

//       console.log("Sending amenities payload:", amenitiesPayload);

//       const response = await fetch('http://localhost:8000/hotels/addAmenities', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(amenitiesPayload)
//       });

//       console.log('Amenities API Response Status:', response.status);

//       if (!response.ok) {
//         const errorData = await response.text();
//         console.error('Amenities API Error:', errorData);
//         throw new Error(`HTTP error! status: ${response.status} - ${errorData}`);
//       }

//       const result = await response.json();
//       console.log('Amenities API Response:', result);

//       toast.dismiss(loadingToast);

//       toast.success(`✅ ${amenitiesPayload.length} amenities saved successfully for "${amenitiesModal.name}"!`, {
//         duration: 4000,
//         position: 'top-center',
//       });
      
//       setAmenitiesModal(null);
      
//       const refreshToast = toast.loading("🔄 Refreshing hotel data...", {
//         position: 'top-center',
//       });
      
//       hotelMutation({});
      
//       setTimeout(() => {
//         toast.dismiss(refreshToast);
//       }, 1000);

//     } catch (error) {
//       console.error("Amenities submission error:", error);
      
//       toast.dismiss(loadingToast);
      
//       const errorMessage = error instanceof Error ? error.message : "Failed to save amenities. Please try again.";
//       toast.error(`❌ Amenities Save Failed: ${errorMessage}`, {
//         duration: 5000,
//         position: 'top-center',
//       });
//     } finally {
//       setIsAmenitiesSubmitting(false);
//     }
//   };

//   // Enhanced privacy policy modal handlers with toast notifications
//   const handleAddPrivacyPolicy = (hotel: Hotel) => {
//     toast.success(`🛡️ Opening privacy policy manager for "${hotel.name}"...`, {
//       duration: 2000,
//       position: 'top-center',
//     });
    
//     setPrivacyPolicyModal(hotel);
//     resetPrivacy({
//       privacyPolicies: [{ title: "", description: hotel.privacyPolicy || "" }]
//     });
//   };

//   // Enhanced privacy policy submission with comprehensive toast notifications
//   const onPrivacySubmit = async (data) => {
//     if (!privacyPolicyModal) return;
    
//     const loadingToast = toast.loading(`🛡️ Saving privacy policy for "${privacyPolicyModal.name}"...`, {
//       duration: 0,
//       position: 'top-center',
//     });
    
//     try {
//       setIsPrivacySubmitting(true);
      
//       const validPolicies = data.privacyPolicies.filter((policy: any) => 
//         policy.title.trim() !== '' && policy.description.trim() !== ''
//       );

//       if (validPolicies.length === 0) {
//         toast.dismiss(loadingToast);
//         toast.warning("⚠️ Please add at least one privacy policy section before saving.", {
//           duration: 3000,
//           position: 'top-center',
//         });
//         return;
//       }

//       for (const [index, policy] of validPolicies.entries()) {
//         const policyPayload = {
//           hotel_id: privacyPolicyModal.id.toString(),
//           title: policy.title.trim(),
//           description: policy.description.trim()
//         };

//         console.log(`Sending policy ${index + 1}/${validPolicies.length}:`, policyPayload);

//         const response = await fetch('http://localhost:8000/hotels/addpolicy', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           },
//           body: JSON.stringify(policyPayload)
//         });

//         console.log(`Policy ${index + 1} API Response Status:`, response.status);

//         if (!response.ok) {
//           const errorData = await response.text();
//           console.error(`Policy ${index + 1} API Error:`, errorData);
//           throw new Error(`HTTP error for policy ${index + 1}! status: ${response.status} - ${errorData}`);
//         }

//         const result = await response.json();
//         console.log(`Policy ${index + 1} API Response:`, result);
//       }
      
//       toast.dismiss(loadingToast);

//       toast.success(`✅ ${validPolicies.length} privacy policy section(s) saved successfully for "${privacyPolicyModal.name}"!`, {
//         duration: 4000,
//         position: 'top-center',
//       });
      
//       setPrivacyPolicyModal(null);
      
//       const refreshToast = toast.loading("🔄 Refreshing hotel data...", {
//         position: 'top-center',
//       });
      
//       hotelMutation({});
      
//       setTimeout(() => {
//         toast.dismiss(refreshToast);
//       }, 1000);
      
//     } catch (error) {
//       console.error("Privacy policy error:", error);
      
//       toast.dismiss(loadingToast);
      
//       const errorMessage = error instanceof Error ? error.message : "Failed to save privacy policy. Please try again.";
//       toast.error(`❌ Privacy Policy Save Failed: ${errorMessage}`, {
//         duration: 5000,
//         position: 'top-center',
//       });
//     } finally {
//       setIsPrivacySubmitting(false);
//     }
//   };

//   // Enhanced onSubmit with comprehensive toast notifications for each step
//   const onSubmit = async (data: Hotel) => {
//     if (!isEditing && currentStep === 4) {
//       const user = data.hotelUser;
//       if (!user?.firstName || !user.lastName || !user.email || !user.phone || !user.password) {
//         toast.error("❌ Please fill in all user registration fields including phone number.", {
//           duration: 4000,
//           position: 'top-center',
//         });
//         return;
//       }
//     }

//     if (currentStep === 4) {
//       const mainLoadingToast = toast.loading("🚀 Starting hotel creation process...", {
//         duration: 0,
//         position: 'top-center',
//       });
      
//       setIsCreatingHotel(true);
      
//       try {
//         console.log("🚀 Starting hotel creation process...");
        
//         // Step 1: Create Hotel
//         toast.dismiss(mainLoadingToast);
//         const hotelLoadingToast = toast.loading("📋 Step 1/4: Creating hotel...", {
//           duration: 0,
//           position: 'top-center',
//         });
        
//         console.log("📋 Step 1: Creating hotel...");
//         const hotelResponse = await new Promise<any>((resolve, reject) => {
//           createHotel({
//             name: getValues("name"),
//             address: getValues("address"),
//             city: getValues("city"),
//             country: getValues("country"),
//             phone: getValues("phone"),
//             email: getValues("email"),
//             star_rating: 5,
//             isHourly: hotelType === "hourly",
//             description: getValues("description"),
//             latitude: getValues("latitude"),
//             longitude: getValues("longitude"),
//           }, {
//             onSuccess: (response) => {
//               console.log("✅ Hotel created successfully:", response);
//               toast.dismiss(hotelLoadingToast);
//               toast.success("✅ Step 1/4: Hotel created successfully!", {
//                 duration: 2000,
//                 position: 'top-center',
//               });
//               resolve(response);
//             },
//             onError: (error) => {
//               console.error("❌ Hotel creation failed:", error);
//               toast.dismiss(hotelLoadingToast);
//               reject(error);
//             },
//           });
//         });

//         const hotelId = hotelResponse?.data?.id;
//         if (!hotelId) {
//           throw new Error("Hotel ID not received from server");
//         }

//         // Step 2: Create Rooms or Hourly Rates
//         if (hotelType === "hourly") {
//           const hourlyLoadingToast = toast.loading("⏰ Step 2/4: Creating hourly rates...", {
//             duration: 0,
//             position: 'top-center',
//           });
          
//           console.log("⏰ Step 2: Creating hourly rates...");
//           const hourlyData = getValues("hourlyRates")?.map((item) => ({
//             ...item,
//             hotel_id: hotelId,
//           }));

//           if (hourlyData && hourlyData.length > 0) {
//             await new Promise<any>((resolve, reject) => {
//               createhourlyHotel(hourlyData, {
//                 onSuccess: (response) => {
//                   console.log("✅ Hourly rates created successfully:", response);
//                   toast.dismiss(hourlyLoadingToast);
//                   toast.success(`✅ Step 2/4: ${hourlyData.length} hourly rate(s) created!`, {
//                     duration: 2000,
//                     position: 'top-center',
//                   });
//                   resolve(response);
//                 },
//                 onError: (error) => {
//                   console.error("❌ Hourly rates creation failed:", error);
//                   toast.dismiss(hourlyLoadingToast);
//                   reject(error);
//                 },
//               });
//             });
//           } else {
//             toast.dismiss(hourlyLoadingToast);
//             toast.success("✅ Step 2/4: No hourly rates to create, skipping...", {
//               duration: 2000,
//               position: 'top-center',
//             });
//           }
//         } else if (hotelType === "normal") {
//           const roomsLoadingToast = toast.loading("🛏️ Step 2/4: Creating rooms...", {
//             duration: 0,
//             position: 'top-center',
//           });
          
//           console.log("🛏️ Step 2: Creating rooms...");
//           const roomData = getValues("rooms")?.map((item) => ({
//             ...item,
//             hotel_id: hotelId,
//           }));

//           if (roomData && roomData.length > 0) {
//             await new Promise<any>((resolve, reject) => {
//               createRooms(roomData, {
//                 onSuccess: (response) => {
//                   console.log("✅ Rooms created successfully:", response);
//                   toast.dismiss(roomsLoadingToast);
//                   toast.success(`✅ Step 2/4: ${roomData.length} room(s) created!`, {
//                     duration: 2000,
//                     position: 'top-center',
//                   });
//                   resolve(response);
//                 },
//                 onError: (error) => {
//                   console.error("❌ Rooms creation failed:", error);
//                   toast.dismiss(roomsLoadingToast);
//                   reject(error);
//                 },
//               });
//             });
//           } else {
//             toast.dismiss(roomsLoadingToast);
//             toast.success("✅ Step 2/4: No rooms to create, skipping...", {
//               duration: 2000,
//               position: 'top-center',
//             });
//           }
//         }

//         // Step 3: Register User
//         const userLoadingToast = toast.loading("👤 Step 3/4: Registering hotel manager...", {
//           duration: 0,
//           position: 'top-center',
//         });
        
//         console.log("👤 Step 3: Registering user...");
//         await new Promise<any>((resolve, reject) => {
//           registerisLoadingMutation({
//             ...data.hotelUser,
//             role: "HOTEL",
//             isVerified: true,
//           }, {
//             onSuccess: (response) => {
//               console.log("✅ User registered successfully:", response);
//               toast.dismiss(userLoadingToast);
//               toast.success(`✅ Step 3/4: Manager "${data.hotelUser.firstName} ${data.hotelUser.lastName}" registered!`, {
//                 duration: 2000,
//                 position: 'top-center',
//               });
//               resolve(response);
//             },
//             onError: (error) => {
//               console.error("❌ User registration failed:", error);
//               toast.dismiss(userLoadingToast);
//               reject(error);
//             },
//           });
//         });

//         // Step 4: Upload Images (optional)
//         if (images.length > 0) {
//           const imageLoadingToast = toast.loading(`📸 Step 4/4: Uploading ${images.length} images...`, {
//             duration: 0,
//             position: 'top-center',
//           });
          
//           console.log("📸 Step 4: Uploading images...");
//           setIsUploadingImages(true);
          
//           try {
//             const formData = new FormData();
//             images.forEach((image) => {
//               formData.append('images', image);
//             });
//             formData.append('serviceName', 'hotel');
//             formData.append('hotel_id', hotelId.toString());

//             const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/hotels/upload`, {
//               method: 'POST',
//               body: formData,
//             });

//             if (!response.ok) {
//               throw new Error(`Image upload failed: ${response.status}`);
//             }

//             const result = await response.json();
//             if (!result.success) {
//               throw new Error(result.message || "Image upload failed");
//             }

//             console.log("✅ Images uploaded successfully:", result);
//             toast.dismiss(imageLoadingToast);
//             toast.success(`✅ Step 4/4: ${images.length} images uploaded successfully!`, {
//               duration: 2000,
//               position: 'top-center',
//             });
//           } catch (imageError) {
//             console.warn("⚠️ Image upload failed (non-critical):", imageError);
            
//           } finally {
//             setIsUploadingImages(false);
//           }
//         } else {
//           toast.success("✅ Step 4/4: No images to upload, skipping...", {
//             duration: 2000,
//             position: 'top-center',
//           });
//         }

//         // All steps completed successfully
//         console.log("🎉 Hotel creation process completed successfully!");
//         setTimeout(() => {
//           toast.success("🎉 Hotel Creation Complete! All components have been set up perfectly.", {
//             duration: 5000,
//             position: 'top-center',
//           });
//         }, 1000);
        
//         handleSuccessCleanup();

//       } catch (error) {
//         console.error("💥 Hotel creation process failed:", error);
//         setIsCreatingHotel(false);
//         setIsUploadingImages(false);
        
//         let errorMessage = "Failed to create hotel. Please try again.";
        
//         if (error instanceof Error) {
//           errorMessage = error.message;
//         } else if (typeof error === 'string') {
//           errorMessage = error;
//         }

//         toast.error(`❌ Hotel Creation Failed: ${errorMessage}`, {
//           duration: 6000,
//           position: 'top-center',
//         });
//       }
//     }
//   };

//   const getStepTitle = () => {
//     switch (currentStep) {
//       case 1: return "Hotel Information";
//       case 2: return "Upload Images";
//       case 3: return "Hotel Type & Details";
//       case 4: return "User Registration";
//       default: return "Hotel Setup";
//     }
//   };

//   const amenitiesConfig = [
//     { key: "pool", name: "Swimming Pool" },
//     { key: "gym", name: "Gym / Fitness Center" },
//     { key: "parking", name: "Parking" },
//     { key: "wifi", name: "Free Wi-Fi" },
//     { key: "restaurant", name: "Restaurant" },
//     { key: "bar", name: "Bar / Lounge" },
//     { key: "spa", name: "Spa" },
//     { key: "ac", name: "Air Conditioning" },
//     { key: "pets", name: "Pet Friendly" },
//     { key: "laundry", name: "Laundry Service" },
//     { key: "tv", name: "Flat Screen TV" },
//     { key: "elevator", name: "Elevator" },
//     { key: "bed", name: "Comfortable Bed" },
//     { key: "outlets", name: "Power Outlets Near Bed" },
//     { key: "drinkingWater", name: "Drinking Water Bottles" },
//     { key: "teaCoffee", name: "Tea / Coffee Maker" },
//     { key: "desk", name: "Desk & Chair" },
//     { key: "luggageRack", name: "Luggage Rack" },
//     { key: "bathroom", name: "Attached Bathroom" },
//     { key: "hotWater", name: "Hot & Cold Water" },
//     { key: "towels", name: "Fresh Towels" },
//     { key: "toiletries", name: "Basic Toiletries" },
//     { key: "fastCheckin", name: "Quick Check-In & Out" },
//     { key: "housekeeping", name: "On-Demand Housekeeping" },
//     { key: "reception", name: "24x7 Reception" },
//     { key: "storage", name: "Luggage Storage" },
//     { key: "cabBooking", name: "Cab / Taxi Booking" },
//     { key: "roomService", name: "In-Room Dining" },
//     { key: "miniFridge", name: "Mini Fridge" },
//     { key: "complimentaryDrinks", name: "Complimentary Water / Tea / Coffee" },
//     { key: "soundproof", name: "Soundproof Rooms" },
//     { key: "keycard", name: "Key Card Access" },
//     { key: "cctv", name: "CCTV Security" },
//     { key: "secureBilling", name: "Secure Billing" },
//     { key: "privateParking", name: "Private Parking" },
//     { key: "lounge", name: "Lounge / Waiting Area" },
//     { key: "business", name: "Business Center" },
//     { key: "printer", name: "Printer & Office Essentials" },
//     { key: "hygiene", name: "Hygiene Add-ons" },
//     { key: "blackoutCurtains", name: "Blackout Curtains" },
//     { key: "shower", name: "Good Shower" },
//     { key: "hairDryer", name: "Hair Dryer" },
//     { key: "breakfast", name: "Complimentary Breakfast" },
//     { key: "airportPickup", name: "Airport / Railway Pickup" },
//     { key: "tourDesk", name: "Tour & Local Guide Desk" },
//     { key: "safe", name: "Digital Safe" },
//     { key: "iron", name: "Iron & Ironing Board" },
//     { key: "firstAid", name: "First Aid / Doctor On Call" },
//     { key: "atm", name: "ATM / Currency Exchange" },
//   ];

//   const columns = [
//     { key: "id", label: "ID" },
//     { key: "name", label: "Hotel Name" },
//     {
//       key: "isHourly", label: "Type",
//       render: (row: Hotel) => <Badge size="sm" color={row.isHourly ? "info" : "success"}>{row.isHourly ? "Hourly" : "Regular"}</Badge>
//     },
//     { key: "email", label: "Email" },
//     { key: "city", label: "City" },
//     {
//       key: "isVerified", label: "Status",
//       render: (row: Hotel) => <Badge size="sm" color={row.isVerified ? "success" : "warning"}>{row.isVerified ? "Verified" : "Pending"}</Badge>
//     },
//     {
//       key: "actions", label: "Actions",
//       render: (row: Hotel) => (
//         <div className="flex gap-2 flex-wrap">
//           <button 
//             onClick={() => {
//               toast.loading("👁️ Loading hotel details...", {
//                 duration: 1000,
//                 position: 'top-center',
//               });
//               setTimeout(() => setViewDetailsModal(row), 500);
//             }} 
//             className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
//           >
//             View
//           </button>
        
//           <button 
//             onClick={() => handleAddAmenities(row)} 
//             className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
//           >
//             Add Amenities
//           </button>
//           <button 
//             onClick={() => handleAddPrivacyPolicy(row)} 
//             className="px-3 py-1 text-xs bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors"
//           >
//             Add Privacy Policy
//           </button>
//           <button 
//             onClick={() => handleDelete(row)} 
//             className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
//             disabled={isDeleting}
//           >
//             {isDeleting ? 'Deleting...' : 'Delete'}
//           </button>
//         </div>
//       )
//     }
//   ];

//   return (
//     <React.Fragment>
//       <PageBreadcrumb pageTitle="Hotel Management" />
      
//       <ComponentCard title="Hotel Management">
//         {/* Simple Filters Section */}
//         <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
//           <h3 className="text-lg font-medium mb-4">Search & Filter</h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//             <div>
//               <Label className="text-sm font-medium mb-1 block">Search</Label>
//               <Input
//                 placeholder="Search hotels..."
//                 value={filters.search}
//                 onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
//               />
//             </div>
//             <div>
//               <Label className="text-sm font-medium mb-1 block">Status</Label>
//               <select
//                 value={filters.status}
//                 onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
//                 className="w-full p-2 text-sm border rounded-md"
//               >
//                 <option value="">All Status</option>
//                 <option value="verified">Verified</option>
//                 <option value="pending">Pending</option>
//               </select>
//             </div>
//             <div>
//               <Label className="text-sm font-medium mb-1 block">Type</Label>
//               <select
//                 value={filters.type}
//                 onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
//                 className="w-full p-2 text-sm border rounded-md"
//               >
//                 <option value="">All Types</option>
//                 <option value="hourly">Hourly</option>
//                 <option value="normal">Regular</option>
//               </select>
//             </div>
//             <div>
//               <Label className="text-sm font-medium mb-1 block">City</Label>
//               <select
//                 value={filters.city}
//                 onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
//                 className="w-full p-2 text-sm border rounded-md"
//               >
//                 <option value="">All Cities</option>
//                 {uniqueCities.map(city => (
//                   <option key={city} value={city}>{city}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
          
//           <div className="flex gap-2">
//             <Button
//               size="sm"
//               onClick={() => {
//                 setFilters({ search: "", status: "", type: "", city: "" });
//                 toast.success("🧹 Filters cleared successfully!", {
//                   duration: 2000,
//                   position: 'top-center',
//                 });
//               }}
//               variant="outline"
//               className="px-4"
//             >
//               Clear Filters
//             </Button>
//             <Button 
//               size="sm" 
//               onClick={handleAddHotel} 
//               className="px-4 bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               Add New Hotel
//             </Button>
//           </div>
          
//           <div className="mt-3 text-sm text-gray-600">
//             Showing {filteredHotels.length} of {hotelList.length} hotels
//           </div>
//         </div>
        
//         {isLoading ? (
//           <div className="text-center py-8">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-2"></div>
//             <p className="text-gray-600">Loading hotels...</p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg border overflow-hidden">
//             <BasicTableOne columns={columns} data={filteredHotels} />
//           </div>
//         )}
//       </ComponentCard>

//       {/* Delete Confirmation Modal */}
//       {deleteModal && (
//         <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} className="max-w-md mx-4">
//           <div className="bg-white rounded-lg overflow-hidden">
//             <div className="p-6 border-b bg-red-600 text-white">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-xl font-bold">🗑️ Delete Hotel</h3>
//                   <p className="text-red-100 text-sm">This action cannot be undone</p>
//                 </div>
//                 <button 
//                   onClick={() => {
//                     setDeleteModal(null);
//                     toast.success("❌ Delete operation cancelled.", {
//                       duration: 2000,
//                       position: 'top-center',
//                     });
//                   }} 
//                   disabled={isDeleting}
//                   className="text-white hover:bg-white/20 p-2 rounded-full transition-colors disabled:opacity-50"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6">
//               <div className="text-center mb-6">
//                 <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
//                   <span className="text-2xl text-red-600">⚠️</span>
//                 </div>
//                 <h4 className="text-lg font-semibold mb-2">Are you sure you want to delete this hotel?</h4>
//                 <div className="bg-gray-50 rounded-lg p-4 mb-4">
//                   <div className="text-sm space-y-1">
//                     <div><strong>Hotel Name:</strong> {deleteModal.name}</div>
//                     <div><strong>ID:</strong> {deleteModal.id}</div>
//                     <div><strong>City:</strong> {deleteModal.city}</div>
//                     <div><strong>Type:</strong> {deleteModal.isHourly ? "Hourly Hotel" : "Regular Hotel"}</div>
//                   </div>
//                 </div>
//                 <p className="text-gray-600 text-sm">
//                   This will permanently delete the hotel and all its associated data including rooms, amenities, and bookings.
//                 </p>
//               </div>
              
//               <div className="flex justify-end gap-3">
//                 <Button 
//                   variant="outline" 
//                   onClick={() => {
//                     setDeleteModal(null);
//                     toast.success("✅ Delete operation cancelled safely.", {
//                       duration: 2000,
//                       position: 'top-center',
//                     });
//                   }}
//                   disabled={isDeleting}
//                   className="px-6"
//                 >
//                   Cancel
//                 </Button>
//                 <Button 
//                   onClick={confirmDelete}
//                   disabled={isDeleting}
//                   className={`bg-red-600 hover:bg-red-700 text-white px-6 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                   {isDeleting ? (
//                     <>
//                       <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
//                       Deleting...
//                     </>
//                   ) : (
//                     '🗑️ Delete Hotel'
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* Amenities Modal */}
//       {amenitiesModal && (
//         <Modal isOpen={!!amenitiesModal} onClose={() => setAmenitiesModal(null)} className="max-w-4xl mx-4">
//           <div className="bg-white rounded-lg max-h-90vh overflow-hidden">
//             <div className="p-6 border-b bg-green-600 text-white">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-xl font-bold">Manage Amenities</h3>
//                   <p className="text-green-100 text-sm">{amenitiesModal.name}</p>
//                 </div>
//                 <button 
//                   onClick={() => {
//                     setAmenitiesModal(null);
//                     toast.success("📝 Amenities editor closed.", {
//                       duration: 2000,
//                       position: 'top-center',
//                     });
//                   }} 
//                   className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6 max-h-96 overflow-y-auto">
//               <form onSubmit={handleAmenitiesSubmit(onAmenitiesSubmit)}>
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <h4 className="text-lg font-semibold">Hotel Amenities</h4>
//                     {modalAmenityFields.length < 20 && (
//                       <Button 
//                         type="button" 
//                         size="sm" 
//                         onClick={() => {
//                           appendModalAmenity({ name: "", description: "" });
//                           toast.success("➕ New amenity field added!", {
//                             duration: 2000,
//                             position: 'top-center',
//                           });
//                         }} 
//                         className="bg-green-500 hover:bg-green-600"
//                       >
//                         Add Amenity
//                       </Button>
//                     )}
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {modalAmenityFields.map((amenity, idx) => (
//                       <div key={amenity.id} className="bg-green-50 p-4 rounded-lg border border-green-200">
//                         <div className="flex justify-between items-center mb-3">
//                           <h5 className="font-semibold">Amenity {idx + 1}</h5>
//                           {modalAmenityFields.length > 1 && (
//                             <Button 
//                               type="button" 
//                               variant="outline" 
//                               size="sm" 
//                               onClick={() => {
//                                 removeModalAmenity(idx);
//                                 toast.success("🗑️ Amenity field removed!", {
//                                   duration: 2000,
//                                   position: 'top-center',
//                                 });
//                               }}
//                               className="text-red-600 border-red-200 hover:bg-red-50"
//                             >
//                               Remove
//                             </Button>
//                           )}
//                         </div>
//                         <div className="space-y-3">
//                           <div>
//                            <Label className="text-xs font-medium mb-1 block">Amenity Name *</Label>
//                             <Controller
//                               name={`amenities.${idx}.name`}
//                               control={amenitiesControl}
//                               rules={{ required: "Amenity name required" }}
//                               render={({ field }) => (
//                                 <select
//                                   {...field}
//                                   className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500"
//                                 >
//                                   <option value="">-- Select Amenity Key --</option>
//                                   {amenitiesConfig.map((item) => (
//                                     <option key={item.key} value={item.key}>
//                                       {item.key}
//                                     </option>
//                                   ))}
//                                 </select>
//                               )}
//                             />
//                             {amenitiesErrors.amenities?.[idx]?.name && (
//                               <p className="text-red-500 text-xs mt-1">
//                                 {amenitiesErrors.amenities[idx].name?.message}
//                               </p>
//                             )}
//                           </div>
//                           <div>
//                             <Label className="text-xs font-medium mb-1 block">Description</Label>
//                             <Controller 
//                               name={`amenities.${idx}.description`} 
//                               control={amenitiesControl} 
//                               render={({ field }) => (
//                                 <textarea 
//                                   {...field} 
//                                   className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 resize-none" 
//                                   rows={2} 
//                                   placeholder="Brief description of this amenity..." 
//                                 />
//                               )} 
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {modalAmenityFields.length === 0 && (
//                     <div className="text-center py-12 border-2 border-dashed border-green-200 rounded-lg bg-green-50/50">
//                       <p className="text-gray-600 mb-4 text-lg">No amenities added yet</p>
//                       <p className="text-gray-500 mb-6">Add amenities to showcase what makes your hotel special</p>
//                       <Button 
//                         type="button" 
//                         onClick={() => {
//                           appendModalAmenity({ name: "", description: "" });
//                           toast.success("🎉 First amenity field added!", {
//                             duration: 2000,
//                             position: 'top-center',
//                           });
//                         }} 
//                         className="bg-green-500 hover:bg-green-600"
//                       >
//                         Add Your First Amenity
//                       </Button>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex justify-end gap-3 pt-6 border-t mt-6">
//                   <Button 
//                     variant="outline" 
//                     onClick={() => {
//                       setAmenitiesModal(null);
//                       toast.success("📝 Amenities editor closed without saving.", {
//                         duration: 2000,
//                         position: 'top-center',
//                       });
//                     }}
//                     disabled={isAmenitiesSubmitting}
//                   >
//                     Cancel
//                   </Button>
//                   <Button 
//                     type="submit" 
//                     disabled={isAmenitiesSubmitting}
//                     className={`bg-green-600 hover:bg-green-700 ${isAmenitiesSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   >
//                     {isAmenitiesSubmitting ? 'Saving...' : 'Save Amenities'}
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* Privacy Policy Modal */}
//       {privacyPolicyModal && (
//         <Modal isOpen={!!privacyPolicyModal} onClose={() => setPrivacyPolicyModal(null)} className="max-w-5xl mx-4">
//           <div className="bg-white rounded-lg max-h-95vh overflow-hidden">
//             <div className="p-6 border-b bg-purple-600 text-white">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-xl font-bold">Manage Privacy Policy</h3>
//                   <p className="text-purple-100 text-sm">{privacyPolicyModal.name}</p>
//                 </div>
//                 <button 
//                   onClick={() => {
//                     setPrivacyPolicyModal(null);
//                     toast.success("📝 Privacy policy editor closed.", {
//                       duration: 2000,
//                       position: 'top-center',
//                     });
//                   }} 
//                   className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 180px)' }}>
//               <form onSubmit={handlePrivacySubmit(onPrivacySubmit)}>
//                 <div className="space-y-6">
//                   <div className="flex justify-between items-center">
//                     <h4 className="text-lg font-semibold">Privacy Policies</h4>
//                     {modalPrivacyFields.length < 5 && (
//                       <Button 
//                         type="button" 
//                         size="sm" 
//                         onClick={() => {
//                           appendModalPrivacy({ title: "", description: "" });
//                           toast.success("➕ New policy section added!", {
//                             duration: 2000,
//                             position: 'top-center',
//                           });
//                         }} 
//                         className="bg-purple-500 hover:bg-purple-600"
//                       >
//                         Add Policy Section
//                       </Button>
//                     )}
//                   </div>
                  
//                   <div className="space-y-6">
//                     {modalPrivacyFields.map((policy, idx) => (
//                       <div key={policy.id} className="bg-purple-50 p-6 rounded-lg border border-purple-200">
//                         <div className="flex justify-between items-center mb-4">
//                           <h5 className="font-semibold text-lg">Policy Section {idx + 1}</h5>
//                           {modalPrivacyFields.length > 1 && (
//                             <Button 
//                               type="button" 
//                               variant="outline" 
//                               size="sm" 
//                               onClick={() => {
//                                 removeModalPrivacy(idx);
//                                 toast.success("🗑️ Policy section removed!", {
//                                   duration: 2000,
//                                   position: 'top-center',
//                                 });
//                               }}
//                               className="text-red-600 border-red-200 hover:bg-red-50"
//                             >
//                               Remove Section
//                             </Button>
//                           )}
//                         </div>
                        
//                         <div className="space-y-4">
//                           <div>
//                             <Label className="text-sm font-medium mb-2 block">Section Title *</Label>
//                             <Controller 
//                               name={`privacyPolicies.${idx}.title`} 
//                               control={privacyControl} 
//                               rules={{ required: "Title is required" }} 
//                               render={({ field }) => (
//                                 <Input 
//                                   {...field} 
//                                   placeholder="e.g., Data Collection, Guest Rights, Security Measures" 
//                                   className="text-base"
//                                 />
//                               )} 
//                             />
//                             {privacyErrors.privacyPolicies?.[idx]?.title && (
//                               <p className="text-red-500 text-xs mt-1">{privacyErrors.privacyPolicies[idx].title?.message}</p>
//                             )}
//                           </div>
                          
//                           <div>
//                             <Label className="text-sm font-medium mb-2 block">Description *</Label>
//                             <Controller 
//                               name={`privacyPolicies.${idx}.description`} 
//                               control={privacyControl} 
//                               rules={{ required: "Description is required" }} 
//                               render={({ field }) => (
//                                 <RichTextEditor
//                                   value={field.value}
//                                   onChange={(e) => field.onChange(e.target.value)}
//                                   placeholder="Enter detailed privacy policy information..."
//                                   label=""
//                                 />
//                               )} 
//                             />
//                             {privacyErrors.privacyPolicies?.[idx]?.description && (
//                               <p className="text-red-500 text-xs mt-1">{privacyErrors.privacyPolicies[idx].description?.message}</p>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {modalPrivacyFields.length === 0 && (
//                     <div className="text-center py-12 border-2 border-dashed border-purple-200 rounded-lg bg-purple-50/50">
//                       <p className="text-gray-600 mb-4 text-lg">No privacy policy sections added yet</p>
//                       <p className="text-gray-500 mb-6">Add privacy policy sections to inform guests about data handling</p>
//                       <Button 
//                         type="button" 
//                         onClick={() => {
//                           appendModalPrivacy({ title: "", description: "" });
//                           toast.success("🎉 First policy section added!", {
//                             duration: 2000,
//                             position: 'top-center',
//                           });
//                         }} 
//                         className="bg-purple-500 hover:bg-purple-600"
//                       >
//                         Add First Policy Section
//                       </Button>
//                     </div>
//                   )}
                  
//                   <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0">
//                         <span className="text-blue-600 text-lg">i</span>
//                       </div>
//                       <div className="ml-3">
//                         <h4 className="text-sm font-medium text-blue-800">Privacy Policy Guidelines</h4>
//                         <div className="mt-1 text-sm text-blue-700">
//                           <p>Your privacy policy should include information about:</p>
//                           <ul className="list-disc list-inside mt-2 space-y-1">
//                             <li>Data collection and usage</li>
//                             <li>Guest rights and preferences</li>
//                             <li>Security measures and data protection</li>
//                             <li>Contact information for privacy concerns</li>
//                             <li>Cookie and tracking policies</li>
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex justify-end gap-3 pt-6 border-t mt-6">
//                   <Button 
//                     variant="outline" 
//                     onClick={() => {
//                       setPrivacyPolicyModal(null);
//                       toast.success("📝 Privacy policy editor closed without saving.", {
//                         duration: 2000,
//                         position: 'top-center',
//                       });
//                     }}
//                     disabled={isPrivacySubmitting}
//                   >
//                     Cancel
//                   </Button>
//                   <Button 
//                     type="submit" 
//                     disabled={isPrivacySubmitting}
//                     className={`bg-purple-600 hover:bg-purple-700 ${isPrivacySubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   >
//                     {isPrivacySubmitting ? 'Saving...' : 'Save Privacy Policy'}
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* Hotel Details Modal */}
//       {viewDetailsModal && (
//         <Modal isOpen={!!viewDetailsModal} onClose={() => setViewDetailsModal(null)} className="max-w-4xl mx-4">
//           <div className="bg-white rounded-lg max-h-90vh overflow-hidden">
//             <div className="p-6 border-b">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-xl font-bold">Hotel Details</h3>
//                   <p className="text-gray-600">{viewDetailsModal.name}</p>
//                 </div>
//                 <button 
//                   onClick={() => {
//                     setViewDetailsModal(null);
//                     toast.success("📝 Hotel details closed.", {
//                       duration: 2000,
//                       position: 'top-center',
//                     });
//                   }} 
//                   className="text-gray-400 hover:text-gray-600 text-xl font-bold"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6 max-h-96 overflow-y-auto">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <h4 className="font-semibold border-b pb-2 mb-4">Basic Information</h4>
//                   <div className="space-y-2 text-sm">
//                     <div><span className="font-medium">Name:</span> {viewDetailsModal.name}</div>
//                     <div><span className="font-medium">Email:</span> {viewDetailsModal.email}</div>
//                     <div><span className="font-medium">Phone:</span> {viewDetailsModal.phone}</div>
//                     <div><span className="font-medium">Type:</span> {viewDetailsModal.isHourly ? "Hourly Hotel" : "Regular Hotel"}</div>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <h4 className="font-semibold border-b pb-2 mb-4">Location</h4>
//                   <div className="space-y-2 text-sm">
//                     <div><span className="font-medium">City:</span> {viewDetailsModal.city}</div>
//                     <div><span className="font-medium">Country:</span> {viewDetailsModal.country}</div>
//                     {viewDetailsModal.latitude && (
//                       <div><span className="font-medium">Latitude:</span> {viewDetailsModal.latitude}</div>
//                     )}
//                     {viewDetailsModal.longitude && (
//                       <div><span className="font-medium">Longitude:</span> {viewDetailsModal.longitude}</div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* Create/Edit Hotel Modal - 4 Step Process */}
//       <Modal isOpen={isOpen} onClose={closeModal} className="max-w-5xl mx-4 my-8">
//         <div className="bg-white rounded-lg max-h-95vh overflow-hidden">
//           {/* Header with Progress */}
//           <div className="p-6 border-b bg-blue-600 text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h4 className="text-xl font-bold">{isEditing ? "Edit Hotel" : "Create New Hotel"}</h4>
//                 <p className="text-blue-100 text-sm">{getStepTitle()}</p>
//                 {isCreatingHotel && (
//                   <p className="text-yellow-200 text-sm mt-1">Creating hotel and setting up all components...</p>
//                 )}
//                 {isUploadingImages && (
//                   <p className="text-yellow-200 text-sm mt-1">Uploading images...</p>
//                 )}
//               </div>
//               <button 
//                 onClick={() => {
//                   closeModal();
//                   toast.success("📝 Hotel form closed.", {
//                     duration: 2000,
//                     position: 'top-center',
//                   });
//                 }} 
//                 disabled={isCreatingHotel || isUploadingImages}
//                 className="text-white hover:bg-white/20 p-2 rounded-full transition-colors disabled:opacity-50"
//               >
//                 ×
//               </button>
//             </div>
            
//             {/* Step Progress Bar */}
//             {!isEditing && (
//               <div className="mt-4">
//                 <div className="flex justify-between text-xs text-blue-100 mb-2">
//                   <span>Step {currentStep} of 4</span>
//                   <span>{Math.round((currentStep / 4) * 100)}% Complete</span>
//                 </div>
//                 <div className="w-full bg-blue-800/30 rounded-full h-2">
//                   <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Content */}
//           <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 200px)' }}>
//             <form onSubmit={handleSubmit(onSubmit)}>
              
//               {/* Step 1: Hotel Information with latitude/longitude */}
//               {!isEditing && currentStep === 1 && (
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold mb-4">Hotel Information</h3>
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Hotel Name *</Label>
//                       <Controller name="name" control={control} rules={{ required: "Hotel name is required" }} render={({ field }) => <Input {...field} placeholder="Grand Plaza Hotel" />} />
//                       {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Email *</Label>
//                       <Controller name="email" control={control} rules={{ required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } }} render={({ field }) => <Input type="email" {...field} placeholder="contact@hotel.com" />} />
//                       {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Phone *</Label>
//                       <Controller name="phone" control={control} rules={{ required: "Phone is required" }} render={({ field }) => <Input {...field} placeholder="+1 (555) 123-4567" />} />
//                       {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Address</Label>
//                       <Controller name="address" control={control} render={({ field }) => <Input {...field} placeholder="123 Main Street" />} />
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">City *</Label>
//                       <Controller
//                         name="city"
//                         control={control}
//                         rules={{ required: "City is required" }}
//                         render={({ field }) => (
//                           <select
//                             {...field}
//                             className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
//                           >
//                             <option value="">Select a city</option>
//                             <option value="Ahmedabad">Ahmedabad</option>
//                           </select>
//                         )}
//                       />
//                       {errors.city && (
//                         <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
//                       )}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Country *</Label>
//                       <Controller name="country" control={control} rules={{ required: "Country is required" }} render={({ field }) => <Input {...field} placeholder="United States" />} />
//                       {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Latitude</Label>
//                       <Controller 
//                         name="latitude" 
//                         control={control} 
//                         rules={{ 
//                           min: { value: -90, message: "Latitude must be between -90 and 90" },
//                           max: { value: 90, message: "Latitude must be between -90 and 90" }
//                         }} 
//                         render={({ field }) => (
//                           <Input 
//                             {...field} 
//                             type="number" 
//                             step="any" 
//                             placeholder="40.7128" 
//                             value={field.value ?? ""} 
//                             onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
//                           />
//                         )} 
//                       />
//                       {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Longitude</Label>
//                       <Controller 
//                         name="longitude" 
//                         control={control} 
//                         rules={{ 
//                           min: { value: -180, message: "Longitude must be between -180 and 180" },
//                           max: { value: 180, message: "Longitude must be between -180 and 180" }
//                         }} 
//                         render={({ field }) => (
//                           <Input 
//                             {...field} 
//                             type="number" 
//                             step="any" 
//                             placeholder="-74.0060" 
//                             value={field.value ?? ""} 
//                             onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
//                           />
//                         )} 
//                       />
//                       {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude.message}</p>}
//                     </div>
//                   </div>
//                   <div>
//                     <Controller name="description" control={control} rules={{ required: "Description is required" }} render={({ field }) => (
//                       <SimpleTextEditor value={field.value} onChange={field.onChange} placeholder="Describe your hotel's unique features, location, and what makes it special..." label="Hotel Description *" />
//                     )} />
//                     {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
//                   </div>
//                 </div>
//               )}

//               {/* Step 2 - Images with increased limit to 12 */}
//               {!isEditing && currentStep === 2 && (
//                 <div className="space-y-6">
//                   <div className="text-center">
//                     <h3 className="text-lg font-semibold mb-2">Upload Hotel Images</h3>
//                     <p className="text-gray-600 text-sm mb-6">Upload 2-12 high-quality images to showcase your hotel</p>
//                   </div>
//                   <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 bg-blue-50 text-center">
//                     <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="upload" />
//                     <label htmlFor="upload" className="cursor-pointer block">
//                       <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
//                         <span className="text-2xl text-blue-600">📷</span>
//                       </div>
//                       <p className="text-lg font-semibold text-gray-700 mb-2">Click to upload images</p>
//                       <p className="text-sm text-gray-500">PNG, JPG up to 5MB each • Min 2, Max 12 images</p>
//                     </label>
//                   </div>
//                   {images.length > 0 && (
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                       {images.map((file, idx) => (
//                         <div key={idx} className="relative group bg-white rounded-lg overflow-hidden border">
//                           <img src={URL.createObjectURL(file)} alt={`Preview ${idx + 1}`} className="w-full h-32 object-cover" />
//                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                             <button type="button" onClick={() => handleRemoveImage(idx)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
//                               Remove
//                             </button>
//                           </div>
//                           <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
//                             Image {idx + 1}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Step 3: Hotel Type & Details */}
//               {!isEditing && currentStep === 3 && (
//                 <div className="space-y-6">
//                   <div>
//                     <h3 className="text-lg font-semibold mb-4">Select Hotel Type</h3>
//                     <div className="grid grid-cols-2 gap-4 mb-6">
//                       <button 
//                         type="button" 
//                         className={`p-6 border-2 rounded-lg text-center transition-all ${hotelType === "hourly" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"}`} 
//                         onClick={() => { 
//                           setHotelType("hourly"); 
//                           setValue("isHourly", true); 
//                           setValue("rooms", []); 
//                           if (hourlyFields.length === 0) appendHourly({ hours: 1, price: 0 }); 
//                           toast.success("⏰ Selected: Hourly Hotel", {
//                             duration: 2000,
//                             position: 'top-center',
//                           });
//                         }}
//                       >
//                         <div className="text-4xl mb-3">⏰</div>
//                         <div className="text-lg font-semibold mb-2">Hourly Hotel</div>
//                         <p className="text-sm text-gray-600">Perfect for short stays • Flexible pricing</p>
//                       </button>
//                       <button 
//                         type="button" 
//                         className={`p-6 border-2 rounded-lg text-center transition-all ${hotelType === "normal" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`} 
//                         onClick={() => { 
//                           setHotelType("normal"); 
//                           setValue("isHourly", false); 
//                           setValue("hourlyRates", []); 
//                           if (roomFields.length === 0) appendRoom({ room_name: "", description: "", price: 0, max_occupancy: 0 }); 
//                           toast.success("🛏️ Selected: Regular Hotel", {
//                             duration: 2000,
//                             position: 'top-center',
//                           });
//                         }}
//                       >
//                         <div className="text-4xl mb-3">🛏️</div>
//                         <div className="text-lg font-semibold mb-2">Regular Hotel</div>
//                         <p className="text-sm text-gray-600">Traditional rooms • Overnight stays</p>
//                       </button>
//                     </div>

//                     {/* Hourly Rates */}
//                     {hotelType === "hourly" && (
//                       <div className="space-y-4">
//                         <div className="flex justify-between items-center">
//                           <h4 className="text-lg font-semibold">Hourly Rate Packages</h4>
//                           {hourlyFields.length < 5 && (
//                             <Button 
//                               type="button" 
//                               size="sm" 
//                               onClick={() => {
//                                 appendHourly({ hours: 1, price: 0 });
//                                 toast.success("➕ New hourly rate package added!", {
//                                   duration: 2000,
//                                   position: 'top-center',
//                                 });
//                               }} 
//                               className="bg-orange-500 hover:bg-orange-600"
//                             >
//                               Add Rate
//                             </Button>
//                           )}
//                         </div>
//                         {hourlyFields.map((hourly, idx) => (
//                           <div key={hourly.id} className="bg-orange-50 p-4 rounded-lg border border-orange-200">
//                             <div className="flex justify-between items-center mb-3">
//                               <h5 className="font-semibold">Package {idx + 1}</h5>
//                               {hourlyFields.length > 1 && (
//                                 <Button 
//                                   type="button" 
//                                   variant="outline" 
//                                   size="sm" 
//                                   onClick={() => {
//                                     removeHourly(idx);
//                                     toast.success("🗑️ Hourly rate package removed!", {
//                                       duration: 2000,
//                                       position: 'top-center',
//                                     });
//                                   }}
//                                 >
//                                   Remove
//                                 </Button>
//                               )}
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                               <div>
//                                 <Label className="text-xs font-medium mb-1 block">Duration (Hours)</Label>
//                                 <Controller name={`hourlyRates.${idx}.hours`} control={control} rules={{ required: "Hours required", min: { value: 1, message: "Min 1 hour" } }} render={({ field }) => <Input type="number" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value))} placeholder="1" />} />
//                                 {errors.hourlyRates?.[idx]?.hours && <p className="text-red-500 text-xs mt-1">{errors.hourlyRates[idx].hours?.message}</p>}
//                               </div>
//                               <div>
//                                 <Label className="text-xs font-medium mb-1 block">Price ($)</Label>
//                                 <Controller name={`hourlyRates.${idx}.price`} control={control} rules={{ required: "Price required", min: { value: 0, message: "Min $0" } }} render={({ field }) => <Input type="number" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value))} placeholder="50" />} />
//                                 {errors.hourlyRates?.[idx]?.price && <p className="text-red-500 text-xs mt-1">{errors.hourlyRates[idx].price?.message}</p>}
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}

//                     {/* Rooms */}
//                     {hotelType === "normal" && (
//                       <div className="space-y-4">
//                         <div className="flex justify-between items-center">
//                           <h4 className="text-lg font-semibold">Hotel Rooms</h4>
//                           {roomFields.length < 10 && (
//                             <Button 
//                               type="button" 
//                               size="sm" 
//                               onClick={() => {
//                                 appendRoom({ room_name: "", description: "", price: 0, max_occupancy: 0 });
//                                 toast.success("➕ New room added!", {
//                                   duration: 2000,
//                                   position: 'top-center',
//                                 });
//                               }} 
//                               className="bg-blue-500 hover:bg-blue-600"
//                             >
//                               Add Room
//                             </Button>
//                           )}
//                         </div>
//                         {roomFields.map((room, idx) => (
//                           <div key={room.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                             <div className="flex justify-between items-center mb-3">
//                               <h5 className="font-semibold">Room {idx + 1}</h5>
//                               {roomFields.length > 1 && (
//                                 <Button 
//                                   type="button" 
//                                   variant="outline" 
//                                   size="sm" 
//                                   onClick={() => {
//                                     removeRoom(idx);
//                                     toast.success("🗑️ Room removed!", {
//                                       duration: 2000,
//                                       position: 'top-center',
//                                     });
//                                   }}
//                                 >
//                                   Remove
//                                 </Button>
//                               )}
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div>
//                                 <Label className="text-xs font-medium mb-1 block">Room Name</Label>
//                                 <Controller name={`rooms.${idx}.room_name`} control={control} rules={{ required: "Room name required" }} render={({ field }) => <Input {...field} placeholder="Deluxe Suite" />} />
//                                 {errors.rooms?.[idx]?.room_name && <p className="text-red-500 text-xs mt-1">{errors.rooms[idx].room_name?.message}</p>}
//                               </div>
//                               <div>
//                                 <Label className="text-xs font-medium mb-1 block">Max Guests</Label>
//                                 <Controller name={`rooms.${idx}.max_occupancy`} control={control} rules={{ required: "Max occupancy required", min: { value: 1, message: "Min 1 guest" } }} render={({ field }) => <Input type="number" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value))} placeholder="2" />} />
//                                 {errors.rooms?.[idx]?.max_occupancy && <p className="text-red-500 text-xs mt-1">{errors.rooms[idx].max_occupancy?.message}</p>}
//                               </div>
//                               <div>
//                                 <Label className="text-xs font-medium mb-1 block">Price/Night ($)</Label>
//                                 <Controller name={`rooms.${idx}.price`} control={control} rules={{ required: "Price required", min: { value: 0, message: "Min $0" } }} render={({ field }) => <Input type="number" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value))} placeholder="150" />} />
//                                 {errors.rooms?.[idx]?.price && <p className="text-red-500 text-xs mt-1">{errors.rooms[idx].price?.message}</p>}
//                               </div>
//                               <div>
//                                 <Label className="text-xs font-medium mb-1 block">Description</Label>
//                                 <Controller name={`rooms.${idx}.description`} control={control} rules={{ required: "Description required" }} render={({ field }) => <Input {...field} placeholder="Spacious room with city view" />} />
//                                 {errors.rooms?.[idx]?.description && <p className="text-red-500 text-xs mt-1">{errors.rooms[idx].description?.message}</p>}
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Step 4 - User Registration with Phone Field */}
//               {!isEditing && currentStep === 4 && (
//                 <div className="space-y-6">
//                   <div className="text-center mb-6">
//                     <h3 className="text-xl font-semibold mb-2">Create Hotel Manager Account</h3>
//                     <p className="text-gray-600">Set up the account that will manage this hotel</p>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">First Name *</Label>
//                       <Controller name="hotelUser.firstName" control={control} rules={{ required: "First name required" }} render={({ field }) => <Input {...field} placeholder="John" />} />
//                       {errors.hotelUser?.firstName && <p className="text-red-500 text-xs mt-1">{errors.hotelUser.firstName.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Last Name *</Label>
//                       <Controller name="hotelUser.lastName" control={control} rules={{ required: "Last name required" }} render={({ field }) => <Input {...field} placeholder="Doe" />} />
//                       {errors.hotelUser?.lastName && <p className="text-red-500 text-xs mt-1">{errors.hotelUser.lastName.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Email Address *</Label>
//                       <Controller name="hotelUser.email" control={control} rules={{ required: "Email required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } }} render={({ field }) => <Input type="email" {...field} placeholder="john@hotel.com" />} />
//                       {errors.hotelUser?.email && <p className="text-red-500 text-xs mt-1">{errors.hotelUser.email.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Phone Number *</Label>
//                       <Controller 
//                         name="hotelUser.phone" 
//                         control={control} 
//                         rules={{ 
//                           required: "Phone number required",
//                           pattern: {
//                             value: /^[\+]?[1-9][\d]{0,15}$/,
//                             message: "Please enter a valid phone number"
//                           }
//                         }} 
//                         render={({ field }) => <Input {...field} placeholder="+1 (555) 123-4567" />} 
//                       />
//                       {errors.hotelUser?.phone && <p className="text-red-500 text-xs mt-1">{errors.hotelUser.phone.message}</p>}
//                     </div>
//                     <div className="md:col-span-2">
//                       <Label className="text-sm font-medium mb-2 block">Password *</Label>
//                       <Controller name="hotelUser.password" control={control} rules={{ required: "Password required", minLength: { value: 6, message: "Min 6 characters" } }} render={({ field }) => <Input type="password" {...field} placeholder="••••••••" />} />
//                       {errors.hotelUser?.password && <p className="text-red-500 text-xs mt-1">{errors.hotelUser.password.message}</p>}
//                     </div>
//                   </div>

//                   {/* Final Review with phone */}
//                   <div className="mt-8 bg-purple-50 rounded-lg p-6 border border-purple-200">
//                     <h4 className="text-lg font-semibold mb-4">Final Review</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                       <div><strong>Hotel:</strong> <span className="text-gray-600">{getValues("name") || "Not set"}</span></div>
//                       <div><strong>Type:</strong> <span className="text-gray-600">{hotelType === "hourly" ? "Hourly Hotel" : "Regular Hotel"}</span></div>
//                       <div><strong>Location:</strong> <span className="text-gray-600">{getValues("city")}, {getValues("country")}</span></div>
//                       <div><strong>Images:</strong> <span className="text-gray-600">{images.length} uploaded</span></div>
//                       <div><strong>{hotelType === "hourly" ? "Packages:" : "Rooms:"}</strong> <span className="text-gray-600">{hotelType === "hourly" ? hourlyFields.length : roomFields.length} configured</span></div>
//                       <div><strong>Manager:</strong> <span className="text-gray-600">{getValues("hotelUser.firstName")} {getValues("hotelUser.lastName")}</span></div>
//                       <div><strong>Manager Phone:</strong> <span className="text-gray-600">{getValues("hotelUser.phone") || "Not set"}</span></div>
//                       {(getValues("latitude") || getValues("longitude")) && (
//                         <div><strong>Coordinates:</strong> <span className="text-gray-600">{getValues("latitude") || 'N/A'}, {getValues("longitude") || 'N/A'}</span></div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Edit Mode - All fields in one view with latitude/longitude */}
//               {isEditing && (
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-semibold mb-4">Edit Hotel Information</h3>
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Hotel Name *</Label>
//                       <Controller name="name" control={control} rules={{ required: "Hotel name is required" }} render={({ field }) => <Input {...field} placeholder="Grand Plaza Hotel" />} />
//                       {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Email *</Label>
//                       <Controller name="email" control={control} rules={{ required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } }} render={({ field }) => <Input type="email" {...field} placeholder="contact@hotel.com" />} />
//                       {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Phone *</Label>
//                       <Controller name="phone" control={control} rules={{ required: "Phone is required" }} render={({ field }) => <Input {...field} placeholder="+1 (555) 123-4567" />} />
//                       {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">City *</Label>
//                       <Controller name="city" control={control} rules={{ required: "City is required" }} render={({ field }) => <Input {...field} placeholder="New York" />} />
//                       {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Latitude</Label>
//                       <Controller 
//                         name="latitude" 
//                         control={control} 
//                         rules={{ 
//                           min: { value: -90, message: "Latitude must be between -90 and 90" },
//                           max: { value: 90, message: "Latitude must be between -90 and 90" }
//                         }} 
//                         render={({ field }) => (
//                           <Input 
//                             {...field} 
//                             type="number" 
//                             step="any" 
//                             placeholder="40.7128" 
//                             value={field.value ?? ""} 
//                             onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
//                           />
//                         )} 
//                       />
//                       {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude.message}</p>}
//                     </div>
//                     <div>
//                       <Label className="text-sm font-medium mb-2 block">Longitude</Label>
//                       <Controller 
//                         name="longitude" 
//                         control={control} 
//                         rules={{ 
//                           min: { value: -180, message: "Longitude must be between -180 and 180" },
//                           max: { value: 180, message: "Longitude must be between -180 and 180" }
//                         }} 
//                         render={({ field }) => (
//                           <Input 
//                             {...field} 
//                             type="number" 
//                             step="any" 
//                             placeholder="-74.0060" 
//                             value={field.value ?? ""} 
//                             onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
//                           />
//                         )} 
//                       />
//                       {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude.message}</p>}
//                     </div>
//                   </div>
//                   <div>
//                     <Controller name="description" control={control} rules={{ required: "Description is required" }} render={({ field }) => (
//                       <SimpleTextEditor value={field.value} onChange={field.onChange} placeholder="Describe your hotel..." label="Description *" />
//                     )} />
//                     {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
//                   </div>
//                 </div>
//               )}

//               {/* Navigation Buttons with increased image validation limit */}
//               <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
//                 {!isEditing && currentStep > 1 && (
//                   <Button 
//                     type="button" 
//                     variant="outline" 
//                     onClick={() => {
//                       setCurrentStep(s => s - 1);
//                       toast.success("⬅️ Previous step", {
//                         duration: 1000,
//                         position: 'top-center',
//                       });
//                     }}
//                     disabled={isCreatingHotel || isUploadingImages}
//                   >
//                     ← Previous
//                   </Button>
//                 )}
//                 <div className="flex-1"></div>
//                 {!isEditing && currentStep < 4 && (
//                   <Button 
//                     type="button" 
//                     onClick={() => {
//                       if (currentStep === 2 && (images.length < 2 || images.length > 12)) { 
//                         toast.error("Please upload 2-12 images."); 
//                         return; 
//                       }
//                       if (currentStep === 3) {
//                         if (hotelType === "hourly" && hourlyFields.length === 0) { 
//                           toast.error("Add at least one hourly rate."); 
//                           return; 
//                         }
//                         if (hotelType === "normal" && roomFields.length === 0) { 
//                           toast.error("Add at least one room."); 
//                           return; 
//                         }
//                       }
//                       setCurrentStep(s => s + 1);
//                       toast.success("➡️ Next step", {
//                         duration: 1000,
//                         position: 'top-center',
//                       });
//                     }}
//                     disabled={isCreatingHotel || isUploadingImages}
//                   >
//                     Next Step →
//                   </Button>
//                 )}
//                 {(isEditing || currentStep === 4) && (
//                   <Button 
//                     type="submit" 
//                     disabled={isCreatingHotel || isUploadingImages} 
//                     className={isCreatingHotel || isUploadingImages ? 'opacity-50 cursor-not-allowed' : ''}
//                   >
//                     {isCreatingHotel ? '🚀 Creating Hotel...' : isUploadingImages ? '📸 Uploading Images...' : (isEditing ? 'Save Changes' : '🎉 Create Hotel')}
//                   </Button>
//                 )}
//               </div>
//             </form>
//           </div>
//         </div>
//       </Modal>
//     </React.Fragment>
//   );
// }


"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import Editor from 'react-simple-wysiwyg';
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import Badge from "@/components/ui/badge/Badge";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useAddHours, useAddRooms, useCreateHotel, useHotels, useRegisterUser } from "@/hooks/apiHooks";
import { useModal } from "@/hooks/useModal";
import { useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/reducers/authSlice";

// Filter Interface
interface HotelFilters {
  search: string;
  status: string;
  type: string;
  city: string;
}

// Simple Text Editor Component
const SimpleTextEditor = ({ value, onChange, placeholder, label }) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical"
        rows={6}
      />
      <div className="text-xs text-gray-500">
        {value ? value.length : 0} characters
      </div>
    </div>
  );
};

// Rich Text Editor Component
const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
  label?: string;
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>

      <div className="border border-gray-300 rounded-md overflow-hidden">
        <Editor
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          containerProps={{ style: { minHeight: "200px" } }}
          buttons={[
            "title",
            "bold",
            "italic",
            "underline",
            "list-ul",
            "list-ol",
            "link",
            "image",
          ]}
        />
      </div>
    </div>
  );
};

interface Room {
  room_name: string;
  description: string;
  price: number;
  max_occupancy: number;
}

interface HourlyRate {
  hours: number;
  price: number;
}

interface Amenity {
  name: string;
  description?: string;
}

interface PrivacyPolicy {
  title: string;
  description: string;
}

interface HotelUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface Hotel {
  id: number;
  name: string;
  isHourly: boolean;
  email: string;
  phone: string;
  description: string;
  country: string;
  address?: string;
  city: string;
  latitude?: number;
  longitude?: number;
  isVerified?: boolean;
  privacyPolicy?: string;
  amenities?: Amenity[];
  hourlyRates?: HourlyRate[];
  rooms?: Room[];
  hotelUser?: HotelUser;
}

export default function HotelTablePage() {
  const [hotelList, setHotelList] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [hotelType, setHotelType] = useState<"hourly" | "normal">("hourly");
  const [images, setImages] = useState<File[]>([]);
  const [viewDetailsModal, setViewDetailsModal] = useState<Hotel | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

 
  
  // Modal states
  const [amenitiesModal, setAmenitiesModal] = useState<Hotel | null>(null);
  const [privacyPolicyModal, setPrivacyPolicyModal] = useState<Hotel | null>(null);
  const [deleteModal, setDeleteModal] = useState<Hotel | null>(null);
  
  // NEW: Manual Add Modal States
  const [manualRoomsModal, setManualRoomsModal] = useState<Hotel | null>(null);
  const [manualHoursModal, setManualHoursModal] = useState<Hotel | null>(null);
  
  // Loading states
  const [isAmenitiesSubmitting, setIsAmenitiesSubmitting] = useState(false);
  const [isPrivacySubmitting, setIsPrivacySubmitting] = useState(false);
  const [isCreatingHotel, setIsCreatingHotel] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // NEW: Manual Add Loading States
  const [isManualRoomsSubmitting, setIsManualRoomsSubmitting] = useState(false);
  const [isManualHoursSubmitting, setIsManualHoursSubmitting] = useState(false);
  
  // Filter States
  const [filters, setFilters] = useState<HotelFilters>({
    search: "",
    status: "",
    type: "",
    city: ""
  });

  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  
  // API hooks
  const { isError, isLoading, data: hotelData, error, mutate: hotelMutation } = useHotels();
  const { isError: createHotelIsError, isLoading: createHotelLoading, data: createHotelData, error: createHotelError, mutate: createHotel } = useCreateHotel();
  const { isError: createhourlyIsError, isLoading: createhourlyLoading, data: createhourlyData, error: createhourlyError, mutate: createhourlyHotel } = useAddHours();
  const { isError: createRoomsIsError, isLoading: createRoomsLoading, data: createRoomsData, error: createRoomsError, mutate: createRooms } = useAddRooms();
  const { isError: regiterError, isLoading: registerisLoading, data: registerisLoadingData, error: registerisLoadingError, mutate: registerisLoadingMutation } = useRegisterUser();

  const { control, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<Hotel>({
    defaultValues: {
      id: 0, name: "", isHourly: true, email: "", phone: "", description: "", city: "", country: "", address: "", latitude: undefined, longitude: undefined, isVerified: false, privacyPolicy: "",
      amenities: [{ name: "", description: "" }], hourlyRates: [{ hours: 1, price: 0 }], 
      rooms: [{ room_name: "", description: "", price: 0, max_occupancy: 0 }], 
      hotelUser: { firstName: "", lastName: "", email: "", phone: "", password: "" }
    },
  });

  // Form controls for amenities modal
  const { control: amenitiesControl, handleSubmit: handleAmenitiesSubmit, reset: resetAmenities, formState: { errors: amenitiesErrors } } = useForm({
    defaultValues: {
      amenities: [{ name: "", description: "" }]
    }
  });

  // Form controls for privacy policy modal
  const { control: privacyControl, handleSubmit: handlePrivacySubmit, reset: resetPrivacy, formState: { errors: privacyErrors } } = useForm({
    defaultValues: {
      privacyPolicies: [{ title: "", description: "" }]
    }
  });

  // NEW: Form controls for manual rooms modal
  const { control: manualRoomsControl, handleSubmit: handleManualRoomsSubmit, reset: resetManualRooms, formState: { errors: manualRoomsErrors } } = useForm({
    defaultValues: {
      rooms: [{ room_name: "", description: "", price: 0, max_occupancy: 0 }]
    }
  });

  // NEW: Form controls for manual hours modal
  const { control: manualHoursControl, handleSubmit: handleManualHoursSubmit, reset: resetManualHours, formState: { errors: manualHoursErrors } } = useForm({
    defaultValues: {
      hourlyRates: [{ hours: 1, price: 0 }]
    }
  });

  const { fields: roomFields, append: appendRoom, remove: removeRoom } = useFieldArray({ control, name: "rooms" });
  const { fields: hourlyFields, append: appendHourly, remove: removeHourly } = useFieldArray({ control, name: "hourlyRates" });
  const { fields: amenityFields, append: appendAmenity, remove: removeAmenity } = useFieldArray({ control, name: "amenities" });
  
  // Field arrays for modals
  const { fields: modalAmenityFields, append: appendModalAmenity, remove: removeModalAmenity } = useFieldArray({ control: amenitiesControl, name: "amenities" });
  const { fields: modalPrivacyFields, append: appendModalPrivacy, remove: removeModalPrivacy } = useFieldArray({ control: privacyControl, name: "privacyPolicies" });

  // NEW: Field arrays for manual add modals
  const { fields: manualRoomFields, append: appendManualRoom, remove: removeManualRoom } = useFieldArray({ control: manualRoomsControl, name: "rooms" });
  const { fields: manualHourFields, append: appendManualHour, remove: removeManualHour } = useFieldArray({ control: manualHoursControl, name: "hourlyRates" });

  // Filter Logic
  const filteredHotels = useMemo(() => {
    return hotelList.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           hotel.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                           hotel.city.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = filters.status === "" || 
                           (filters.status === "verified" && hotel.isVerified) ||
                           (filters.status === "pending" && !hotel.isVerified);
      
      const matchesType = filters.type === "" || 
                         (filters.type === "hourly" && hotel.isHourly) ||
                         (filters.type === "normal" && !hotel.isHourly);
      
      const matchesCity = filters.city === "" || hotel.city.toLowerCase() === filters.city.toLowerCase();
      
      return matchesSearch && matchesStatus && matchesType && matchesCity;
    });
  }, [hotelList, filters]);

  const uniqueCities = useMemo(() => {
    return [...new Set(hotelList.map(hotel => hotel.city))].filter(Boolean);
  }, [hotelList]);

  // Enhanced useEffect with proper toast notifications for hotel loading
  useEffect(() => { 
    const loadingToast = toast.loading("🔄 Loading hotels...", {
      duration: 0,
      position: 'top-center',
    });
    
    hotelMutation({});
    
    setTimeout(() => {
      toast.dismiss(loadingToast);
    }, 1000);
  }, [hotelMutation]);

  // Enhanced error and success handling with detailed toast notifications
  useEffect(() => {
    if (isError && !isLoading) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred while fetching hotels";
      
      toast.error(`❌ ${errorMessage}`, {
        duration: 5000,
        position: 'top-center',
      });
      
      if (errorMessage.toLowerCase().includes('unauthorized') || errorMessage.toLowerCase().includes('token')) {
        toast.error("🔐 Session expired. Redirecting to login...", {
          duration: 3000,
          position: 'top-center',
        });
        setTimeout(() => {
          router.push("/login ");
        }, 2000);
      }
    }
    
    if (Array.isArray(hotelData?.data?.hotels)) {
      setHotelList(hotelData.data.hotels);
      
      if (hotelData.data.hotels.length > 0) {
        toast.success(`✅ Successfully loaded ${hotelData.data.hotels.length} hotels`, {
          duration: 3000,
          position: 'top-center',
        });
      }
    }
  }, [isError, isLoading, error, hotelData, router]);

  // Helper function to clean up after successful hotel creation
  const handleSuccessCleanup = () => {
    closeModal(); 
    reset(); 
    setImages([]);
    setCurrentStep(1);
    setIsCreatingHotel(false);
    
    const refreshToast = toast.loading("🔄 Refreshing hotel list...", {
      position: 'top-center',
    });
    
    hotelMutation({});
    
    setTimeout(() => {
      toast.dismiss(refreshToast);
      toast.success("📋 Hotel list updated successfully!", {
        duration: 2000,
        position: 'top-center',
      });
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const newFiles = Array.from(e.target.files);
    const merged = [...images, ...newFiles].slice(0, 12);
    
    if (newFiles.length > 0) {
      toast.success(`📷 ${newFiles.length} image(s) selected successfully!`, {
        duration: 2000,
        position: 'top-center',
      });
    }
    
    if (merged.length === 12 && newFiles.length > (12 - images.length)) {
      toast.warning("⚠️ Maximum 12 images allowed. Extra images were not added.", {
        duration: 3000,
        position: 'top-center',
      });
    }
    
    setImages(merged); 
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    toast.success("🗑️ Image removed successfully!", {
      duration: 2000,
      position: 'top-center',
    });
  };

  const handleAddHotel = () => {
    toast.success("➕ Opening hotel creation form...", {
      duration: 2000,
      position: 'top-center',
    });
    
    setIsEditing(false); 
    setCurrentStep(1); 
    setHotelType("hourly"); 
    setImages([]);
    reset({
      id: 0, name: "", isHourly: true, email: "", phone: "", description: "", city: "", country: "", address: "", latitude: undefined, longitude: undefined, isVerified: false, privacyPolicy: "",
      amenities: [{ name: "", description: "" }], hourlyRates: [{ hours: 1, price: 0 }],
      rooms: [{ room_name: "", description: "", price: 0, max_occupancy: 0 }],
      hotelUser: { firstName: "", lastName: "", email: "", phone: "", password: "" }
    });
    openModal();
  };

  const handleEdit = (hotel: Hotel) => {
    toast.success(`✏️ Opening edit form for "${hotel.name}"...`, {
      duration: 2000,
      position: 'top-center',
    });
    
    setIsEditing(true); 
    setSelectedHotel({ ...hotel }); 
    setCurrentStep(1); 
    setHotelType(hotel.isHourly ? "hourly" : "normal");
    setImages([]);
    reset({
      ...hotel,
      amenities: hotel.amenities?.length ? hotel.amenities : [{ name: "", description: "" }],
      hourlyRates: hotel.isHourly ? (hotel.hourlyRates?.length ? hotel.hourlyRates : [{ hours: 1, price: 0 }]) : [],
      rooms: !hotel.isHourly ? (hotel.rooms?.length ? hotel.rooms : [{ room_name: "", description: "", price: 0, max_occupancy: 0 }]) : []
    });
    openModal();
  };

  // Enhanced delete functionality with comprehensive toast notifications
  const handleDelete = (hotel: Hotel) => {
    toast.loading("🔍 Preparing to delete hotel...", {
      duration: 1000,
      position: 'top-center',
    });
    
    setTimeout(() => {
      setDeleteModal(hotel);
    }, 500);
  };

  // Enhanced delete confirmation with detailed toast notifications
  const confirmDelete = async () => {
    if (!deleteModal) return;
    
    const loadingToast = toast.loading(`🗑️ Deleting "${deleteModal.name}"...`, {
      duration: 0,
      position: 'top-center',
    });
    
    try {
      setIsDeleting(true);
      
      console.log("🗑️ Deleting hotel:", deleteModal.name, "ID:", deleteModal.id);
      
      const response = await fetch('http://localhost:8000/hotels/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ids: [deleteModal.id.toString()]
        })
      });

      console.log('Delete API Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Delete API Error:', errorData);
        throw new Error(`HTTP error! status: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('Delete API Response:', result);

      toast.dismiss(loadingToast);

      toast.success(`🎉 Hotel "${deleteModal.name}" deleted successfully!`, {
        duration: 4000,
        position: 'top-center',
      });
      
      setDeleteModal(null);
      
      const refreshToast = toast.loading("🔄 Updating hotel list...", {
        position: 'top-center',
      });
      
      hotelMutation({});
      
      setTimeout(() => {
        toast.dismiss(refreshToast);
        toast.success("📋 Hotel list refreshed!", {
          duration: 2000,
          position: 'top-center',
        });
      }, 1000);

    } catch (error) {
      console.error("❌ Hotel deletion error:", error);
      
      toast.dismiss(loadingToast);
      
      let errorMessage = "Failed to delete hotel. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      toast.error(`❌ Delete Failed: ${errorMessage}`, {
        duration: 6000,
        position: 'top-center',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Enhanced amenities modal handlers with toast notifications
  const handleAddAmenities = (hotel: Hotel) => {
    toast.success(`🏨 Opening amenities manager for "${hotel.name}"...`, {
      duration: 2000,
      position: 'top-center',
    });
    
    setAmenitiesModal(hotel);
    resetAmenities({
      amenities: hotel.amenities?.length ? hotel.amenities : [{ name: "", description: "" }]
    });
  };

  // Enhanced amenities submission with comprehensive toast notifications
  const onAmenitiesSubmit = async (data) => {
    if (!amenitiesModal) return;
    
    const loadingToast = toast.loading(`💎 Saving amenities for "${amenitiesModal.name}"...`, {
      duration: 0,
      position: 'top-center',
    });
    
    try {
      setIsAmenitiesSubmitting(true);

      const amenitiesPayload = data.amenities
        .filter((amenity: any) => amenity.name.trim() !== '')
        .map((amenity: any) => ({
          hotel_id: amenitiesModal.id.toString(),
          name: amenity.name.trim(),
          description: amenity.description?.trim() || ""
        }));

      if (amenitiesPayload.length === 0) {
        toast.dismiss(loadingToast);
        toast.warning("⚠️ Please add at least one amenity before saving.", {
          duration: 3000,
          position: 'top-center',
        });
        return;
      }

      console.log("Sending amenities payload:", amenitiesPayload);

      const response = await fetch('http://localhost:8000/hotels/addAmenities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(amenitiesPayload)
      });

      console.log('Amenities API Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Amenities API Error:', errorData);
        throw new Error(`HTTP error! status: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('Amenities API Response:', result);

      toast.dismiss(loadingToast);

      toast.success(`✅ ${amenitiesPayload.length} amenities saved successfully for "${amenitiesModal.name}"!`, {
        duration: 4000,
        position: 'top-center',
      });
      
      setAmenitiesModal(null);
      
      const refreshToast = toast.loading("🔄 Refreshing hotel data...", {
        position: 'top-center',
      });
      
      hotelMutation({});
      
      setTimeout(() => {
        toast.dismiss(refreshToast);
      }, 1000);

    } catch (error) {
      console.error("Amenities submission error:", error);
      
      toast.dismiss(loadingToast);
      
      const errorMessage = error instanceof Error ? error.message : "Failed to save amenities. Please try again.";
      toast.error(`❌ Amenities Save Failed: ${errorMessage}`, {
        duration: 5000,
        position: 'top-center',
      });
    } finally {
      setIsAmenitiesSubmitting(false);
    }
  };

  // Enhanced privacy policy modal handlers with toast notifications
  const handleAddPrivacyPolicy = (hotel: Hotel) => {
    toast.success(`🛡️ Opening privacy policy manager for "${hotel.name}"...`, {
      duration: 2000,
      position: 'top-center',
    });
    
    setPrivacyPolicyModal(hotel);
    resetPrivacy({
      privacyPolicies: [{ title: "", description: hotel.privacyPolicy || "" }]
    });
  };

  // Enhanced privacy policy submission with comprehensive toast notifications
  const onPrivacySubmit = async (data) => {
    if (!privacyPolicyModal) return;
    
    const loadingToast = toast.loading(`🛡️ Saving privacy policy for "${privacyPolicyModal.name}"...`, {
      duration: 0,
      position: 'top-center',
    });
    
    try {
      setIsPrivacySubmitting(true);
      
      const validPolicies = data.privacyPolicies.filter((policy: any) => 
        policy.title.trim() !== '' && policy.description.trim() !== ''
      );

      if (validPolicies.length === 0) {
        toast.dismiss(loadingToast);
        toast.warning("⚠️ Please add at least one privacy policy section before saving.", {
          duration: 3000,
          position: 'top-center',
        });
        return;
      }

      for (const [index, policy] of validPolicies.entries()) {
        const policyPayload = {
          hotel_id: privacyPolicyModal.id.toString(),
          title: policy.title.trim(),
          description: policy.description.trim()
        };

        console.log(`Sending policy ${index + 1}/${validPolicies.length}:`, policyPayload);

        const response = await fetch('http://localhost:8000/hotels/addpolicy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(policyPayload)
        });

        console.log(`Policy ${index + 1} API Response Status:`, response.status);

        if (!response.ok) {
          const errorData = await response.text();
          console.error(`Policy ${index + 1} API Error:`, errorData);
          throw new Error(`HTTP error for policy ${index + 1}! status: ${response.status} - ${errorData}`);
        }

        const result = await response.json();
        console.log(`Policy ${index + 1} API Response:`, result);
      }
      
      toast.dismiss(loadingToast);

      toast.success(`✅ ${validPolicies.length} privacy policy section(s) saved successfully for "${privacyPolicyModal.name}"!`, {
        duration: 4000,
        position: 'top-center',
      });
      
      setPrivacyPolicyModal(null);
      
      const refreshToast = toast.loading("🔄 Refreshing hotel data...", {
        position: 'top-center',
      });
      
      hotelMutation({});
      
      setTimeout(() => {
        toast.dismiss(refreshToast);
      }, 1000);
      
    } catch (error) {
      console.error("Privacy policy error:", error);
      
      toast.dismiss(loadingToast);
      
      const errorMessage = error instanceof Error ? error.message : "Failed to save privacy policy. Please try again.";
      toast.error(`❌ Privacy Policy Save Failed: ${errorMessage}`, {
        duration: 5000,
        position: 'top-center',
      });
    } finally {
      setIsPrivacySubmitting(false);
    }
  };

  // NEW: Manual Rooms Modal Handlers
  const handleAddManualRooms = (hotel: Hotel) => {
    toast.success(`🛏️ Opening rooms manager for "${hotel.name}"...`, {
      duration: 2000,
      position: 'top-center',
    });
    
    setManualRoomsModal(hotel);
    resetManualRooms({
      rooms: [{ room_name: "", description: "", price: 0, max_occupancy: 0 }]
    });
  };

  // NEW: Manual Hours Modal Handlers
  const handleAddManualHours = (hotel: Hotel) => {
    toast.success(`⏰ Opening hourly rates manager for "${hotel.name}"...`, {
      duration: 2000,
      position: 'top-center',
    });
    
    setManualHoursModal(hotel);
    resetManualHours({
      hourlyRates: [{ hours: 1, price: 0 }]
    });
  };

  // NEW: Manual Rooms Submission
  const onManualRoomsSubmit = async (data) => {
    if (!manualRoomsModal) return;
    
    const loadingToast = toast.loading(`🛏️ Adding rooms for "${manualRoomsModal.name}"...`, {
      duration: 0,
      position: 'top-center',
    });
    
    try {
      setIsManualRoomsSubmitting(true);

      const validRooms = data.rooms.filter((room: any) => 
        room.room_name.trim() !== '' && room.description.trim() !== '' && room.price > 0 && room.max_occupancy > 0
      );

      if (validRooms.length === 0) {
        toast.dismiss(loadingToast);
        toast.warning("⚠️ Please add at least one complete room before saving.", {
          duration: 3000,
          position: 'top-center',
        });
        return;
      }

      const roomsPayload = validRooms.map((room: any) => ({
        ...room,
        hotel_id: manualRoomsModal.id,
      }));

      console.log("Sending manual rooms payload:", roomsPayload);

      await new Promise<any>((resolve, reject) => {
        createRooms(roomsPayload, {
          onSuccess: (response) => {
            console.log("✅ Manual rooms created successfully:", response);
            toast.dismiss(loadingToast);
            toast.success(`✅ ${validRooms.length} room(s) added successfully to "${manualRoomsModal.name}"!`, {
              duration: 4000,
              position: 'top-center',
            });
            resolve(response);
          },
          onError: (error) => {
            console.error("❌ Manual rooms creation failed:", error);
            toast.dismiss(loadingToast);
            reject(error);
          },
        });
      });
      
      setManualRoomsModal(null);
      
      const refreshToast = toast.loading("🔄 Refreshing hotel data...", {
        position: 'top-center',
      });
      
      hotelMutation({});
      
      setTimeout(() => {
        toast.dismiss(refreshToast);
      }, 1000);

    } catch (error) {
      console.error("Manual rooms submission error:", error);
      
      toast.dismiss(loadingToast);
      
      const errorMessage = error instanceof Error ? error.message : "Failed to add rooms. Please try again.";
      toast.error(`❌ Rooms Addition Failed: ${errorMessage}`, {
        duration: 5000,
        position: 'top-center',
      });
    } finally {
      setIsManualRoomsSubmitting(false);
    }
  };

  // NEW: Manual Hours Submission
  const onManualHoursSubmit = async (data) => {
    if (!manualHoursModal) return;
    
    const loadingToast = toast.loading(`⏰ Adding hourly rates for "${manualHoursModal.name}"...`, {
      duration: 0,
      position: 'top-center',
    });
    
    try {
      setIsManualHoursSubmitting(true);

      const validHours = data.hourlyRates.filter((rate: any) => 
        rate.hours > 0 && rate.price > 0
      );

      if (validHours.length === 0) {
        toast.dismiss(loadingToast);
        // toast.warning("⚠️ Please add at least one complete hourly rate before saving.", {
        //   duration: 3000,
        //   position: 'top-center',
        // });
        return;
      }

      const hoursPayload = validHours.map((rate: any) => ({
        ...rate,
        hotel_id: manualHoursModal.id,
      }));

      console.log("Sending manual hours payload:", hoursPayload);

      await new Promise<any>((resolve, reject) => {
        createhourlyHotel(hoursPayload, {
          onSuccess: (response) => {
            console.log("✅ Manual hourly rates created successfully:", response);
            toast.dismiss(loadingToast);
            toast.success(`✅ ${validHours.length} hourly rate(s) added successfully to "${manualHoursModal.name}"!`, {
              duration: 4000,
              position: 'top-center',
            });
            resolve(response);
          },
          onError: (error) => {
            console.error("❌ Manual hourly rates creation failed:", error);
            toast.dismiss(loadingToast);
            reject(error);
          },
        });
      });
      
      setManualHoursModal(null);
      
      const refreshToast = toast.loading("🔄 Refreshing hotel data...", {
        position: 'top-center',
      });
      
      hotelMutation({});
      
      setTimeout(() => {
        toast.dismiss(refreshToast);
      }, 1000);

    } catch (error) {
      console.error("Manual hours submission error:", error);
      
      toast.dismiss(loadingToast);
      
      const errorMessage = error instanceof Error ? error.message : "Failed to add hourly rates. Please try again.";
      toast.error(`❌ Hourly Rates Addition Failed: ${errorMessage}`, {
        duration: 5000,
        position: 'top-center',
      });
    } finally {
      setIsManualHoursSubmitting(false);
    }
  };

  // Enhanced onSubmit with comprehensive toast notifications for each step
  const onSubmit = async (data: Hotel) => {
    if (!isEditing && currentStep === 4) {
      const user = data.hotelUser;
      if (!user?.firstName || !user.lastName || !user.email || !user.phone || !user.password) {
        toast.error("❌ Please fill in all user registration fields including phone number.", {
          duration: 4000,
          position: 'top-center',
        });
        return;
      }
    }

    if (currentStep === 4) {
      const mainLoadingToast = toast.loading("🚀 Starting hotel creation process...", {
        duration: 0,
        position: 'top-center',
      });
      
      setIsCreatingHotel(true);
      
      try {
        console.log("🚀 Starting hotel creation process...");
        
        // Step 1: Create Hotel
        toast.dismiss(mainLoadingToast);
        const hotelLoadingToast = toast.loading("📋 Step 1/4: Creating hotel...", {
          duration: 0,
          position: 'top-center',
        });
        
        console.log("📋 Step 1: Creating hotel...");
        const hotelResponse = await new Promise<any>((resolve, reject) => {
          createHotel({
            name: getValues("name"),
            address: getValues("address"),
            city: getValues("city"),
            country: getValues("country"),
            phone: getValues("phone"),
            email: getValues("email"),
            star_rating: 5,
            isHourly: hotelType === "hourly",
            description: getValues("description"),
            latitude: getValues("latitude"),
            longitude: getValues("longitude"),
          }, {
            onSuccess: (response) => {
              console.log("✅ Hotel created successfully:", response);
              toast.dismiss(hotelLoadingToast);
              toast.success("✅ Step 1/4: Hotel created successfully!", {
                duration: 2000,
                position: 'top-center',
              });
              resolve(response);
            },
            onError: (error) => {
              console.error("❌ Hotel creation failed:", error);
              toast.dismiss(hotelLoadingToast);
              reject(error);
            },
          });
        });

        const hotelId = hotelResponse?.data?.id;
        
        if (!hotelId) {
          throw new Error("Hotel ID not received from server");
        }

        // Step 2: Create Rooms or Hourly Rates
        if (hotelType === "hourly") {
          const hourlyLoadingToast = toast.loading("⏰ Step 2/4: Creating hourly rates...", {
            duration: 0,
            position: 'top-center',
          });
          
          console.log("⏰ Step 2: Creating hourly rates...");
          const hourlyData = getValues("hourlyRates")?.map((item) => ({
            ...item,
            hotel_id: hotelId,
          }));

          if (hourlyData && hourlyData.length > 0) {
            await new Promise<any>((resolve, reject) => {
              createhourlyHotel(hourlyData, {
                onSuccess: (response) => {
                  console.log("✅ Hourly rates created successfully:", response);
                  toast.dismiss(hourlyLoadingToast);
                  toast.success(`✅ Step 2/4: ${hourlyData.length} hourly rate(s) created!`, {
                    duration: 2000,
                    position: 'top-center',
                  });
                  resolve(response);
                },
                onError: (error) => {
                  console.error("❌ Hourly rates creation failed:", error);
                  toast.dismiss(hourlyLoadingToast);
                  reject(error);
                },
              });
            });
          } else {
            toast.dismiss(hourlyLoadingToast);
            toast.success("✅ Step 2/4: No hourly rates to create, skipping...", {
              duration: 2000,
              position: 'top-center',
            });
          }
        } else if (hotelType === "normal") {
          const roomsLoadingToast = toast.loading("🛏️ Step 2/4: Creating rooms...", {
            duration: 0,
            position: 'top-center',
          });
          
          console.log("🛏️ Step 2: Creating rooms...");
          const roomData = getValues("rooms")?.map((item) => ({
            ...item,
            hotel_id: hotelId,
          }));

          if (roomData && roomData.length > 0) {
            await new Promise<any>((resolve, reject) => {
              createRooms(roomData, {
                onSuccess: (response) => {
                  console.log("✅ Rooms created successfully:", response);
                  toast.dismiss(roomsLoadingToast);
                  toast.success(`✅ Step 2/4: ${roomData.length} room(s) created!`, {
                    duration: 2000,
                    position: 'top-center',
                  });
                  resolve(response);
                },
                onError: (error) => {
                  console.error("❌ Rooms creation failed:", error);
                  toast.dismiss(roomsLoadingToast);
                  reject(error);
                },
              });
            });
          } else {
            toast.dismiss(roomsLoadingToast);
            toast.success("✅ Step 2/4: No rooms to create, skipping...", {
              duration: 2000,
              position: 'top-center',
            });
          }
        }

        // Step 3: Register User
        const userLoadingToast = toast.loading("👤 Step 3/4: Registering hotel manager...", {
          duration: 0,
          position: 'top-center',
        });
        
        console.log("👤 Step 3: Registering user...");
        await new Promise<any>((resolve, reject) => {
          registerisLoadingMutation({
            ...data.hotelUser,
            role: "HOTEL",
            isVerified: true,
            hotel_id: hotelResponse.data.hotel_id,
          }, {
            onSuccess: (response) => {
              console.log("✅ User registered successfully:", response);
              toast.dismiss(userLoadingToast);
              toast.success(`✅ Step 3/4: Manager "${data.hotelUser.firstName} ${data.hotelUser.lastName}" registered!`, {
                duration: 2000,
                position: 'top-center',
              });
              resolve(response);
            },
            onError: (error) => {
              console.error("❌ User registration failed:", error);
              toast.dismiss(userLoadingToast);
              reject(error);
            },
          });
        });

        // Step 4: Upload Images (optional)
        if (images.length > 0) {
          const imageLoadingToast = toast.loading(`📸 Step 4/4: Uploading ${images.length} images...`, {
            duration: 0,
            position: 'top-center',
          });
          
          console.log("📸 Step 4: Uploading images...");
          setIsUploadingImages(true);
          
          try {
            const formData = new FormData();
            images.forEach((image) => {
              formData.append('images', image);
            });
            formData.append('serviceName', 'hotel');
            formData.append('hotel_id', hotelId.toString());

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/hotels/upload`, {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              throw new Error(`Image upload failed: ${response.status}`);
            }

            const result = await response.json();
            if (!result.success) {
              throw new Error(result.message || "Image upload failed");
            }

            console.log("✅ Images uploaded successfully:", result);
            toast.dismiss(imageLoadingToast);
            toast.success(`✅ Step 4/4: ${images.length} images uploaded successfully!`, {
              duration: 2000,
              position: 'top-center',
            });
          } catch (imageError) {
            console.warn("⚠️ Image upload failed (non-critical):", imageError);
            
          } finally {
            setIsUploadingImages(false);
          }
        } else {
          toast.success("✅ Step 4/4: No images to upload, skipping...", {
            duration: 2000,
            position: 'top-center',
          });
        }

        // All steps completed successfully
        console.log("🎉 Hotel creation process completed successfully!");
        setTimeout(() => {
          toast.success("🎉 Hotel Creation Complete! All components have been set up perfectly.", {
            duration: 5000,
            position: 'top-center',
          });
        }, 1000);
        
        handleSuccessCleanup();

      } catch (error) {
        console.error("💥 Hotel creation process failed:", error);
        setIsCreatingHotel(false);
        setIsUploadingImages(false);
        
        let errorMessage = "Failed to create hotel. Please try again.";
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }

        toast.error(`❌ Hotel Creation Failed: ${errorMessage}`, {
          duration: 6000,
          position: 'top-center',
        });
      }
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Hotel Information";
      case 2: return "Upload Images";
      case 3: return "Hotel Type & Details";
      case 4: return "User Registration";
      default: return "Hotel Setup";
    }
  };

  const amenitiesConfig = [
    { key: "pool", name: "Swimming Pool" },
    { key: "gym", name: "Gym / Fitness Center" },
    { key: "parking", name: "Parking" },
    { key: "wifi", name: "Free Wi-Fi" },
    { key: "restaurant", name: "Restaurant" },
    { key: "bar", name: "Bar / Lounge" },
    { key: "spa", name: "Spa" },
    { key: "ac", name: "Air Conditioning" },
    { key: "pets", name: "Pet Friendly" },
    { key: "laundry", name: "Laundry Service" },
    { key: "tv", name: "Flat Screen TV" },
    { key: "elevator", name: "Elevator" },
    { key: "bed", name: "Comfortable Bed" },
    { key: "outlets", name: "Power Outlets Near Bed" },
    { key: "drinkingWater", name: "Drinking Water Bottles" },
    { key: "teaCoffee", name: "Tea / Coffee Maker" },
    { key: "desk", name: "Desk & Chair" },
    { key: "luggageRack", name: "Luggage Rack" },
    { key: "bathroom", name: "Attached Bathroom" },
    { key: "hotWater", name: "Hot & Cold Water" },
    { key: "towels", name: "Fresh Towels" },
    { key: "toiletries", name: "Basic Toiletries" },
    { key: "fastCheckin", name: "Quick Check-In & Out" },
    { key: "housekeeping", name: "On-Demand Housekeeping" },
    { key: "reception", name: "24x7 Reception" },
    { key: "storage", name: "Luggage Storage" },
    { key: "cabBooking", name: "Cab / Taxi Booking" },
    { key: "roomService", name: "In-Room Dining" },
    { key: "miniFridge", name: "Mini Fridge" },
    { key: "complimentaryDrinks", name: "Complimentary Water / Tea / Coffee" },
    { key: "soundproof", name: "Soundproof Rooms" },
    { key: "keycard", name: "Key Card Access" },
    { key: "cctv", name: "CCTV Security" },
    { key: "secureBilling", name: "Secure Billing" },
    { key: "privateParking", name: "Private Parking" },
    { key: "lounge", name: "Lounge / Waiting Area" },
    { key: "business", name: "Business Center" },
    { key: "printer", name: "Printer & Office Essentials" },
    { key: "hygiene", name: "Hygiene Add-ons" },
    { key: "blackoutCurtains", name: "Blackout Curtains" },
    { key: "shower", name: "Good Shower" },
    { key: "hairDryer", name: "Hair Dryer" },
    { key: "breakfast", name: "Complimentary Breakfast" },
    { key: "airportPickup", name: "Airport / Railway Pickup" },
    { key: "tourDesk", name: "Tour & Local Guide Desk" },
    { key: "safe", name: "Digital Safe" },
    { key: "iron", name: "Iron & Ironing Board" },
    { key: "firstAid", name: "First Aid / Doctor On Call" },
    { key: "atm", name: "ATM / Currency Exchange" },
  ];

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Hotel Name" },
    {
      key: "isHourly", label: "Type",
      render: (row: Hotel) => <Badge size="sm" color={row.isHourly ? "info" : "success"}>{row.isHourly ? "Hourly" : "Regular"}</Badge>
    },
    { key: "email", label: "Email" },
    { key: "city", label: "City" },
    {
      key: "isVerified", label: "Status",
      render: (row: Hotel) => <Badge size="sm" color={row.isVerified ? "success" : "warning"}>{row.isVerified ? "Verified" : "Pending"}</Badge>
    },
    {
      key: "actions", label: "Actions",
      render: (row: Hotel) => (
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => {
              toast.loading("👁️ Loading hotel details...", {
                duration: 1000,
                position: 'top-center',
              });
              setTimeout(() => setViewDetailsModal(row), 500);
            }} 
            className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
          >
            View
          </button>
        
          <button 
            onClick={() => handleAddAmenities(row)} 
            className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
          >
            Add Amenities
          </button>
          <button 
            onClick={() => handleAddPrivacyPolicy(row)} 
            className="px-3 py-1 text-xs bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors"
          >
            Add Privacy Policy
          </button>
          
          {/* NEW: Manual Add Buttons */}
          <button 
            onClick={() => handleAddManualRooms(row)} 
            className="px-3 py-1 text-xs bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200 transition-colors"
          >
            Add Rooms
          </button>
          <button 
            onClick={() => handleAddManualHours(row)} 
            className="px-3 py-1 text-xs bg-orange-100 text-orange-600 rounded hover:bg-orange-200 transition-colors"
          >
            Add Hours
          </button>
          
          <button 
            onClick={() => handleDelete(row)} 
            className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )
    }
  ];

  return (
    <React.Fragment>
      <PageBreadcrumb pageTitle="Hotel Management" />
      
      <ComponentCard title="Hotel Management">
        {/* Simple Filters Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">Search & Filter</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <Label className="text-sm font-medium mb-1 block">Search</Label>
              <Input
                placeholder="Search hotels..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1 block">Status</Label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-2 text-sm border rounded-md"
              >
                <option value="">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-1 block">Type</Label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-2 text-sm border rounded-md"
              >
                <option value="">All Types</option>
                <option value="hourly">Hourly</option>
                <option value="normal">Regular</option>
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-1 block">City</Label>
              <select
                value={filters.city}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                className="w-full p-2 text-sm border rounded-md"
              >
                <option value="">All Cities</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setFilters({ search: "", status: "", type: "", city: "" });
                toast.success("🧹 Filters cleared successfully!", {
                  duration: 2000,
                  position: 'top-center',
                });
              }}
              variant="outline"
              className="px-4"
            >
              Clear Filters
            </Button>
            <Button 
              size="sm" 
              onClick={handleAddHotel} 
              className="px-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add New Hotel
            </Button>
          </div>
          
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredHotels.length} of {hotelList.length} hotels
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-2"></div>
            <p className="text-gray-600">Loading hotels...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            <BasicTableOne columns={columns} data={filteredHotels} />
          </div>
        )}
      </ComponentCard>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} className="max-w-md mx-4">
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="p-6 border-b bg-red-600 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">🗑️ Delete Hotel</h3>
                  <p className="text-red-100 text-sm">This action cannot be undone</p>
                </div>
                <button 
                  onClick={() => {
                    setDeleteModal(null);
                    toast.success("❌ Delete operation cancelled.", {
                      duration: 2000,
                      position: 'top-center',
                    });
                  }} 
                  disabled={isDeleting}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors disabled:opacity-50"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-red-600">⚠️</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Are you sure you want to delete this hotel?</h4>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="text-sm space-y-1">
                    <div><strong>Hotel Name:</strong> {deleteModal.name}</div>
                    <div><strong>ID:</strong> {deleteModal.id}</div>
                    <div><strong>City:</strong> {deleteModal.city}</div>
                    <div><strong>Type:</strong> {deleteModal.isHourly ? "Hourly Hotel" : "Regular Hotel"}</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  This will permanently delete the hotel and all its associated data including rooms, amenities, and bookings.
                </p>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setDeleteModal(null);
                    toast.success("✅ Delete operation cancelled safely.", {
                      duration: 2000,
                      position: 'top-center',
                    });
                  }}
                  disabled={isDeleting}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className={`bg-red-600 hover:bg-red-700 text-white px-6 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isDeleting ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                      Deleting...
                    </>
                  ) : (
                    '🗑️ Delete Hotel'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Amenities Modal */}
      {amenitiesModal && (
        <Modal isOpen={!!amenitiesModal} onClose={() => setAmenitiesModal(null)} className="max-w-4xl mx-4">
          <div className="bg-white rounded-lg max-h-90vh overflow-hidden">
            <div className="p-6 border-b bg-green-600 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Manage Amenities</h3>
                  <p className="text-green-100 text-sm">{amenitiesModal.name}</p>
                </div>
                <button 
                  onClick={() => {
                    setAmenitiesModal(null);
                    toast.success("📝 Amenities editor closed.", {
                      duration: 2000,
                      position: 'top-center',
                    });
                  }} 
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <form onSubmit={handleAmenitiesSubmit(onAmenitiesSubmit)}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold">Hotel Amenities</h4>
                    {modalAmenityFields.length < 20 && (
                      <Button 
                        type="button" 
                        size="sm" 
                        onClick={() => {
                          appendModalAmenity({ name: "", description: "" });
                          toast.success("➕ New amenity field added!", {
                            duration: 2000,
                            position: 'top-center',
                          });
                        }} 
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Add Amenity
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modalAmenityFields.map((amenity, idx) => (
                      <div key={amenity.id} className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-semibold">Amenity {idx + 1}</h5>
                          {modalAmenityFields.length > 1 && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                removeModalAmenity(idx);
                                toast.success("🗑️ Amenity field removed!", {
                                  duration: 2000,
                                  position: 'top-center',
                                });
                              }}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                           <Label className="text-xs font-medium mb-1 block">Amenity Name *</Label>
                            <Controller
                              name={`amenities.${idx}.name`}
                              control={amenitiesControl}
                              rules={{ required: "Amenity name required" }}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500"
                                >
                                  <option value="">-- Select Amenity Key --</option>
                                  {amenitiesConfig.map((item) => (
                                    <option key={item.key} value={item.key}>
                                      {item.key}
                                    </option>
                                  ))}
                                </select>
                              )}
                            />
                            {amenitiesErrors.amenities?.[idx]?.name && (
                              <p className="text-red-500 text-xs mt-1">
                                {amenitiesErrors.amenities[idx].name?.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="text-xs font-medium mb-1 block">Description</Label>
                            <Controller 
                              name={`amenities.${idx}.description`} 
                              control={amenitiesControl} 
                              render={({ field }) => (
                                <textarea 
                                  {...field} 
                                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 resize-none" 
                                  rows={2} 
                                  placeholder="Brief description of this amenity..." 
                                />
                              )} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {modalAmenityFields.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-green-200 rounded-lg bg-green-50/50">
                      <p className="text-gray-600 mb-4 text-lg">No amenities added yet</p>
                      <p className="text-gray-500 mb-6">Add amenities to showcase what makes your hotel special</p>
                      <Button 
                        type="button" 
                        onClick={() => {
                          appendModalAmenity({ name: "", description: "" });
                          toast.success("🎉 First amenity field added!", {
                            duration: 2000,
                            position: 'top-center',
                          });
                        }} 
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Add Your First Amenity
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setAmenitiesModal(null);
                      toast.success("📝 Amenities editor closed without saving.", {
                        duration: 2000,
                        position: 'top-center',
                      });
                    }}
                    disabled={isAmenitiesSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isAmenitiesSubmitting}
                    className={`bg-green-600 hover:bg-green-700 ${isAmenitiesSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isAmenitiesSubmitting ? 'Saving...' : 'Save Amenities'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {/* Privacy Policy Modal */}
      {privacyPolicyModal && (
        <Modal isOpen={!!privacyPolicyModal} onClose={() => setPrivacyPolicyModal(null)} className="max-w-5xl mx-4">
          <div className="bg-white rounded-lg max-h-95vh overflow-hidden">
            <div className="p-6 border-b bg-purple-600 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Manage Privacy Policy</h3>
                  <p className="text-purple-100 text-sm">{privacyPolicyModal.name}</p>
                </div>
                <button 
                  onClick={() => {
                    setPrivacyPolicyModal(null);
                    toast.success("📝 Privacy policy editor closed.", {
                      duration: 2000,
                      position: 'top-center',
                    });
                  }} 
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 180px)' }}>
              <form onSubmit={handlePrivacySubmit(onPrivacySubmit)}>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold">Privacy Policies</h4>
                    {modalPrivacyFields.length < 5 && (
                      <Button 
                        type="button" 
                        size="sm" 
                        onClick={() => {
                          appendModalPrivacy({ title: "", description: "" });
                          toast.success("➕ New policy section added!", {
                            duration: 2000,
                            position: 'top-center',
                          });
                        }} 
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        Add Policy Section
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    {modalPrivacyFields.map((policy, idx) => (
                      <div key={policy.id} className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="font-semibold text-lg">Policy Section {idx + 1}</h5>
                          {modalPrivacyFields.length > 1 && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                removeModalPrivacy(idx);
                                toast.success("🗑️ Policy section removed!", {
                                  duration: 2000,
                                  position: 'top-center',
                                });
                              }}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Remove Section
                            </Button>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Section Title *</Label>
                            <Controller 
                              name={`privacyPolicies.${idx}.title`} 
                              control={privacyControl} 
                              rules={{ required: "Title is required" }} 
                              render={({ field }) => (
                                <Input 
                                  {...field} 
                                  placeholder="e.g., Data Collection, Guest Rights, Security Measures" 
                                  className="text-base"
                                />
                              )} 
                            />
                            {privacyErrors.privacyPolicies?.[idx]?.title && (
                              <p className="text-red-500 text-xs mt-1">{privacyErrors.privacyPolicies[idx].title?.message}</p>
                            )}
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Description *</Label>
                            <Controller 
                              name={`privacyPolicies.${idx}.description`} 
                              control={privacyControl} 
                              rules={{ required: "Description is required" }} 
                              render={({ field }) => (
                                <RichTextEditor
                                  value={field.value}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  placeholder="Enter detailed privacy policy information..."
                                  label=""
                                />
                              )} 
                            />
                            {privacyErrors.privacyPolicies?.[idx]?.description && (
                              <p className="text-red-500 text-xs mt-1">{privacyErrors.privacyPolicies[idx].description?.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {modalPrivacyFields.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-purple-200 rounded-lg bg-purple-50/50">
                      <p className="text-gray-600 mb-4 text-lg">No privacy policy sections added yet</p>
                      <p className="text-gray-500 mb-6">Add privacy policy sections to inform guests about data handling</p>
                      <Button 
                        type="button" 
                        onClick={() => {
                          appendModalPrivacy({ title: "", description: "" });
                          toast.success("🎉 First policy section added!", {
                            duration: 2000,
                            position: 'top-center',
                          });
                        }} 
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        Add First Policy Section
                      </Button>
                    </div>
                  )}
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <span className="text-blue-600 text-lg">i</span>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-800">Privacy Policy Guidelines</h4>
                        <div className="mt-1 text-sm text-blue-700">
                          <p>Your privacy policy should include information about:</p>
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Data collection and usage</li>
                            <li>Guest rights and preferences</li>
                            <li>Security measures and data protection</li>
                            <li>Contact information for privacy concerns</li>
                            <li>Cookie and tracking policies</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setPrivacyPolicyModal(null);
                      toast.success("📝 Privacy policy editor closed without saving.", {
                        duration: 2000,
                        position: 'top-center',
                      });
                    }}
                    disabled={isPrivacySubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isPrivacySubmitting}
                    className={`bg-purple-600 hover:bg-purple-700 ${isPrivacySubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isPrivacySubmitting ? 'Saving...' : 'Save Privacy Policy'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {/* NEW: Manual Rooms Modal */}
      {manualRoomsModal && (
        <Modal isOpen={!!manualRoomsModal} onClose={() => setManualRoomsModal(null)} className="max-w-4xl mx-4">
          <div className="bg-white rounded-lg max-h-90vh overflow-hidden">
            <div className="p-6 border-b bg-indigo-600 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">🛏️ Add Rooms</h3>
                  <p className="text-indigo-100 text-sm">{manualRoomsModal.name}</p>
                </div>
                <button 
                  onClick={() => {
                    setManualRoomsModal(null);
                    toast.success("📝 Rooms editor closed.", {
                      duration: 2000,
                      position: 'top-center',
                    });
                  }} 
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <form onSubmit={handleManualRoomsSubmit(onManualRoomsSubmit)}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold">Hotel Rooms</h4>
                    {manualRoomFields.length < 10 && (
                      <Button 
                        type="button" 
                        size="sm" 
                        onClick={() => {
                          appendManualRoom({ room_name: "", description: "", price: 0, max_occupancy: 0 });
                          toast.success("➕ New room field added!", {
                            duration: 2000,
                            position: 'top-center',
                          });
                        }} 
                        className="bg-indigo-500 hover:bg-indigo-600"
                      >
                        Add Room
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {manualRoomFields.map((room, idx) => (
                      <div key={room.id} className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-semibold">Room {idx + 1}</h5>
                          {manualRoomFields.length > 1 && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                removeManualRoom(idx);
                                toast.success("🗑️ Room field removed!", {
                                  duration: 2000,
                                  position: 'top-center',
                                });
                              }}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs font-medium mb-1 block">Room Name *</Label>
                            <Controller 
                              name={`rooms.${idx}.room_name`} 
                              control={manualRoomsControl} 
                              rules={{ required: "Room name required" }} 
                              render={({ field }) => (
                                <Input {...field} placeholder="Deluxe Suite" />
                              )} 
                            />
                            {manualRoomsErrors.rooms?.[idx]?.room_name && (
                              <p className="text-red-500 text-xs mt-1">{manualRoomsErrors.rooms[idx].room_name?.message}</p>
                            )}
                          </div>
                          <div>
                            <Label className="text-xs font-medium mb-1 block">Max Guests *</Label>
                            <Controller 
                              name={`rooms.${idx}.max_occupancy`} 
                              control={manualRoomsControl} 
                              rules={{ required: "Max occupancy required", min: { value: 1, message: "Min 1 guest" } }} 
                              render={({ field }) => (
                                <Input 
                                  type="number" 
                                  {...field} 
                                  value={field.value ?? ""} 
                                  onChange={(e) => field.onChange(Number(e.target.value))} 
                                  placeholder="2" 
                                />
                              )} 
                            />
                            {manualRoomsErrors.rooms?.[idx]?.max_occupancy && (
                              <p className="text-red-500 text-xs mt-1">{manualRoomsErrors.rooms[idx].max_occupancy?.message}</p>
                            )}
                          </div>
                          <div>
                            <Label className="text-xs font-medium mb-1 block">Price/Night ($) *</Label>
                            <Controller 
                              name={`rooms.${idx}.price`} 
                              control={manualRoomsControl} 
                              rules={{ required: "Price required", min: { value: 0, message: "Min $0" } }} 
                              render={({ field }) => (
                                <Input 
                                  type="number" 
                                  {...field} 
                                  value={field.value ?? ""} 
                                  onChange={(e) => field.onChange(Number(e.target.value))} 
                                  placeholder="150" 
                                />
                              )} 
                            />
                            {manualRoomsErrors.rooms?.[idx]?.price && (
                              <p className="text-red-500 text-xs mt-1">{manualRoomsErrors.rooms[idx].price?.message}</p>
                            )}
                          </div>
                          <div>
                            <Label className="text-xs font-medium mb-1 block">Description *</Label>
                            <Controller 
                              name={`rooms.${idx}.description`} 
                              control={manualRoomsControl} 
                              rules={{ required: "Description required" }} 
                              render={({ field }) => (
                                <Input {...field} placeholder="Spacious room with city view" />
                              )} 
                            />
                            {manualRoomsErrors.rooms?.[idx]?.description && (
                              <p className="text-red-500 text-xs mt-1">{manualRoomsErrors.rooms[idx].description?.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {manualRoomFields.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-indigo-200 rounded-lg bg-indigo-50/50">
                      <p className="text-gray-600 mb-4 text-lg">No rooms added yet</p>
                      <p className="text-gray-500 mb-6">Add rooms to expand your hotel's capacity</p>
                      <Button 
                        type="button" 
                        onClick={() => {
                          appendManualRoom({ room_name: "", description: "", price: 0, max_occupancy: 0 });
                          toast.success("🎉 First room field added!", {
                            duration: 2000,
                            position: 'top-center',
                          });
                        }} 
                        className="bg-indigo-500 hover:bg-indigo-600"
                      >
                        Add Your First Room
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setManualRoomsModal(null);
                      toast.success("📝 Rooms editor closed without saving.", {
                        duration: 2000,
                        position: 'top-center',
                      });
                    }}
                    disabled={isManualRoomsSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isManualRoomsSubmitting}
                    className={`bg-indigo-600 hover:bg-indigo-700 ${isManualRoomsSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isManualRoomsSubmitting ? 'Adding Rooms...' : 'Add Rooms'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {/* NEW: Manual Hours Modal */}
      {manualHoursModal && (
        <Modal isOpen={!!manualHoursModal} onClose={() => setManualHoursModal(null)} className="max-w-4xl mx-4">
          <div className="bg-white rounded-lg max-h-90vh overflow-hidden">
            <div className="p-6 border-b bg-orange-600 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">⏰ Add Hourly Rates</h3>
                  <p className="text-orange-100 text-sm">{manualHoursModal.name}</p>
                </div>
                <button 
                  onClick={() => {
                    setManualHoursModal(null);
                    toast.success("📝 Hourly rates editor closed.", {
                      duration: 2000,
                      position: 'top-center',
                    });
                  }} 
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <form onSubmit={handleManualHoursSubmit(onManualHoursSubmit)}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold">Hourly Rate Packages</h4>
                    {manualHourFields.length < 10 && (
                      <Button 
                        type="button" 
                        size="sm" 
                        onClick={() => {
                          appendManualHour({ hours: 1, price: 0 });
                          toast.success("➕ New hourly rate field added!", {
                            duration: 2000,
                            position: 'top-center',
                          });
                        }} 
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Add Rate
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {manualHourFields.map((rate, idx) => (
                      <div key={rate.id} className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-semibold">Package {idx + 1}</h5>
                          {manualHourFields.length > 1 && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                removeManualHour(idx);
                                toast.success("🗑️ Hourly rate field removed!", {
                                  duration: 2000,
                                  position: 'top-center',
                                });
                              }}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs font-medium mb-1 block">Duration (Hours) *</Label>
                            <Controller 
                              name={`hourlyRates.${idx}.hours`} 
                              control={manualHoursControl} 
                              rules={{ required: "Hours required", min: { value: 1, message: "Min 1 hour" } }} 
                              render={({ field }) => (
                                <Input 
                                  type="number" 
                                  {...field} 
                                  value={field.value ?? ""} 
                                  onChange={(e) => field.onChange(Number(e.target.value))} 
                                  placeholder="1" 
                                />
                              )} 
                            />
                            {manualHoursErrors.hourlyRates?.[idx]?.hours && (
                              <p className="text-red-500 text-xs mt-1">{manualHoursErrors.hourlyRates[idx].hours?.message}</p>
                            )}
                          </div>
                          <div>
                            <Label className="text-xs font-medium mb-1 block">Price ($) *</Label>
                            <Controller 
                              name={`hourlyRates.${idx}.price`} 
                              control={manualHoursControl} 
                              rules={{ required: "Price required", min: { value: 0, message: "Min $0" } }} 
                              render={({ field }) => (
                                <Input 
                                  type="number" 
                                  {...field} 
                                  value={field.value ?? ""} 
                                  onChange={(e) => field.onChange(Number(e.target.value))} 
                                  placeholder="50" 
                                />
                              )} 
                            />
                            {manualHoursErrors.hourlyRates?.[idx]?.price && (
                              <p className="text-red-500 text-xs mt-1">{manualHoursErrors.hourlyRates[idx].price?.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {manualHourFields.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-orange-200 rounded-lg bg-orange-50/50">
                      <p className="text-gray-600 mb-4 text-lg">No hourly rates added yet</p>
                      <p className="text-gray-500 mb-6">Add hourly rates to offer flexible booking options</p>
                      <Button 
                        type="button" 
                        onClick={() => {
                          appendManualHour({ hours: 1, price: 0 });
                          toast.success("🎉 First hourly rate field added!", {
                            duration: 2000,
                            position: 'top-center',
                          });
                        }} 
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Add Your First Rate
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setManualHoursModal(null);
                      toast.success("📝 Hourly rates editor closed without saving.", {
                        duration: 2000,
                        position: 'top-center',
                      });
                    }}
                    disabled={isManualHoursSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isManualHoursSubmitting}
                    className={`bg-orange-600 hover:bg-orange-700 ${isManualHoursSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isManualHoursSubmitting ? 'Adding Rates...' : 'Add Hourly Rates'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {/* Hotel Details Modal */}
      {viewDetailsModal && (
        <Modal isOpen={!!viewDetailsModal} onClose={() => setViewDetailsModal(null)} className="max-w-4xl mx-4">
          <div className="bg-white rounded-lg max-h-90vh overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Hotel Details</h3>
                  <p className="text-gray-600">{viewDetailsModal.name}</p>
                </div>
                <button 
                  onClick={() => {
                    setViewDetailsModal(null);
                    toast.success("📝 Hotel details closed.", {
                      duration: 2000,
                      position: 'top-center',
                    });
                  }} 
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold border-b pb-2 mb-4">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {viewDetailsModal.name}</div>
                    <div><span className="font-medium">Email:</span> {viewDetailsModal.email}</div>
                    <div><span className="font-medium">Phone:</span> {viewDetailsModal.phone}</div>
                    <div><span className="font-medium">Type:</span> {viewDetailsModal.isHourly ? "Hourly Hotel" : "Regular Hotel"}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold border-b pb-2 mb-4">Location</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">City:</span> {viewDetailsModal.city}</div>
                    <div><span className="font-medium">Country:</span> {viewDetailsModal.country}</div>
                    {viewDetailsModal.latitude && (
                      <div><span className="font-medium">Latitude:</span> {viewDetailsModal.latitude}</div>
                    )}
                    {viewDetailsModal.longitude && (
                      <div><span className="font-medium">Longitude:</span> {viewDetailsModal.longitude}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Create/Edit Hotel Modal - 4 Step Process */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-5xl mx-4 my-8">
        <div className="bg-white rounded-lg max-h-95vh overflow-hidden">
          {/* Header with Progress */}
          <div className="p-6 border-b bg-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold">{isEditing ? "Edit Hotel" : "Create New Hotel"}</h4>
                <p className="text-blue-100 text-sm">{getStepTitle()}</p>
                {isCreatingHotel && (
                  <p className="text-yellow-200 text-sm mt-1">Creating hotel and setting up all components...</p>
                )}
                {isUploadingImages && (
                  <p className="text-yellow-200 text-sm mt-1">Uploading images...</p>
                )}
              </div>
              <button 
                onClick={() => {
                  closeModal();
                  toast.success("📝 Hotel form closed.", {
                    duration: 2000,
                    position: 'top-center',
                  });
                }} 
                disabled={isCreatingHotel || isUploadingImages}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors disabled:opacity-50"
              >
                ×
              </button>
            </div>
            
            {/* Step Progress Bar */}
            {!isEditing && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-blue-100 mb-2">
                  <span>Step {currentStep} of 4</span>
                  <span>{Math.round((currentStep / 4) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-blue-800/30 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 200px)' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              
              {/* Step 1: Hotel Information with latitude/longitude */}
              {!isEditing && currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Hotel Information</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Hotel Name *</Label>
                      <Controller name="name" control={control} rules={{ required: "Hotel name is required" }} render={({ field }) => <Input {...field} placeholder="Grand Plaza Hotel" />} />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Email *</Label>
                      <Controller name="email" control={control} rules={{ required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } }} render={({ field }) => <Input type="email" {...field} placeholder="contact@hotel.com" />} />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Phone *</Label>
                      <Controller name="phone" control={control} rules={{ required: "Phone is required" }} render={({ field }) => <Input {...field} placeholder="+1 (555) 123-4567" />} />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Address</Label>
                      <Controller name="address" control={control} render={({ field }) => <Input {...field} placeholder="123 Main Street" />} />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">City *</Label>
                      <Controller
                        name="city"
                        control={control}
                        rules={{ required: "City is required" }}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                          >
                            <option value="">Select a city</option>
                            <option value="Ahmedabad">Ahmedabad</option>
                          </select>
                        )}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Country *</Label>
                      <Controller name="country" control={control} rules={{ required: "Country is required" }} render={({ field }) => <Input {...field} placeholder="United States" />} />
                      {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Latitude</Label>
                      <Controller 
                        name="latitude" 
                        control={control} 
                        rules={{ 
                          min: { value: -90, message: "Latitude must be between -90 and 90" },
                          max: { value: 90, message: "Latitude must be between -90 and 90" }
                        }} 
                        render={({ field }) => (
                          <Input 
                            {...field} 
                            type="number" 
                            step="any" 
                            placeholder="40.7128" 
                            value={field.value ?? ""} 
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
                          />
                        )} 
                      />
                      {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude.message}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Longitude</Label>
                      <Controller 
                        name="longitude" 
                        control={control} 
                        rules={{ 
                          min: { value: -180, message: "Longitude must be between -180 and 180" },
                          max: { value: 180, message: "Longitude must be between -180 and 180" }
                        }} 
                        render={({ field }) => (
                          <Input 
                            {...field} 
                            type="number" 
                            step="any" 
                            placeholder="-74.0060" 
                            value={field.value ?? ""} 
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
                          />
                        )} 
                      />
                      {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude.message}</p>}
                    </div>
                  </div>
                  <div>
                    <Controller name="description" control={control} rules={{ required: "Description is required" }} render={({ field }) => (
                      <SimpleTextEditor value={field.value} onChange={field.onChange} placeholder="Describe your hotel's unique features, location, and what makes it special..." label="Hotel Description *" />
                    )} />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                  </div>
                </div>
              )}

              {/* Step 2 - Images with increased limit to 12 */}
              {!isEditing && currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Upload Hotel Images</h3>
                    <p className="text-gray-600 text-sm mb-6">Upload 2-12 high-quality images to showcase your hotel</p>
                  </div>
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 bg-blue-50 text-center">
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="upload" />
                    <label htmlFor="upload" className="cursor-pointer block">
                      <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl text-blue-600">📷</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-700 mb-2">Click to upload images</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 5MB each • Min 2, Max 12 images</p>
                    </label>
                  </div>
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((file, idx) => (
                        <div key={idx} className="relative group bg-white rounded-lg overflow-hidden border">
                          <img src={URL.createObjectURL(file)} alt={`Preview ${idx + 1}`} className="w-full h-32 object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button type="button" onClick={() => handleRemoveImage(idx)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                              Remove
                            </button>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            Image {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Hotel Type & Details */}
              {!isEditing && currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Select Hotel Type</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <button 
                        type="button" 
                        className={`p-6 border-2 rounded-lg text-center transition-all ${hotelType === "hourly" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"}`} 
                        onClick={() => { 
                          setHotelType("hourly"); 
                          setValue("isHourly", true); 
                          setValue("rooms", []); 
                          if (hourlyFields.length === 0) appendHourly({ hours: 1, price: 0 }); 
                          toast.success("⏰ Selected: Hourly Hotel", {
                            duration: 2000,
                            position: 'top-center',
                          });
                        }}
                      >
                        <div className="text-4xl mb-3">⏰</div>
                        <div className="text-lg font-semibold mb-2">Hourly Hotel</div>
                        <p className="text-sm text-gray-600">Perfect for short stays • Flexible pricing</p>
                      </button>
                      <button 
                        type="button" 
                        className={`p-6 border-2 rounded-lg text-center transition-all ${hotelType === "normal" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`} 
                        onClick={() => { 
                          setHotelType("normal"); 
                          setValue("isHourly", false); 
                          setValue("hourlyRates", []); 
                          if (roomFields.length === 0) appendRoom({ room_name: "", description: "", price: 0, max_occupancy: 0 }); 
                          toast.success("🛏️ Selected: Regular Hotel", {
                            duration: 2000,
                            position: 'top-center',
                          });
                        }}
                      >
                        <div className="text-4xl mb-3">🛏️</div>
                        <div className="text-lg font-semibold mb-2">Regular Hotel</div>
                        <p className="text-sm text-gray-600">Traditional rooms • Overnight stays</p>
                      </button>
                    </div>

                    {/* Hourly Rates */}
                    {hotelType === "hourly" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-semibold">Hourly Rate Packages</h4>
                          {hourlyFields.length < 5 && (
                            <Button 
                              type="button" 
                              size="sm" 
                              onClick={() => {
                                appendHourly({ hours: 1, price: 0 });
                                toast.success("➕ New hourly rate package added!", {
                                  duration: 2000,
                                  position: 'top-center',
                                });
                              }} 
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              Add Rate
                            </Button>
                          )}
                        </div>
                        {hourlyFields.map((hourly, idx) => (
                          <div key={hourly.id} className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="font-semibold">Package {idx + 1}</h5>
                              {hourlyFields.length > 1 && (
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => {
                                    removeHourly(idx);
                                    toast.success("🗑️ Hourly rate package removed!", {
                                      duration: 2000,
                                      position: 'top-center',
                                    });
                                  }}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs font-medium mb-1 block">Duration (Hours)</Label>
                                <Controller name={`hourlyRates.${idx}.hours`} control={control} rules={{ required: "Hours required", min: { value: 1, message: "Min 1 hour" } }} render={({ field }) => <Input type="number" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value))} placeholder="1" />} />
                                {errors.hourlyRates?.[idx]?.hours && <p className="text-red-500 text-xs mt-1">{errors.hourlyRates[idx].hours?.message}</p>}
                              </div>
                              <div>
                                <Label className="text-xs font-medium mb-1 block">Price ($)</Label>
                                <Controller name={`hourlyRates.${idx}.price`} control={control} rules={{ required: "Price required", min: { value: 0, message: "Min $0" } }} render={({ field }) => <Input type="number" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value))} placeholder="50" />} />
                                {errors.hourlyRates?.[idx]?.price && <p className="text-red-500 text-xs mt-1">{errors.hourlyRates[idx].price?.message}</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Rooms */}
                    {hotelType === "normal" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-semibold">Hotel Rooms</h4>
                          {roomFields.length < 10 && (
                            <Button 
                              type="button" 
                              size="sm" 
                              onClick={() => {
                                appendRoom({ room_name: "", description: "", price: 0, max_occupancy: 0 });
                                toast.success("➕ New room added!", {
                                  duration: 2000,
                                  position: 'top-center',
                                });
                              }} 
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              Add Room
                            </Button>
                          )}
                        </div>
                        {roomFields.map((room, idx) => (
                          <div key={room.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="font-semibold">Room {idx + 1}</h5>
                              {roomFields.length > 1 && (
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => {
                                    removeRoom(idx);
                                    toast.success("🗑️ Room removed!", {
                                      duration: 2000,
                                      position: 'top-center',
                                    });
                                  }}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs font-medium mb-1 block">Room Name</Label>
                                <Controller name={`rooms.${idx}.room_name`} control={control} rules={{ required: "Room name required" }} render={({ field }) => <Input {...field} placeholder="Deluxe Suite" />} />
                                {errors.rooms?.[idx]?.room_name && <p className="text-red-500 text-xs mt-1">{errors.rooms[idx].room_name?.message}</p>}
                              </div>
                              <div>
                                <Label className="text-xs font-medium mb-1 block">Max Guests</Label>
                                <Controller name={`rooms.${idx}.max_occupancy`} control={control} rules={{ required: "Max occupancy required", min: { value: 1, message: "Min 1 guest" } }} render={({ field }) => <Input type="number" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value))} placeholder="2" />} />
                                {errors.rooms?.[idx]?.max_occupancy && <p className="text-red-500 text-xs mt-1">{errors.rooms[idx].max_occupancy?.message}</p>}
                              </div>
                              <div>
                                <Label className="text-xs font-medium mb-1 block">Price/Night ($)</Label>
                                <Controller name={`rooms.${idx}.price`} control={control} rules={{ required: "Price required", min: { value: 0, message: "Min $0" } }} render={({ field }) => <Input type="number" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value))} placeholder="150" />} />
                                {errors.rooms?.[idx]?.price && <p className="text-red-500 text-xs mt-1">{errors.rooms[idx].price?.message}</p>}
                              </div>
                              <div>
                                <Label className="text-xs font-medium mb-1 block">Description</Label>
                                <Controller name={`rooms.${idx}.description`} control={control} rules={{ required: "Description required" }} render={({ field }) => <Input {...field} placeholder="Spacious room with city view" />} />
                                {errors.rooms?.[idx]?.description && <p className="text-red-500 text-xs mt-1">{errors.rooms[idx].description?.message}</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4 - User Registration with Phone Field */}
              {!isEditing && currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2">Create Hotel Manager Account</h3>
                    <p className="text-gray-600">Set up the account that will manage this hotel</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">First Name *</Label>
                      <Controller name="hotelUser.firstName" control={control} rules={{ required: "First name required" }} render={({ field }) => <Input {...field} placeholder="John" />} />
                      {errors.hotelUser?.firstName && <p className="text-red-500 text-xs mt-1">{errors.hotelUser.firstName.message}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Last Name *</Label>
                      <Controller name="hotelUser.lastName" control={control} rules={{ required: "Last name required" }} render={({ field }) => <Input {...field} placeholder="Doe" />} />
                      {errors.hotelUser?.lastName && <p className="text-red-500 text-xs mt-1">{errors.hotelUser.lastName.message}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Email Address *</Label>
                      <Controller name="hotelUser.email" control={control} rules={{ required: "Email required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } }} render={({ field }) => <Input type="email" {...field} placeholder="john@hotel.com" />} />
                      {errors.hotelUser?.email && <p className="text-red-500 text-xs mt-1">{errors.hotelUser.email.message}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Phone Number *</Label>
                      <Controller 
                        name="hotelUser.phone" 
                        control={control} 
                        rules={{ 
                          required: "Phone number required",
                          pattern: {
                            value: /^[\+]?[1-9][\d]{0,15}$/,
                            message: "Please enter a valid phone number"
                          }
                        }} 
                        render={({ field }) => <Input {...field} placeholder="+1 (555) 123-4567" />} 
                      />
                      {errors.hotelUser?.phone && <p className="text-red-500 text-xs mt-1">{errors.hotelUser.phone.message}</p>}
                    </div>
                    {/* <div className="md:col-span-2">
                      <Label className="text-sm font-medium mb-2 block">Password *</Label>
                      <Controller name="hotelUser.password" control={control} rules={{ required: "Password required", minLength: { value: 6, message: "Min 6 characters" } }} render={({ field }) => <Input type="password" {...field} placeholder="••••••••" />} />
                      {errors.hotelUser?.password && <p className="text-red-500 text-xs mt-1">{errors.hotelUser.password.message}</p>}
                    </div> */}
                                        <div className="md:col-span-2">
                      <Label className="text-sm font-medium mb-2 block">Password *</Label>
                      <Controller name="hotelUser.password" control={control} rules={{ required: "Password required", minLength: { value: 6, message: "Min 6 characters" } }} render={({ field }) => <Input type="password" {...field} placeholder="••••••••" />} />
                      {errors.hotelUser?.password && <p className="text-red-500 text-xs mt-1">{errors.hotelUser.password.message}</p>}
                    </div>
                  </div>

                  {/* Final Review with phone */}
                  <div className="mt-8 bg-purple-50 rounded-lg p-6 border border-purple-200">
                    <h4 className="text-lg font-semibold mb-4">Final Review</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><strong>Hotel:</strong> <span className="text-gray-600">{getValues("name") || "Not set"}</span></div>
                      <div><strong>Type:</strong> <span className="text-gray-600">{hotelType === "hourly" ? "Hourly Hotel" : "Regular Hotel"}</span></div>
                      <div><strong>Location:</strong> <span className="text-gray-600">{getValues("city")}, {getValues("country")}</span></div>
                      <div><strong>Images:</strong> <span className="text-gray-600">{images.length} uploaded</span></div>
                      <div><strong>{hotelType === "hourly" ? "Packages:" : "Rooms:"}</strong> <span className="text-gray-600">{hotelType === "hourly" ? hourlyFields.length : roomFields.length} configured</span></div>
                      <div><strong>Manager:</strong> <span className="text-gray-600">{getValues("hotelUser.firstName")} {getValues("hotelUser.lastName")}</span></div>
                      <div><strong>Manager Phone:</strong> <span className="text-gray-600">{getValues("hotelUser.phone") || "Not set"}</span></div>
                      {(getValues("latitude") || getValues("longitude")) && (
                        <div><strong>Coordinates:</strong> <span className="text-gray-600">{getValues("latitude") || 'N/A'}, {getValues("longitude") || 'N/A'}</span></div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Mode - All fields in one view with latitude/longitude */}
              {isEditing && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Edit Hotel Information</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Hotel Name *</Label>
                      <Controller name="name" control={control} rules={{ required: "Hotel name is required" }} render={({ field }) => <Input {...field} placeholder="Grand Plaza Hotel" />} />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Email *</Label>
                      <Controller name="email" control={control} rules={{ required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } }} render={({ field }) => <Input type="email" {...field} placeholder="contact@hotel.com" />} />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Phone *</Label>
                      <Controller name="phone" control={control} rules={{ required: "Phone is required" }} render={({ field }) => <Input {...field} placeholder="+1 (555) 123-4567" />} />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">City *</Label>
                      <Controller name="city" control={control} rules={{ required: "City is required" }} render={({ field }) => <Input {...field} placeholder="New York" />} />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Latitude</Label>
                      <Controller 
                        name="latitude" 
                        control={control} 
                        rules={{ 
                          min: { value: -90, message: "Latitude must be between -90 and 90" },
                          max: { value: 90, message: "Latitude must be between -90 and 90" }
                        }} 
                        render={({ field }) => (
                          <Input 
                            {...field} 
                            type="number" 
                            step="any" 
                            placeholder="40.7128" 
                            value={field.value ?? ""} 
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
                          />
                        )} 
                      />
                      {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude.message}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Longitude</Label>
                      <Controller 
                        name="longitude" 
                        control={control} 
                        rules={{ 
                          min: { value: -180, message: "Longitude must be between -180 and 180" },
                          max: { value: 180, message: "Longitude must be between -180 and 180" }
                        }} 
                        render={({ field }) => (
                          <Input 
                            {...field} 
                            type="number" 
                            step="any" 
                            placeholder="-74.0060" 
                            value={field.value ?? ""} 
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
                          />
                        )} 
                      />
                      {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude.message}</p>}
                    </div>
                  </div>
                  <div>
                    <Controller name="description" control={control} rules={{ required: "Description is required" }} render={({ field }) => (
                      <SimpleTextEditor value={field.value} onChange={field.onChange} placeholder="Describe your hotel..." label="Description *" />
                    )} />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                  </div>
                </div>
              )}

              {/* Navigation Buttons with increased image validation limit */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                {!isEditing && currentStep > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setCurrentStep(s => s - 1);
                      toast.success("⬅️ Previous step", {
                        duration: 1000,
                        position: 'top-center',
                      });
                    }}
                    disabled={isCreatingHotel || isUploadingImages}
                  >
                    ← Previous
                  </Button>
                )}
                <div className="flex-1"></div>
                {!isEditing && currentStep < 4 && (
                  <Button 
                    type="button" 
                    onClick={() => {
                      if (currentStep === 2 && (images.length < 2 || images.length > 12)) { 
                        toast.error("Please upload 2-12 images."); 
                        return; 
                      }
                      if (currentStep === 3) {
                        if (hotelType === "hourly" && hourlyFields.length === 0) { 
                          toast.error("Add at least one hourly rate."); 
                          return; 
                        }
                        if (hotelType === "normal" && roomFields.length === 0) { 
                          toast.error("Add at least one room."); 
                          return; 
                        }
                      }
                      setCurrentStep(s => s + 1);
                      toast.success("➡️ Next step", {
                        duration: 1000,
                        position: 'top-center',
                      });
                    }}
                    disabled={isCreatingHotel || isUploadingImages}
                  >
                    Next Step →
                  </Button>
                )}
                {(isEditing || currentStep === 4) && (
                  <Button 
                    type="submit" 
                    disabled={isCreatingHotel || isUploadingImages} 
                    className={isCreatingHotel || isUploadingImages ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {isCreatingHotel ? '🚀 Creating Hotel...' : isUploadingImages ? '📸 Uploading Images...' : (isEditing ? 'Save Changes' : '🎉 Create Hotel')}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </Modal>

      {/* NEW: Manual Rooms Modal */}
      <Modal isOpen={!!manualRoomsModal} onClose={() => setManualRoomsModal(null)} className="max-w-4xl mx-4">
        <div className="bg-white rounded-lg max-h-90vh overflow-hidden">
          <div className="p-6 border-b bg-indigo-600 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">🛏️ Add Rooms</h3>
                <p className="text-indigo-100 text-sm">{manualRoomsModal?.name}</p>
              </div>
              <button 
                onClick={() => {
                  setManualRoomsModal(null);
                  toast.success("📝 Rooms editor closed.", {
                    duration: 2000,
                    position: 'top-center',
                  });
                }} 
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-6 max-h-96 overflow-y-auto">
            <form onSubmit={handleManualRoomsSubmit(onManualRoomsSubmit)}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold">Hotel Rooms</h4>
                  {manualRoomFields.length < 10 && (
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={() => {
                        appendManualRoom({ room_name: "", description: "", price: 0, max_occupancy: 0 });
                        toast.success("➕ New room field added!", {
                          duration: 2000,
                          position: 'top-center',
                        });
                      }} 
                      className="bg-indigo-500 hover:bg-indigo-600"
                    >
                      Add Room
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  {manualRoomFields.map((room, idx) => (
                    <div key={room.id} className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-semibold">Room {idx + 1}</h5>
                        {manualRoomFields.length > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              removeManualRoom(idx);
                              toast.success("🗑️ Room field removed!", {
                                duration: 2000,
                                position: 'top-center',
                              });
                            }}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs font-medium mb-1 block">Room Name *</Label>
                          <Controller 
                            name={`rooms.${idx}.room_name`} 
                            control={manualRoomsControl} 
                            rules={{ required: "Room name required" }} 
                            render={({ field }) => (
                              <Input {...field} placeholder="Deluxe Suite" />
                            )} 
                          />
                          {manualRoomsErrors.rooms?.[idx]?.room_name && (
                            <p className="text-red-500 text-xs mt-1">{manualRoomsErrors.rooms[idx].room_name?.message}</p>
                          )}
                        </div>
                        <div>
                          <Label className="text-xs font-medium mb-1 block">Max Guests *</Label>
                          <Controller 
                            name={`rooms.${idx}.max_occupancy`} 
                            control={manualRoomsControl} 
                            rules={{ required: "Max occupancy required", min: { value: 1, message: "Min 1 guest" } }} 
                            render={({ field }) => (
                              <Input 
                                type="number" 
                                {...field} 
                                value={field.value ?? ""} 
                                onChange={(e) => field.onChange(Number(e.target.value))} 
                                placeholder="2" 
                              />
                            )} 
                          />
                          {manualRoomsErrors.rooms?.[idx]?.max_occupancy && (
                            <p className="text-red-500 text-xs mt-1">{manualRoomsErrors.rooms[idx].max_occupancy?.message}</p>
                          )}
                        </div>
                        <div>
                          <Label className="text-xs font-medium mb-1 block">Price/Night ($) *</Label>
                          <Controller 
                            name={`rooms.${idx}.price`} 
                            control={manualRoomsControl} 
                            rules={{ required: "Price required", min: { value: 0, message: "Min $0" } }} 
                            render={({ field }) => (
                              <Input 
                                type="number" 
                                {...field} 
                                value={field.value ?? ""} 
                                onChange={(e) => field.onChange(Number(e.target.value))} 
                                placeholder="150" 
                              />
                            )} 
                          />
                          {manualRoomsErrors.rooms?.[idx]?.price && (
                            <p className="text-red-500 text-xs mt-1">{manualRoomsErrors.rooms[idx].price?.message}</p>
                          )}
                        </div>
                        <div>
                          <Label className="text-xs font-medium mb-1 block">Description *</Label>
                          <Controller 
                            name={`rooms.${idx}.description`} 
                            control={manualRoomsControl} 
                            rules={{ required: "Description required" }} 
                            render={({ field }) => (
                              <Input {...field} placeholder="Spacious room with city view" />
                            )} 
                          />
                          {manualRoomsErrors.rooms?.[idx]?.description && (
                            <p className="text-red-500 text-xs mt-1">{manualRoomsErrors.rooms[idx].description?.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {manualRoomFields.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-indigo-200 rounded-lg bg-indigo-50/50">
                    <p className="text-gray-600 mb-4 text-lg">No rooms added yet</p>
                    <p className="text-gray-500 mb-6">Add rooms to expand your hotel's capacity</p>
                    <Button 
                      type="button" 
                      onClick={() => {
                        appendManualRoom({ room_name: "", description: "", price: 0, max_occupancy: 0 });
                        toast.success("🎉 First room field added!", {
                          duration: 2000,
                          position: 'top-center',
                        });
                      }} 
                      className="bg-indigo-500 hover:bg-indigo-600"
                    >
                      Add Your First Room
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setManualRoomsModal(null);
                    toast.success("📝 Rooms editor closed without saving.", {
                      duration: 2000,
                      position: 'top-center',
                    });
                  }}
                  disabled={isManualRoomsSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isManualRoomsSubmitting}
                  className={`bg-indigo-600 hover:bg-indigo-700 ${isManualRoomsSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isManualRoomsSubmitting ? 'Adding Rooms...' : 'Add Rooms'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      {/* NEW: Manual Hours Modal */}
      <Modal isOpen={!!manualHoursModal} onClose={() => setManualHoursModal(null)} className="max-w-4xl mx-4">
        <div className="bg-white rounded-lg max-h-90vh overflow-hidden">
          <div className="p-6 border-b bg-orange-600 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">⏰ Add Hourly Rates</h3>
                <p className="text-orange-100 text-sm">{manualHoursModal?.name}</p>
              </div>
              <button 
                onClick={() => {
                  setManualHoursModal(null);
                  toast.success("📝 Hourly rates editor closed.", {
                    duration: 2000,
                    position: 'top-center',
                  });
                }} 
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-6 max-h-96 overflow-y-auto">
            <form onSubmit={handleManualHoursSubmit(onManualHoursSubmit)}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold">Hourly Rate Packages</h4>
                  {manualHourFields.length < 10 && (
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={() => {
                        appendManualHour({ hours: 1, price: 0 });
                        toast.success("➕ New hourly rate field added!", {
                          duration: 2000,
                          position: 'top-center',
                        });
                      }} 
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Add Rate
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  {manualHourFields.map((rate, idx) => (
                    <div key={rate.id} className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-semibold">Package {idx + 1}</h5>
                        {manualHourFields.length > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              removeManualHour(idx);
                              toast.success("🗑️ Hourly rate field removed!", {
                                duration: 2000,
                                position: 'top-center',
                              });
                            }}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs font-medium mb-1 block">Duration (Hours) *</Label>
                          <Controller 
                            name={`hourlyRates.${idx}.hours`} 
                            control={manualHoursControl} 
                            rules={{ required: "Hours required", min: { value: 1, message: "Min 1 hour" } }} 
                            render={({ field }) => (
                              <Input 
                                type="number" 
                                {...field} 
                                value={field.value ?? ""} 
                                onChange={(e) => field.onChange(Number(e.target.value))} 
                                placeholder="1" 
                              />
                            )} 
                          />
                          {manualHoursErrors.hourlyRates?.[idx]?.hours && (
                            <p className="text-red-500 text-xs mt-1">{manualHoursErrors.hourlyRates[idx].hours?.message}</p>
                          )}
                        </div>
                        <div>
                          <Label className="text-xs font-medium mb-1 block">Price ($) *</Label>
                          <Controller 
                            name={`hourlyRates.${idx}.price`} 
                            control={manualHoursControl} 
                            rules={{ required: "Price required", min: { value: 0, message: "Min $0" } }} 
                            render={({ field }) => (
                              <Input 
                                type="number" 
                                {...field} 
                                value={field.value ?? ""} 
                                onChange={(e) => field.onChange(Number(e.target.value))} 
                                placeholder="50" 
                              />
                            )} 
                          />
                          {manualHoursErrors.hourlyRates?.[idx]?.price && (
                            <p className="text-red-500 text-xs mt-1">{manualHoursErrors.hourlyRates[idx].price?.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {manualHourFields.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-orange-200 rounded-lg bg-orange-50/50">
                    <p className="text-gray-600 mb-4 text-lg">No hourly rates added yet</p>
                    <p className="text-gray-500 mb-6">Add hourly rates to offer flexible booking options</p>
                    <Button 
                      type="button" 
                      onClick={() => {
                        appendManualHour({ hours: 1, price: 0 });
                        toast.success("🎉 First hourly rate field added!", {
                          duration: 2000,
                          position: 'top-center',
                        });
                      }} 
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Add Your First Rate
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setManualHoursModal(null);
                    toast.success("📝 Hourly rates editor closed without saving.", {
                      duration: 2000,
                      position: 'top-center',
                    });
                  }}
                  disabled={isManualHoursSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isManualHoursSubmitting}
                  className={`bg-orange-600 hover:bg-orange-700 ${isManualHoursSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isManualHoursSubmitting ? 'Adding Rates...' : 'Add Hourly Rates'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
}

