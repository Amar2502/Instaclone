"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCallback, useState } from "react";
import { ArrowLeft, MapPin, Users, ChevronDown, Smile, Loader2 } from "lucide-react";
import axios from "axios";
import { cropToPostAndCompress } from "@/lib/croptopostandcompress";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

export function CreatePostDialog({
  trigger,
  user_id,
  profile_pic,
}: {
  trigger: React.ReactNode;
  user_id: number | null;
  profile_pic: string | null;
}) {
  const [step, setStep] = useState<"upload" | "preview">("upload");
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const username = useSelector((state: RootState) => state.auth.username);

  const handleSelectFile = useCallback(() => {
    if (!user_id) return;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      const cropped = await cropToPostAndCompress(file);
      setCroppedFile(cropped);
      setPreviewURL(URL.createObjectURL(cropped));
      setStep("preview");
    };

    fileInput.click();
  }, [user_id]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && file.type.startsWith('image/')) {
      cropToPostAndCompress(file).then(cropped => {
        setCroppedFile(cropped);
        setPreviewURL(URL.createObjectURL(cropped));
        setStep("preview");
      });
    }
  }, []);

  const handleBack = useCallback(() => {
    setStep("upload");
    setPreviewURL(null);
    setCroppedFile(null);
    setCaption("");
  }, []);

  const handleSharePost = useCallback(async () => {
    if (!user_id || !croppedFile) return;
    
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("user_id", user_id.toString());
    formData.append("caption", caption);
    formData.append("content_type", "post");
    formData.append("file", croppedFile);

    try {
      const res = await axios.post(
        "http://localhost:8080/posts/set-post",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      console.log("Upload Success:", res.data);
      
      // Reset UI
      setStep("upload");
      setCaption("");
      setPreviewURL(null);
      setCroppedFile(null);
    } catch (err) {
      console.error("Upload Failed:", err);
    } finally {
      setIsUploading(false);
    }
  }, [user_id, croppedFile, caption]);

  const handleDialogClose = useCallback(() => {
    setStep("upload");
    setPreviewURL(null);
    setCroppedFile(null);
    setCaption("");
  }, []);

  return (
    <Dialog onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      
      {step === "upload" && (
        <DialogContent className="sm:max-w-[700px] h-[650px] bg-zinc-900 text-white border border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-4 py-10 px-6">
          <DialogHeader>
            <DialogTitle className="text-center text-white text-lg font-medium">
              Create new post
            </DialogTitle>
          </DialogHeader>
          
          <div 
            className="flex flex-col items-center justify-center gap-4 w-full h-[600px] border-2 border-dashed border-zinc-600 rounded-lg p-8"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Icon */}
            <div className="text-white text-6xl opacity-80">
              <svg width="96" height="77" viewBox="0 0 96 77" fill="none">
                <path d="M12 0C5.37 0 0 5.37 0 12v41c0 6.63 5.37 12 12 12h48c6.63 0 12-5.37 12-12V12c0-6.63-5.37-12-12-12H12zM12 6h48c3.31 0 6 2.69 6 6v41c0 3.31-2.69 6-6 6H12c-3.31 0-6-2.69-6-6V12c0-3.31 2.69-6 6-6z" fill="currentColor"/>
                <path d="M24 24c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="currentColor"/>
                <path d="M12 47l12-12 6 6 12-12 18 18v6c0 3.31-2.69 6-6 6H12c-3.31 0-6-2.69-6-6v-6z" fill="currentColor"/>
                <path d="M84 24c3.31 0 6 2.69 6 6v35c0 6.63-5.37 12-12 12H30c-3.31 0-6-2.69-6-6h54c3.31 0 6-2.69 6-6V24z" fill="currentColor"/>
              </svg>
            </div>
            
            {/* Message */}
            <p className="text-xl text-zinc-300 text-center font-light">
              Drag photos and videos here
            </p>
            
            {/* Upload Button */}
            <button
              onClick={handleSelectFile}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-6 rounded-lg transition duration-200 cursor-pointer"
            >
              Select from computer
            </button>
          </div>
        </DialogContent>
      )}  

      {step === "preview" && previewURL && (
        <DialogContent className="sm:max-w-[750px] h-[650px] p-0 overflow-hidden text-white rounded-xl border border-zinc-700">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700 bg-zinc-900">
            <button
              onClick={handleBack}
              className="text-white hover:text-zinc-300 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <DialogTitle className="text-white text-lg font-medium">
              Create new post
            </DialogTitle>
            <button
              onClick={handleSharePost}
              disabled={isUploading}
              className="text-blue-500 hover:text-blue-400 font-medium text-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Sharing...
                </span>
              ) : (
                "Share"
              )}
            </button>
          </div>

          <div className="flex h-full">
            {/* Image Preview */}
            <div className="flex-1 bg-black flex items-center justify-center relative h-full">
              <img
                src={previewURL}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Right Panel */}
            <div className="w-85 bg-zinc-900 flex flex-col">
              {/* User Info */}
              <div className="p-4 border-b border-zinc-700 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <img src={profile_pic || ""} alt="Profile" className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="text-white text-sm font-medium">{username}</span>
              </div>

              {/* Caption */}
              <div className="flex-1 p-4">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full bg-transparent text-white placeholder-zinc-500 text-sm resize-none outline-none border-none min-h-[120px]"
                  maxLength={2200}
                />
                <div className="flex items-center justify-between mt-2">
                  <Smile size={16} className="text-zinc-500" />
                  <span className="text-zinc-500 text-xs">{caption.length}/2,200</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}