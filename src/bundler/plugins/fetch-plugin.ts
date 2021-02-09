import axios from "axios";
import * as esbuild from "esbuild-wasm";
import localForage from "localforage";

const fileCache = localForage.createInstance({ name: "filecache" });

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /^index\.js$/ }, () => ({
        loader: "jsx",
        contents: inputCode,
      }));

      build.onLoad(
        { filter: /.*/ },
        async ({ path }: esbuild.OnLoadArgs) =>
          await getCachedResult<esbuild.OnLoadResult>(path)
      );

      build.onLoad(
        { filter: /\.css$/ },
        async ({ path }: esbuild.OnLoadArgs) => {
          const { data, request } = await axios.get(path);
          const contents = wrapCssWithJs(escape(data));
          const result: esbuild.OnLoadResult = {
            loader: "jsx",
            contents,
            resolveDir: new URL("./", request.responseURL).pathname,
          };
          await setCachedResult<esbuild.OnLoadResult>(path, result);
          return result;
        }
      );

      build.onLoad({ filter: /.*/ }, async ({ path }: esbuild.OnLoadArgs) => {
        const { data, request } = await axios.get(path);
        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        await setCachedResult<esbuild.OnLoadResult>(path, result);
        return result;
      });
    },
  };
};

function getCachedResult<T>(key: string) {
  return fileCache.getItem<T>(key);
}

function setCachedResult<T>(key: string, result: T) {
  return fileCache.setItem(key, result);
}

function escape(data: string): string {
  return data.replace(/\n/g, "").replace(/"/g, '\\"').replace(/'/g, "\\'");
}

function wrapCssWithJs(css: string): string {
  return `
  const style = document.createElement('style');
  style.innerText = '${css}';
  document.head.appendChild(style);
  `;
}
