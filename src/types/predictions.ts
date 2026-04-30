export type StationPrediction = {
  stationId: string;
  at: string;
  horizonMinutes: 15 | 30 | 60;
  predictedBikes: number;
  predictedDocks: number;
  confidence?: number;
};

export type PredictionApiResponse = {
  generatedAt: string;
  predictions: StationPrediction[];
};
