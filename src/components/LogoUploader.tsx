import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LogoUploaderProps {
  logo: string | null;
  onLogoChange: (logoBase64: string | null) => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({ logo, onLogoChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      toast({
        title: "Formato inválido",
        description: "Apenas imagens PNG e JPEG são aceitas.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 5MB.",
        variant: "destructive"
      });
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      onLogoChange(base64);
      toast({
        title: "Logo carregado com sucesso!",
        description: "A imagem será exibida no topo da sidebar.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erro ao carregar imagem",
        description: "Tente novamente com outro arquivo.",
        variant: "destructive"
      });
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveLogo = () => {
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: "Logo removido",
      description: "O logo foi removido do documento.",
      variant: "default"
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Logo do Documento
        </h3>
        <p className="text-sm text-muted-foreground">
          Adicione um logo que aparecerá no topo da sidebar
        </p>
      </div>

      {logo ? (
        <div className="space-y-4">
          <div className="relative bg-muted rounded-lg p-4 text-center">
            <img 
              src={logo} 
              alt="Logo preview" 
              className="max-w-full max-h-32 mx-auto rounded-md shadow-sm"
            />
            <Button
              onClick={handleRemoveLogo}
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={triggerFileInput}
            variant="outline"
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Alterar Logo
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary hover:bg-muted/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Clique para selecionar ou arraste uma imagem
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPEG até 5MB
              </p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </Card>
  );
};