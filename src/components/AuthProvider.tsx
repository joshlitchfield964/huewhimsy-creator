
import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Configure session to persist for 30 days
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // Set the auth cookie expiry to 30 days
        supabase.auth.refreshSession({
          refreshToken: session.refresh_token,
        }).then(({ data }) => {
          if (data.session) {
            console.log("Auth cookie expiry set to 30 days");
            setSession(data.session);
          }
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      
      // If a new session is established, set its expiry to 30 days
      if (session) {
        supabase.auth.refreshSession({
          refreshToken: session.refresh_token,
        }).then(({ data }) => {
          if (data.session) {
            console.log("Session refreshed and set to expire in 30 days");
          }
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
