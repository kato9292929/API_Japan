const CITY_COORDS: Record<string, { lat: number; lon: number; name: string }> = {
  tokyo: { lat: 35.6762, lon: 139.6503, name: "Tokyo" },
  osaka: { lat: 34.6937, lon: 135.5023, name: "Osaka" },
  kyoto: { lat: 35.0116, lon: 135.7681, name: "Kyoto" },
  fukuoka: { lat: 33.5904, lon: 130.4017, name: "Fukuoka" },
  sapporo: { lat: 43.0642, lon: 141.3469, name: "Sapporo" },
  nagoya: { lat: 35.1815, lon: 136.9066, name: "Nagoya" },
  hiroshima: { lat: 34.3853, lon: 132.4553, name: "Hiroshima" },
};

export interface WeatherData {
  city: string;
  temperature_c: number;
  temperature_f: number;
  weathercode: number;
  description: string;
  humidity_pct: number;
  windspeed_kmh: number;
  timestamp: string;
}

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Foggy", 48: "Depositing rime fog",
  51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
  61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
  71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
  80: "Slight showers", 81: "Moderate showers", 82: "Violent showers",
  95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail",
};

export async function fetchWeather(city: string): Promise<WeatherData> {
  const coords = CITY_COORDS[city.toLowerCase()];
  if (!coords) {
    throw new Error(
      `Unknown city: ${city}. Supported: ${Object.keys(CITY_COORDS).join(", ")}`
    );
  }

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${coords.lat}&longitude=${coords.lon}` +
    `&current_weather=true` +
    `&hourly=relativehumidity_2m` +
    `&forecast_days=1` +
    `&timezone=Asia%2FTokyo`;

  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) {
    throw new Error(`Open-Meteo error: ${res.status}`);
  }

  const data = await res.json();
  const cw = data.current_weather;

  const currentHourIndex: number = data.hourly.time.findIndex(
    (t: string) => t === cw.time.substring(0, 16)
  );
  const humidity: number =
    currentHourIndex >= 0
      ? data.hourly.relativehumidity_2m[currentHourIndex]
      : data.hourly.relativehumidity_2m[0];

  return {
    city: coords.name,
    temperature_c: cw.temperature,
    temperature_f: Math.round(cw.temperature * 9/5 + 32 * 10) / 10,
    weathercode: cw.weathercode,
    description: WMO_DESCRIPTIONS[cw.weathercode] ?? "Unknown",
    humidity_pct: humidity,
    windspeed_kmh: cw.windspeed,
    timestamp: new Date().toISOString(),
  };
}
