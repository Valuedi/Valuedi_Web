export const GOAL_COLOR_NAME_TO_CODE: Record<string, string> = {
  Red: '#FF6363',
  RedOrange: '#FF7B2E',
  Orange: '#FFA938',
  yellow: '#FFEB38',
  Lime: '#6BE016',
  Green: '#1ED45A',
  Cyan: '#28D0ED',
  LightBlue: '#3DC2FF',
  Blue: '#3385FF',
  Violet: '#7D5EF7',
  Purple: '#D478FF',
  Pink: '#FA73E3',
};
export const GOAL_COLOR_NAME_TO_HEX: Record<string, string> = Object.fromEntries(
  Object.entries(GOAL_COLOR_NAME_TO_CODE).map(([k, v]) => [k, v.replace(/^#/, '')])
);

export const GOAL_COLOR_NAME_TO_API_ENUM: Record<string, string> = {
  Red: 'RED',
  RedOrange: 'RED_ORANGE',
  Orange: 'ORANGE',
  yellow: 'YELLOW',
  Lime: 'LIME',
  Green: 'GREEN',
  Cyan: 'CYAN',
  LightBlue: 'LIGHT_BLUE',
  Blue: 'BLUE',
  Violet: 'VIOLET',
  Purple: 'PURPLE',
  Pink: 'PINK',
  LightGreen: 'LIGHT_GREEN',
  LightOrange: 'LIGHT_ORANGE',
};

export function toHexColor(apiColorCode: string): string {
  const s = apiColorCode.trim();
  if (s.startsWith('#')) return s;
  if (/^[0-9A-Fa-f]{6}$/.test(s)) return `#${s}`;
  return s;
}

export function getColorNameFromHex(hex: string): string | undefined {
  const normalized = hex.replace(/^#/, '').trim().toUpperCase();
  const entry = Object.entries(GOAL_COLOR_NAME_TO_HEX).find(([, v]) => v.toUpperCase() === normalized);
  return entry?.[0];
}
