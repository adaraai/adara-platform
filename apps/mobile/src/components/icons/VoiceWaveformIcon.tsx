import Svg, { Rect } from "react-native-svg";

/** ChatGPT-style voice waveform — five vertical bars, equalizer shape. */
const BARS = [
  { x: 3, height: 10 },
  { x: 8.5, height: 16 },
  { x: 14, height: 22 },
  { x: 19.5, height: 13 },
  { x: 25, height: 11 },
] as const;

const BAR_WIDTH = 2.8;
const VIEW_SIZE = 28;

export type VoiceWaveformIconProps = {
  size?: number;
  color?: string;
};

export function VoiceWaveformIcon({ size = 24, color = "#FFFFFF" }: VoiceWaveformIconProps) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`} fill="none">
      {BARS.map((bar) => {
        const y = (VIEW_SIZE - bar.height) / 2;
        return (
          <Rect
            key={bar.x}
            x={bar.x}
            y={y}
            width={BAR_WIDTH}
            height={bar.height}
            rx={BAR_WIDTH / 2}
            fill={color}
          />
        );
      })}
    </Svg>
  );
}
