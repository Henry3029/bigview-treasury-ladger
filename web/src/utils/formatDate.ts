export const formatDate = (timeStamp: number | string | bigint): string => {

if(!timeStamp) return "N/A";

const date = new Date(Number(timeStamp) * 1000);

return new Intl.DateTimeFormat('en-US', {
month: 'long', 
day: 'numeric', 
year: 'numeric'
}).format(date);
}
