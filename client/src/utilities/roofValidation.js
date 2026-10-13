const convertibleRoofOptions = new Set(["Transparent Roof", "Dual Roof"]);

export const isRoofCompatible = (roofOption, convertibleChoice) => {
  if (!roofOption) {
    return true;
  }

  if (convertibleChoice !== "Yes" && convertibleChoice !== "No") {
    return false;
  }

  const requiresConvertible = convertibleRoofOptions.has(roofOption);

  return requiresConvertible === (convertibleChoice === "Yes");
};

export const getRoofAvailability = (roofOption, convertibleChoice) => {
  if (convertibleChoice !== "Yes" && convertibleChoice !== "No") {
    return {
      disabled: true,
      message: "Choose Yes or No for convertible before selecting a roof.",
    };
  }

  if (isRoofCompatible(roofOption, convertibleChoice)) {
    return { disabled: false, message: "" };
  }

  return {
    disabled: true,
    message: `Only available for ${convertibleRoofOptions.has(roofOption) ? "convertibles" : "non-convertibles"}.`,
  };
};
