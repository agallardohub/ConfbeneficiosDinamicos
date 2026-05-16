import type { AgentState, LeadFilter } from "./types";

export const emptyFilter: LeadFilter = {
  workshops: [],
  technical_levels: [],
  tools: [],
  opt_in: "any",
  search: "",
};

const defaultBenefits = [
  {
    "id": 1,
    "name": "Polera Corporativa Buk",
    "category": "gift",
    "points": 50,
    "description": "¡Vístete con los colores del equipo! Elige tu talla y recibe tu polera oficial en la oficina.",
    "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
    "config": {
      "type": "size_selector",
      "options": ["S", "M", "L", "XL"]
    }
  },
  {
    "id": 2,
    "name": "Entradas al Cine",
    "category": "wellness",
    "points": 100,
    "description": "Canjea tus tickets para las mejores películas. Tienes un cupo máximo de 4 por mes.",
    "image": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
    "config": {
      "type": "quantity_stepper",
      "max": 4
    }
  },
  {
    "id": 3,
    "name": "Seguro Complementario",
    "category": "b2b",
    "points": 0,
    "description": "Elige el plan que mejor se adapte a tus necesidades y las de tu familia.",
    "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
    "config": {
      "type": "dropdown",
      "label": "Selecciona tu plan",
      "options": ["Plan Base (Gratis)", "Plan Pro (+10 pts)", "Plan Familiar (+25 pts)"]
    }
  },
  {
    "id": 4,
    "name": "BukPass Alimentación",
    "category": "fast",
    "points": 300,
    "description": "Carga mensual para tus almuerzos. Selecciona tu proveedor preferido.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
    "config": {
      "type": "dropdown",
      "label": "Proveedor",
      "options": ["Sodexo", "Edenred", "Amipass"]
    }
  },
  {
    "id": 5,
    "name": "Kit de Bienvenida",
    "category": "gift",
    "points": 0,
    "description": "Selecciona el color de tu botella y libreta Buk para tu kit de inicio.",
    "image": "https://images.unsplash.com/photo-1583500178690-234026b526ed?auto=format&fit=crop&q=80&w=800",
    "config": {
      "type": "color_picker",
      "options": [
        { "name": "Azul Buk", "hex": "#4b5ef9" },
        { "name": "Verde Teal", "hex": "#10b981" },
        { "name": "Blanco", "hex": "#ffffff" }
      ]
    }
  },
  {
    "id": 6,
    "name": "Sesión de Masajes",
    "category": "wellness",
    "points": 150,
    "description": "Reserva tu hora para un masaje descontracturante en la sala de bienestar.",
    "image": "https://images.unsplash.com/photo-1544161515-4ae6ce6db874?auto=format&fit=crop&q=80&w=800",
    "config": {
      "type": "dropdown",
      "label": "Horario",
      "options": ["Lunes 10:00", "Miércoles 15:00", "Viernes 11:00"]
    }
  },
  {
    "id": 7,
    "name": "Día Administrativo",
    "category": "security",
    "points": 0,
    "description": "Tómate un día libre para trámites personales. Elige el semestre.",
    "image": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800",
    "config": {
      "type": "dropdown",
      "label": "Semestre",
      "options": ["Primer Semestre", "Segundo Semestre"]
    }
  },
  {
    "id": 8,
    "name": "Cursos Online",
    "category": "wellness",
    "points": 500,
    "description": "Aprende nuevas habilidades. Selecciona la plataforma que prefieras.",
    "image": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800",
    "config": {
      "type": "dropdown",
      "label": "Plataforma",
      "options": ["Udemy", "Coursera", "Platzi"]
    }
  },
  {
    "id": 9,
    "name": "Gift Card Supermercado",
    "category": "gift",
    "points": 1000,
    "description": "Canjea tus puntos por una tarjeta de regalo para tus compras.",
    "image": "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800",
    "config": {
      "type": "quantity_stepper",
      "max": 2
    }
  },
  {
    "id": 10,
    "name": "Suscripción Spotify",
    "category": "wellness",
    "points": 200,
    "description": "Disfruta de tu música favorita sin anuncios por 3 meses.",
    "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=800",
    "config": {
      "type": "dropdown",
      "label": "Plan",
      "options": ["Individual", "Duo", "Familiar"]
    }
  },
  {
    "id": 11,
    "name": "Soporte Ayudante IA",
    "category": "wellness",
    "points": 10,
    "description": "Usa la IA para resolver tus dudas del portal. Indica tu requerimiento.",
    "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    "config": {
      "type": "multi_input",
      "fields": [
        {
          "name": "requerimiento",
          "label": "Detalle del requerimiento",
          "type": "text_area"
        },
        {
          "name": "pago",
          "label": "¿Con qué quieres pagar?",
          "type": "dropdown",
          "options": ["Café", "Muffin", "Bebida"]
        }
      ]
    }
  }
];

export const initialState: AgentState = {
  leads: [],
  filter: emptyFilter,
  highlightedLeadIds: [],
  selectedLeadId: null,
  header: {
    title: "Catálogo de Beneficios",
    subtitle: "Explora y solicita tus beneficios corporativos",
  },
  sync: { databaseId: "", databaseTitle: "", syncedAt: null },
  benefits: defaultBenefits,
  activeView: "benefits",
  selectedBenefitId: null,
  benefitSelections: {},
};

export function isFilterEmpty(f: LeadFilter): boolean {
  return (
    f.workshops.length === 0 &&
    f.technical_levels.length === 0 &&
    f.tools.length === 0 &&
    f.opt_in === "any" &&
    f.search.trim().length === 0
  );
}

export function filterCount(f: LeadFilter): number {
  let n = 0;
  if (f.workshops.length) n += 1;
  if (f.technical_levels.length) n += 1;
  if (f.tools.length) n += 1;
  if (f.opt_in !== "any") n += 1;
  if (f.search.trim().length) n += 1;
  return n;
}
