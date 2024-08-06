// auth.d.ts
declare module '#auth-utils' {
    interface User {
      // Add your own fields
    }
  
    interface UserSession {
      // Add your own fields
        loggedInAt: Date
    }
  }
  
  export {}