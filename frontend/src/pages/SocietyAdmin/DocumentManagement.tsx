import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff,
  X,
  Loader2,
  FolderOpen,
  FileIcon,
  UploadCloud,
  ExternalLink
} from 'lucide-react';
import { DashboardLayout } from "../../components/layout/DashboardLayout"; 
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { 
  getAdminDocuments,
  uploadDocument,
  updateDocument,
  deleteDocument,
  resetAdminState
} from '../../features/admin/adminSlice';
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// ─── Types ─────────────────────────────────────────────────────────────────
interface Document {
  _id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  visibility: 'Public' | 'Private';
  uploadedBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────
const CATEGORIES = ['Legal', 'Society Rules', 'Forms', 'Financial Reports', 'NOC Templates', 'Others'];

const DocumentManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { documents, documentsLoading, isLoading, isSuccess, error } = useSelector(
    (state: RootState) => state.admin
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Legal',
    visibility: 'Public' as 'Public' | 'Private',
    file: null as File | null,
  });

  useEffect(() => {
    dispatch(getAdminDocuments());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(isEditing ? "Document updated successfully" : "Document uploaded successfully");
      setShowModal(false);
      resetForm();
      dispatch(resetAdminState());
    
      dispatch(getAdminDocuments()); 
    }
    if (error) {
      toast.error(error);
      dispatch(resetAdminState());
    }
  }, [isSuccess, error, dispatch, isEditing]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Legal',
      visibility: 'Public',
      file: null,
    });
    setIsEditing(false);
    setCurrentDocId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('visibility', formData.visibility);
    if (formData.file) {
      data.append('documentFile', formData.file);
    }

    if (isEditing && currentDocId) {
      dispatch(updateDocument({ id: currentDocId, formData: data }));
    } else {
      if (!formData.file) {
        toast.error("Please select a file to upload");
        return;
      }
      dispatch(uploadDocument(data));
    }
  };

  const handleEdit = (doc: Document) => {
    setIsEditing(true);
    setCurrentDocId(doc._id);
    setFormData({
      title: doc.title,
      description: doc.description,
      category: doc.category,
      visibility: doc.visibility,
      file: null,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this document?")) {
      dispatch(deleteDocument(id)).then((res: any) => {
        if (!res.error) {
          toast.success("Document deleted successfully");
        }
      });
    }
  };

  const filteredDocuments = Array.isArray(documents) ? documents.filter(doc => {
    const matchesSearch = doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) : [];

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <DashboardLayout role="society-admin">
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Document Management</h1>
            <p className="text-slate-500">Create, Update, and Delete society documents</p>
          </div>
          <Button onClick={() => { resetForm(); setShowModal(true); }} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Upload New Document
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by title..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center justify-end">
            <Badge variant="outline" className="text-slate-500 font-normal py-1.5 px-3">
              Total Documents: {filteredDocuments.length}
            </Badge>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {documentsLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Loading documents...</p>
            </div>
          ) : filteredDocuments.length > 0 ? (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Document</TableHead>
                  <TableHead className="font-semibold text-slate-700">Category</TableHead>
                  <TableHead className="font-semibold text-slate-700">Visibility</TableHead>
                  <TableHead className="font-semibold text-slate-700">Uploaded Details</TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc._id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <FileIcon className="w-5 h-5" />
                        </div>
                        <div className="max-w-[200px]">
                          <p className="font-medium text-slate-800 truncate">{doc.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{doc.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-50 font-normal">{doc.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {doc.visibility === 'Public' ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50">
                          <Eye className="w-3 h-3 mr-1" /> Public
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50">
                          <EyeOff className="w-3 h-3 mr-1" /> Private
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-slate-700 font-medium">{doc.uploadedBy?.name || 'Admin'}</p>
                        <p className="text-slate-400 text-xs">
                          {new Date(doc.createdAt).toLocaleDateString()} • {formatFileSize(doc.fileSize)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600" asChild title="View/Download">
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-amber-600" onClick={() => handleEdit(doc)} title="Edit Document">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-600" onClick={() => handleDelete(doc._id)} title="Delete Document">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <FolderOpen className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">No documents found</h3>
              <p className="text-slate-500 max-w-sm">
                {searchTerm || selectedCategory !== 'All' 
                  ? "No documents match your current filters."
                  : "Start by uploading your first society document."}
              </p>
            </div>
          )}
        </div>

        {/* Upload/Edit Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-xl font-bold text-slate-800">
                {isEditing ? "Edit Document" : "Create New Document"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="p-6 pt-2 space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Document Title</Label>
                  <Input 
                    id="title" 
                    name="title"
                    placeholder="e.g., Society Bylaws 2026" 
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="h-10 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Description (Optional)</Label>
                  <Input 
                    id="description" 
                    name="description"
                    placeholder="Short description of the document" 
                    value={formData.description}
                    onChange={handleInputChange}
                    className="h-10 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-semibold text-slate-700">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                    >
                      <SelectTrigger className="h-10 border-slate-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visibility" className="text-sm font-semibold text-slate-700">Visibility</Label>
                    <Select 
                      value={formData.visibility} 
                      onValueChange={(val: 'Public' | 'Private') => setFormData(prev => ({ ...prev, visibility: val }))}
                    >
                      <SelectTrigger className="h-10 border-slate-200">
                        <SelectValue placeholder="Set visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Public">Public (All Residents)</SelectItem>
                        <SelectItem value="Private">Private (Admins Only)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <Label htmlFor="file" className="text-sm font-semibold text-slate-700">File Attachment</Label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-indigo-400 transition-all bg-slate-50/50 cursor-pointer relative group">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-100 transition-colors">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-700 truncate max-w-[250px]">
                        {formData.file ? formData.file.name : (isEditing ? "Click to replace file" : "Click to browse")}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">PDF, PNG, JPG (Max 20MB)</p>
                    </div>
                    <input 
                      type="file" 
                      id="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                      accept=".pdf,.png,.jpg,.jpeg"
                      required={!isEditing}
                    />
                  </div>
                  {isEditing && !formData.file && (
                    <p className="text-[11px] text-amber-600 italic mt-1">Leave empty to keep existing file</p>
                  )}
                </div>
              </div>
              <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                <Button type="button" variant="ghost" onClick={() => setShowModal(false)} disabled={isLoading} className="text-slate-500 hover:bg-slate-200">
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 min-w-[140px] shadow-indigo-200 shadow-lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {isEditing ? "Updating..." : "Uploading..."}
                    </>
                  ) : (isEditing ? "Update Document" : "Upload Document")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default DocumentManagement;
