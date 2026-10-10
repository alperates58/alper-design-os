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
    compactToSpacious = -75;
  } else if (intent.informationDensity === 'SPACIOUS') {
    compactToSpacious = +60;
  } else {
    compactToSpacious = 0;
  }

  // 2. Reserved vs Expressive
  if (intent.brandCharacter === 'UTILITY_NEUTRAL' || intent.brandCharacter === 'AUTHORITATIVE') {
    reservedToExpressive = -60;
  } else if (intent.brandCharacter === 'FRIENDLY') {
    reservedToExpressive = +50;
  } else if (intent.brandCharacter === 'TECHNICAL') {
    reservedToExpressive = -40;
  }

  // 3. Technical vs Editorial
  if (intent.productType === 'DEVELOPER_TOOL' || intent.productType === 'ANALYTICS_DATA' || intent.productType === 'ADMIN_OPERATIONAL') {
    technicalToEditorial = -80;
  } else if (intent.productType === 'B2C_CONSUMER') {
    technicalToEditorial = +50;
  } else {
    technicalToEditorial = -20;
  }

  // 4. Neutral vs Branded
  if (intent.visualEmphasis === 'BRAND_FIRST') {
    neutralToBranded = +70;
  } else if (intent.visualEmphasis === 'DATA_FIRST' || intent.visualEmphasis === 'CONTENT_FIRST') {
    neutralToBranded = -50;
  } else {
    neutralToBranded = 0;
  }

  // 5. Flat vs Layered
  if (intent.informationDensity === 'COMPACT' || intent.devicePriority === 'DESKTOP_FIRST') {
    flatToLayered = -20; // Crisp subtle borders rather than heavy floating drop shadows
  } else {
    flatToLayered = +30;
  }

  // 6. Static vs Animated
  if (intent.motionTolerance === 'REDUCED') {
    staticToAnimated = -100;
  } else if (intent.motionTolerance === 'SUBTLE') {
    staticToAnimated = -40;
  } else {
    staticToAnimated = +40;
  }

  const rationale = `Design personality synthesized: ${
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
