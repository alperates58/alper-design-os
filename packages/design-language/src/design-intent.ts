import {
  DesignIntent,
  ProductType,
  UserExpertise,
  UsageFrequency,
  SessionDuration,
  InformationDensity,
  InteractionIntensity,
  DevicePriority,
  TaskCriticality,
  ErrorCost,
  BrandCharacter,
  VisualEmphasis,
  MotionTolerance,
  AccessibilityNeeds
} from './types.js';

export interface CreateDesignIntentParams {
  productType?: ProductType;
  userExpertise?: UserExpertise;
  usageFrequency?: UsageFrequency;
  sessionDuration?: SessionDuration;
  informationDensity?: InformationDensity;
  interactionIntensity?: InteractionIntensity;
  devicePriority?: DevicePriority;
  taskCriticality?: TaskCriticality;
  errorCost?: ErrorCost;
  brandCharacter?: BrandCharacter;
  visualEmphasis?: VisualEmphasis;
  motionTolerance?: MotionTolerance;
  accessibilityNeeds?: AccessibilityNeeds;
  decisionPrinciples?: string[];
}

/**
 * Creates and normalizes a DesignIntent profile from contextual attributes.
 * Zero hardcoded domain names.
 */
export function createDesignIntent(params: CreateDesignIntentParams): DesignIntent {
  const productType = params.productType || 'B2B_SAAS';
  const informationDensity = params.informationDensity || (
    productType === 'ENTERPRISE_INTERNAL' || productType === 'ANALYTICS_DATA' || productType === 'DEVELOPER_TOOL'
      ? 'COMPACT'
      : productType === 'B2C_CONSUMER'
      ? 'SPACIOUS'
      : 'COMFORTABLE'
  );

  const userExpertise = params.userExpertise || (
    productType === 'DEVELOPER_TOOL' || productType === 'ENTERPRISE_INTERNAL'
      ? 'EXPERT'
      : productType === 'B2C_CONSUMER'
      ? 'NOVICE'
      : 'INTERMEDIATE'
  );

  const usageFrequency = params.usageFrequency || (
    productType === 'ADMIN_OPERATIONAL' || productType === 'ENTERPRISE_INTERNAL'
      ? 'DAILY_FREQUENT'
      : 'PERIODIC'
  );

  const sessionDuration = params.sessionDuration || (
    informationDensity === 'COMPACT' ? 'LONG_EXTENDED' : 'MEDIUM'
  );

  const interactionIntensity = params.interactionIntensity || (
    userExpertise === 'EXPERT' ? 'KEYBOARD_POWER' : 'BALANCED'
  );

  const devicePriority = params.devicePriority || (
    productType === 'B2C_CONSUMER' ? 'MOBILE_FIRST' : 'DESKTOP_FIRST'
  );

  const taskCriticality = params.taskCriticality || (
    productType === 'ENTERPRISE_INTERNAL' || productType === 'ADMIN_OPERATIONAL'
      ? 'HIGH'
      : 'MEDIUM'
  );

  const errorCost = params.errorCost || (
    taskCriticality === 'HIGH' || taskCriticality === 'MISSION_CRITICAL'
      ? 'SIGNIFICANT'
      : 'LOW'
  );

  const brandCharacter = params.brandCharacter || (
    productType === 'B2C_CONSUMER'
      ? 'FRIENDLY'
      : productType === 'DEVELOPER_TOOL'
      ? 'TECHNICAL'
      : 'UTILITY_NEUTRAL'
  );

  const visualEmphasis = params.visualEmphasis || (
    informationDensity === 'COMPACT' ? 'DATA_FIRST' : 'ACTION_FIRST'
  );

  const motionTolerance = params.motionTolerance || (
    informationDensity === 'COMPACT' ? 'SUBTLE' : 'EXPRESSIVE'
  );

  const accessibilityNeeds = params.accessibilityNeeds || 'STANDARD_AA';

  // Compute decision principles based on profile combination
  const decisionPrinciples: string[] = params.decisionPrinciples || [];
  if (decisionPrinciples.length === 0) {
    if (informationDensity === 'COMPACT') {
      decisionPrinciples.push('Maximize scannable data density; use compact row heights and 4px rhythmic baseline.');
      decisionPrinciples.push('Enable full keyboard navigation for rapid power-user workflows.');
    } else if (informationDensity === 'SPACIOUS') {
      decisionPrinciples.push('Provide ample breathing room and prominent visual touch targets.');
      decisionPrinciples.push('Focus user attention on singular primary actions per viewport.');
    } else {
      decisionPrinciples.push('Balance information hierarchy with accessible touch and mouse targets.');
    }

    if (errorCost === 'SIGNIFICANT' || errorCost === 'CATASTROPHIC') {
      decisionPrinciples.push('Require explicit confirmation and state undo barriers for destructive actions.');
    }

    if (devicePriority === 'MOBILE_FIRST') {
      decisionPrinciples.push('Prioritize single-column card flows and bottom sheet drawers for complex filters.');
    }
  }

  return {
    productType,
    userExpertise,
    usageFrequency,
    sessionDuration,
    informationDensity,
    interactionIntensity,
    devicePriority,
    taskCriticality,
    errorCost,
    brandCharacter,
    visualEmphasis,
    motionTolerance,
    accessibilityNeeds,
    decisionPrinciples
  };
}
