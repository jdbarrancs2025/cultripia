/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as availability from "../availability.js";
import type * as bookings from "../bookings.js";
import type * as experiences from "../experiences.js";
import type * as files from "../files.js";
import type * as hostApplications from "../hostApplications.js";
import type * as hosts from "../hosts.js";
import type * as migrations from "../migrations.js";
import type * as stripe from "../stripe.js";
import type * as translator from "../translator.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  availability: typeof availability;
  bookings: typeof bookings;
  experiences: typeof experiences;
  files: typeof files;
  hostApplications: typeof hostApplications;
  hosts: typeof hosts;
  migrations: typeof migrations;
  stripe: typeof stripe;
  translator: typeof translator;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
