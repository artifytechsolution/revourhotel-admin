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
  Link
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon
} from "@mui/icons-material";

import { useUserList } from "@/hooks/apiHooks";

// ---- Types ----
interface User {
  id: number;
  firstName: string;
  email: string;
  role: string;
  phone:string;
  isVerified: boolean;
}

export default function UserManagementTable() {
  const router = useRouter();
  const [userList, setUserList] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const {
    isError,
    isLoading,
    data: userData,
    error,
    mutate: fetchUsers,
  } = useUserList();

  // Fetch users once on mount
  useEffect(() => {
    fetchUsers("");
  }, [fetchUsers]);

  // Handle data & errors
  useEffect(() => {
    if (isError && !isLoading) {
      toast.error(error instanceof Error ? error.message : "Failed to load users");
    }
    if (Array.isArray(userData?.data)) {
      setUserList(userData.data);
    }
  }, [isError, isLoading, error, userData]);

  // Get unique roles for filter dropdown
  const uniqueRoles = useMemo(() => {
    const roles = userList.map(user => user.role);
    return [...new Set(roles)];
  }, [userList]);

  // Filtered users based on search and role filter
  const filteredUsers = useMemo(() => {
    return userList.filter(user => {
      const matchesSearch = 
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toString().includes(searchQuery);
      
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [userList, searchQuery, roleFilter]);

  const handleReset = () => {
    setSearchQuery("");
    setRoleFilter("all");
  };


  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/">
          Dashboard
        </Link>
        <Typography color="text.primary">User Management</Typography>
      </Breadcrumbs>

      <Paper elevation={2} sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            User Management Table
          </Typography>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by name, email, or ID..."
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
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={roleFilter}
                label="Filter by Role"
                onChange={(e) => setRoleFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterIcon sx={{ ml: 1 }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Roles</MenuItem>
                {uniqueRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
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
          Showing {filteredUsers.length} of {userList.length} users
        </Typography>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading users...</Typography>
          </Box>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error loading users. Please try again.
          </Alert>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <>
            {filteredUsers.length > 0 ? (
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Full Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Email Address</TableCell>
                       <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>User Role</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Current Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user,index) => (
                      <TableRow
                        key={user.id}
                        sx={{ 
                          '&:nth-of-type(odd)': { backgroundColor: 'grey.25' },
                          '&:hover': { backgroundColor: 'action.hover' },
                          cursor: 'pointer'
                        }}
                        onClick={() => console.log('Row clicked:', user)}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {index + 1}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {user.firstName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </TableCell>
                         <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {user.phone}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.isVerified ? "Verified" : "Pending"}
                            size="small"
                            color={user.isVerified ? "success" : "warning"}
                            variant={user.isVerified ? "filled" : "outlined"}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  {searchQuery || roleFilter !== "all" 
                    ? "No users found matching your filters." 
                    : "No users found."}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}
