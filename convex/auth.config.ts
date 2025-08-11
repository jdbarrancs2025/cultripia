// Production configuration for Clerk authentication
const authConfig = {
  providers: [
    {
      domain: "https://clerk.cultripia.com",
      applicationID: "convex",
    },
  ],
};

export default authConfig;
