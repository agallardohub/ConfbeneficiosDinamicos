"use client";

import React from "react";
import { BenefitCard } from "./BenefitCard";
import { Benefit } from "@/lib/leads/types";

interface BenefitListProps {
  benefits: Benefit[];
  title?: string;
}

export function BenefitList({ benefits, title }: BenefitListProps) {
  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
          <div className="w-2 h-8 bg-primary rounded-full" />
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit) => (
          <BenefitCard key={benefit.id} {...benefit} />
        ))}
      </div>
    </div>
  );
}
