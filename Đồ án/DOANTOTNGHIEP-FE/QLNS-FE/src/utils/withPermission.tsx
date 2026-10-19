"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermissions: string[] = []
) {
  const ProtectedComponent = (props: P) => {
    const [authorized, setAuthorized] = useState(false);
    const [checked, setChecked] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const stored = localStorage.getItem("user");
      if (!stored) {
        router.replace("/login");
        return;
      }

      const u = JSON.parse(stored);

      if (!u?.token) {
        router.replace("/login");
        return;
      }

      const userPermissions: string[] = Array.isArray(u.permissions)
        ? u.permissions
        : [];

      const hasPermission = requiredPermissions.every((perm) =>
        userPermissions.map((p) => p.toLowerCase()).includes(perm.toLowerCase())
      );
      if (requiredPermissions.length > 0 && !hasPermission) {
        router.replace("/unauthorized");
        return;
      }
      setAuthorized(true);
      setChecked(true);
    }, [router]);
    if (!checked) return null;

    return authorized ? <WrappedComponent {...(props as P)} /> : null;
  };

  return ProtectedComponent;
}
