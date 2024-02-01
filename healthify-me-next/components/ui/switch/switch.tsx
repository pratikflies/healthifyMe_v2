import React, { useState } from 'react';
import * as Switch from '@radix-ui/react-switch';
import './style.css';

const SwitchDemo = ({ theme, setTheme } : any) => {
  const onSwitch = () => {
    setTheme(!theme);
  };

  return (
    <form>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label className="Label" htmlFor="airplane-mode" style={{ paddingRight: 15 }}>
          Theme
        </label>
        <Switch.Root className="SwitchRoot" id="airplane-mode" onCheckedChange={onSwitch}>
          <Switch.Thumb className="SwitchThumb" />
        </Switch.Root>
      </div>
    </form>
  );
};

export default SwitchDemo;
