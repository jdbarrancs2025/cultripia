import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const setDefaultCountryForExperiences = internalMutation({
  args: {},
  handler: async (ctx) => {
    const experiences = await ctx.db.query("experiences").collect();
    
    let updated = 0;
    for (const experience of experiences) {
      if (!experience.country) {
        await ctx.db.patch(experience._id, {
          country: "Guatemala"
        });
        updated++;
      }
    }
    
    console.log(`Updated ${updated} experiences with default country Guatemala`);
    return { updated };
  },
});

export const setDefaultCountryForHostApplications = internalMutation({
  args: {},
  handler: async (ctx) => {
    const applications = await ctx.db.query("hostApplications").collect();
    
    let updated = 0;
    for (const application of applications) {
      if (!application.applicationData.country) {
        await ctx.db.patch(application._id, {
          applicationData: {
            ...application.applicationData,
            country: "Guatemala"
          }
        });
        updated++;
      }
    }
    
    console.log(`Updated ${updated} host applications with default country Guatemala`);
    return { updated };
  },
});