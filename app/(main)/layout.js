import React from 'react'
import PageEntrance from '@/components/page-entrance'

const MainLayout = ({ children }) => {
    // redirect to  onboarding
  return (
    <PageEntrance className="container mx-auto mt-24 mb-20">
      <div className="page-content space-y-6">
        {children}
      </div>
    </PageEntrance>
  );
};

export default MainLayout;