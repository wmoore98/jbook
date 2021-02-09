import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /^index\.js$/ }, () => ({
        namespace: "a",
        path: "index.js",
      }));

      build.onResolve(
        { filter: /^\.+\// },
        ({ path, resolveDir }: esbuild.OnResolveArgs) => ({
          namespace: "a",
          path: new URL(path, `https://unpkg.com${resolveDir}/`).href,
        })
      );

      build.onResolve({ filter: /.*/ }, ({ path }: esbuild.OnResolveArgs) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${path}`,
        };
      });
    },
  };
};
