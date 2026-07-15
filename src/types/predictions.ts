// Prédictions ML issues de la table gold, servies par le backend (/api/predict).
// Le modèle prédit le taux de remplissage (fill_rate, 0..1) à +15 / +30 / +60 min ;
// le backend en dérive aussi un nombre de vélos.

export type PredictionTriplet = {
  t15: number;
  t30: number;
  t60: number;
};

export type StationPrediction = {
  stationId: string;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  currentFillRate: number;
  fillRate: PredictionTriplet; // taux de remplissage prédit (0..1)
  bikes: PredictionTriplet; // vélos prédits (dérivés)
  predictionTs?: string;
};

export type PredictionApiResponse = {
  generatedAt: string | null;
  modelKey: string | null;
  count: number;
  predictions: StationPrediction[];
};

// Indexé par stationId pour une jointure O(1) avec les stations de la carte.
export type PredictionMap = Map<string, StationPrediction>;
