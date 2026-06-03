import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Loader2,
  FolderOpen,
  FileIcon,
  ExternalLink
} from 'lucide-react';
import { DashboardLayout } from "../../components/layout/DashboardLayout"; 
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { getPublicDocuments } from '../../features/User/userSlice';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = ['Legal', 'Society Rules', 'Forms', 'Financial Reports', 'NOC Templates', 'Others'];

const DocumentCenter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { documents, documentsLoading, error } = useSelector(
    (state: RootState) => state.user
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    dispatch(getPublicDocuments({}));
  }, [dispatch]);

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
    <DashboardLayout role="member">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Document Center</h1>
          <p className="text-slate-500">Access and download important society documents</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search documents..." 
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
        </div>

        {/* Documents Grid */}
        {documentsLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading documents...</p>
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div key={doc._id} className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow p-5 flex flex-col group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <FileIcon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="bg-slate-50 text-xs font-normal">{doc.category}</Badge>
                </div>
                
                <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {doc.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">
                  {doc.description || "No description provided."}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <span className="text-xs text-slate-400">
                    {formatFileSize(doc.fileSize)}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild title="Open in new tab">
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button size="sm" className="h-8 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border-none shadow-none transition-all" asChild>
                      <a href={doc.fileUrl} download={doc.fileName || "document"}>
                        <Download className="w-4 h-4 mr-1" /> Download
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-white rounded-xl border border-slate-100 border-dashed">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <FolderOpen className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">No documents available</h3>
            <p className="text-slate-500 max-w-sm">
              {searchTerm || selectedCategory !== 'All' 
                ? "No documents match your filters."
                : "Your society hasn't shared any public documents yet."}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DocumentCenter;
