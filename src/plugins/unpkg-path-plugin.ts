import axios from "axios";
import * as esbuild from "esbuild-wasm";
import localForage from "localforage";

const fileCache = localForage.createInstance({ name: "filecache" });

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onResolve(
        { filter: /.*/ },
        async ({ path, resolveDir }: esbuild.OnResolveArgs) => {
          if (path === "index.js") {
            return { path, namespace: "a" };
          }

          if (path.includes("./") || path.includes("../")) {
            return {
              namespace: "a",
              path: new URL(path, `https://unpkg.com${resolveDir}/`).href,
            };
          }

          return {
            namespace: "a",
            path: `https://unpkg.com/${path}`,
          };
        }
      );

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: `
              import React, { useState } from 'react';
              console.log(React, useState);
            `,
          };
        }

        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) {
          return cachedResult;
        }

        const { data, request } = await axios.get(args.path);
        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
