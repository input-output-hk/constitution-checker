import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface NavTabsProps {
  value: string;
  onChange: (event: React.ChangeEvent<{}>, newValue: string) => void;
}

export default function NavTabs({ value, onChange }: NavTabsProps) {
  return (
    <Tabs value={value} onChange={onChange} aria-label="nav tabs">
      <Tab label="Proposal Parameters" value="Proposal Parameters" />
      <Tab label="Guardrails" value="Guardrails" />
    </Tabs>
  );
}
