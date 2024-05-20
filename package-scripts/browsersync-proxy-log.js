import chalk from "chalk";

/**
 * Afficher dans la console l'url de développement de DDEV
 */
const log = console.log;
const url = process.env.DDEV_PRIMARY_URL + ":3000";

log(
  chalk.hex("#f26135")(`
╭─────────────────────────────────╮
      Proxying browsersync on
  ${url}
╰─────────────────────────────────╯
`)
);
