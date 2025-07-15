import { useState, useEffect, useCallback } from 'react';
import { FavoriteFolder, FavoriteAgent, FavoritesData, DEFAULT_FOLDER_COLORS, DEFAULT_FOLDER_ICONS } from '@/types/favorites';
import { isLoggedIn, getUserId } from '@/utils/auth';

const STORAGE_KEY_PREFIX = 'aiagent-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritesData>({
    folders: [],
    agents: []
  });
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  // Check login status and load favorites
  useEffect(() => {
    const checkLoginAndLoad = () => {
      const loginStatus = isLoggedIn();
      setLoggedIn(loginStatus);
      
      if (!loginStatus) {
        setFavorites({ folders: [], agents: [] });
        setLoading(false);
        return;
      }

      // Load favorites for logged in user
      try {
        const userId = getUserId();
        if (userId) {
          const storageKey = `${STORAGE_KEY_PREFIX}-${userId}`;
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            const parsed = JSON.parse(saved);
            setFavorites(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginAndLoad();

    // Listen for storage changes (login/logout)
    const handleStorageChange = () => {
      checkLoginAndLoad();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save favorites to localStorage
  const saveFavorites = useCallback((data: FavoritesData) => {
    if (!isLoggedIn()) return;
    
    try {
      const userId = getUserId();
      if (userId) {
        const storageKey = `${STORAGE_KEY_PREFIX}-${userId}`;
        localStorage.setItem(storageKey, JSON.stringify(data));
        setFavorites(data);
      }
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, []);

  // Create a new folder
  const createFolder = useCallback((name: string, description?: string, color?: string, icon?: string) => {
    if (!isLoggedIn()) return null;

    const newFolder: FavoriteFolder = {
      id: `folder-${Date.now()}`,
      name,
      description,
      color: color || DEFAULT_FOLDER_COLORS[Math.floor(Math.random() * DEFAULT_FOLDER_COLORS.length)],
      icon: icon || DEFAULT_FOLDER_ICONS[Math.floor(Math.random() * DEFAULT_FOLDER_ICONS.length)],
      agentIds: [],
      order: favorites.folders.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newData = {
      ...favorites,
      folders: [...favorites.folders, newFolder]
    };
    saveFavorites(newData);
    return newFolder;
  }, [favorites, saveFavorites]);

  // Update a folder
  const updateFolder = useCallback((folderId: string, updates: Partial<FavoriteFolder>) => {
    if (!isLoggedIn()) return;

    const newData = {
      ...favorites,
      folders: favorites.folders.map(folder => 
        folder.id === folderId 
          ? { ...folder, ...updates, updatedAt: new Date().toISOString() }
          : folder
      )
    };
    saveFavorites(newData);
  }, [favorites, saveFavorites]);

  // Delete a folder
  const deleteFolder = useCallback((folderId: string) => {
    if (!isLoggedIn()) return;

    const newData = {
      folders: favorites.folders.filter(folder => folder.id !== folderId),
      agents: favorites.agents.filter(agent => agent.folderId !== folderId)
    };
    saveFavorites(newData);
  }, [favorites, saveFavorites]);

  // Add agent to folder
  const addAgentToFolder = useCallback((agentId: string, folderId: string) => {
    if (!isLoggedIn()) return;

    // Check if agent is already in the folder
    const exists = favorites.agents.some(
      fav => fav.agentId === agentId && fav.folderId === folderId
    );
    
    if (exists) return;

    const newAgent: FavoriteAgent = {
      agentId,
      folderId,
      addedAt: new Date().toISOString()
    };

    const newData = {
      ...favorites,
      agents: [...favorites.agents, newAgent],
      folders: favorites.folders.map(folder =>
        folder.id === folderId
          ? { ...folder, agentIds: [...folder.agentIds, agentId] }
          : folder
      )
    };
    saveFavorites(newData);
  }, [favorites, saveFavorites]);

  // Remove agent from folder
  const removeAgentFromFolder = useCallback((agentId: string, folderId: string) => {
    if (!isLoggedIn()) return;

    const newData = {
      ...favorites,
      agents: favorites.agents.filter(
        agent => !(agent.agentId === agentId && agent.folderId === folderId)
      ),
      folders: favorites.folders.map(folder =>
        folder.id === folderId
          ? { ...folder, agentIds: folder.agentIds.filter(id => id !== agentId) }
          : folder
      )
    };
    saveFavorites(newData);
  }, [favorites, saveFavorites]);

  // Remove agent from all folders
  const removeAgentFromAllFolders = useCallback((agentId: string) => {
    if (!isLoggedIn()) return;

    const newData = {
      ...favorites,
      agents: favorites.agents.filter(agent => agent.agentId !== agentId),
      folders: favorites.folders.map(folder => ({
        ...folder,
        agentIds: folder.agentIds.filter(id => id !== agentId)
      }))
    };
    saveFavorites(newData);
  }, [favorites, saveFavorites]);

  // Check if agent is in any folder
  const isAgentFavorite = useCallback((agentId: string) => {
    if (!isLoggedIn()) return false;
    return favorites.agents.some(agent => agent.agentId === agentId);
  }, [favorites.agents]);

  // Get folders containing an agent
  const getFoldersContainingAgent = useCallback((agentId: string) => {
    if (!isLoggedIn()) return [];
    
    const folderIds = favorites.agents
      .filter(agent => agent.agentId === agentId)
      .map(agent => agent.folderId);
    
    return favorites.folders.filter(folder => folderIds.includes(folder.id));
  }, [favorites]);

  // Get agents in a folder
  const getAgentsInFolder = useCallback((folderId: string) => {
    if (!isLoggedIn()) return [];
    
    return favorites.agents
      .filter(agent => agent.folderId === folderId)
      .map(agent => agent.agentId);
  }, [favorites.agents]);

  return {
    favorites,
    loading,
    loggedIn,
    createFolder,
    updateFolder,
    deleteFolder,
    addAgentToFolder,
    removeAgentFromFolder,
    removeAgentFromAllFolders,
    isAgentFavorite,
    getFoldersContainingAgent,
    getAgentsInFolder
  };
} 