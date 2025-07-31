import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  Palette, 
  Upload, 
  Plus, 
  Minus,
  Type,
  List,
  Image,
  Table,
  Minus as HorizontalRule
} from 'lucide-react';
import { Block, BlockType, BLOCK_TYPE_LABELS } from '@/types/block';

interface BlockEditorProps {
  onAddBlock: (block: Block) => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({ onAddBlock }) => {
  const [selectedType, setSelectedType] = useState<BlockType>(BlockType.PARAGRAPH);
  const [content, setContent] = useState('');
  const [anchor, setAnchor] = useState('');
  const [formatting, setFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
    color: '#000000'
  });
  const [tableHeaders, setTableHeaders] = useState(['Coluna 1', 'Coluna 2']);
  const [tableRows, setTableRows] = useState([['Dados 1', 'Dados 2']]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isHeading = [BlockType.H1, BlockType.H2, BlockType.H3].includes(selectedType);
  const isImage = [BlockType.IMAGE_SMALL, BlockType.IMAGE_MEDIUM, BlockType.IMAGE_LARGE].includes(selectedType);
  const isTable = selectedType === BlockType.TABLE;
  const isSeparator = selectedType === BlockType.SEPARATOR;

  const validateAnchor = (value: string): boolean => {
    return /^[a-zA-Z0-9_-]*$/.test(value);
  };

  const handleAnchorChange = (value: string) => {
    if (validateAnchor(value)) {
      setAnchor(value);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setContent(base64);
    };
    reader.readAsDataURL(file);
  };

  const addTableColumn = () => {
    setTableHeaders([...tableHeaders, `Coluna ${tableHeaders.length + 1}`]);
    setTableRows(tableRows.map(row => [...row, '']));
  };

  const removeTableColumn = (index: number) => {
    if (tableHeaders.length <= 1) return;
    setTableHeaders(tableHeaders.filter((_, i) => i !== index));
    setTableRows(tableRows.map(row => row.filter((_, i) => i !== index)));
  };

  const addTableRow = () => {
    setTableRows([...tableRows, new Array(tableHeaders.length).fill('')]);
  };

  const removeTableRow = (index: number) => {
    if (tableRows.length <= 1) return;
    setTableRows(tableRows.filter((_, i) => i !== index));
  };

  const updateTableHeader = (index: number, value: string) => {
    const newHeaders = [...tableHeaders];
    newHeaders[index] = value;
    setTableHeaders(newHeaders);
  };

  const updateTableCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...tableRows];
    newRows[rowIndex][colIndex] = value;
    setTableRows(newRows);
  };

  const handleAddBlock = () => {
    if (!isSeparator && !content.trim() && !isTable) return;

    const imageSize = selectedType === BlockType.IMAGE_SMALL ? 'small' :
                     selectedType === BlockType.IMAGE_MEDIUM ? 'medium' :
                     selectedType === BlockType.IMAGE_LARGE ? 'large' : undefined;

    const block: Block = {
      id: Date.now().toString(),
      type: selectedType,
      content: isTable ? '' : content,
      anchor: isHeading && anchor ? anchor : undefined,
      imageSize,
      tableData: isTable ? { headers: tableHeaders, rows: tableRows } : undefined,
      formatting: !isSeparator && !isImage && !isTable ? formatting : undefined
    };

    onAddBlock(block);
    
    // Reset form
    setContent('');
    setAnchor('');
    setFormatting({ bold: false, italic: false, underline: false, color: '#000000' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderTypeIcon = (type: BlockType) => {
    switch (type) {
      case BlockType.H1:
      case BlockType.H2:
      case BlockType.H3:
        return <Type className="w-4 h-4" />;
      case BlockType.PARAGRAPH:
        return <Type className="w-4 h-4" />;
      case BlockType.LIST_ITEM:
        return <List className="w-4 h-4" />;
      case BlockType.SEPARATOR:
        return <HorizontalRule className="w-4 h-4" />;
      case BlockType.IMAGE_SMALL:
      case BlockType.IMAGE_MEDIUM:
      case BlockType.IMAGE_LARGE:
        return <Image className="w-4 h-4" />;
      case BlockType.TABLE:
        return <Table className="w-4 h-4" />;
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  return (
    <Card className="p-6 space-y-6 shadow-card">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Tipo de Bloco
          </label>
          <Select 
            value={selectedType.toString()} 
            onValueChange={(value) => setSelectedType(parseInt(value) as BlockType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(BLOCK_TYPE_LABELS).map(([type, label]) => (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center gap-2">
                    {renderTypeIcon(parseInt(type) as BlockType)}
                    {label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isHeading && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              ID/Âncora (opcional)
            </label>
            <Input
              placeholder="ex: introducao"
              value={anchor}
              onChange={(e) => handleAnchorChange(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Apenas letras, números, _ e -
            </p>
          </div>
        )}

        {!isSeparator && !isImage && !isTable && (
          <>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Conteúdo
              </label>
              <Textarea
                placeholder="Digite o conteúdo aqui..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Formatação
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={formatting.bold ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormatting(prev => ({ ...prev, bold: !prev.bold }))}
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant={formatting.italic ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormatting(prev => ({ ...prev, italic: !prev.italic }))}
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant={formatting.underline ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormatting(prev => ({ ...prev, underline: !prev.underline }))}
                >
                  <Underline className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="color"
                    value={formatting.color}
                    onChange={(e) => setFormatting(prev => ({ ...prev, color: e.target.value }))}
                    className="w-8 h-8 border border-border rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {isImage && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Imagem
            </label>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Selecionar Imagem
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {content && (
                <div className="text-sm text-success">
                  ✓ Imagem carregada
                </div>
              )}
            </div>
          </div>
        )}

        {isTable && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  Cabeçalhos da Tabela
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTableColumn}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid gap-2">
                {tableHeaders.map((header, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={header}
                      onChange={(e) => updateTableHeader(index, e.target.value)}
                      placeholder={`Cabeçalho ${index + 1}`}
                    />
                    {tableHeaders.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTableColumn(index)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  Dados da Tabela
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTableRow}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {tableRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2">
                    <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${tableHeaders.length}, 1fr)` }}>
                      {row.map((cell, colIndex) => (
                        <Input
                          key={colIndex}
                          value={cell}
                          onChange={(e) => updateTableCell(rowIndex, colIndex, e.target.value)}
                          placeholder={`Linha ${rowIndex + 1}, Col ${colIndex + 1}`}
                        />
                      ))}
                    </div>
                    {tableRows.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTableRow(rowIndex)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Button 
        onClick={handleAddBlock} 
        className="w-full bg-gradient-primary text-primary-foreground hover:shadow-elegant transition-all duration-300"
        disabled={!isSeparator && !content.trim() && !isTable}
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Bloco
      </Button>
    </Card>
  );
};