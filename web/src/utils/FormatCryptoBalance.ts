import {formatUnits} from 'viem';
 
export const FormatCryptoBalance = (rawValue: bigint | undefined, decimal: number = 18): string => {

if(!rawValue) return "0.00";

const formatted = formatUnits(rawValue, decimal);

return `$${parseFloat(formatted).toFixed(2)}`;
};