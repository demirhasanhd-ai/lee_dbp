const rawBasePath =
  process.env.__NEXT_ROUTER_BASEPATH || process.env.NEXT_PUBLIC_DBP_BASE_PATH || "/dbp";

export const DBP_BASE_PATH =
  rawBasePath === "/" ? "" : rawBasePath.replace(/\/+$/, "");

export function dbpPath(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!DBP_BASE_PATH) {
    return normalizedPath;
  }

  if (normalizedPath === "/") {
    return `${DBP_BASE_PATH}/`;
  }

  return `${DBP_BASE_PATH}${normalizedPath}`;
}
