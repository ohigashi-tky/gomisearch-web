import { useState } from "react";
import { MunicipalitySelectionView } from "./components/MunicipalitySelectionView";
import { SearchView } from "./components/SearchView";
import {
  loadSelectedMunicipality,
  saveSelectedMunicipality,
} from "./lib/selectedMunicipality";
import type { Municipality } from "./lib/types";

/** ルート画面: 自治体未選択なら選択画面、選択済みなら検索画面 */
export default function App() {
  const [municipality, setMunicipality] = useState<Municipality | null>(() =>
    loadSelectedMunicipality(),
  );

  const select = (selected: Municipality) => {
    saveSelectedMunicipality(selected);
    setMunicipality(selected);
  };

  return (
    <div className="mx-auto min-h-dvh max-w-md bg-white text-neutral-950 md:border-x md:border-neutral-200 dark:bg-neutral-950 dark:text-neutral-50 md:dark:border-neutral-800">
      {municipality ? (
        // 自治体切り替え時は key で作り直してキャッシュを取り直す
        <SearchView
          key={municipality.id}
          municipality={municipality}
          onChangeMunicipality={select}
        />
      ) : (
        <MunicipalitySelectionView onSelect={select} />
      )}
    </div>
  );
}
