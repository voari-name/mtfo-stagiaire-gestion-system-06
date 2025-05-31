
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, Upload } from "lucide-react";
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

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-gray-700 flex items-center">
        <Camera className="w-4 h-4 mr-2" />
        Photo
      </Label>
      
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16 border-2 border-gray-200">
          {value ? (
            <AvatarImage src={value} alt="Photo du stagiaire" />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-lg font-bold">
              {initials || "?"}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1">
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
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
              <div className="flex flex-col items-center space-y-2">
                <Upload className="w-6 h-6 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">Cliquez pour télécharger</span> ou glissez-déposez
                </div>
                <div className="text-xs text-gray-500">PNG, JPG jusqu'à 10MB</div>
              </div>
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
