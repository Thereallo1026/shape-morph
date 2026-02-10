import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

export const gitConfig = {
  user: "Thereallo1026",
  repo: "shape-morph",
  branch: "master",
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image alt="" height={20} src="/icon.svg" width={20} />
          shape-morph
        </>
      ),
    },
    links: [],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
