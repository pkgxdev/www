import Markdown from "../components/Markdown";
import md from "./privacy-policy.md?raw";

export default function PrivacyPolicy() {
  return <Markdown txt={md} />;
}
