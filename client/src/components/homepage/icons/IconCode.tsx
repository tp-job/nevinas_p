import React from 'react';
import { Assets } from '@/data/homeData';

const IconCodeImg = Assets.codeIcon;

export const IconCode: React.FC = () => (
  <img src={IconCodeImg} alt="Icon Code" style={{ width: '100%', height: '100%' }} />
);

export default IconCode;
