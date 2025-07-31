import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Block, BlockType } from '@/types/block';

interface HTMLPreviewProps {
  blocks: Block[];
}

export const HTMLPreview: React.FC<HTMLPreviewProps> = ({ blocks }) => {
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
      navigationItems.map(item => `    <a href="#${item.anchor}">${item.text}</a>`).join('\n') : 
      '    <div class="nav-empty">Nenhuma navegação disponível</div>';

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documento HTML Dinâmico</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #ffffff;
    }
    
    #sidebar {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 240px;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      background: linear-gradient(180deg, #fdfdfd, #f0f0f0);
      border-right: 1px solid #ddd;
      box-shadow: 2px 0 5px rgba(0,0,0,0.05);
      overflow-y: auto;
      padding: 20px;
      z-index: 100;
    }
    
    .nav-title {
      font-size: 18px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
    }
    
    #sidebar a {
      display: block;
      padding: 8px 12px;
      margin: 4px 0;
      color: #4a5568;
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.2s ease;
      font-size: 14px;
    }
    
    #sidebar a:hover {
      background: #e2e8f0;
      color: #2d3748;
      transform: translateX(4px);
    }
    
    .nav-empty {
      padding: 20px 12px;
      color: #a0aec0;
      font-style: italic;
      text-align: center;
      font-size: 14px;
    }
    
    .container {
      margin-left: 260px;
      padding: 40px;
      background: white;
      min-height: 100vh;
    }
    
    h1, h2, h3 {
      margin: 24px 0 16px 0;
      color: #2d3748;
      line-height: 1.2;
    }
    
    h1 {
      font-size: 2.25rem;
      font-weight: 700;
      border-bottom: 3px solid #667eea;
      padding-bottom: 8px;
    }
    
    h2 {
      font-size: 1.875rem;
      font-weight: 600;
      border-bottom: 2px solid #a78bfa;
      padding-bottom: 6px;
    }
    
    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #4c51bf;
    }
    
    p {
      margin: 16px 0;
      color: #4a5568;
    }
    
    ul {
      margin: 16px 0;
      padding-left: 24px;
    }
    
    li {
      margin: 8px 0;
      color: #4a5568;
    }
    
    hr {
      margin: 32px 0;
      border: none;
      height: 2px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 1px;
    }
    
    .img-small {
      width: 250px;
      max-width: 100%;
    }
    
    .img-medium {
      width: 450px;
      max-width: 100%;
    }
    
    .img-large {
      width: 700px;
      max-width: 100%;
    }
    
    .content-image {
      display: block;
      margin: 20px auto;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    th, td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    
    th {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    td {
      color: #4a5568;
    }
    
    tr:hover {
      background: #f7fafc;
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
      
      h1 {
        font-size: 1.875rem;
      }
      
      h2 {
        font-size: 1.5rem;
      }
      
      h3 {
        font-size: 1.25rem;
      }
      
      .img-small,
      .img-medium,
      .img-large {
        width: 100%;
      }
      
      table {
        font-size: 14px;
      }
      
      th, td {
        padding: 8px 12px;
      }
    }
  </style>
</head>
<body>
  <div id="sidebar">
    <div class="nav-title">Navegação</div>
${navigationHTML}
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