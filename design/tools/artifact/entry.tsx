// Client code for the artifact copy of the site: the same components the Next.js site uses, mounted onto the
// server-rendered page that design/tools/build-artifact.mjs copies out of the Next.js build.
import { createRoot } from "react-dom/client";
import Experience from "@/components/Experience";
import Inquiry from "@/components/Inquiry";

const mount = document.getElementById("iq-mount");
if (mount) createRoot(mount).render(<Inquiry />);
const fx = document.createElement("div");
fx.hidden = true;
document.body.append(fx);
createRoot(fx).render(<Experience />);
