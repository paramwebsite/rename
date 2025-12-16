export interface PeriodicElement {
  symbol: string;
  name: string;
  atomicNumber: number;
  type: 'metal' | 'nonmetal' | 'metalloid' | 'noble-gas';
  color: {
    from: string;
    to: string;
  };
}

// Color schemes for each element type using hex codes
const elementColors = {
  metal: {
    from: 'from-[#FFB74D]',
    to: 'to-[#FFA726]'
  },
  nonmetal: {
    from: 'from-[#4CAF50]',
    to: 'to-[#43A047]'
  },
  metalloid: {
    from: 'from-[#9C27B0]',
    to: 'to-[#8E24AA]'
  },
  'noble-gas': {
    from: 'from-[#2196F3]',
    to: 'to-[#1E88E5]'
  }
} as const;

export const periodicElements: PeriodicElement[] = [
  { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, type: 'nonmetal', color: elementColors.nonmetal },
  { symbol: 'He', name: 'Helium', atomicNumber: 2, type: 'noble-gas', color: elementColors['noble-gas'] },
  { symbol: 'Li', name: 'Lithium', atomicNumber: 3, type: 'metal', color: elementColors.metal },
  { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, type: 'metal', color: elementColors.metal },
  { symbol: 'B', name: 'Boron', atomicNumber: 5, type: 'metalloid', color: elementColors.metalloid },
  { symbol: 'C', name: 'Carbon', atomicNumber: 6, type: 'nonmetal', color: elementColors.nonmetal },
  { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, type: 'nonmetal', color: elementColors.nonmetal },
  { symbol: 'O', name: 'Oxygen', atomicNumber: 8, type: 'nonmetal', color: elementColors.nonmetal },
  { symbol: 'F', name: 'Fluorine', atomicNumber: 9, type: 'nonmetal', color: elementColors.nonmetal },
  { symbol: 'Ne', name: 'Neon', atomicNumber: 10, type: 'noble-gas', color: elementColors['noble-gas'] },
  { symbol: 'Na', name: 'Sodium', atomicNumber: 11, type: 'metal', color: elementColors.metal },
  { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, type: 'metal', color: elementColors.metal },
  { symbol: 'Al', name: 'Aluminum', atomicNumber: 13, type: 'metal', color: elementColors.metal },
  { symbol: 'Si', name: 'Silicon', atomicNumber: 14, type: 'metalloid', color: elementColors.metalloid },
  { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, type: 'nonmetal', color: elementColors.nonmetal },
  { symbol: 'S', name: 'Sulfur', atomicNumber: 16, type: 'nonmetal', color: elementColors.nonmetal },
  { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, type: 'nonmetal', color: elementColors.nonmetal },
  { symbol: 'Ar', name: 'Argon', atomicNumber: 18, type: 'noble-gas', color: elementColors['noble-gas'] },
  { symbol: 'K', name: 'Potassium', atomicNumber: 19, type: 'metal', color: elementColors.metal },
  { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, type: 'metal', color: elementColors.metal },
  { symbol: 'Sc', name: 'Scandium', atomicNumber: 21, type: 'metal', color: elementColors.metal },
  { symbol: 'Ti', name: 'Titanium', atomicNumber: 22, type: 'metal', color: elementColors.metal },
  { symbol: 'V', name: 'Vanadium', atomicNumber: 23, type: 'metal', color: elementColors.metal },
  { symbol: 'Cr', name: 'Chromium', atomicNumber: 24, type: 'metal', color: elementColors.metal },
  { symbol: 'Mn', name: 'Manganese', atomicNumber: 25, type: 'metal', color: elementColors.metal },
  { symbol: 'Fe', name: 'Iron', atomicNumber: 26, type: 'metal', color: elementColors.metal },
  { symbol: 'Co', name: 'Cobalt', atomicNumber: 27, type: 'metal', color: elementColors.metal },
  { symbol: 'Ni', name: 'Nickel', atomicNumber: 28, type: 'metal', color: elementColors.metal },
  { symbol: 'Cu', name: 'Copper', atomicNumber: 29, type: 'metal', color: elementColors.metal },
  { symbol: 'Zn', name: 'Zinc', atomicNumber: 30, type: 'metal', color: elementColors.metal },
  { symbol: 'Ga', name: 'Gallium', atomicNumber: 31, type: 'metal', color: elementColors.metal },
  { symbol: 'Ge', name: 'Germanium', atomicNumber: 32, type: 'metalloid', color: elementColors.metalloid },
  { symbol: 'As', name: 'Arsenic', atomicNumber: 33, type: 'metalloid', color: elementColors.metalloid },
  { symbol: 'Se', name: 'Selenium', atomicNumber: 34, type: 'nonmetal', color: elementColors.nonmetal },
  { symbol: 'Br', name: 'Bromine', atomicNumber: 35, type: 'nonmetal', color: elementColors.nonmetal },
  { symbol: 'Kr', name: 'Krypton', atomicNumber: 36, type: 'noble-gas', color: elementColors['noble-gas'] },
  { symbol: 'I', name: 'Iodine', atomicNumber: 53, type: 'nonmetal', color: elementColors.nonmetal },
  { symbol: 'Xe', name: 'Xenon', atomicNumber: 54, type: 'noble-gas', color: elementColors['noble-gas'] },
  { symbol: 'Cs', name: 'Cesium', atomicNumber: 55, type: 'metal', color: elementColors.metal },
  { symbol: 'Ba', name: 'Barium', atomicNumber: 56, type: 'metal', color: elementColors.metal },
  { symbol: 'La', name: 'Lanthanum', atomicNumber: 57, type: 'metal', color: elementColors.metal },
  { symbol: 'Hf', name: 'Hafnium', atomicNumber: 72, type: 'metal', color: elementColors.metal },
  { symbol: 'Ta', name: 'Tantalum', atomicNumber: 73, type: 'metal', color: elementColors.metal },
  { symbol: 'W', name: 'Tungsten', atomicNumber: 74, type: 'metal', color: elementColors.metal },
  { symbol: 'Re', name: 'Rhenium', atomicNumber: 75, type: 'metal', color: elementColors.metal },
  { symbol: 'Os', name: 'Osmium', atomicNumber: 76, type: 'metal', color: elementColors.metal },
  { symbol: 'Ir', name: 'Iridium', atomicNumber: 77, type: 'metal', color: elementColors.metal },
  { symbol: 'Pt', name: 'Platinum', atomicNumber: 78, type: 'metal', color: elementColors.metal },
  { symbol: 'Au', name: 'Gold', atomicNumber: 79, type: 'metal', color: elementColors.metal },
  { symbol: 'Hg', name: 'Mercury', atomicNumber: 80, type: 'metal', color: elementColors.metal },
  { symbol: 'Tl', name: 'Thallium', atomicNumber: 81, type: 'metal', color: elementColors.metal },
  { symbol: 'Pb', name: 'Lead', atomicNumber: 82, type: 'metal', color: elementColors.metal },
  { symbol: 'Bi', name: 'Bismuth', atomicNumber: 83, type: 'metal', color: elementColors.metal },
  { symbol: 'Po', name: 'Polonium', atomicNumber: 84, type: 'metal', color: elementColors.metal },
  { symbol: 'At', name: 'Astatine', atomicNumber: 85, type: 'metalloid', color: elementColors.metalloid },
  { symbol: 'Rn', name: 'Radon', atomicNumber: 86, type: 'noble-gas', color: elementColors['noble-gas'] },
  { symbol: 'Fr', name: 'Francium', atomicNumber: 87, type: 'metal', color: elementColors.metal },
  { symbol: 'Ra', name: 'Radium', atomicNumber: 88, type: 'metal', color: elementColors.metal },
  { symbol: 'Ac', name: 'Actinium', atomicNumber: 89, type: 'metal', color: elementColors.metal },
  { symbol: 'Th', name: 'Thorium', atomicNumber: 90, type: 'metal', color: elementColors.metal },
  { symbol: 'Pa', name: 'Protactinium', atomicNumber: 91, type: 'metal', color: elementColors.metal },
  { symbol: 'U', name: 'Uranium', atomicNumber: 92, type: 'metal', color: elementColors.metal },
  { symbol: 'Np', name: 'Neptunium', atomicNumber: 93, type: 'metal', color: elementColors.metal },
  { symbol: 'Pu', name: 'Plutonium', atomicNumber: 94, type: 'metal', color: elementColors.metal },
  { symbol: 'Am', name: 'Americium', atomicNumber: 95, type: 'metal', color: elementColors.metal },
  { symbol: 'Cm', name: 'Curium', atomicNumber: 96, type: 'metal', color: elementColors.metal },
  { symbol: 'Bk', name: 'Berkelium', atomicNumber: 97, type: 'metal', color: elementColors.metal },
  { symbol: 'Cf', name: 'Californium', atomicNumber: 98, type: 'metal', color: elementColors.metal },
  { symbol: 'Es', name: 'Einsteinium', atomicNumber: 99, type: 'metal', color: elementColors.metal },
  { symbol: 'Fm', name: 'Fermium', atomicNumber: 100, type: 'metal', color: elementColors.metal },
  { symbol: 'Md', name: 'Mendelevium', atomicNumber: 101, type: 'metal', color: elementColors.metal },
  { symbol: 'No', name: 'Nobelium', atomicNumber: 102, type: 'metal', color: elementColors.metal },
  { symbol: 'Lr', name: 'Lawrencium', atomicNumber: 103, type: 'metal', color: elementColors.metal }
];