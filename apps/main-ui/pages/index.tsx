import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Text } from '@mantine/core';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
      router.replace('/dashboard');
  }, [router]);

  // Show a loading message while redirecting
  return <Text>Loading...</Text>;
} 