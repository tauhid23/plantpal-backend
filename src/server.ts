import app from "./app";
import { env } from "./config/env";
import { initDB } from "./config/initDB";
import { startScheduler } from "./services/schedule.service";

(async () => {
  await initDB();
  startScheduler();
  app.listen(env.PORT, () => {
    console.log(`🌱 PlantPal API running on http://localhost:${env.PORT}`);
  });
})();
