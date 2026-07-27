/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DocumentsWorkspace } from './documents/DocumentsWorkspace';

export const CareerDocumentsView: React.FC = () => {
  return (
    <div className="w-full">
      <DocumentsWorkspace />
    </div>
  );
};

export default CareerDocumentsView;
