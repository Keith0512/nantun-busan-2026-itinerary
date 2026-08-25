export function uberRide(nickname: string, formattedAddress: string) {
  return [
    "https://m.uber.com/ul/?action=setPickup",
    "pickup=my_location",
    `dropoff[nickname]=${encodeURIComponent(nickname)}`,
    `dropoff[formatted_address]=${encodeURIComponent(formattedAddress)}`,
  ].join("&");
}
