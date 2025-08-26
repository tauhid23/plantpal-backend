import cron from "node-cron";
import { getDueActivitiesWithin } from "./activity.service";
import { formatISO } from "date-fns";

export function startScheduler() {
  // Every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    try {
      const upcoming = await getDueActivitiesWithin(5);
      if (upcoming.length > 0) {
        console.log("🔔 Upcoming activities (next 5m):");
        for (const a of upcoming) {
          console.log(
            ` - [${a.type}] "${a.title}" for plant#${a.plantId} at ${formatISO(
              new Date(a.dueAt)
            )} (user#${a.userId})`
          );
        }
      }
    } catch (e) {
      console.error("Scheduler error:", e);
    }
  });
}
