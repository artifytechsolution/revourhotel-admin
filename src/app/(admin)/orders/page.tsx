"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Breadcrumbs,
  Link,
  Card,
  CardContent
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ShoppingCart as OrderIcon,
  Hotel as HotelIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon
} from "@mui/icons-material";

import { useOrderList } from "@/hooks/apiHooks";

// ---- Utility Function ----
export const formatDateTime = (isoString: string) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

// ---- Types ----
interface Order {
  id: number;
  order_type: string;
  status: "PENDING" | "SUCCESS" | "FAIL";
  amount: number;
  reservation?: {
    hotel?: {
      name: string;
    };
    total_days: number;
    check_in_datetime: string;
    check_out_datetime: string;
  };
  user?: {
    firstName: string;
    lastName: string;
  };
}

export default function OrderManagementTable() {
  const router = useRouter();
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");

  const {
    isError,
    isLoading,
    data: orderData,
    error,
    mutate: hotelMutation,
  } = useOrderList();

  // Fetch orders on mount
  useEffect(() => {
    hotelMutation({});
  }, [hotelMutation]);

  // Handle data & errors
  useEffect(() => {
    if (isError && !isLoading) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      router.push("/login ");
    }
    if (Array.isArray(orderData?.data)) {
      setOrderList(orderData.data);
    }
  }, [isError, isLoading, error, orderData, router]);

  // Get unique order types for filter
  const uniqueOrderTypes = useMemo(() => {
    const types = orderList.map(order => order.order_type);
    return [...new Set(types)];
  }, [orderList]);

  // Filtered orders based on search and filters
  const filteredOrders = useMemo(() => {
    return orderList.filter(order => {
      const customerName = `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.toLowerCase();
      const hotelName = order.reservation?.hotel?.name?.toLowerCase() || "";
      const orderId = order.id.toString();
      
      const matchesSearch = 
        customerName.includes(searchQuery.toLowerCase()) ||
        hotelName.includes(searchQuery.toLowerCase()) ||
        orderId.includes(searchQuery);
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesOrderType = orderTypeFilter === "all" || order.order_type === orderTypeFilter;
      
      return matchesSearch && matchesStatus && matchesOrderType;
    });
  }, [orderList, searchQuery, statusFilter, orderTypeFilter]);

  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setOrderTypeFilter("all");
  };

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS": return "success";
      case "PENDING": return "warning";
      case "FAIL": return "error";
      default: return "default";
    }
  };

  // Summary stats
  const totalAmount = filteredOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
  const successfulOrders = filteredOrders.filter(order => order.status === "SUCCESS").length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/">
          Dashboard
        </Link>
        <Typography color="text.primary">Order Management</Typography>
      </Breadcrumbs>

      {/* Summary Cards */}
     

      <Paper elevation={2} sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <OrderIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            Order Management Table
          </Typography>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by Order ID, Hotel, or Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="SUCCESS">Success</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="FAIL">Failed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={orderTypeFilter}
                label="Filter by Type"
                onChange={(e) => setOrderTypeFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterIcon sx={{ ml: 1 }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Types</MenuItem>
                {uniqueOrderTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={handleReset}
              >
                Reset Filters
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Results Summary */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Showing {filteredOrders.length} of {orderList.length} orders
        </Typography>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading orders...</Typography>
          </Box>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error loading orders. Please try again.
          </Alert>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <>
            {filteredOrders.length > 0 ? (
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Order Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Hotel Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                    
                      <TableCell sx={{ fontWeight: 600 }}>Check-in</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Check-out</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        sx={{ 
                          '&:nth-of-type(odd)': { backgroundColor: 'grey.25' },
                          '&:hover': { backgroundColor: 'action.hover' },
                          cursor: 'pointer'
                        }}
                        onClick={() => console.log('Order clicked:', order)}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            #{order.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.order_type}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            size="small"
                            color={getStatusColor(order.status)}
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {order.reservation?.hotel?.name || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            ₹{order.amount?.toLocaleString() || 0}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDateTime(order.reservation?.check_in_datetime)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDateTime(order.reservation?.check_out_datetime)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {`${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim() || "-"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  {searchQuery || statusFilter !== "all" || orderTypeFilter !== "all"
                    ? "No orders found matching your filters." 
                    : "No orders found."}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}
