import React, { useState } from 'react';
import { Lock, Delete, ShieldCheck, Heart } from 'lucide-react';

interface PinLockModalProps {
  savedPin: string;
  onUnlocked: () => void;
  discreteMode: boolean;
}

export const PinLockModal: React.FC<PinLockModalProps> = ({
  savedPin,
  onUnlocked,
  discreteMode
}) => {
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  const handleDigit = (digit: string) => {
    if (enteredPin.length < 4) {
      const next = enteredPin + digit;
      setEnteredPin(next);
      setHasError(false);

      if (next.length === 4) {
        if (next === savedPin) {
          onUnlocked();
        } else {
          setHasError(true);
          setTimeout(() => setEnteredPin(''), 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setEnteredPin(prev => prev.slice(0, -1));
    setHasError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-linear-to-b from-[#FFF0F4] via-[#FFE8EF] to-[#FFDDE6] text-zinc-800">
      <div className="w-full max-w-xs flex flex-col items-center text-center animate-in zoom-in-95 bg-white/80 backdrop-blur-md p-8 rounded-3xl border-2 border-rose-200/80 shadow-2xl shadow-rose-200">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 border border-rose-300/80 flex items-center justify-center text-[#FF5B84] mb-4 shadow-md shadow-rose-200">
          <Lock className="w-7 h-7" />
        </div>

        <h2 className="text-xl font-black tracking-tight text-zinc-900 mb-1">
          {discreteMode ? 'Espace Sécurisé' : 'Mood Verrouillé'}
        </h2>
        <p className="text-xs text-zinc-500 mb-6">
          Saisis ton code secret à 4 chiffres
        </p>

        {/* 4 Pin Bullets */}
        <div className={`flex items-center gap-4 mb-8 ${hasError ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3].map(i => {
            const filled = i < enteredPin.length;
            return (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  hasError
                    ? 'border-red-400 bg-red-400 scale-110'
                    : filled
                    ? 'border-[#FF5B84] bg-[#FF5B84] shadow-md shadow-rose-300 scale-110'
                    : 'border-rose-300 bg-white'
                }`}
              />
            );
          })}
        </div>

        {hasError && (
          <p className="text-xs font-bold text-red-500 mb-4 animate-in fade-in">
            Code incorrect. Veuillez réessayer.
          </p>
        )}

        {/* Keypad in Soft Light Pink theme */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className="h-14 rounded-2xl bg-white hover:bg-rose-50 active:scale-95 text-lg font-black text-zinc-800 transition-all border border-rose-200/80 shadow-xs flex items-center justify-center"
            >
              {num}
            </button>
          ))}

          <div className="h-14 flex items-center justify-center text-rose-300">
            <Heart className="w-5 h-5 fill-rose-100" />
          </div>

          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-white hover:bg-rose-50 active:scale-95 text-lg font-black text-zinc-800 transition-all border border-rose-200/80 shadow-xs flex items-center justify-center"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-rose-50 hover:bg-rose-100 active:scale-95 text-[#FF5B84] transition-all border border-rose-200 flex items-center justify-center"
            title="Effacer"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-6 text-[10px] text-zinc-400 font-medium">
          Stockage 100% local sur ton appareil
        </p>
      </div>
    </div>
  );
};
