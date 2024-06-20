import type { AppLoadContext, SessionStorage } from "@remix-run/server-runtime";
import { Strategy, AuthenticateOptions } from "remix-auth";

export interface FormStrategyVerifyParams {
  form: FormData;
  context?: AppLoadContext;
  request: Request;
}

export class FormStrategy<User> extends Strategy<
  User,
  FormStrategyVerifyParams
> {
  name = "form";

  async authenticate(
    request: Request,
    sessionStorage: SessionStorage,
    options: AuthenticateOptions
  ): Promise<User> {
    try {
      const form = await request.clone().formData();
      const user = await this.verify({
        form,
        context: options.context,
        request,
      });
      return this.success(user, request, sessionStorage, options);
    } catch (error) {
      if (error instanceof Error) {
        return await this.failure(
          error.message,
          request,
          sessionStorage,
          options,
          error
        );
      }

      if (typeof error === "string") {
        return await this.failure(
          error,
          request,
          sessionStorage,
          options,
          new Error(error)
        );
      }

      return await this.failure(
        "Unknown error",
        request,
        sessionStorage,
        options,
        new Error(JSON.stringify(error, null, 2))
      );
    }
  }
}
