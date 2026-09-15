import { Redirect } from "expo-router";

/** Legacy route — Talk home lives at `/`. */
export default function VoiceRedirect() {
  return <Redirect href="/" />;
}
