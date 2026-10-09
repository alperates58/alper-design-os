import { ProductUXProfile } from '@alper-design-os/design-core';
import { UserJourney, UserJourneySchema } from './types.js';

export function synthesizeUserJourneys(profile: ProductUXProfile): UserJourney[] {
  const journeys: UserJourney[] = [];
  const primaryPersona = profile.personas[0]?.name || 'Primary Operator';

  // 1. Synthesize journeys from criticalWorkflows
  for (const wf of profile.criticalWorkflows) {
    const journey: UserJourney = {
      id: `journey-${wf.id}`,
      persona: primaryPersona,
      goal: wf.name,
      preconditions: [
        'User is authenticated with active workspace permissions',
        'Initial dataset loaded and visible in primary viewport'
      ],
      steps: wf.steps,
      criticality: 'MISSION_CRITICAL',
      expectedOutcome: `Successfully complete ${wf.name} without validation error or system regression`,
      failureStates: [
        'EMPTY_STATE',
        'LOADING_TIMEOUT',
        'API_400_BAD_REQUEST',
        'API_500_SERVER_ERROR',
        'CONSTRAINT_VIOLATION_CONFLICT',
        'NETWORK_DISCONNECTED'
      ],
      performanceBudget: {
        maxFlowDurationMs: wf.latencyTolerance === 'SUB_SECOND' ? 3000 : 6000,
        maxStepLatencyMs: wf.latencyTolerance === 'SUB_SECOND' ? 500 : 1500
      },
      accessibilityRequirements: {
        keyboardOnlyNavigable: profile.accessibilityConsiderations.keyboardOnlyNavigable,
        announceLiveRegions: profile.accessibilityConsiderations.screenReaderAnnouncementNotes.length > 0,
        minTouchTargetPx: profile.interactionStyle === 'TOUCH_OPTIMIZED' ? 48 : 40
      }
    };

    journeys.push(UserJourneySchema.parse(journey));
  }

  // 2. Synthesize journeys from primaryJobsAndTasks if criticalWorkflows was small
  if (journeys.length < 2 && profile.primaryJobsAndTasks.length > 0) {
    const jtbd = profile.primaryJobsAndTasks[0]!;
    const journey: UserJourney = {
      id: `journey-${jtbd.id}`,
      persona: primaryPersona,
      goal: jtbd.title,
      preconditions: ['System ready in standard view state'],
      steps: [
        'Locate target operational item in primary list or grid',
        'Select item to view detail parameters in inspector',
        'Execute required task modification and commit',
        'Verify immediate confirmation badge and system state consistency'
      ],
      criticality: jtbd.complexity === 'MISSION_CRITICAL' ? 'MISSION_CRITICAL' : 'HIGH',
      expectedOutcome: jtbd.successMetric,
      failureStates: ['EMPTY_STATE', 'API_422_VALIDATION_ERROR', 'API_500_SERVER_ERROR'],
      performanceBudget: {
        maxFlowDurationMs: 4000,
        maxStepLatencyMs: 800
      },
      accessibilityRequirements: {
        keyboardOnlyNavigable: true,
        announceLiveRegions: true,
        minTouchTargetPx: 44
      }
    };
    journeys.push(UserJourneySchema.parse(journey));
  }

  return journeys;
}
