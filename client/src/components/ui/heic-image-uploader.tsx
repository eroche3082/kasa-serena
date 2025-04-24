import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Upload, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadedImage {
  original: string;
  optimized: string | null;
  lowQuality: string | null;
}

interface HeicImageUploaderProps {
  onImageUpload?: (imageData: UploadedImage) => void;
  className?: string;
  acceptedFileTypes?: string;
  showPreview?: boolean;
  maxSizeInMB?: number;
  buttonText?: string;
}

export function HeicImageUploader({
  onImageUpload,
  className = '',
  acceptedFileTypes = 'image/jpeg,image/png,image/heic,image/heif',
  showPreview = true,
  maxSizeInMB = 10,
  buttonText = 'Subir imagen'
}: HeicImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) {
      return;
    }
    
    // Validar tamaño
    if (selectedFile.size > maxSizeInBytes) {
      setError(`El archivo excede el tamaño máximo de ${maxSizeInMB}MB`);
      toast({
        variant: 'destructive',
        title: 'Archivo demasiado grande',
        description: `El archivo excede el tamaño máximo de ${maxSizeInMB}MB`
      });
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    
    // Simular subida inmediata cuando hay archivo seleccionado
    handleUpload(selectedFile);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleUpload = async (selectedFile: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      // Iniciar intervalos para simular el progreso de carga
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const increment = Math.random() * 10;
          return Math.min(prev + increment, 95); // Máximo 95% hasta que se complete realmente
        });
      }, 300);
      
      // Realizar la petición al servidor
      const response = await fetch('/api/image-convert', {
        method: 'POST',
        body: formData
      });
      
      // Limpiar intervalo y establecer progreso completo
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      const imageData = await response.json();
      
      if (response.ok) {
        setUploadedImage(imageData);
        
        if (onImageUpload) {
          onImageUpload(imageData);
        }
        
        toast({
          title: 'Imagen procesada correctamente',
          description: imageData.optimized 
            ? 'La imagen ha sido optimizada para web' 
            : 'La imagen ha sido subida correctamente'
        });
      } else {
        throw new Error(imageData.message || 'Error al procesar la imagen');
      }
    } catch (error: any) {
      setError(error.message || 'Error al subir la imagen');
      toast({
        variant: 'destructive',
        title: 'Error al procesar la imagen',
        description: error.message || 'No se pudo procesar la imagen'
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className={className}>
      <Input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept={acceptedFileTypes}
        className="hidden"
      />
      
      <div className="flex flex-col gap-4">
        <Button 
          type="button" 
          onClick={triggerFileInput} 
          variant="outline"
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {buttonText}
        </Button>
        
        {file && (
          <div className="text-sm text-muted-foreground">
            Archivo: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
          </div>
        )}
        
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Procesando imagen...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        {showPreview && uploadedImage && (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={uploadedImage.optimized || uploadedImage.original} 
                  alt="Vista previa" 
                  className="w-full h-auto"
                />
                {uploadedImage.optimized && (
                  <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground rounded-full p-1">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="p-3 bg-muted/50">
                <div className="flex items-center gap-2 text-sm">
                  <ImageIcon className="h-4 w-4" />
                  <span>
                    {uploadedImage.optimized 
                      ? 'Imagen optimizada automáticamente' 
                      : 'Imagen subida correctamente'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default HeicImageUploader;