/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/useAuth';
import { ProductivityService } from '../services/productivityService';
import { ProductivityNote } from '../types';

export function useNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<ProductivityNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotes = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await ProductivityService.getNotes(user.id);
    setNotes(data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async (note: Partial<ProductivityNote>) => {
    if (!user?.id) return null;
    const created = await ProductivityService.createNote(user.id, note);
    setNotes((prev) => [created, ...prev]);
    return created;
  };

  const updateNote = async (id: string, updates: Partial<ProductivityNote>) => {
    if (!user?.id) return;
    await ProductivityService.updateNote(user.id, id, updates);
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n))
    );
  };

  const deleteNote = async (id: string) => {
    if (!user?.id) return;
    await ProductivityService.deleteNote(user.id, id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const togglePin = async (id: string, currentPinned: boolean) => {
    await updateNote(id, { isPinned: !currentPinned });
  };

  const toggleFavorite = async (id: string, currentFav: boolean) => {
    await updateNote(id, { isFavorite: !currentFav });
  };

  return {
    notes,
    loading,
    refetch: fetchNotes,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleFavorite
  };
}
