import app from "./app";
import { env } from "./config/env";
import { initDB } from "./config/initDB";

(async () => {
  await initDB();
  app.listen(env.PORT, () => {
    console.log(`🌱 PlantPal API running on http://localhost:${env.PORT}`);
  });
})();
