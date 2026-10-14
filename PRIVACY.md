# Privacy Policy — Verso for phpMyAdmin

**Last updated:** 2026-10-14

## Data collection

Verso for phpMyAdmin does **not** collect, transmit, or share any personal data, browsing history, database contents, or any other information.

## Data storage

All settings (selected theme, server labels, density preference, font configuration) are stored **locally on your device** using the `chrome.storage.local` API and, optionally, `chrome.storage.sync` if you enable cross-device synchronization.

- `chrome.storage.local`: settings are stored only on the current device.
- `chrome.storage.sync`: if enabled by the user, settings (theme, density, font preferences) are synced via the user's Chrome profile. No data leaves the Chrome sync infrastructure.

## Permissions

| Permission | Why it's needed |
|---|---|
| `storage` | Save your theme, density, server labels, and other preferences. |
| `scripting` | Inject the dark mode CSS and scripts into your phpMyAdmin pages. |
| `activeTab` | Detect whether the current tab is a phpMyAdmin page when you open the popup. |
| Optional host permissions | Granted per-site when you click "Enable on this site." Only requested for the specific origin you choose. |

## Third parties

This extension does not use any third-party analytics, tracking, advertising, or telemetry services. No data is sent to any external server.

## Open source

The full source code is available for inspection. There is no obfuscated or minified code.

## Contact

If you have questions about this privacy policy, open an issue on the project repository.
