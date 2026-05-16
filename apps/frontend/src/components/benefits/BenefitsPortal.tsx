"use client";

import React from "react";
import { BenefitCard } from "./BenefitCard";
import { BenefitDetail } from "./BenefitDetail";
import { Benefit } from "@/lib/leads/types";
import { Search, Filter, Trophy } from "lucide-react";
import { AnimatePresence } from "motion/react";

interface BenefitsPortalProps {
  benefits: Benefit[];
}

const CATEGORIES = ["Todos", "Salud", "Wellness", "Seguros", "Otros"];

import { useCoAgent } from "@copilotkit/react-core";

export function BenefitsPortal({ benefits }: BenefitsPortalProps) {
  const [activeCategory, setActiveCategory] = React.useState("Todos");
  const { state, setState } = useCoAgent({
    name: "default",
  });

  const selectedId = state.selectedBenefitId;
  const setSelectedId = (id: number | null) => {
    setState({ ...state, selectedBenefitId: id });
  };

  const selectedBenefit = benefits.find(b => b.id === selectedId) || null;

  return (
    <div className="flex relative w-full h-full bg-[#f8fafc] overflow-hidden">
      <div className="flex flex-col flex-1 h-full overflow-hidden">
      {/* Portal Header */}
      <div className="bg-white border-b border-border/60 px-8 py-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h1 className="text-2xl font-black text-[#1a233b]">Catálogo de Beneficios</h1>
            <p className="text-muted-foreground text-sm mt-1">Explora y solicita tus beneficios corporativos</p>
          </div>
          
          <div className="flex items-center gap-4 bg-amber-50 border border-amber-100 px-4 py-2 rounded-2xl">
             <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                <Trophy size={20} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter">Puntos Disponibles</p>
                <p className="text-xl font-black text-amber-700 leading-none">2,450</p>
             </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 mt-8 max-w-6xl mx-auto">
           {CATEGORIES.map((cat) => (
             <button
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                 activeCategory === cat 
                 ? "bg-[#4b5ef9] text-white shadow-lg shadow-blue-200" 
                 : "text-muted-foreground hover:bg-muted/50"
               }`}
             >
               {cat}
             </button>
           ))}
           <div className="ml-auto flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-xl border border-border/40">
             <Search size={16} className="text-muted-foreground" />
             <input 
               type="text" 
               placeholder="Buscar beneficio..." 
               className="bg-transparent border-none text-sm focus:ring-0 w-40"
             />
           </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <div key={benefit.id} onClick={() => setSelectedId(benefit.id)}>
              <BenefitCard {...benefit} />
            </div>
          ))}
        </div>
      </div>
      </div>
      <AnimatePresence>
        {selectedId && (
          <BenefitDetail 
            benefit={selectedBenefit} 
            onClose={() => setSelectedId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
