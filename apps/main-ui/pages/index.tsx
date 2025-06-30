import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Text } from '@mantine/core';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
      // User is logged in, redirect to dashboard
      router.replace('/dashboard');
    } else {
      // User is not logged in, redirect to login
      router.replace('/login');
    }
  }, [router]);

  // Show a loading message while redirecting
  return <Text>Loading...</Text>;
}