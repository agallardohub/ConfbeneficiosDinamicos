"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Heart, Star, Shield, Gift, Zap, CheckCircle2, Clock, Minus, Plus, ChevronDown, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Benefit } from "@/lib/leads/types";

const ICON_MAP: Record<string, any> = {
  b2b: Heart,
  wellness: Star,
  security: Shield,
  gift: Gift,
  fast: Zap,
};

import { useCoAgent } from "@copilotkit/react-core";

export function BenefitCard(benefit: Benefit) {
  const Icon = ICON_MAP[benefit.benefit_type] || Gift;
  const { state, setState } = useCoAgent({
    name: "default",
  });
  const [isRequested, setIsRequested] = useState(false);

  const formData = state.benefitSelections?.[benefit.id] || {};

  const handleInputChange = (name: string, value: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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

  const handleRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Abrimos el panel lateral asignando este ID al estado global
    setState({
      ...state,
      selectedBenefitId: benefit.id
    });
  };

  const renderField = (field: any) => {
    const currentValue = formData[field.name || field.id] || "";

    switch (field.type) {
      case "text_area":
        return (
          <div key={field.name || field.id} className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <label className="text-[10px] font-black text-muted-foreground uppercase">{field.label}</label>
            <textarea 
              placeholder={field.placeholder}
              value={currentValue}
              onChange={(e) => handleInputChange(field.name || field.id, e.target.value)}
              className="w-full bg-white border border-border/60 rounded-lg px-3 py-2 text-xs focus:ring-primary focus:border-primary min-h-[60px] resize-none"
            />
          </div>
        );
      case "dropdown":
        return (
          <div key={field.name || field.id} className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <label className="text-[10px] font-black text-muted-foreground uppercase">{field.label}</label>
            <div className="relative">
              <select 
                value={currentValue}
                onChange={(e) => handleInputChange(field.name || field.id, e.target.value)}
                className="w-full bg-white border border-border/60 rounded-lg px-3 py-2 text-xs font-bold appearance-none"
              >
                <option value="" disabled>Seleccionar...</option>
                {field.options?.map((opt: string) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        );
      case "size_selector":
        return (
          <div key={field.name || field.id} className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <label className="text-[10px] font-black text-muted-foreground uppercase">{field.label}</label>
            <div className="flex flex-wrap gap-2">
              {field.options?.map((opt: string) => (
                <button 
                  key={opt} 
                  onClick={(e) => handleInputChange(field.name || field.id, opt, e)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 shadow-sm hover:shadow-xl",
        benefit.favorite ? "border-amber-200" : "border-border"
      )}
    >
      <div className="h-32 w-full bg-muted relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
           <Icon size={48} className="text-primary/40" />
        </div>
        
        {benefit.points !== undefined && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg">
            {benefit.points} Puntos
          </div>
        )}

        {benefit.favorite && (
          <div className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full shadow-sm">
            <Star size={16} className="text-amber-500 fill-amber-500" />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-primary/10 text-primary">
            {benefit.benefit_type}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[#1a233b] leading-tight mb-2">{benefit.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed h-8">
          {benefit.description}
        </p>

        <div className="mt-4 bg-[#f8fafc] rounded-xl p-3 border border-border/40 space-y-4">
           {benefit.config?.type === "multi_input" ? (
             benefit.config.fields?.map(renderField)
           ) : (
             renderField({ ...benefit.config, id: "single" })
           )}

           {benefit.config?.type === "quantity_selector" && (
             <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
               <label className="text-[10px] font-black text-muted-foreground uppercase">{benefit.config.label}</label>
               <div className="flex items-center gap-3 bg-white rounded-lg border border-border/60 p-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const val = Math.max(1, (formData.quantity || 1) - 1);
                      handleInputChange("quantity", val);
                    }} 
                    className="p-1 hover:bg-muted rounded-md"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-black w-4 text-center">{formData.quantity || 1}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const val = (formData.quantity || 1) + 1;
                      handleInputChange("quantity", val);
                    }} 
                    className="p-1 hover:bg-muted rounded-md"
                  >
                    <Plus size={14} />
                  </button>
               </div>
             </div>
           )}
        </div>

        <button 
          onClick={handleRequest}
          className={cn(
            "w-full mt-4 py-3 text-sm font-black rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2",
            isRequested 
              ? "bg-green-500 text-white shadow-green-100" 
              : "bg-primary text-white hover:bg-primary/90 shadow-blue-200"
          )}
        >
          {isRequested ? (
            <>
              <CheckCircle2 size={18} />
              Solicitado
            </>
          ) : (
            "Solicitar Beneficio"
          )}
        </button>
      </div>
    </motion.div>
  );
}
