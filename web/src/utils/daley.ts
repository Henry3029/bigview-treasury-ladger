export const delay = (ms: number): Promise<void> => {

if(!ms) return Promise.resolve();

return new Promise((resolve) => setTimeout(resolve, ms));
}
