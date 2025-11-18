import { Providers } from "./providers";
import FileExplorer from "../components/FileExplorer";

export default function Page() {
  return (
    <Providers>
      <main style={{ padding: 24 }}>
        <FileExplorer />
      </main>
    </Providers>
  );
}
