export function uberRide(nickname: string, formattedAddress: string) {
  const params = new URLSearchParams({
    action: "setPickup",
    pickup: "my_location",
    "dropoff[nickname]": nickname,
    "dropoff[formatted_address]": formattedAddress,
  });

  return `https://m.uber.com/ul/?${params.toString()}`;
}
