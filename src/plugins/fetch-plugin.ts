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
        { filter: /\.css$/ },
        async ({ path }: esbuild.OnLoadArgs) => {
          const cachedResult = await getCachedResult<esbuild.OnLoadResult>(
            path
          );
          if (cachedResult) {
            return cachedResult;
          }

          console.log(path);

          const { data, request } = await axios.get(path);

          const escapedData = data
            .replace(/\n/g, "")
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'");

          const contents = `
          const style = document.createElement('style');
          style.innerText = '${escapedData}';
          document.head.appendChild(style);
          `;

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
        const cachedResult = await getCachedResult<esbuild.OnLoadResult>(path);
        if (cachedResult) {
          return cachedResult;
        }

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
