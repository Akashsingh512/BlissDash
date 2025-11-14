import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return setAllowed(false);

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      setAllowed(roleData?.role === "admin");
    };

    checkRole();
  }, []);

  if (allowed === null) return null; // loading state to avoid flicker

  return allowed ? children : <Navigate to="/" replace />;
}
