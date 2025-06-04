
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PhotoUploadProps {
  value?: string;
  onChange: (photoUrl: string) => void;
  firstName?: string;
  lastName?: string;
}

const PhotoUpload = ({ value, onChange, firstName = "", lastName = "" }: PhotoUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("La taille du fichier ne doit pas dépasser 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleRemovePhoto = () => {
    onChange("");
  };

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold text-gray-700 flex items-center">
        <Camera className="w-4 h-4 mr-2" />
        Photo du stagiaire
      </Label>
      
      <div className="flex items-center space-x-6">
        {/* Photo Preview */}
        <div className="relative">
          <Avatar className="h-20 w-20 border-2 border-gray-200 shadow-md">
            {value ? (
              <AvatarImage 
                src={value} 
                alt="Photo du stagiaire" 
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-bold">
                {initials || "?"}
              </AvatarFallback>
            )}
          </Avatar>
          {value && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={handleRemovePhoto}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        {/* Upload Area */}
        <div className="flex-1">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50 scale-105' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="photo-upload"
            />
            <Label htmlFor="photo-upload" className="cursor-pointer">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">Cliquez pour télécharger</span>
                  <br />
                  ou glissez-déposez votre photo
                </div>
                <div className="text-xs text-gray-500">PNG, JPG jusqu'à 5MB</div>
              </div>
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
