export function uberRide(
  nickname: string,
  formattedAddress: string,
  latitude: number,
  longitude: number,
) {
  const params = new URLSearchParams({
    "drop[0]": JSON.stringify({
      latitude,
      longitude,
      addressLine1: nickname,
      addressLine2: formattedAddress,
    }),
  });

  return `https://m.uber.com/looking?${params}`;
}
