import type { UserDto } from "./types/Administrators";

declare module "#auth-utils" {
  interface User {
    // Add your own fields
    token: string;
    user: UserDto;
  }

  interface UserSession {
    // Add your own fields
    loggedInAt: Date;
  }
}

export {};

