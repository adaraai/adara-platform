import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";

/**
 * NativeWind only wires `className` into React Native's own components.
 * Third-party views need their style prop mapped explicitly — do it once
 * here so the rest of the app styles gradients and blur like anything else.
 */
export const Gradient = cssInterop(LinearGradient, { className: "style" });
export const Blur = cssInterop(BlurView, { className: "style" });
