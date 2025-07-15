'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Contact() {
  const router = useRouter();

  useEffect(() => {
    // 기본적으로 inquiry 페이지로 리다이렉트
    router.replace('/contact/inquiry');
  }, [router]);

  return null;
} 