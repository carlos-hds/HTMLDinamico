import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Block, BlockType } from '@/types/block';

interface HTMLPreviewProps {
  blocks: Block[];
  logo?: string | null;
}

export const HTMLPreview: React.FC<HTMLPreviewProps> = ({ blocks, logo }) => {
  const generateNavigationItems = (): { text: string; anchor: string }[] => {
    return blocks
      .filter(block => 
        [BlockType.H1, BlockType.H2, BlockType.H3].includes(block.type) && 
        block.anchor
      )
      .map(block => ({
        text: block.content,
        anchor: block.anchor!
      }));
  };

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
    const navigationItems = generateNavigationItems();
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
      padding-left: 40px; 
      padding-right: 20px;      
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);      
      margin-left: 280px;
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
  </div>
</body>
</html>`;
  };

  const navigationItems = generateNavigationItems();

  return (
    <div className="space-y-4">
      {/* Navigation Preview */}
      {navigationItems.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            📋 Navegação Gerada
          </h3>
          <div className="space-y-1">
            {navigationItems.map((item, index) => (
              <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                <Badge variant="outline" className="text-xs">#{item.anchor}</Badge>
                {item.text}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Content Preview */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          👁️ Preview do Conteúdo
        </h3>
        
        {blocks.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>Nenhum conteúdo para visualizar ainda.</p>
            <p className="text-sm">Adicione blocos para ver o preview!</p>
          </div>
        ) : (
          <div 
            className="prose prose-sm max-w-none space-y-4"
            dangerouslySetInnerHTML={{ 
              __html: blocks.map(renderBlock).join('\n') 
            }}
            style={{
              // Inline styles para simular o resultado final
              fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
            }}
          />
        )}
      </Card>

      {/* HTML Code Preview */}
      <Card className="p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          💻 HTML Gerado
        </h3>
        <div className="bg-muted rounded-lg p-4 overflow-x-auto">
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
            {generateCompleteHTML()}
          </pre>
        </div>
      </Card>
    </div>
  );
};