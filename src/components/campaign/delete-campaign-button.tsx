"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteCampaign } from "@/actions/Campaings/delete-campaign-action";
import { Button } from "@/components/ui/button";

export function DeleteCampaignButton({ campaignId }: { campaignId: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      const res = await deleteCampaign(campaignId);
      if (res.success) {
        router.push("/campaign");
        router.refresh();
      } else {
        alert(res.message);
        setConfirming(false);
      }
    });
  };

  return (
    <Button
      variant={confirming ? "destructive" : "outline"}
      onClick={handleDelete}
      disabled={isPending}
      className={confirming ? "animate-pulse" : ""}
      title={confirming ? "Confirmar eliminación" : "Eliminar"}
    >
      <Trash2 className="h-4 w-4 mr-2" />
      {confirming ? (isPending ? "Eliminando..." : "Confirmar") : "Eliminar"}
    </Button>
  );
}
