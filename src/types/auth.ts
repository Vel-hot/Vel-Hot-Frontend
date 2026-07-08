export type AuthUser = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  created_at: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  nom: string;
  prenom: string;
  email: string;
  password: string;
};

export type AuthTokenResponse = {
  access_token: string;
  token_type: string;
};
