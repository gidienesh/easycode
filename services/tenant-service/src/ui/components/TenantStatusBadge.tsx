import React from 'react';
import { Badge } from '@mantine/core';
import type Tenant from '../types';

export default function TenantStatusBadge({ status }: { status: Tenant['status'] }) {
  let color: string;
  switch (status) {
    case 'active': color = 'green'; break;
    case 'suspended': color = 'red'; break;
    case 'trial': color = 'yellow'; break;
    case 'offboarded': color = 'gray'; break;
    default: color = 'blue';
  }
  return <Badge color={color}>{status}</Badge>;
} 