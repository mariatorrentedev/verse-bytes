import { sessionStorage } from "./session.server";
import type { Theme } from "./theme-provider";
import { isTheme } from "./theme-provider";

export async function getThemeSession(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return {
    getTheme: () => {
      const themeValue = session.get("theme");
      return isTheme(themeValue) ? themeValue : null;
    },
    setTheme: (theme: Theme) => session.set("theme", theme),
    commit: () => sessionStorage.commitSession(session),
  };
}
