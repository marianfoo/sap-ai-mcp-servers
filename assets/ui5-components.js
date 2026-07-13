import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";
import { registerThemePropertiesLoader } from "@ui5/webcomponents-base/dist/asset-registries/Themes.js";
import "@ui5/webcomponents-base/dist/features/F6Navigation.js";
import horizonDarkBase from "@ui5/webcomponents-theming/dist/generated/themes/sap_horizon_dark/parameters-bundle.css.js";
import horizonDarkMain from "@ui5/webcomponents/dist/generated/themes/sap_horizon_dark/parameters-bundle.css.js";
import horizonDarkFiori from "@ui5/webcomponents-fiori/dist/generated/themes/sap_horizon_dark/parameters-bundle.css.js";

registerThemePropertiesLoader("@ui5/webcomponents-theming", "sap_horizon_dark", async () => horizonDarkBase);
registerThemePropertiesLoader("@ui5/webcomponents", "sap_horizon_dark", async () => horizonDarkMain, "host");
registerThemePropertiesLoader("@ui5/webcomponents-fiori", "sap_horizon_dark", async () => horizonDarkFiori, "host");

import "@ui5/webcomponents/dist/Avatar.js";
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents/dist/Card.js";
import "@ui5/webcomponents/dist/CardHeader.js";
import "@ui5/webcomponents/dist/Icon.js";
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/Option.js";
import "@ui5/webcomponents/dist/Select.js";
import "@ui5/webcomponents/dist/Tag.js";
import "@ui5/webcomponents/dist/Text.js";
import "@ui5/webcomponents/dist/Title.js";
import "@ui5/webcomponents/dist/ToggleButton.js";
import "@ui5/webcomponents/dist/Toolbar.js";
import "@ui5/webcomponents/dist/ToolbarSpacer.js";

import "@ui5/webcomponents-fiori/dist/DynamicPage.js";
import "@ui5/webcomponents-fiori/dist/DynamicPageHeader.js";
import "@ui5/webcomponents-fiori/dist/DynamicPageTitle.js";
import "@ui5/webcomponents-fiori/dist/IllustratedMessage.js";
import "@ui5/webcomponents-fiori/dist/ShellBar.js";
import "@ui5/webcomponents-fiori/dist/ShellBarItem.js";
import "@ui5/webcomponents-fiori/dist/illustrations/NoData.js";

import "@ui5/webcomponents-icons/dist/activities.js";
import "@ui5/webcomponents-icons/dist/add.js";
import "@ui5/webcomponents-icons/dist/calendar.js";
import "@ui5/webcomponents-icons/dist/dark-mode.js";
import "@ui5/webcomponents-icons/dist/decline.js";
import "@ui5/webcomponents-icons/dist/filter.js";
import "@ui5/webcomponents-icons/dist/lightbulb.js";
import "@ui5/webcomponents-icons/dist/palette.js";
import "@ui5/webcomponents-icons/dist/reset.js";
import "@ui5/webcomponents-icons/dist/source-code.js";
import "@ui5/webcomponents-icons/dist/world.js";

function themeName(mode) {
  return mode === "dark" ? "sap_horizon_dark" : "sap_horizon";
}

const initialTheme = document.documentElement.dataset.theme
  || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.dataset.theme = initialTheme;
await setTheme(themeName(initialTheme));

document.addEventListener("catalog-theme-change", (event) => {
  setTheme(themeName(event.detail?.theme));
});
