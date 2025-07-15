export interface FavoriteFolder {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  agentIds: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteAgent {
  agentId: string;
  folderId: string;
  addedAt: string;
}

export interface FavoritesData {
  folders: FavoriteFolder[];
  agents: FavoriteAgent[];
}

export const DEFAULT_FOLDER_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#8B5CF6', // purple
  '#F59E0B', // amber
  '#EF4444', // red
  '#06B6D4', // cyan
  '#EC4899', // pink
  '#84CC16', // lime
];

export const DEFAULT_FOLDER_ICONS = [
  '📁', '⭐', '💼', '🎯', '📊', '💡', '🔥', '🎨', '🚀', '💎'
]; 