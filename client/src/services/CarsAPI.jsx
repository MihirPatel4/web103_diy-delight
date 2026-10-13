export const getAllCars = async () => {
  const response = await fetch("/cars");
  const data = await response.json();
  return data;
};

export const getCar = async (carId) => {
  const response = await fetch(`/cars/${carId}`);
  const data = await response.json();
  return data;
};

const convertToBool = (value) => {
  if (value === "Yes") {
    return true;
  }
  if (value === "No") {
    return false;
  }
  return value;
};

export const createCar = async (car) => {
  const response = await fetch("/cars", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...car,
      is_convertible: convertToBool(car.is_convertible),
    }),
  });
  const data = await response.json();
  return data;
};

export const editCar = async (car) => {
  const response = await fetch(`/cars/${car.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...car,
      is_convertible: convertToBool(car.is_convertible),
    }),
  });
  const data = await response.json();
  return data;
};

export const deleteCar = async (carId) => {
  const response = await fetch(`/cars/${carId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
};
