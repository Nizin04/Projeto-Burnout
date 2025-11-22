// src/components/daily-recommendation-card.tsx
"use client"

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDailyRecommendation } from "@/lib/recommendations";
import type { FeedbackResponse } from "@/lib/feedback";
import { getAllFeedbacks } from "@/lib/feedback";

const STORAGE_KEY_PREFIX = "daily_reco_v1:"; // prefix pra caso queira mudar versão

function todayKey(userId = "global") {
  const d = new Date();
  return `${STORAGE_KEY_PREFIX}${userId}:${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

export function DailyRecommendationCard({ userId }: { userId?: string }) {
  const [reco, setReco] = useState<{ id: string; title: string; text: string } | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // pegar o último feedback do usuário (usa getAllFeedbacks que tu já tem)
    const all = getAllFeedbacks() as FeedbackResponse[]; // adapta se teu método exige args
    // assume que getAllFeedbacks retorna ordenado do mais recente pro mais antigo (ou pega último)
    const last = Array.isArray(all) && all.length ? all[0] : undefined; // ajusta se necessário

    const newReco = getDailyRecommendation(last);
    setReco(newReco);

    // checar storage: se já vimos/fechamos hoje para este recommendation id
    const key = todayKey(userId ?? "global");
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        // raw: JSON { id: string, dismissed: boolean }
        const parsed = JSON.parse(raw);
        if (parsed && parsed.id === newReco.id && parsed.dismissed) {
          setHidden(true);
        } else {
          setHidden(false);
        }
      }
    } catch (err) {
      // ignore storage errors
      setHidden(false);
    }
  }, [userId]);

  if (!reco || hidden) return null;

  const handleDone = () => {
    const key = todayKey(userId ?? "global");
    localStorage.setItem(key, JSON.stringify({ id: reco.id, dismissed: true }));
    setHidden(true);
  }

  const handleSnooze = () => {
    // só oculta por hoje (mesma ação), mas poderia ser 3 dias
    handleDone();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recomendação do Dia</CardTitle>
        <CardDescription>{reco.title}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">{reco.text}</p>
        <div className="flex gap-2">
          <Button variant="default" onClick={handleDone}>Já fiz</Button>
          <Button variant="ghost" onClick={handleSnooze}>Sair por hoje</Button>
        </div>
      </CardContent>
    </Card>
  );
}
