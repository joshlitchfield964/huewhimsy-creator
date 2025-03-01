
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";

interface UserProfileProps {
  session: Session;
}

export function UserProfile({ session }: UserProfileProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Email</p>
            <p className="font-medium">{session.user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Full Name</p>
            <p className="font-medium">{session.user?.user_metadata?.full_name || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">User ID</p>
            <p className="font-medium text-xs text-muted-foreground">{session.user?.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Account Created</p>
            <p className="font-medium">{formatDate(session.user?.created_at)}</p>
          </div>
        </div>
        
        <Button 
          variant="outline"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate('/');
          }}
          className="mt-4"
        >
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
}
