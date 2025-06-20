import React, { useState } from 'react';
import { Button, Group, Card, Title } from '@easycode/ui-library';

import FeatureChecklist from './FeatureChecklist';
import QuotationSummary from './QuotationSummary';
import ProposalGenerator from './ProposalGenerator';
import PaymentStatus from './PaymentStatus';
import TrialPromotionManager from './TrialPromotionManager';
import AffiliateAgentTracker from './AffiliateAgentTracker';

const steps = [
  'Feature Checklist',
  'Quotation',
  'Proposal',
  'Payment',
  'Trial/Promotion',
  'Affiliate Agent',
  'Summary',
];

export default function AdminFeatureManager() {
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Render the correct step component
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <FeatureChecklist />;
      case 1:
        return <QuotationSummary />;
      case 2:
        return <ProposalGenerator />;
      case 3:
        return <PaymentStatus />;
      case 4:
        return <TrialPromotionManager />;
      case 5:
        return <AffiliateAgentTracker />;
      case 6:
        return <div>Summary & Audit Log (TODO)</div>;
      default:
        return null;
    }
  };

  return (
    <Card style={{ maxWidth: 800, margin: '0 auto', padding: 24 }} shadow="sm" radius="md" withBorder>
      <Title order={2} mb="md">Tenant Feature Management (Admin)</Title>
      <div style={{ marginBottom: 16 }}>
        <strong>Step {currentStep + 1} of {steps.length}:</strong> {steps[currentStep]}
      </div>
      <div style={{ minHeight: 200, border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 24 }}>
        {renderStep()}
      </div>
      <Group position="apart">
        <Button
          onClick={() => setCurrentStep((s: number) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          variant="outline"
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep((s: number) => Math.min(steps.length - 1, s + 1))}
          disabled={currentStep === steps.length - 1}
        >
          Next
        </Button>
      </Group>
    </Card>
  );
} 