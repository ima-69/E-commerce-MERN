import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Users, 
  UserPlus, 
  UserCheck,
  UserX,
  Search,
  Shield,
  User
} from "lucide-react";
import { 
  getAllUsers, 
  updateUserStatus,
  deleteUser, 
  getUserStats 
} from "@/store/admin/user-slice";
import { toast } from "sonner";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { userList, userStats, isLoading, error } = useSelector((state) => state.adminUsers);
  const { user: currentUser } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(""); // 'delete' or 'status'

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getUserStats());
  }, [dispatch]);

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setActionType("delete");
    setDeleteDialogOpen(true);
  };

  const handleStatusChange = (user) => {
    setSelectedUser(user);
    setActionType("status");
    setStatusDialogOpen(true);
  };

  const confirmAction = async () => {
    if (actionType === "delete") {
      const result = await dispatch(deleteUser(selectedUser._id));
      if (result.payload?.success) {
        toast.success("User deleted successfully");
        dispatch(getUserStats()); // Refresh stats
      } else {
        toast.error("Failed to delete user");
      }
    } else if (actionType === "status") {
      const result = await dispatch(updateUserStatus({
        userId: selectedUser._id,
        isActive: !selectedUser.isActive
      }));
      if (result.payload?.success) {
        toast.success(`User ${!selectedUser.isActive ? 'activated' : 'deactivated'} successfully`);
        dispatch(getUserStats()); // Refresh stats
      } else {
        toast.error("Failed to update user status");
      }
    }
    
    setDeleteDialogOpen(false);
    setStatusDialogOpen(false);
    setSelectedUser(null);
    setActionType("");
  };

  const filteredUsers = userList
    .filter(user =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Admin users first, then normal users
      if (a.role === 'admin' && b.role !== 'admin') return -1;
      if (a.role !== 'admin' && b.role === 'admin') return 1;
      
      // If both are same role, sort by name
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

  const getRoleIcon = (role) => {
    return role === 'admin' ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />;
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Error loading users: {error}</p>
        <Button onClick={() => dispatch(getAllUsers())}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.totalUsers}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-50">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.activeUsers}</p>
                </div>
                <div className="p-3 rounded-full bg-green-50">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.inactiveUsers}</p>
                </div>
                <div className="p-3 rounded-full bg-red-50">
                  <UserX className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Users (30d)</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.newUsers}</p>
                </div>
                <div className="p-3 rounded-full bg-orange-50">
                  <UserPlus className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-lg">Loading users...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500">ID: {user._id.slice(-8)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={`${getRoleColor(user.role)} flex items-center gap-1 w-fit`}>
                          {getRoleIcon(user.role)}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(user.isActive)} w-fit`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Only show action buttons for normal users, not admin users */}
                          {user.role !== 'admin' && user._id !== currentUser?._id && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(user)}
                                className="text-xs"
                              >
                                {user.isActive ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteUser(user)}
                                className="text-xs"
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-gray-500">No users found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmAction}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.firstName} ${selectedUser?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      <ConfirmationDialog
        isOpen={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        onConfirm={confirmAction}
        title={selectedUser?.isActive ? "Deactivate User" : "Activate User"}
        description={`Are you sure you want to ${selectedUser?.isActive ? 'deactivate' : 'activate'} ${selectedUser?.firstName} ${selectedUser?.lastName}?`}
        confirmText={selectedUser?.isActive ? "Deactivate" : "Activate"}
        cancelText="Cancel"
        variant={selectedUser?.isActive ? "destructive" : "default"}
      />
    </div>
  );
};

export default AdminUsers;
