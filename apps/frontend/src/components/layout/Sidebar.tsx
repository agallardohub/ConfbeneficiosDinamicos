"use client";

import React from "react";
import { 
  Home, 
  Heart, 
  Gift, 
  Users, 
  FileText, 
  Settings, 
  HelpCircle,
  ChevronRight,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: Home, label: "Inicio", active: false },
  { icon: Heart, label: "Beneficios", active: true },
  { icon: Gift, label: "Mis Canjes", active: false },
  { icon: FileText, label: "Solicitudes", active: false },
  { icon: Users, label: "Comunidad", active: false },
];

const SECONDARY_ITEMS = [
  { icon: Settings, label: "Configuración" },
  { icon: HelpCircle, label: "Ayuda" },
];

export function Sidebar() {
  return (
    <div className="w-[260px] h-screen bg-[#1a233b] flex flex-col text-white/70">
      {/* Brand */}
      <div className="p-8">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-[#4b5ef9] rounded-lg flex items-center justify-center text-white font-black italic">B</div>
           <span className="text-xl font-black text-white tracking-tight">buk</span>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-6 mb-8">
        <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/10">
           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border border-white/20" />
           <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Antonio Silva</p>
              <p className="text-[10px] text-white/50 truncate">Gestor de Proyectos</p>
           </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
              item.active 
                ? "bg-[#4b5ef9] text-white shadow-lg shadow-blue-900/20" 
                : "hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon size={20} />
            {item.label}
            {item.active && <ChevronRight size={16} className="ml-auto" />}
          </button>
        ))}

        <div className="pt-8 pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/30">
          Soporte
        </div>

        {SECONDARY_ITEMS.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold hover:bg-white/5 hover:text-white transition-all"
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-6">
         <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-400/10 transition-all">
            <LogOut size={20} />
            Cerrar Sesión
         </button>
      </div>
    </div>
  );
}
