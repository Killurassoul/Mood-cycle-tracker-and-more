import React, { useState } from 'react';
import { SkincareProduct, CyclePhase } from '../types';
import { ProductThumbnail } from '../components/ProductThumbnails';
import { CYCLE_SKIN_TIPS } from '../data/skincareData';
import {
  Sun,
  Moon,
  Check,
  Plus,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Trash2,
  Heart
} from 'lucide-react';

interface RoutineViewProps {
  morningRoutine: SkincareProduct[];
  nightRoutine: SkincareProduct[];
  currentCyclePhase: CyclePhase;
  onUpdateMorning: (products: SkincareProduct[]) => void;
  onUpdateNight: (products: SkincareProduct[]) => void;
  onBack: () => void;
}

export const RoutineView: React.FC<RoutineViewProps> = ({
  morningRoutine,
  nightRoutine,
  currentCyclePhase,
  onUpdateMorning,
  onUpdateNight,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'morning' | 'night'>('morning');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New product form
  const [newCategory, setNewCategory] = useState<string>('Serum');
  const [newName, setNewName] = useState<string>('');
  const [newBrand, setNewBrand] = useState<string>('');
  const [newTip, setNewTip] = useState<string>('');

  const currentList = activeTab === 'morning' ? morningRoutine : nightRoutine;
  const setList = activeTab === 'morning' ? onUpdateMorning : onUpdateNight;

  const toggleComplete = (id: string) => {
    const updated = currentList.map(p => (p.id === id ? { ...p, completed: !p.completed } : p));
    setList(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = currentList.filter(p => p.id !== id);
    // Reindex step numbers
    const reindexed = updated.map((p, idx) => ({ ...p, stepNumber: idx + 1 }));
    setList(reindexed);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProd: SkincareProduct = {
      id: `prod-${Date.now()}`,
      stepNumber: currentList.length + 1,
      category: newCategory,
      name: newName,
      brand: newBrand || 'Custom',
      completed: false,
      timeOfDay: activeTab,
      tip: newTip || undefined
    };

    setList([...currentList, newProd]);
    setShowAddModal(false);
    setNewName('');
    setNewBrand('');
    setNewTip('');
  };

  const phaseAdvice = CYCLE_SKIN_TIPS[currentCyclePhase] || CYCLE_SKIN_TIPS.follicular;

  return (
    <div className="space-y-6 max-w-xl mx-auto animate-in fade-in duration-300 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-rose-100/70 hover:bg-rose-200 text-rose-600 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">
          My Routine
        </h2>

        <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200/60 text-rose-500 flex items-center justify-center">
          <Heart className="w-5 h-5 fill-rose-100" />
        </div>
      </div>

      {/* Cycle Syncing Pill Alert */}
      <div className="p-4 rounded-3xl bg-linear-to-r from-rose-100/90 via-pink-50 to-purple-100/70 border border-rose-200/70 flex items-start gap-3 shadow-2xs">
        <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <span className="font-extrabold text-rose-950 block">{phaseAdvice.title}</span>
          <p className="text-zinc-600 mt-0.5 leading-relaxed">{phaseAdvice.tip}</p>
        </div>
      </div>

      {/* Morning vs Night Tab Switcher (Matching screenshot exactly) */}
      <div className="p-1 rounded-full bg-rose-100/60 flex items-center gap-1 max-w-xs mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('morning')}
          className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'morning'
              ? 'bg-[#FF6584] text-white shadow-md shadow-rose-300/60 scale-[1.02]'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Morning</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('night')}
          className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'night'
              ? 'bg-[#FF6584] text-white shadow-md shadow-rose-300/60 scale-[1.02]'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Night</span>
        </button>
      </div>

      {/* Step List (matching the screenshot cards) */}
      <div className="space-y-3">
        {currentList.map(item => (
          <div
            key={item.id}
            className={`p-4 rounded-3xl bg-white border transition-all flex items-center justify-between gap-3 shadow-2xs ${
              item.completed ? 'border-rose-200/80' : 'border-zinc-200/70 hover:border-rose-200'
            }`}
          >
            {/* Step Number Badge */}
            <div className="w-7 h-7 rounded-full bg-rose-100/70 text-[#FF6584] font-black text-xs flex items-center justify-center shrink-0">
              {item.stepNumber}
            </div>

            {/* Product Thumbnail */}
            <ProductThumbnail category={item.category} size={44} />

            {/* Text description */}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-zinc-900 block truncate">
                {item.category}
              </span>
              <span className="text-[11px] text-zinc-500 block truncate font-medium">
                {item.name}
              </span>
            </div>

            {/* Day/Night subtle indicator */}
            <div className="text-amber-400 shrink-0">
              {item.timeOfDay === 'morning' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-purple-400" />
              )}
            </div>

            {/* Pink Circular Checkmark Toggle Button */}
            <button
              type="button"
              onClick={() => toggleComplete(item.id)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0 ${
                item.completed
                  ? 'bg-[#FF6584] text-white shadow-xs scale-105'
                  : 'border-2 border-rose-300 bg-white hover:border-rose-500 text-transparent'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        ))}
      </div>

      {/* Big Rounded CTA: + Add Product */}
      <button
        type="button"
        onClick={() => setShowAddModal(true)}
        className="w-full py-4 rounded-3xl bg-[#FF6584] hover:bg-[#FF4E72] active:scale-[0.99] text-white text-sm font-extrabold shadow-lg shadow-rose-300/50 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>+ Add Product</span>
      </button>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/25 backdrop-blur-xs">
          <form
            onSubmit={handleAddProduct}
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 space-y-4"
          >
            <h3 className="text-base font-extrabold text-zinc-900">
              Ajouter un soin à ma routine {activeTab === 'morning' ? 'matin' : 'soir'}
            </h3>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Étape / Catégorie :</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-semibold"
              >
                <option value="Cleanser">Nettoyant (Cleanser)</option>
                <option value="Toner">Lotion tonique (Toner)</option>
                <option value="Serum">Sérum traitant (Serum)</option>
                <option value="Moisturizer">Crème hydratante (Moisturizer)</option>
                <option value="Sunscreen">Protection solaire (Sunscreen)</option>
                <option value="Eye Cream">Contour des yeux</option>
                <option value="Night Mask">Masque de nuit</option>
                <option value="Lip Balm">Soin des lèvres</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Nom du produit :</label>
              <input
                type="text"
                required
                placeholder="Ex : The Ordinary Niacinamide 10%"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Marque (facultatif) :</label>
              <input
                type="text"
                placeholder="Ex : La Roche-Posay, Cetaphil..."
                value={newBrand}
                onChange={e => setNewBrand(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#FF6584] hover:bg-[#FF4E72] shadow-md shadow-rose-200"
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
