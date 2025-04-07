import React from 'react';
import { View } from 'react-native';
import { useAuth } from '@/hooks/domain/auth/useAuth';
import type { UserRole } from '@/hooks/domain/auth/types';

interface WithRoleAccessProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function WithRoleAccess({ allowedRoles, children, fallback }: WithRoleAccessProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

// HOC 版本
export function withRoleAccess(WrappedComponent: React.ComponentType<any>, allowedRoles: UserRole[]) {
  return function WithRoleAccessWrapper(props: any) {
    return (
      <WithRoleAccess allowedRoles={allowedRoles}>
        <WrappedComponent {...props} />
      </WithRoleAccess>
    );
  };
}