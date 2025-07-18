import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

interface Tag {
  id: string;
  name: string;
}

export default function AdminTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [form, setForm] = useState({ name: "" });
  const [showDelete, setShowDelete] = useState<{ open: boolean; tag: Tag | null }>({ open: false, tag: null });
  const [viewing, setViewing] = useState<Tag | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchTags() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/tags?page=${currentPage}&limit=${itemsPerPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch tags");
        const data = await res.json();
        setTags(data.data || []);
        setTotal(data.total || 0);
      } catch (err: any) {
        setError(err.message || "Error fetching tags");
      } finally {
        setLoading(false);
      }
    }
    fetchTags();
  }, [currentPage, itemsPerPage]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "" });
    setShowDialog(true);
  };
  const openEdit = (tag: Tag) => {
    setEditing(tag);
    setForm({ name: tag.name });
    setShowDialog(true);
  };
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (editing) {
        // Edit
        await fetch(`/api/tags/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        });
      } else {
        // Add
        await fetch(`/api/tags`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        });
      }
      setShowDialog(false);
      setEditing(null);
      setForm({ name: "" });
      // Refetch
      const res = await fetch(`/api/tags`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setTags(data.data || []);
    } catch {}
  };
  const handleDelete = async () => {
    if (!showDelete.tag) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/tags/${showDelete.tag.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDelete({ open: false, tag: null });
      // Refetch
      const res = await fetch(`/api/tags`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setTags(data.data || []);
    } catch {}
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Tag
          </button>
        </div>
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tags.map((tag) => (
                  <tr key={tag.id}>
                    <td className="px-6 py-4 font-medium text-gray-900">{tag.name}</td>
                    <td className="px-6 py-4 flex gap-1">
                      <button onClick={() => setViewing(tag)} className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => openEdit(tag)} className="p-1 text-gray-400 hover:text-green-600"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => setShowDelete({ open: true, tag })} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination */}
        {tags.length > 0 && total > itemsPerPage && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-700">
              Page {currentPage} of {Math.ceil(total / itemsPerPage)}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(Math.ceil(total / itemsPerPage), currentPage + 1))}
                disabled={currentPage === Math.ceil(total / itemsPerPage)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Tag" : "Add Tag"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update tag name." : "Enter new tag name."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Cancel</button>
            </DialogClose>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleSave}
            >
              {editing ? "Save Changes" : "Add Tag"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!viewing} onOpenChange={open => !open && setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tag Details</DialogTitle>
            <DialogDescription>All information about this tag.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <div><b>ID:</b> {viewing?.id}</div>
            <div><b>Name:</b> {viewing?.name}</div>
          </div>
          <DialogFooter>
            <button onClick={() => { setViewing(null); openEdit(viewing!); }} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"><Edit className="w-4 h-4" />Edit</button>
            <button onClick={() => { setViewing(null); setShowDelete({ open: true, tag: viewing }); }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"><Trash2 className="w-4 h-4" />Delete</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showDelete.open} onOpenChange={open => setShowDelete(s => ({ ...s, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this tag? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
} 