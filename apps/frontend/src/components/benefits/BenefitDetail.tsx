"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Heart, Star, Shield, Gift, Zap, CheckCircle2, Clock, MapPin, Calendar, Info } from "lucide-react";
import { Benefit } from "@/lib/leads/types";
import { cn } from "@/lib/utils";

interface BenefitDetailProps {
  benefit: Benefit | null;
  onClose: () => void;
}

const ICON_MAP: Record<string, any> = {
  b2b: Heart,
  wellness: Star,
  security: Shield,
  gift: Gift,
  fast: Zap,
};

import { useCoAgent } from "@copilotkit/react-core";
import { ChevronDown, Minus, Plus } from "lucide-react";

export function BenefitDetail({ benefit, onClose }: BenefitDetailProps) {
  const { state, setState } = useCoAgent({
    name: "default",
  });
  if (!benefit) return null;
  const Icon = ICON_MAP[benefit.benefit_type] || Gift;

  const formData = state.benefitSelections?.[benefit.id] || {};

  const handleInputChange = (name: string, value: any) => {
    setState({
      ...state,
      benefitSelections: {
        ...state.benefitSelections,
        [benefit.id]: {
          ...(state.benefitSelections?.[benefit.id] || {}),
          [name]: value
        }
      }
    });
  };

  const renderField = (field: any) => {
    const currentValue = formData[field.name || field.id] || "";

    switch (field.type) {
      case "text_area":
        return (
          <div key={field.name || field.id} className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase">{field.label}</label>
            <textarea 
              placeholder={field.placeholder}
              value={currentValue}
              onChange={(e) => handleInputChange(field.name || field.id, e.target.value)}
              className="w-full bg-white border border-border/60 rounded-xl px-4 py-3 text-sm focus:ring-primary focus:border-primary min-h-[100px] resize-none"
            />
          </div>
        );
      case "dropdown":
        return (
          <div key={field.name || field.id} className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase">{field.label}</label>
            <div className="relative">
              <select 
                value={currentValue}
                onChange={(e) => handleInputChange(field.name || field.id, e.target.value)}
                className="w-full bg-white border border-border/60 rounded-xl px-4 py-3 text-sm font-bold appearance-none"
              >
                <option value="" disabled>Seleccionar...</option>
                {field.options?.map((opt: string) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        );
      case "size_selector":
        return (
          <div key={field.name || field.id} className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase">{field.label}</label>
            <div className="flex flex-wrap gap-2">
              {field.options?.map((opt: string) => (
                <button 
                  key={opt} 
                  onClick={() => handleInputChange(field.name || field.id, opt)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-bold border transition-all",
                    currentValue === opt 
                      ? "bg-primary text-white border-primary shadow-md scale-105" 
                      : "bg-white border-border hover:border-primary/50"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleRequest = () => {
    const summary = Object.entries(formData)
      .map(([key, val]) => `${key}: ${val}`)
      .join("\n");
    
    alert(`¡Solicitud enviada desde el panel lateral!\n\nBeneficio: ${benefit.name}\nDetalles:\n${summary || "Sin opciones adicionales"}`);
    onClose();
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 h-full w-[450px] bg-white shadow-2xl border-l border-border z-50 flex flex-col"
    >
      {/* Header with Banner */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center">
           <Icon size={80} className="text-primary/20" />
        </div>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="flex items-center gap-2 mb-4">
           <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
             {benefit.benefit_type}
           </span>
           {benefit.buk_benefit && (
             <span className="flex items-center gap-1 text-[10px] font-bold text-secondary">
               <CheckCircle2 size={12} /> Buk Benefit
             </span>
           )}
        </div>

        <h2 className="text-3xl font-black text-[#1a233b] mb-4">{benefit.name}</h2>
        
        <div className="flex items-center gap-4 mb-8">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-muted-foreground uppercase">Costo</span>
              <span className="text-xl font-black text-amber-600">{benefit.points || 0} Puntos</span>
           </div>
           <div className="w-px h-8 bg-border" />
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-muted-foreground uppercase">Aprobación</span>
              <span className="text-sm font-bold text-foreground">Inmediata</span>
           </div>
        </div>

        <div className="space-y-8">
           {/* Dynamic Config Fields */}
           <section className="bg-gray-50 p-6 rounded-2xl border border-border/50 space-y-6">
              <h3 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                 Configuración del Beneficio
              </h3>
              {benefit.config?.type === "multi_input" ? (
                benefit.config.fields?.map(renderField)
              ) : (
                benefit.config && renderField({ ...benefit.config, id: "single" })
              )}
           </section>

           <section>
              <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Info size={14} /> Descripción
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefit.description}
                {benefit.additional_info && (
                  <span className="block mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 font-medium">
                    {benefit.additional_info}
                  </span>
                )}
              </p>
           </section>

           <section>
              <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                 <MapPin size={14} /> Dónde aplica
              </h3>
              <p className="text-sm font-bold text-[#1a233b]">Todas las sucursales Buk / Remoto</p>
           </section>

           <section>
              <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Calendar size={14} /> Vigencia
              </h3>
              <p className="text-sm font-bold text-[#1a233b]">Hasta el 31 de Diciembre, 2026</p>
           </section>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-8 border-t border-border bg-gray-50">
         <button 
           onClick={handleRequest}
           className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-blue-200 active:scale-95"
         >
           Solicitar Ahora
         </button>
      </div>
    </motion.div>
  );
}
