import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { LerpIcon } from "./lerp-icon";

export const gitConfig = {
  user: "Thereallo1026",
  repo: "shape-morph",
  branch: "master",
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <LerpIcon />,
    },
    links: [],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
