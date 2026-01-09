
import React from 'react';
import { ArrowLeft, Construction } from 'lucide-react';

interface OtherAppProps {
  onBack: () => void;
}

const OtherApp: React.FC<OtherAppProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-lg w-full border border-slate-100">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Construction size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight uppercase">Zweite App</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Hier kannst du den Code deiner zweiten Anwendung einfügen. 
          Aktuell ist dies ein Platzhalter, bis du mir die Dateien schickst.
        </p>
        <button 
          onClick={onBack}
          className="flex items-center justify-center gap-2 w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-black transition-all"
        >
          <ArrowLeft size={18} /> Zurück zur Auswahl
        </button>
      </div>
    </div>
  );
};

export default OtherApp;
