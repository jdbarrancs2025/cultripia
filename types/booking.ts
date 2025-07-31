import { Doc, Id } from "@/convex/_generated/dataModel";

export type BookingWithDetails = Doc<"bookings"> & {
  experience: Doc<"experiences"> | null;
  host: Doc<"users"> | null;
  guestCount: number;
};

export type BookingDetailWithTraveler = Doc<"bookings"> & {
  experience: Doc<"experiences"> | null;
  host: Doc<"users"> | null;
  traveler: Doc<"users"> | null;
  guestCount: number;
};
