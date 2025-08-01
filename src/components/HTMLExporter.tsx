import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Code, FileText } from 'lucide-react';
import { Block, BlockType } from '@/types/block';
import { useToast } from '@/hooks/use-toast';

interface HTMLExporterProps {
  blocks: Block[];
  logo?: string | null;
}

export const HTMLExporter: React.FC<HTMLExporterProps> = ({ blocks, logo }) => {
  const { toast } = useToast();

  const applyFormatting = (content: string, formatting?: Block['formatting']): string => {
    if (!formatting) return content;
    
    let formatted = content;
    if (formatting.bold) formatted = `<b>${formatted}</b>`;
    if (formatting.italic) formatted = `<i>${formatted}</i>`;
    if (formatting.underline) formatted = `<u>${formatted}</u>`;
    if (formatting.color && formatting.color !== '#000000') {
      formatted = `<span style="color: ${formatting.color}">${formatted}</span>`;
    }
    
    return formatted;
  };

  const renderBlock = (block: Block): string => {
    const formattedContent = applyFormatting(block.content, block.formatting);
    
    switch (block.type) {
      case BlockType.H1:
        return `<h1${block.anchor ? ` id="${block.anchor}"` : ''}>${formattedContent}</h1>`;
      case BlockType.H2:
        return `<h2${block.anchor ? ` id="${block.anchor}"` : ''}>${formattedContent}</h2>`;
      case BlockType.H3:
        return `<h3${block.anchor ? ` id="${block.anchor}"` : ''}>${formattedContent}</h3>`;
      case BlockType.PARAGRAPH:
        return `<p>${formattedContent}</p>`;
      case BlockType.LIST_ITEM:
        return `<ul><li>${formattedContent}</li></ul>`;
      case BlockType.SEPARATOR:
        return '<hr>';
      case BlockType.IMAGE_SMALL:
        return `<img src="${block.content}" class="img-small content-image" alt="Imagem">`;
      case BlockType.IMAGE_MEDIUM:
        return `<img src="${block.content}" class="img-medium content-image" alt="Imagem">`;
      case BlockType.IMAGE_LARGE:
        return `<img src="${block.content}" class="img-large content-image" alt="Imagem">`;
      case BlockType.TABLE:
        if (!block.tableData) return '';
        const headerRow = `<tr>${block.tableData.headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
        const bodyRows = block.tableData.rows.map(row => 
          `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
        ).join('');
        return `<table><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`;
      default:
        return '';
    }
  };

  const generateCompleteHTML = (): string => {
    const navigationItems = blocks
      .filter(block => 
        [BlockType.H1, BlockType.H2, BlockType.H3].includes(block.type) && 
        block.anchor
      )
      .map(block => ({
        text: block.content,
        anchor: block.anchor!
      }));

    const contentHTML = blocks.map(renderBlock).join('\n    ');
    
    const navigationHTML = navigationItems.length > 0 ? 
      navigationItems.map(item => `      <a href="#${item.anchor}" class="button">${item.text}</a>`).join('\n') : 
      '      <div class="nav-empty">Nenhuma navegação disponível</div>';

    const logoHTML = logo ? 
      `  <div class="nav-header">
    <img src="${logo}" alt="Logo">
  </div>` : '';

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documento HTML Dinâmico</title>
  <style>
    #sidebar {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 240px;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      background: linear-gradient(180deg, #fdfdfd, #f0f0f0);
      border-right: 1px solid #ddd;
      box-shadow: 2px 0 5px rgba(0,0,0,0.05);
      font-family: "Segoe UI", sans-serif;
      z-index: 1000;
      overflow-y: auto;
    }

    #sidebar .nav-header {
      text-align: center;
      padding: 2px 0 2px;
    }

    #sidebar .nav-header img {
      width: 220px;
      opacity: 0.9;
      transition: 0.3s;
    }
    #sidebar .nav-header img:hover {
      opacity: 1;
    }

    #sidebar .nav-body {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    #sidebar .nav-title {
      text-align: center;
      font-weight: bold;
      color: #333;
      margin: 10px 0;
      font-size: 1.1em;
      cursor: pointer;
      user-select: none;
    }

    #sidebar a.button,
    #sidebar button.button {
      display: block;
      width: 80%;
      margin: 4px auto;
      padding: 10px;
      text-align: center;
      border: none;
      border-radius: 8px;
      background-color: #10608F;
      color: white;
      font-weight: 500;
      text-decoration: none;
      transition: background 0.3s, transform 0.1s;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    #sidebar a.button:hover,
    #sidebar button.button:hover {
      background-color: #0e5078;
      transform: scale(1.03);
      cursor: pointer;
    }

    #sidebar button.button {
      background-color: #28a745;
      margin-top: 20px;
    }
    #sidebar button.button:hover {
      background-color: #218838;
    }

    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 20px;
      padding: 20px;
      background-color: #f4f4f4;
    }

    h1, h2, h3 {
      color: #333;
    }

    p {
      margin-bottom: 10px;
    }

    .container {
      max-width: 900px;
      margin: auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      margin-left: 260px;
    }

    .highlight {
      font-weight: bold;
      color: #007bff;
    }

    .warning {
      color: red;
      font-weight: bold;
    }

    .button {
      display: inline-block;
      padding: 10px 15px;
      margin: 10px 0;
      background: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }

    .button:hover {
      background: #0056b3;
    }

    .table-container {
      margin-top: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: left;
    }

    th {
      background: #007bff;
      color: white;
    }

    a {
      color: #007bff;
      text-decoration: none;
      font-weight: bold;
    }

    a:hover {
      text-decoration: underline;
    }

    .image-item {
      list-style-type: none;
      margin: 15px 0;
      text-align: center;
    }

    .content-image {
      display: block;
      max-width: 100%;
      height: auto;
      margin: 10px auto;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }

    .img-small { width: 250px; }
    .img-medium { width: 600px; }
    .img-large { width: 700px; }
    .img-extra-large { width: 850px; }
    .img-mega-extra-large { width: 1050px; }

    .footer {
      margin-top: 40px;
      padding: 20px 0;
      border-top: 1px solid #ddd;
      text-align: center;
    }

    .footer p {
      margin: 0;
      color: #666;
      font-size: 0.9em;
      font-style: italic;
    }

    @media (max-width: 768px) {
      #sidebar {
        position: relative;
        width: 100%;
        height: auto;
        border-right: none;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        border-bottom: 1px solid #ddd;
      }
      
      .container {
        margin-left: 0;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div id="sidebar">
${logoHTML}
    <div class="nav-body">
      <div class="nav-title" onclick="window.scrollTo({ top: 0, behavior: 'smooth' })">☰ Menu de Navegação</div>
${navigationHTML}
    </div>
  </div>
  
  <div class="container">
    ${contentHTML}
    
    <div class="footer">
      <p>Desenvolvido por: Carlos Silva</p>
    </div>
  </div>
</body>
</html>`;
  };

  const downloadHTML = () => {
    if (blocks.length === 0) {
      toast({
        title: "Erro ao exportar",
        description: "Adicione pelo menos um bloco antes de exportar.",
        variant: "destructive"
      });
      return;
    }

    const htmlContent = generateCompleteHTML();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'documento-html-dinamico.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "HTML exportado com sucesso!",
      description: "O arquivo foi baixado para seu dispositivo.",
      variant: "default"
    });
  };

  const copyToClipboard = () => {
    if (blocks.length === 0) {
      toast({
        title: "Erro ao copiar",
        description: "Adicione pelo menos um bloco antes de copiar.",
        variant: "destructive"
      });
      return;
    }

    const htmlContent = generateCompleteHTML();
    navigator.clipboard.writeText(htmlContent).then(() => {
      toast({
        title: "HTML copiado!",
        description: "O código HTML foi copiado para a área de transferência.",
        variant: "default"
      });
    }).catch(() => {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o código. Tente novamente.",
        variant: "destructive"
      });
    });
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
          <FileText className="w-5 h-5" />
          Exportar HTML
        </h3>
        <p className="text-sm text-muted-foreground">
          Baixe ou copie seu documento HTML completo
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          onClick={downloadHTML}
          disabled={blocks.length === 0}
          className="bg-gradient-success text-white hover:shadow-elegant transition-all duration-300"
        >
          <Download className="w-4 h-4 mr-2" />
          Baixar HTML
        </Button>

        <Button
          onClick={copyToClipboard}
          disabled={blocks.length === 0}
          variant="outline"
          className="hover:bg-muted transition-all duration-300"
        >
          <Code className="w-4 h-4 mr-2" />
          Copiar Código
        </Button>
      </div>

      {blocks.length === 0 && (
        <p className="text-xs text-center text-muted-foreground mt-4">
          Adicione pelo menos um bloco para habilitar a exportação
        </p>
      )}

      {blocks.length > 0 && (
        <div className="text-center pt-2 border-t border-border">
          <p className="text-xs text-success font-medium">
            ✓ {blocks.length} bloco{blocks.length > 1 ? 's' : ''} pronto{blocks.length > 1 ? 's' : ''} para exportação
          </p>
        </div>
      )}
    </Card>
  );
};