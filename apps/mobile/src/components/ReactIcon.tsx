import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import Svg, { Circle, Line, Path, Polyline, Rect } from "react-native-svg";
import type { IconType } from "react-icons";

type IconFn = IconType;

/**
 * Renders any `react-icons` glyph on React Native via `react-native-svg`.
 * Invokes the icon factory (GenIcon) and maps DOM path/line/circle nodes.
 */
export function ReactIcon({
  icon: Icon,
  size = 24,
  color = "#111111",
  strokeWidth: strokeWidthProp,
}: {
  icon: IconFn;
  size?: number;
  color?: string;
  /** Override stroke weight for outline icons (Feather default is 2). */
  strokeWidth?: number;
}) {
  const tree = Icon({ size, color }) as ReactElement<{
    attr?: Record<string, string | number>;
    children?: ReactNode;
  }>;
  const attr = tree.props.attr ?? {};
  const viewBox = String(attr.viewBox ?? "0 0 24 24");
  const stroked = attr.stroke === "currentColor" || attr.fill === "none";
  const strokeWidth = Number(
    strokeWidthProp ?? attr.strokeWidth ?? (stroked ? 2 : 0),
  );

  return (
    <Svg width={size} height={size} viewBox={viewBox} fill="none">
      {Children.map(tree.props.children, (child, index) => {
        if (!isValidElement(child)) return null;
        const p = child.props as Record<string, string | number | undefined>;
        const d = p.d != null ? String(p.d) : "";

        // Skip Material spacer paths
        if (d === "M0 0h24v24H0z" || d === "M0 0h24v24H0V0z") return null;

        const commonStroke = {
          stroke: color,
          strokeWidth,
          strokeLinecap: "round" as const,
          strokeLinejoin: "round" as const,
          fill: "none" as const,
        };

        if (child.type === "path") {
          if (stroked) {
            return <Path key={index} d={d} {...commonStroke} />;
          }
          if (p.fill === "none") return null;
          return <Path key={index} d={d} fill={color} stroke="none" />;
        }

        if (child.type === "line") {
          return (
            <Line
              key={index}
              x1={Number(p.x1)}
              y1={Number(p.y1)}
              x2={Number(p.x2)}
              y2={Number(p.y2)}
              {...commonStroke}
            />
          );
        }

        if (child.type === "circle") {
          return (
            <Circle
              key={index}
              cx={Number(p.cx)}
              cy={Number(p.cy)}
              r={Number(p.r)}
              {...(stroked ? commonStroke : { fill: color, stroke: "none" })}
            />
          );
        }

        if (child.type === "polyline") {
          return <Polyline key={index} points={String(p.points ?? "")} {...commonStroke} />;
        }

        if (child.type === "rect") {
          return (
            <Rect
              key={index}
              x={Number(p.x)}
              y={Number(p.y)}
              width={Number(p.width)}
              height={Number(p.height)}
              rx={p.rx != null ? Number(p.rx) : undefined}
              {...(stroked ? commonStroke : { fill: color, stroke: "none" })}
            />
          );
        }

        return null;
      })}
    </Svg>
  );
}
