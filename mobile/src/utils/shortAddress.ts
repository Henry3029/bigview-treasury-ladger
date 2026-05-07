export const shortAddress = (address: string): string => {

if(!address) return "ox000...000";

const start = address.slice(0, 5);
const end = address.slice(-4);

return `${start}...${end}`;
};