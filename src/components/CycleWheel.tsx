/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FloralGarden3D } from './FloralGarden3D';
import { CycleCalculationResult } from '../types';

interface CycleWheelProps {
  stats: CycleCalculationResult;
  onOpenLogModal?: () => void;
  onQuickLogPeriodStart?: () => void;
  className?: string;
  showDetails?: boolean;
}

/**
 * CycleWheel now renders the interactive 3D Floral Garden ('Jardin Floral'),
 * where flowers gracefully bloom and close according to cycle phases.
 */
export const CycleWheel: React.FC<CycleWheelProps> = props => {
  return <FloralGarden3D {...props} />;
};

export default CycleWheel;
