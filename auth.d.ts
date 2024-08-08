// auth.d.ts
declare module '#auth-utils' {
    interface User {
      // Add your own fields
      token: string
    }
  
    interface UserSession {
      // Add your own fields
        loggedInAt: Date
    }
  }
  
  export {}