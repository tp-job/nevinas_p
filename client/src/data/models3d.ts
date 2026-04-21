import crystalMossUrl from "@/models/crystal-moss-ring.glb";
import driftwoodUrl from "@/models/driftwood.glb";
import mossyWoodUrl from "@/models/mossy-wood.glb";
import models1Url from "@/models/models1.glb";

export interface Model3DItem {
  id: string;
  url: string;
  label: string;
  icon: string;
}

export const MODEL_3D_ITEMS: Model3DItem[] = [
  { id: "crystal-moss", url: crystalMossUrl, label: "Crystal Moss", icon: "ri-shape-line" },
  { id: "driftwood", url: driftwoodUrl, label: "Driftwood", icon: "ri-shape-2-line" },
  { id: "mossy-wood", url: mossyWoodUrl, label: "Mossy Wood", icon: "ri-leaf-line" },
  { id: "core-model", url: models1Url, label: "Core Model", icon: "ri-bubble-chart-line" },
];
