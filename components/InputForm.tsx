
import React, { useState } from 'react';
import { AppState, LineItem, INSOLVENCY_PRESETS, generateRandomSuffix } from '../types';
import { Download, Wand2, Plus, Trash, RotateCw, CreditCard, Receipt, Briefcase } from 'lucide-react';

interface InputFormProps {
  data: AppState;
  onChange: (newData: AppState) => void;
  onSmartImport: (text: string) => Promise<void>;
  isImporting: boolean;
  onDownload: (type: 'invoice' | 'confirmation', format: 'pdf' | 'jpg') => void;
}

export const InputForm: React.FC<InputFormProps> = ({ data, onChange, onSmartImport, isImporting, onDownload }) => {
  const [importText, setImportText] = useState('');
  const [activeTab, setActiveTab] = useState<'client' | 'items' | 'legal' | 'bank'>('client');

  const updateClient = (field: keyof typeof data.client, value: string) => {
    onChange({ ...data, client: { ...data.client, [field]: value } });
  };

  const updateInsolvency = (field: keyof typeof data.insolvency, value: string) => {
    onChange({ ...data, insolvency: { ...data.insolvency, [field]: value } });
  };

  const updateBank = (field: keyof typeof data.senderBank, value: string) => {
    onChange({ ...data, senderBank: { ...data.senderBank, [field]: value } });
  };

  const handleInvoiceNrChange = (val: string) => {
    const suffix = val.includes('-') ? val.split('-')[1] : val;
    onChange({
      ...data,
      invoiceNr: val,
      client: { ...data.client, customerNr: suffix }
    });
  };

  const generateNewId = () => {
    const suffix = generateRandomSuffix();
    const newId = `2025-${suffix}`;
    onChange({
      ...data,
      invoiceNr: newId,
      client: { ...data.client, customerNr: suffix }
    });
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      name: 'Neues Verwertungslos',
      articleNr: Math.floor(10000 + Math.random() * 90000).toString(),
      quantity: 1,
      unitPrice: 0,
      notes: ''
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  return (
    <div className="h-full overflow-y-auto p-5 bg-white no-scrollbar">
      <div className="mb-8">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
           <Wand2 className="w-4 h-4 text-brand-gold" /> KI Smart Import
        </h2>
        <div className="relative">
          <textarea
            className="w-full p-3 border border-slate-100 bg-slate-50/50 rounded-xl text-sm mb-3 focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none transition-all placeholder:text-slate-300 min-h-[100px]"
            placeholder="Kunden- oder Positionsdaten hier einfügen..."
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
        </div>
        <button
          onClick={() => onSmartImport(importText)}
          disabled={isImporting || !importText}
          className="w-full bg-brand-navy text-white py-3 rounded-xl hover:bg-black transition-all disabled:opacity-50 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-brand-navy/10 flex items-center justify-center gap-2"
        >
          {isImporting ? <RotateCw className="animate-spin w-4 h-4" /> : 'KI Extraktion starten'}
        </button>
      </div>

      <div className="flex gap-1 mb-6 p-1 bg-slate-50 rounded-xl border border-slate-100">
         {[
           {id: 'client', label: 'Kunde'},
           {id: 'items', label: 'Posten'},
           {id: 'legal', label: 'Verfahren'},
           {id: 'bank', label: 'Bank/Tax'}
         ].map((tab) => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)} 
             className={`flex-1 py-2 text-[9px] uppercase font-black tracking-wider rounded-lg transition-all duration-300 ${activeTab === tab.id ? 'bg-white text-brand-navy shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
           >
             {tab.label}
           </button>
         ))}
      </div>

      <div className="min-h-[300px]">
        {activeTab === 'client' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 gap-3">
              <div>
                 <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5 tracking-wider">Rg-Nr.</label>
                 <div className="flex gap-1">
                   <input type="text" value={data.invoiceNr} onChange={(e) => handleInvoiceNrChange(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-bold text-brand-navy"/>
                   <button onClick={generateNewId} className="bg-slate-100 p-2 rounded-lg hover:bg-slate-200 transition-colors text-slate-500"><RotateCw size={14} /></button>
                 </div>
              </div>
              <div>
                 <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5 tracking-wider">Datum</label>
                 <input type="text" value={data.date} onChange={(e) => onChange({...data, date: e.target.value})} className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium"/>
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5 tracking-wider">Empfängerdaten</label>
              <input type="text" value={data.client.company} onChange={(e) => updateClient('company', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-brand-navy focus:bg-white" placeholder="Firma / Masseverwalter"/>
              <input type="text" value={data.client.name} onChange={(e) => updateClient('name', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white" placeholder="Ansprechpartner"/>
              <input type="text" value={data.client.addressLine1} onChange={(e) => updateClient('addressLine1', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white" placeholder="Straße, Hausnr."/>
              <input type="text" value={data.client.addressLine2} onChange={(e) => updateClient('addressLine2', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white" placeholder="PLZ Ort"/>
              <input type="text" value={data.client.vatId} onChange={(e) => updateClient('vatId', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-mono focus:bg-white" placeholder="USt-IdNr. (Optional)"/>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5 tracking-wider">Lieferanschrift (Abweichend)</label>
              <textarea value={data.client.deliveryAddress} onChange={(e) => updateClient('deliveryAddress', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white min-h-[60px]" placeholder="Leer lassen falls identisch"/>
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {data.items.map((item, idx) => (
              <div key={item.id} className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 relative group">
                <button onClick={() => onChange({...data, items: data.items.filter((_, i) => i !== idx)})} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"><Trash size={14} /></button>
                <input type="text" value={item.name} onChange={(e) => {
                  const newItems = [...data.items];
                  newItems[idx].name = e.target.value;
                  onChange({...data, items: newItems});
                }} className="w-[90%] mb-1.5 p-1 bg-transparent border-none text-[11px] font-bold text-brand-navy focus:ring-0" placeholder="Bezeichnung"/>
                <div className="grid grid-cols-2 gap-2">
                   <div className="bg-white rounded-lg border border-slate-100 p-1.5 flex items-center">
                     <span className="text-[9px] font-black text-slate-300 mr-2">QTY</span>
                     <input type="number" value={item.quantity} onChange={(e) => {
                       const newItems = [...data.items];
                       newItems[idx].quantity = parseFloat(e.target.value) || 0;
                       onChange({...data, items: newItems});
                     }} className="w-full bg-transparent border-none p-0 text-xs font-bold text-slate-700 focus:ring-0"/>
                   </div>
                   <div className="bg-white rounded-lg border border-slate-100 p-1.5 flex items-center">
                     <span className="text-[9px] font-black text-slate-300 mr-2">€</span>
                     <input type="number" value={item.unitPrice} onChange={(e) => {
                       const newItems = [...data.items];
                       newItems[idx].unitPrice = parseFloat(e.target.value) || 0;
                       onChange({...data, items: newItems});
                     }} className="w-full bg-transparent border-none p-0 text-xs font-bold text-slate-700 text-right focus:ring-0"/>
                   </div>
                </div>
              </div>
            ))}
            <button onClick={addItem} className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-50 hover:border-brand-gold hover:text-brand-gold transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
               <Plus size={16}/> Neue Position hinzufügen
            </button>
          </div>
        )}

        {activeTab === 'legal' && (
          <div className="space-y-5 animate-in fade-in duration-300">
             <div className="bg-brand-navy p-4 rounded-2xl shadow-xl shadow-brand-navy/10">
               <label className="block text-[10px] uppercase font-black text-slate-400 mb-3 tracking-widest flex items-center gap-2">
                 <Briefcase size={14} className="text-brand-gold"/> Insolvenz-Verfahren
               </label>
               <select 
                 className="w-full p-2.5 bg-white/10 border border-white/10 rounded-xl text-[11px] mb-4 text-white font-bold outline-none hover:bg-white/20 transition-all cursor-pointer truncate"
                 onChange={(e) => {
                   const preset = INSOLVENCY_PRESETS.find(p => p.id === e.target.value);
                   if (preset) onChange({...data, insolvency: preset});
                 }}
                 value={data.insolvency.id}
               >
                 {INSOLVENCY_PRESETS.map(p => <option key={p.id} value={p.id} className="text-slate-800 font-medium">{p.debtorName} ({p.proceedingNr})</option>)}
               </select>
               <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/40 uppercase">Aktenzeichen</label>
                    <input type="text" value={data.insolvency.proceedingNr} onChange={(e) => updateInsolvency('proceedingNr', e.target.value)} className="w-full p-2 bg-white/5 border border-white/5 rounded-lg text-xs text-white focus:bg-white/10 outline-none"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/40 uppercase">Schuldnerin</label>
                    <input type="text" value={data.insolvency.debtorName} onChange={(e) => updateInsolvency('debtorName', e.target.value)} className="w-full p-2 bg-white/5 border border-white/5 rounded-lg text-xs text-white focus:bg-white/10 outline-none"/>
                  </div>
               </div>
             </div>
             <div className="p-4 border rounded-2xl bg-white shadow-sm border-slate-100">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Autorisierter Mitarbeiter (Bearbeiter)</label>
                <input type="text" value={data.senderLegal.ceo} onChange={(e) => onChange({...data, senderLegal: {...data.senderLegal, ceo: e.target.value}})} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black text-brand-navy focus:bg-white outline-none"/>
             </div>
          </div>
        )}

        {activeTab === 'bank' && (
          <div className="space-y-5 animate-in fade-in duration-300">
             <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
               <label className="block text-[10px] uppercase font-black text-slate-400 mb-3 tracking-widest flex items-center gap-2">
                  <Receipt size={14} className="text-brand-gold"/> Besteuerung & Zone
               </label>
               <div className="flex gap-2">
                 <button onClick={() => onChange({...data, taxRegion: 'de'})} className={`flex-1 py-3 rounded-xl border text-[10px] font-black transition-all shadow-sm tracking-wider ${data.taxRegion === 'de' ? 'bg-brand-navy text-white border-brand-navy scale-[1.02] shadow-brand-navy/20' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'}`}>19% INLAND</button>
                 <button onClick={() => onChange({...data, taxRegion: 'eu'})} className={`flex-1 py-3 rounded-xl border text-[10px] font-black transition-all shadow-sm tracking-wider ${data.taxRegion === 'eu' ? 'bg-brand-navy text-white border-brand-navy scale-[1.02] shadow-brand-navy/20' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'}`}>0% EXPORT</button>
               </div>
             </div>
             <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
               <label className="block text-[10px] uppercase font-black text-slate-400 mb-4 tracking-widest flex items-center gap-2">
                  <CreditCard size={14} className="text-brand-gold"/> Bankkonto (Treuhand)
               </label>
               <div className="space-y-4">
                  <div>
                     <label className="text-[9px] font-black text-slate-300 uppercase mb-1 block">Zahlungsempfänger</label>
                     <input type="text" value={data.senderBank.recipient} onChange={(e) => updateBank('recipient', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700"/>
                  </div>
                  <div>
                     <label className="text-[9px] font-black text-slate-300 uppercase mb-1 block">IBAN</label>
                     <input type="text" value={data.senderBank.iban} onChange={(e) => updateBank('iban', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono text-slate-700 tracking-wider"/>
                  </div>
                  <div>
                     <label className="text-[9px] font-black text-slate-300 uppercase mb-1 block">BIC</label>
                     <input type="text" value={data.senderBank.bic} onChange={(e) => updateBank('bic', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono text-slate-700 tracking-widest"/>
                  </div>
               </div>
             </div>
          </div>
        )}
      </div>

      <div className="mt-12 pt-6 border-t border-slate-100 space-y-3">
         <button onClick={() => onDownload('invoice', 'pdf')} className="w-full bg-brand-gold text-white py-4 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-gold/20 hover:bg-amber-500 hover:scale-[1.02] active:scale-95 transition-all">
            <Download size={18} strokeWidth={3}/> RECHNUNG PDF
         </button>
         <button onClick={() => onDownload('confirmation', 'pdf')} className="w-full bg-slate-800 text-white py-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-800/10">
            B2B-BESTÄTIGUNG PDF
         </button>
      </div>
    </div>
  );
};
