import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  Shield,
  Mail,
  Calendar,
  Users,
  Crown,
  User,
  Ban,
  CheckCircle,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import { Dialog } from "@headlessui/react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "user";
  status: "active" | "inactive" | "banned";
  joinDate: string;
  lastActive: string;
  contentCount: number;
  avatar?: string;
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  });
  const [userFormLoading, setUserFormLoading] = useState(false);
  const [userFormError, setUserFormError] = useState("");
  const [showDelete, setShowDelete] = useState<{ user: UserData | null }>({ user: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showDetail, setShowDetail] = useState<{ id: string | null }>({ id: null });
  const [detailUser, setDetailUser] = useState<UserData | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/admin/users?page=${currentPage}&limit=${itemsPerPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.data || data);
        setTotal(data.total || (Array.isArray(data) ? data.length : 0));
      } catch (err: any) {
        setError(err.message || "Error fetching users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (showDetail.id) {
      setDetailLoading(true);
      setDetailError("");
      setDetailUser(null);
      const token = localStorage.getItem("token");
      fetch(`/api/admin/users/${showDetail.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.ok ? res.json() : Promise.reject("Không tìm thấy user"))
        .then(data => setDetailUser(data))
        .catch(err => setDetailError(typeof err === "string" ? err : "Lỗi tải user"))
        .finally(() => setDetailLoading(false));
    }
  }, [showDetail.id]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    banned: users.filter((u) => u.status === "banned").length,
    admins: users.filter((u) => u.role === "admin").length,
    moderators: users.filter((u) => u.role === "moderator").length,
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case "moderator":
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-yellow-100 text-yellow-800";
      case "moderator":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "banned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "inactive":
        return <Eye className="w-4 h-4 text-gray-600" />;
      case "banned":
        return <Ban className="w-4 h-4 text-red-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on users:`, selectedUsers);
    setSelectedUsers([]);
  };

  // Hàm mở modal tạo user
  const openCreateUser = () => {
    setEditingUser(null);
    setUserForm({ name: "", email: "", password: "", role: "user", status: "active" });
    setShowUserModal(true);
  };
  // Hàm mở modal sửa user
  const openEditUser = (user: UserData) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    });
    setShowUserModal(true);
  };
  // Hàm submit tạo/sửa user
  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormLoading(true);
    setUserFormError("");
    try {
      const token = localStorage.getItem("token");
      let res;
      if (editingUser) {
        // Sửa user
        res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            name: userForm.name,
            email: userForm.email,
            role: userForm.role,
            status: userForm.status,
          }),
        });
      } else {
        // Tạo user
        res = await fetch(`/api/admin/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            name: userForm.name,
            email: userForm.email,
            password: userForm.password,
            role: userForm.role,
            status: userForm.status,
          }),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save user");
      }
      setShowUserModal(false);
      // Refetch user list
      setCurrentPage(1);
      setTimeout(() => window.location.reload(), 500); // hoặc refetchUsers nếu tách hàm
    } catch (err: any) {
      setUserFormError(err.message || "Error");
    } finally {
      setUserFormLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!showDelete.user) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/users/${showDelete.user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setShowDelete({ user: null });
      setCurrentPage(1);
      // Refetch user list
      setTimeout(() => window.location.reload(), 500); // hoặc refetchUsers nếu tách hàm
    } catch (err: any) {
      setDeleteError(err.message || "Error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage user accounts, roles, and permissions
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={openCreateUser}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-xl font-semibold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-semibold text-gray-900">
                  {stats.active}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-xl font-semibold text-gray-900">
                  {stats.inactive}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Ban className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Banned</p>
                <p className="text-xl font-semibold text-gray-900">
                  {stats.banned}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-xl font-semibold text-gray-900">
                  {stats.admins}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Moderators</p>
                <p className="text-xl font-semibold text-gray-900">
                  {stats.moderators}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    showFilters
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="banned">Banned</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilterRole("all");
                        setFilterStatus("all");
                        setSearchQuery("");
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="bg-blue-50 border-b border-blue-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {selectedUsers.length} user(s) selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkAction("activate")}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction("deactivate")}
                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction("ban")}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Ban
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map((u) => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      checked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-600 mt-2">Loading users...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-red-600">
                      {error}
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No users found
                      </h3>
                      <p className="text-gray-600">
                        {searchQuery || filterRole !== "all" || filterStatus !== "all"
                          ? "Try adjusting your search or filters"
                          : "No users have been created yet"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {user.name}
                            </h4>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-400">
                              Joined{" "}
                              {new Date(user.joinDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getRoleBadge(user.role)}`}
                          >
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(user.status)}
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(user.status)}`}
                          >
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.contentCount} items
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.lastActive).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600" onClick={() => setShowDetail({ id: user.id })}>
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditUser(user)}
                            className="p-1 text-gray-400 hover:text-green-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowDelete({ user })}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > itemsPerPage && (
            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-gray-700">
                Showing {currentPage * itemsPerPage - itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, total)} of {total} users
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {Math.ceil(total / itemsPerPage)}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(Math.ceil(total / itemsPerPage), prev + 1))}
                  disabled={currentPage === Math.ceil(total / itemsPerPage)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showUserModal} onClose={() => setShowUserModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30" />
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto z-10 p-6 relative">
            <Dialog.Title className="text-lg font-bold mb-4">{editingUser ? "Edit User" : "Add User"}</Dialog.Title>
            <form onSubmit={handleUserFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full border px-3 py-2 rounded" required value={userForm.name} onChange={e => setUserForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full border px-3 py-2 rounded" required value={userForm.email} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input type="password" className="w-full border px-3 py-2 rounded" required value={userForm.password} onChange={e => setUserForm(f => ({ ...f, password: e.target.value }))} />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select className="w-full border px-3 py-2 rounded" value={userForm.role} onChange={e => setUserForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select className="w-full border px-3 py-2 rounded" value={userForm.status} onChange={e => setUserForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
              {userFormError && <div className="text-red-600 text-sm">{userFormError}</div>}
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 bg-gray-100 rounded" onClick={() => setShowUserModal(false)} disabled={userFormLoading}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={userFormLoading}>{userFormLoading ? "Saving..." : (editingUser ? "Save Changes" : "Create User")}</button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>

      <Dialog open={!!showDelete.user} onClose={() => setShowDelete({ user: null })} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30" />
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto z-10 p-6 relative">
            <Dialog.Title className="text-lg font-bold mb-4">Xác nhận xóa user</Dialog.Title>
            <p>Bạn có chắc chắn muốn xóa user <b>{showDelete.user?.name}</b> ({showDelete.user?.email})? Hành động này không thể hoàn tác.</p>
            {deleteError && <div className="text-red-600 text-sm mt-2">{deleteError}</div>}
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="px-4 py-2 bg-gray-100 rounded" onClick={() => setShowDelete({ user: null })} disabled={deleteLoading}>Hủy</button>
              <button type="button" className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleDeleteUser} disabled={deleteLoading}>{deleteLoading ? "Đang xóa..." : "Xóa user"}</button>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog open={!!showDetail.id} onClose={() => setShowDetail({ id: null })} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30" />
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto z-10 p-6 relative">
            <Dialog.Title className="text-lg font-bold mb-4">Thông tin chi tiết user</Dialog.Title>
            {detailLoading ? (
              <div className="text-center py-8">Đang tải...</div>
            ) : detailError ? (
              <div className="text-red-600 text-center py-8">{detailError}</div>
            ) : detailUser ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {detailUser.avatar ? (
                    <img src={detailUser.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-7 h-7 text-blue-500" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-lg">{detailUser.name}</div>
                    <div className="text-sm text-gray-500">{detailUser.email}</div>
                  </div>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className={`px-2 py-1 rounded-full ${getRoleBadge(detailUser.role)}`}>{detailUser.role}</span>
                  <span className={`px-2 py-1 rounded-full ${getStatusBadge(detailUser.status)}`}>{detailUser.status}</span>
                </div>
                <div className="text-sm text-gray-600">Tham gia: {new Date(detailUser.joinDate).toLocaleDateString()}</div>
                <div className="text-sm text-gray-600">Hoạt động gần nhất: {new Date(detailUser.lastActive).toLocaleDateString()}</div>
                <div className="text-sm text-gray-600">Số content: {detailUser.contentCount}</div>
              </div>
            ) : null}
            <div className="flex justify-end mt-6">
              <button type="button" className="px-4 py-2 bg-gray-100 rounded" onClick={() => setShowDetail({ id: null })}>Đóng</button>
            </div>
          </div>
        </div>
      </Dialog>
    </AdminLayout>
  );
}
