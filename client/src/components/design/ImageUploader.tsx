import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaImages, FaSpinner } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useDesign } from '@/context/DesignContext';
import { useToast } from '@/hooks/use-toast';

const ImageUploader = () => {
  const { uploadImage, uploadedImage, imagePreview, clearImage, isAnalyzing, analyzeCurrentImage } = useDesign();
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Archivo demasiado grande",
        description: "El tamaño máximo permitido es 10MB",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Check if it's a HEIC file by extension
      if (file.name.toLowerCase().endsWith('.heic')) {
        setIsConverting(true);
        
        // Create FormData to send the file to server for conversion
        const formData = new FormData();
        formData.append('image', file);
        
        // Call server endpoint to convert HEIC to JPEG
        const response = await fetch('/api/convert-heic', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Error al convertir la imagen HEIC');
        }
        
        // Get converted image as blob
        const convertedImageBlob = await response.blob();
        
        // Create a new file from the blob
        const convertedFile = new File(
          [convertedImageBlob], 
          file.name.replace('.heic', '.jpg'), 
          { type: 'image/jpeg' }
        );
        
        // Upload the converted file
        await uploadImage(convertedFile);
        setIsConverting(false);
      } else if (!file.type.startsWith('image/')) {
        // Check if it's an image
        toast({
          title: "Formato no soportado",
          description: "Por favor, sube un archivo de imagen (JPG, PNG, HEIC)",
          variant: "destructive",
        });
        return;
      } else {
        // Regular image upload
        await uploadImage(file);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error al procesar la imagen",
        description: "No se pudo procesar la imagen. Intenta con otro archivo.",
        variant: "destructive",
      });
      setIsConverting(false);
    }
  }, [uploadImage, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/heic': [],
      // Accept all files to handle HEIC which might not have proper MIME type
      '': ['.heic', '.HEIC']
    },
    maxFiles: 1
  });
  
  // Update isDragging state when drag state changes
  useEffect(() => {
    setIsDragging(isDragActive);
  }, [isDragActive]);

  return (
    <div>
      {!uploadedImage ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed ${isDragActive ? 'border-primary bg-primary/5' : 'border-neutral-300'} rounded-lg p-8 text-center cursor-pointer transition-colors`}
        >
          <input {...getInputProps()} />
          {isConverting ? (
            <div className="text-center py-4">
              <FaSpinner className="text-4xl text-primary mb-3 mx-auto animate-spin" />
              <h4 className="text-lg font-medium mb-2">Convirtiendo imagen HEIC</h4>
              <p className="text-neutral-500">Por favor espere mientras procesamos su imagen...</p>
            </div>
          ) : (
            <>
              <FaImages className="text-4xl text-neutral-400 mb-3 mx-auto" />
              <h4 className="text-lg font-medium mb-2">Arrastra o selecciona tus fotos</h4>
              <p className="text-neutral-500 mb-4 text-sm">Formatos soportados: JPG, PNG, HEIC • Tamaño máximo: 10MB</p>
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Seleccionar imágenes
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden shadow-md">
          <div className="relative">
            <img 
              src={imagePreview || ''} 
              alt="Imagen subida" 
              className="w-full h-auto rounded-lg"
            />
            
            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <div className="text-center">
                  <FaSpinner className="text-primary text-3xl mb-2 animate-spin mx-auto" />
                  <p className="text-neutral-800">Analizando imagen...</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-between">
            <Button 
              variant="outline" 
              onClick={clearImage}
              disabled={isAnalyzing}
            >
              Cambiar imagen
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => {
                if (!isAnalyzing) {
                  analyzeCurrentImage();
                }
              }}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Analizando..." : "Analizar imagen"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
