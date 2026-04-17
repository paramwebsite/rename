import FireflyNameStyle from './FireflyNameStyle';
import PixelRainNameStyle from './PixelRainNameStyle';

export const styleRegistry = [
  {
    id: 'firefly',
    label: 'Firefly Particles',
    component: FireflyNameStyle,
    enabled: true,
  },
  {
    id: 'pixel-rain',
    label: 'Pixel Rain',
    component: PixelRainNameStyle,
    enabled: true,
  }
];

export const getEnabledStyles = () => styleRegistry.filter(s => s.enabled);
