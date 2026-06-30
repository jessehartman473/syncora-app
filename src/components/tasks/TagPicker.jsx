import React, { useState } from 'react';
import { useTags } from '../../hooks/useTags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Loader2 } from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Indigo', value: '#6366f1', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  { name: 'Emerald', value: '#10b981', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { name: 'Amber', value: '#f59e0b', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { name: 'Rose', value: '#f43f5e', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  { name: 'Sky', value: '#0ea5e9', bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30' },
  { name: 'Violet', value: '#8b5cf6', bg: 'bg-violet-500/10 text-violet-400 border-violet-500/30' },
  { name: 'Fuchsia', value: '#d946ef', bg: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30' },
  { name: 'Orange', value: '#f97316', bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  { name: 'Teal', value: '#14b8a6', bg: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
];

export default function TagPicker({ selectedTags = [], onChange }) {
  // Hook returns { data: tagsArray, createTag, deleteTag, isLoading } safely
  const { data: allTags = [], createTag, deleteTag, isLoading } = useTags();
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].value);
  const [isCreating, setIsCreating] = useState(false);

  const safeSelectedTags = Array.isArray(selectedTags) ? selectedTags : [];
  const safeAllTags = Array.isArray(allTags) ? allTags : [];

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    setIsCreating(true);
    try {
      // 1. Save new tag definition directly to database
      const createdTag = await createTag(newTagName.trim(), selectedColor);
      
      // 2. Automatically select it for this task
      if (createdTag && createdTag.id) {
        onChange([...safeSelectedTags, createdTag.id]);
      }
      setNewTagName('');
    } catch (err) {
      console.error("Failed creating tag pill entity:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const toggleTagSelection = (tagId) => {
    if (safeSelectedTags.includes(tagId)) {
      onChange(safeSelectedTags.filter(id => id !== tagId));
    } else {
      onChange([...safeSelectedTags, tagId]);
    }
  };

  const handleDeleteTagDefinition = async (e, tagId) => {
    e.stopPropagation(); // Avoid triggering selection click handler
    try {
      await deleteTag(tagId);
      // Remove from current selection if it was active
      onChange(safeSelectedTags.filter(id => id !== tagId));
    } catch (err) {
      console.error("Failed to delete custom tag:", err);
    }
  };

  return (
    <div className="space-y-3">
      {/* 🛠️ Part 1: Input and Color Dot Selector */}
      <div className="flex gap-2 items-center">
        <Input
          placeholder="New tag title..."
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          className="flex-1 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs h-8"
        />
        
        {/* Color Palette Choice Selectors */}
        <div className="flex gap-1.5 px-1">
          {PRESET_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setSelectedColor(color.value)}
              className={`w-4 h-4 rounded-full border transition-transform ${
                selectedColor === color.value ? 'scale-125 border-white ring-1 ring-indigo-500' : 'border-transparent'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>

        <Button
          type="button"
          size="sm"
          onClick={handleCreateTag}
          disabled={isCreating || !newTagName.trim()}
          className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 gap-1"
        >
          {isCreating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />} Add
        </Button>
      </div>

      {/* 🛠️ Part 2: Active Available Re-usable Tags List */}
      {isLoading ? (
        <div className="text-[11px] text-slate-400 animate-pulse">Loading saved tags...</div>
      ) : (
        <div className="flex flex-wrap gap-1.5 min-h-[1.5rem]">
          {safeAllTags.map((tag) => {
            if (!tag) return null;
            const isSelected = safeSelectedTags.includes(tag.id);
            const colorMatch = PRESET_COLORS.find(c => c.value === tag.color) || PRESET_COLORS[0];

            return (
              <div
                key={tag.id}
                onClick={() => toggleTagSelection(tag.id)}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-medium cursor-pointer transition-all select-none ${
                  isSelected 
                    ? `${colorMatch.bg} border-current ring-1 ring-current opacity-100` 
                    : 'bg-slate-950 border-slate-800 text-slate-400 opacity-60 hover:opacity-90'
                }`}
              >
                <span>{tag.name}</span>
                
                {/* Micro Trash icon allows removal of saved tag definition */}
                <button
                  type="button"
                  onClick={(e) => handleDeleteTagDefinition(e, tag.id)}
                  className="ml-1 text-slate-500 hover:text-red-400 rounded-full transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            );
          })}

          {safeAllTags.length === 0 && (
            <div className="text-[11px] text-slate-500 italic">No reusable tags set up yet. Create one above!</div>
          )}
        </div>
      )}
    </div>
  );
}