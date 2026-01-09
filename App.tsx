
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { INITIAL_STATE, AppState } from './types';
import { parseDataWithGemini } from './services/geminiService';
import { InputForm } from './components/InputForm';
import { InvoiceTemplate, ConfirmationTemplate } from './components/DocumentTemplates';
import { FileText, ScrollText, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'impro_insolvenz_state_v1';

const App: React.FC = () => {
  const [data, setData] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...INITIAL_STATE, ...JSON.parse(saved) };
    } catch (e) {}
    return INITIAL_STATE;
  });

  const [activeView, setActiveView] = useState<'invoice' | 'confirmation'>('invoice');
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const handleSmartImport = async (text: string) => {
    setIsImporting(true);
    const updates = await parseDataWithGemini(text, data);
    setData(prev => ({ ...prev, ...updates }));
    setIsImporting(false);
  };

  const handleDownload = async (type: 'invoice' | 'confirmation', format: 'pdf' | 'jpg') => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-10000px';
    container.style.left = '0';
    container.style.width = '210mm'; 
    container.style.zIndex = '-9999';
    document.body.appendChild(container);

    const root = createRoot(container);
    let Component;
    if (type === 'invoice') Component = InvoiceTemplate;
    else Component = ConfirmationTemplate;
    
    await new Promise<void>((resolve) => {
      root.render(<Component data={data} />);
      setTimeout(resolve, 2000); 
    });

    try {
      const pageElements = container.querySelectorAll('.document-page');
      if (pageElements.length === 0) throw new Error("Seiten-Container nicht gefunden.");

      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pageElements.length; i++) {
          if (i > 0) pdf.addPage();
          const canvas = await html2canvas(pageElements[i] as HTMLElement, { 
            scale: 4, 
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            windowWidth: 794, 
            onclone: (doc) => {
              const el = doc.querySelector('.document-page') as HTMLElement;
              if (el) el.style.transform = 'none';
            }
          });
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      }
      
      const names = { invoice: 'Rechnung', confirmation: 'B2B_Bestätigung' };
      pdf.save(`${names[type]}_${data.invoiceNr}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Download-Fehler. Bitte erneut versuchen.");
    } finally {
      root.unmount();
      document.body.removeChild(container);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-sans">
      <div className="w-[360px] flex-shrink-0 bg-white shadow-2xl z-10 h-full border-r border-slate-200 flex flex-col">
         <div className="p-5 border-b border-slate-800/10 bg-brand-navy text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-brand-gold w-7 h-7" />
              <div>
                <h1 className="font-extrabold text-lg leading-none tracking-tight text-white">IMPRO</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Insolvenzverwertung</p>
              </div>
            </div>
         </div>
         <div className="flex-1 overflow-hidden">
            <InputForm data={data} onChange={setData} onSmartImport={handleSmartImport} isImporting={isImporting} onDownload={handleDownload} />
         </div>
      </div>

      <div className="flex-1 flex flex-col h-full relative">
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full shadow-2xl p-1.5 z-20 flex gap-1">
           <button onClick={() => setActiveView('invoice')} className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-2 transition-all duration-200 ${activeView === 'invoice' ? 'bg-brand-navy text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}><FileText size={14}/> Rechnung</button>
           <button onClick={() => setActiveView('confirmation')} className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-2 transition-all duration-200 ${activeView === 'confirmation' ? 'bg-brand-navy text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}><ScrollText size={14}/> B2B-Bestätigung</button>
        </div>

        <div className="flex-1 overflow-auto bg-slate-200/50 p-12 flex justify-center items-start no-scrollbar">
           <div className="transform scale-[0.55] lg:scale-[0.82] origin-top shadow-2xl transition-all duration-500 mb-24 rounded-lg overflow-hidden border border-slate-300 bg-white">
             <div style={{ display: activeView === 'invoice' ? 'block' : 'none' }}><InvoiceTemplate data={data} /></div>
             <div style={{ display: activeView === 'confirmation' ? 'block' : 'none' }}><ConfirmationTemplate data={data} /></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;
