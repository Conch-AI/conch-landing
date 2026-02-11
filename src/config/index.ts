export const Config = {
  environment: (process.env.NODE_ENV === "development" ? "local" : "prod") as
    | "local"
    | "prod",
};
