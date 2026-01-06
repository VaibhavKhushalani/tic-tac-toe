import { Suspense } from "react";
import MultiPlayer from "./multi-player";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading room…</div>}>
      <MultiPlayer />
    </Suspense>
  );
}
