import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Edit3, 
  Eye, 
  Download, 
  Layers3,
  Smartphone,
  Monitor,
  Palette,
  Image as ImageIcon
} from 'lucide-react';
import { Block } from '@/types/block';
import { BlockEditor } from './BlockEditor';
import { BlockList } from './BlockList';
import { HTMLPreview } from './HTMLPreview';
import { HTMLExporter } from './HTMLExporter';
import { LogoUploader } from './LogoUploader';

export const HTMLDinamico: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [activeTab, setActiveTab] = useState('editor');
  const [logo, setLogo] = useState<string | null>(null);

  const handleAddBlock = (block: Block) => {
    setBlocks(prev => [...prev, block]);
  };

  const handleMoveUp = (id: string) => {
    setBlocks(prev => {
      const index = prev.findIndex(block => block.id === id);
      if (index <= 0) return prev;
      
      const newBlocks = [...prev];
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      return newBlocks;
    });
  };

  const handleMoveDown = (id: string) => {
    setBlocks(prev => {
      const index = prev.findIndex(block => block.id === id);
      if (index >= prev.length - 1) return prev;
      
      const newBlocks = [...prev];
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      return newBlocks;
    });
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
  };

  const getNavigationCount = () => {
    return blocks.filter(block => block.anchor).length;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-white border-b border-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">HTMLDinâmico</h1>
                <p className="text-sm text-muted-foreground">Criador Visual de HTML</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="hidden sm:flex items-center gap-1">
                <Layers3 className="w-3 h-3" />
                {blocks.length} blocos
              </Badge>
              <Badge variant="outline" className="hidden sm:flex items-center gap-1">
                <Palette className="w-3 h-3" />
                {getNavigationCount()} âncoras
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-card">
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Editor</span>
            </TabsTrigger>
            <TabsTrigger value="blocks" className="flex items-center gap-2">
              <Layers3 className="w-4 h-4" />
              <span className="hidden sm:inline">Blocos</span>
              {blocks.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {blocks.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TabsContent value="editor" className="mt-0">
                <div className="space-y-6">
                  <Card className="p-6 bg-white shadow-card">
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-primary" />
                      Criar Novo Bloco
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Selecione o tipo de conteúdo e configure as opções abaixo para adicionar ao seu documento HTML.
                    </p>
                    <BlockEditor onAddBlock={handleAddBlock} />
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="blocks" className="mt-0">
                <Card className="p-6 bg-white shadow-card">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Layers3 className="w-5 h-5 text-primary" />
                    Gerenciar Blocos
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Reorganize, edite ou remova os blocos do seu documento. Use as setas para alterar a ordem.
                  </p>
                  <BlockList
                    blocks={blocks}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onRemove={handleRemoveBlock}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <div className="space-y-6">
                  <Card className="p-6 bg-white shadow-card">
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary" />
                      Visualização do Documento
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Veja como seu documento HTML ficará quando exportado, incluindo a navegação lateral.
                    </p>
                  </Card>
                  <HTMLPreview blocks={blocks} logo={logo} />
                </div>
              </TabsContent>

              <TabsContent value="export" className="mt-0">
                <div className="space-y-6">
                  <Card className="p-6 bg-white shadow-card">
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Download className="w-5 h-5 text-primary" />
                      Exportar Documento
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Baixe seu documento HTML completo com estilo moderno e navegação lateral automática.
                    </p>
                  </Card>
                  <HTMLExporter blocks={blocks} logo={logo} />
                </div>
              </TabsContent>
            </div>

            {/* Sidebar - Statistics & Quick Info */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <LogoUploader logo={logo} onLogoChange={setLogo} />
                
                <Card className="p-6 bg-white shadow-card">
                  <h3 className="font-semibold text-foreground mb-4">📊 Estatísticas</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total de blocos:</span>
                      <Badge variant="secondary">{blocks.length}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Itens de navegação:</span>
                      <Badge variant="secondary">{getNavigationCount()}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Títulos (H1-H3):</span>
                      <Badge variant="secondary">
                        {blocks.filter(b => [0, 1, 2].includes(b.type)).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Imagens:</span>
                      <Badge variant="secondary">
                        {blocks.filter(b => [6, 7, 8].includes(b.type)).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tabelas:</span>
                      <Badge variant="secondary">
                        {blocks.filter(b => b.type === 9).length}
                      </Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-primary text-white">
                  <h3 className="font-semibold mb-4">🚀 Recursos</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Design responsivo automático</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Navegação lateral dinâmica</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Formatação rica de texto</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Imagens Base64 embutidas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Tabelas personalizáveis</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white shadow-card">
                  <h3 className="font-semibold text-foreground mb-4">💡 Dicas</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      <strong>IDs/Âncoras:</strong> Adicione IDs únicos aos títulos para criar navegação automática.
                    </p>
                    <p>
                      <strong>Imagens:</strong> Use diferentes tamanhos conforme o contexto - pequena para ícones, grande para banners.
                    </p>
                    <p>
                      <strong>Responsivo:</strong> Seu HTML será automaticamente otimizado para dispositivos móveis.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Desenvolvido por: <span className="font-medium text-foreground">Carlos Silva</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};