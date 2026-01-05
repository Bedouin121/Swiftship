import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, X } from "lucide-react";

interface ImagePreviewProps {
  label: string;
  imageUrl: string;
  className?: string;
}

export function ImagePreview({ label, imageUrl, className }: ImagePreviewProps) {
  const [showFullImage, setShowFullImage] = useState(false);

  if (!imageUrl) {
    return (
      <div className={className}>
        <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
        <p className="text-sm text-muted-foreground">No image uploaded</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
      <div className="mt-2">
        <div className="relative inline-block">
          <img
            src={imageUrl}
            alt={label}
            className="w-32 h-24 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowFullImage(true)}
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowFullImage(true)}
            className="absolute top-1 right-1 h-6 w-6 p-0"
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Click to view full size</p>
      </div>

      {/* Full Image Modal */}
      {showFullImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" 
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <img
              src={imageUrl}
              alt={label}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowFullImage(false)}
              className="absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}