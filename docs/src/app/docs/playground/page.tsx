import { DocsBody, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { Playground } from "@/components/playground";

export default function PlaygroundPage() {
  return (
    <DocsPage>
      <DocsTitle>Playground</DocsTitle>
      <DocsBody>
        <p className="text-fd-muted-foreground">
          Preview all 35 shapes and morph between any two of them.
        </p>
        <Playground />
      </DocsBody>
    </DocsPage>
  );
}
