export interface Block {
  id: string;
  type: BlockType;
  content: string;
  anchor?: string;
  imageSize?: 'small' | 'medium' | 'large';
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  formatting?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
  };
}

export enum BlockType {
  H1 = 0,
  H2 = 1,
  H3 = 2,
  PARAGRAPH = 3,
  LIST_ITEM = 4,
  SEPARATOR = 5,
  IMAGE_SMALL = 6,
  IMAGE_MEDIUM = 7,
  IMAGE_LARGE = 8,
  TABLE = 9
}

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  [BlockType.H1]: 'Título Grande (H1)',
  [BlockType.H2]: 'Título Médio (H2)',
  [BlockType.H3]: 'Título Pequeno (H3)',
  [BlockType.PARAGRAPH]: 'Parágrafo',
  [BlockType.LIST_ITEM]: 'Item de Lista',
  [BlockType.SEPARATOR]: 'Separador Horizontal',
  [BlockType.IMAGE_SMALL]: 'Imagem Pequena',
  [BlockType.IMAGE_MEDIUM]: 'Imagem Média',
  [BlockType.IMAGE_LARGE]: 'Imagem Grande',
  [BlockType.TABLE]: 'Tabela Personalizada'
};