
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

    // Set auth cookie expiry to 30 days (2592000 seconds)
    supabase.auth.setSession({
      refresh_token: session?.refresh_token,
      access_token: session?.access_token,
    }, {
      expiresIn: 2592000 // 30 days in seconds
    }).then(({ data }) => {
      if (data.session) {
        console.log("Auth cookie expiry set to 30 days");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      
      // Set auth cookie expiry to 30 days for new sessions
      if (session) {
        supabase.auth.setSession({
          refresh_token: session.refresh_token,
          access_token: session.access_token,
        }, {
          expiresIn: 2592000 // 30 days in seconds
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
