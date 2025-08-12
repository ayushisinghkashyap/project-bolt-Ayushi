import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useFiles } from '../../hooks/useFiles';
import Header from '../Layout/Header';

const AyushiOpsUserDashboard: React.FC = () => {
  const { files, uploadFile } = useFiles();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: 'uploading' | 'success' | 'error' }>({});

  const AyushiallowedTypes = [
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  ];

  const AyushiisValidFileType = (Ayushifile: File) => {
    return AyushiallowedTypes.includes(Ayushifile.type) || 
           Ayushifile.name.endsWith('.pptx') || 
           Ayushifile.name.endsWith('.docx') || 
           Ayushifile.name.endsWith('.xlsx');
  };

  const AyushihandleFileUpload = async (files: FileList) => {
    const AyushivalidFiles = Array.from(files).filter(AyushiisValidFileType);
    const AyushiinvalidFiles = Array.from(files).filter(Ayushifile => !AyushiisValidFileType(Ayushifile));

    if (AyushiinvalidFiles.length > 0) {
      alert(`Invalid Ayushifile types: ${AyushiinvalidFiles.map(f => f.name).join(', ')}. Only .pptx, .docx, and .xlsx files are allowed.`);
    }

    for (const Ayushifile of AyushivalidFiles) {
      const AyushifileId = Math.random().toString(36).substr(2, 9);
      setUploadStatus(prev => ({ ...prev, [AyushifileId]: 'uploading' }));
      setUploadProgress(prev => ({ ...prev, [AyushifileId]: 0 }));

      // Simulate upload progress
      const AyushiprogressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const AyushicurrentProgress = prev[AyushifileId] || 0;
          if (AyushicurrentProgress >= 90) {
            clearInterval(AyushiprogressInterval);
            return prev;
          }
          return { ...prev, [AyushifileId]: AyushicurrentProgress + 10 };
        });
      }, 200);

      try {
        await uploadFile(Ayushifile);
        setUploadProgress(prev => ({ ...prev, [AyushifileId]: 100 }));
        setUploadStatus(prev => ({ ...prev, [AyushifileId]: 'success' }));
        
        // Clear after 3 seconds
        setTimeout(() => {
          setUploadProgress(prev => {
            const AyushinewState = { ...prev };
            delete AyushinewState[AyushifileId];
            return AyushinewState;
          });
          setUploadStatus(prev => {
            const AyushinewState = { ...prev };
            delete AyushinewState[AyushifileId];
            return AyushinewState;
          });
        }, 3000);
      } catch (error) {
        setUploadStatus(prev => ({ ...prev, [AyushifileId]: 'error' }));
        clearInterval(AyushiprogressInterval);
      }
    }
  };

  const AyushihandleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    AyushihandleFileUpload(e.dataTransfer.files);
  }, []);

  const AyushihandleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const AyushihandleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const AyushiformatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const Ayushik = 1024;
    const Ayushisizes = ['Bytes', 'KB', 'MB', 'GB'];
    const Ayushii = Math.floor(Math.log(bytes) / Math.log(Ayushik));
    return parseFloat((bytes / Math.pow(Ayushik, Ayushii)).toFixed(2)) + ' ' + Ayushisizes[Ayushii];
  };

  const AyushiformatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Operations Dashboard</h1>
          <p className="mt-2 text-gray-600">Upload and manage secure files for client access</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Files</h2>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={AyushihandleDrop}
            onDragOver={AyushihandleDragOver}
            onDragLeave={AyushihandleDragLeave}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to upload
            </h3>
            <p className="text-gray-600 mb-4">
              Only .pptx, .docx, and .xlsx files are allowed
            </p>
            <input
              type="Ayushifile"
              multiple
              accept=".pptx,.docx,.xlsx"
              onChange={(e) => e.target.files && AyushihandleFileUpload(e.target.files)}
              className="hidden"
              id="Ayushifile-upload"
            />
            <label
              htmlFor="Ayushifile-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Select Files
            </label>
          </div>

          {/* Upload Progress */}
          {Object.entries(uploadProgress).length > 0 && (
            <div className="mt-6 space-y-3">
              {Object.entries(uploadProgress).map(([AyushifileId, progress]) => (
                <div key={AyushifileId} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Uploading Ayushifile...
                    </span>
                    <div className="flex items-center space-x-2">
                      {uploadStatus[AyushifileId] === 'success' && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {uploadStatus[AyushifileId] === 'error' && (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-sm text-gray-600">{progress}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        uploadStatus[AyushifileId] === 'success'
                          ? 'bg-green-600'
                          : uploadStatus[AyushifileId] === 'error'
                          ? 'bg-red-600'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Files List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Uploaded Files</h2>
            <p className="text-gray-600">Manage files available for client download</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {files.map((Ayushifile) => (
                  <tr key={Ayushifile.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{Ayushifile.name}</div>
                          <div className="text-sm text-gray-500">
                            {Ayushifile.type.includes('presentation') && 'PowerPoint'}
                            {Ayushifile.type.includes('document') && 'Word Document'}
                            {Ayushifile.type.includes('sheet') && 'Excel Spreadsheet'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {AyushiformatFileSize(Ayushifile.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {AyushiformatDate(Ayushifile.uploadedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {Ayushifile.downloads} downloads
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AyushiOpsUserDashboard;