
import React from 'react';
import { useTheme } from './ThemeContext';

/**
 * 显示设置面板组件
 * 提供用于更改主题颜色（Hue）的滑块
 */
const DisplaySettings = () => {
  const { hue, setHue, resetHue, defaultHue, isDisplaySettingsOpen } = useTheme();

  const handleHueChange = (e) => {
    setHue(Number(e.target.value));
  };

  if (hue === undefined) {
    return null; 
  }

  const panelClassName = `float-panel absolute transition-all w-80 right-4 px-4 py-4 ${
    !isDisplaySettingsOpen ? 'float-panel-closed' : ''
  }`;

  return (
    <div id="display-setting" className={panelClassName}>
      <div className="flex flex-row gap-2 mb-3 items-center justify-between">
        <div className="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
          Theme Color
          <button 
            aria-label="Reset to Default"
            className={`btn-regular w-7 h-7 rounded-md active:scale-90 ${
              hue === defaultHue ? 'opacity-0 pointer-events-none' : ''
            }`}
            onClick={resetHue}
          >
            <div className="text-[var(--btn-content)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.899 2.186l-2.02.73a5.002 5.002 0 00-8.545-1.554l-1.414-.707A7.002 7.002 0 014 5.101V3a1 1 0 01-2 0V2a1 1 0 011-1zm14 14a1 1 0 01-1-1v-2.101a7.002 7.002 0 01-11.899-2.186l2.02-.73a5.002 5.002 0 008.545 1.554l1.414.707A7.002 7.002 0 0116 14.899V17a1 1 0 012 0v1a1 1 0 01-1 1z" clipRule="evenodd" /></svg>
            </div>
          </button>
        </div>
        <div className="flex gap-1">
          <div id="hueValue" className="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)]">
            {hue}
          </div>
        </div>
      </div>
      <div className="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded select-none">
        <input 
          aria-label="Theme Color"
          type="range" 
          min="0" 
          max="360" 
          value={hue}
          onChange={handleHueChange}
          className="slider w-full h-full" 
          id="colorSlider" 
          step="5" 
        />
      </div>
      
      <style jsx>{`
        #display-setting input[type="range"] {
          -webkit-appearance: none;
          height: 1.5rem;
          background-image: var(--color-selection-bar);
          transition: background-image 0.15s ease-in-out;
        }

        #display-setting input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 1rem;
          width: 0.5rem;
          border-radius: 0.125rem;
          background: rgba(255, 255, 255, 0.7);
          box-shadow: none;
        }

        #display-setting input[type="range"]::-webkit-slider-thumb:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        #display-setting input[type="range"]::-webkit-slider-thumb:active {
          background: rgba(255, 255, 255, 0.6);
        }
        
        /* Firefox */
        #display-setting input[type="range"]::-moz-range-thumb {
          height: 1rem;
          width: 0.5rem;
          border-radius: 0.125rem;
          border-width: 0;
          background: rgba(255, 255, 255, 0.7);
          box-shadow: none;
        }

        #display-setting input[type="range"]::-moz-range-thumb:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        #display-setting input[type="range"]::-moz-range-thumb:active {
          background: rgba(255, 255, 255, 0.6);
        }
      `}</style>

    </div>
  );
};

export default DisplaySettings;
