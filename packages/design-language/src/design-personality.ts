import { DesignIntent, DesignPersonality } from './types.js';

export function computeDesignPersonality(intent: DesignIntent): DesignPersonality {
  let reservedToExpressive = 0;
  let compactToSpacious = 0;
  let technicalToEditorial = 0;
  let neutralToBranded = 0;
  let flatToLayered = 0;
  let staticToAnimated = 0;

  // 1. Compact vs Spacious
  if (intent.informationDensity === 'COMPACT') {
    compactToSpacious = intent.productType === 'INDUSTRIAL_OPERATIONS' ? -85 : -75;
  } else if (intent.informationDensity === 'SPACIOUS') {
    compactToSpacious = +60;
  } else {
    compactToSpacious = intent.productType === 'COMMERCE' ? +30 : 0;
  }

  // 2. Reserved vs Expressive
  if (intent.productType === 'INDUSTRIAL_OPERATIONS') {
    reservedToExpressive = -70; // Highly disciplined, non-decorative
  } else if (intent.productType === 'FINANCE_DATA_HEAVY') {
    reservedToExpressive = -80; // High precision financial utility
  } else if (intent.productType === 'COMMERCE') {
    reservedToExpressive = +50; // Welcoming, conversion-focused
  } else if (intent.productType === 'MEDIA_FIRST') {
    reservedToExpressive = +30; // Visual asset showcase
  } else if (intent.brandCharacter === 'UTILITY_NEUTRAL' || intent.brandCharacter === 'AUTHORITATIVE') {
    reservedToExpressive = -60;
  } else if (intent.brandCharacter === 'FRIENDLY') {
    reservedToExpressive = +50;
  } else if (intent.brandCharacter === 'TECHNICAL') {
    reservedToExpressive = -40;
  }

  // 3. Technical vs Editorial
  if (intent.productType === 'INDUSTRIAL_OPERATIONS') {
    technicalToEditorial = -90; // Manufacturing, Gantt, Shop-floor ergonomics
  } else if (intent.productType === 'FINANCE_DATA_HEAVY') {
    technicalToEditorial = -95; // Tabular numerical alignment, audits
  } else if (intent.productType === 'DEVELOPER_TOOL' || intent.productType === 'ANALYTICS_DATA' || intent.productType === 'ADMIN_OPERATIONAL') {
    technicalToEditorial = -80;
  } else if (intent.productType === 'COMMERCE' || intent.productType === 'B2C_CONSUMER') {
    technicalToEditorial = +50;
  } else if (intent.productType === 'MEDIA_FIRST') {
    technicalToEditorial = +10;
  } else {
    technicalToEditorial = -20;
  }

  // 4. Neutral vs Branded
  if (intent.visualEmphasis === 'BRAND_FIRST') {
    neutralToBranded = +70;
  } else if (intent.visualEmphasis === 'DATA_FIRST' || intent.visualEmphasis === 'CONTENT_FIRST') {
    neutralToBranded = -50;
  } else if (intent.productType === 'INDUSTRIAL_OPERATIONS' || intent.productType === 'FINANCE_DATA_HEAVY') {
    neutralToBranded = -60;
  } else {
    neutralToBranded = 0;
  }

  // 5. Flat vs Layered
  if (intent.productType === 'INDUSTRIAL_OPERATIONS' || intent.productType === 'FINANCE_DATA_HEAVY') {
    flatToLayered = -50; // Precision 1px borders, zero fuzzy drop shadows
  } else if (intent.informationDensity === 'COMPACT' || intent.devicePriority === 'DESKTOP_FIRST') {
    flatToLayered = -20;
  } else {
    flatToLayered = +30;
  }

  // 6. Static vs Animated
  if (intent.productType === 'INDUSTRIAL_OPERATIONS') {
    staticToAnimated = -60; // Instant response, zero lag
  } else if (intent.productType === 'MEDIA_FIRST') {
    staticToAnimated = +50; // Smooth media controls and transitions
  } else if (intent.motionTolerance === 'REDUCED') {
    staticToAnimated = -100;
  } else if (intent.motionTolerance === 'SUBTLE') {
    staticToAnimated = -40;
  } else {
    staticToAnimated = +40;
  }

  const rationale = `Design personality synthesized for ${intent.productType}: ${
    compactToSpacious < 0 ? 'High-density compact layout' : 'Comfortable spacious layout'
  } with ${
    technicalToEditorial < 0 ? 'rigorous technical scanability' : 'editorial brand narrative'
  }, ${
    reservedToExpressive < 0 ? 'utility-first neutral surfaces' : 'expressive visual accents'
  }, and ${
    staticToAnimated < 0 ? 'restrained micro-motion' : 'rich responsive animations'
  }.`;

  return {
    reservedToExpressive,
    compactToSpacious,
    technicalToEditorial,
    neutralToBranded,
    flatToLayered,
    staticToAnimated,
    rationale
  };
}
