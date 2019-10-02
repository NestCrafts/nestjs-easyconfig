export interface Config {
  /**
   * path to the file to load.
   * If this is not passed, Easyconfig load the environment file based on
   * the NODE_ENV with the naming convention of `.env.<NODE_ENV>`.
   *
   * For example, if the NODE_ENV is `production`, the file `.env.<NODE_ENV>` will load.
   */
  path?: string;
  /**
   * checks whether the used env file is missing some keys.
   *
   * For example, if the given `.env` file has the following content:
   * ```
   * VAR=true
   * ```
   *
   * and the `.env.sample` file has the following:
   * ```
   * VAR=true
   * VAR2=sample value
   * ```
   *
   * the following error log will be printed:
   * ```
   * MissingEnvVarsError: [VAR2] were defined in .env.example but are not present in the environment:
   *     This may cause the app to misbehave.
   * ```
   */
  safe?: boolean;
}
