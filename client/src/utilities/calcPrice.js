import { stages } from "../data/stages";

const BASE_PRICE = 65000;

export const calcPrice = (selections) => {
  return BASE_PRICE + stages.reduce((total, stage) => {
    const selectedOption = stage.options.find(
      (option) => option.value === selections[stage.key],
    );
    return total + (selectedOption?.priceAdjustment ?? 0);
  }, 0);
};
