export const Config = {
  environment: (process.env.NODE_ENV === "development" ? "local" : "prod") as
    | "local"
    | "prod",
};

export const API_BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://app.getconch.ai";
