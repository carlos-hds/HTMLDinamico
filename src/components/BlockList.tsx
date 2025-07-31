import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Edit3,
  Type,
  List,
  Image,
  Table,
  Minus as HorizontalRule,
  Anchor
} from 'lucide-react';
import { Block, BlockType, BLOCK_TYPE_LABELS } from '@/types/block';

interface BlockListProps {
  blocks: Block[];
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onRemove: (id: string) => void;
}

export const BlockList: React.FC<BlockListProps> = ({ 
  blocks, 
  onMoveUp, 
  onMoveDown, 
  onRemove 
}) => {
  const renderBlockIcon = (type: BlockType) => {
    switch (type) {
      case BlockType.H1:
      case BlockType.H2:
      case BlockType.H3:
        return <Type className="w-4 h-4 text-primary" />;
      case BlockType.PARAGRAPH:
        return <Type className="w-4 h-4 text-muted-foreground" />;
      case BlockType.LIST_ITEM:
        return <List className="w-4 h-4 text-accent" />;
      case BlockType.SEPARATOR:
        return <HorizontalRule className="w-4 h-4 text-muted-foreground" />;
      case BlockType.IMAGE_SMALL:
      case BlockType.IMAGE_MEDIUM:
      case BlockType.IMAGE_LARGE:
        return <Image className="w-4 h-4 text-info" />;
      case BlockType.TABLE:
        return <Table className="w-4 h-4 text-warning" />;
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  const getBlockPreview = (block: Block): string => {
    if (block.type === BlockType.SEPARATOR) return 'Separador horizontal';
    if (block.type === BlockType.TABLE && block.tableData) {
      return `Tabela (${block.tableData.headers.length} colunas, ${block.tableData.rows.length} linhas)`;
    }
    if ([BlockType.IMAGE_SMALL, BlockType.IMAGE_MEDIUM, BlockType.IMAGE_LARGE].includes(block.type)) {
      return 'Imagem carregada';
    }
    return block.content.length > 50 ? block.content.substring(0, 50) + '...' : block.content;
  };

  const applyFormatting = (content: string, formatting?: Block['formatting']): string => {
    if (!formatting) return content;
    
    let formatted = content;
    if (formatting.bold) formatted = `<strong>${formatted}</strong>`;
    if (formatting.italic) formatted = `<em>${formatted}</em>`;
    if (formatting.underline) formatted = `<u>${formatted}</u>`;
    if (formatting.color && formatting.color !== '#000000') {
      formatted = `<span style="color: ${formatting.color}">${formatted}</span>`;
    }
    
    return formatted;
  };

  if (blocks.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <Edit3 className="w-8 h-8 mx-auto mb-2" />
          <p>Nenhum bloco adicionado ainda.</p>
          <p className="text-sm">Comece criando seu primeiro bloco!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => (
        <Card key={block.id} className="p-4 hover:shadow-card transition-all duration-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {renderBlockIcon(block.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {BLOCK_TYPE_LABELS[block.type]}
                </Badge>
                {block.anchor && (
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    <Anchor className="w-3 h-3" />
                    {block.anchor}
                  </Badge>
                )}
              </div>
              
              <div 
                className="text-sm text-foreground/80 break-words"
                dangerouslySetInnerHTML={{ 
                  __html: applyFormatting(getBlockPreview(block), block.formatting) 
                }}
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMoveUp(block.id)}
                disabled={index === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMoveDown(block.id)}
                disabled={index === blocks.length - 1}
                className="h-8 w-8 p-0"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(block.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};