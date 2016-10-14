export const isImmutable = appState => (typeof appState.get === 'function');

export default {
  isImmutable,
};
