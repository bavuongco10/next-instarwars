import React from 'react';
import { useRouter } from 'next/router';

import Layout from 'components/Layout';

export default function ProfilePage() {
  const router = useRouter();
  const { pid } = router.query;

  return (
    <Layout user={pid}>
      <div>{pid}</div>
    </Layout>
  );
}
