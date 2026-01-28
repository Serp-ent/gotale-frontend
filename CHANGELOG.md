# Changelog

## 0.14.2

- Removed junk code.
- Updated `backend-schema.yml`.

## 0.14.1

- Fixed a bug in the Gamebook Creator where clicking the "Quick Add" button (plus icon) created multiple duplicate nodes instead of one.
- Fixed TypeScript build errors related to missing `steps` property in `Scenario` type.
- Fixed build script by removing legacy static export commands.

## 0.14.0

- Updated Scenario Details page (`/scenarios/[id]`) to use `scenariosFullRetrieve` and provide an "Edit in Creator" button.
- Regenerated API client to support new endpoints and schema changes.

## 0.13.0

- Improved Gamebook Creator with split connections for better visibility of parallel paths.
- Added edge deletion and color-coded connections based on output index.
- Enforced character limits and input validation for titles and choice text.

## 0.12.3

- Redesigned Login/Registration modal with enhanced error feedback and dark mode optimizations.
- Refactored authentication components for better maintainability and state consistency.

## 0.12.2

- Fixed API client generation path in `scripts/generate-api.sh` (changed from `src/lib/api_client` to `src/lib/api`).

## 0.12.1

- Updated `backend-schema.yml` to version 0.18.1, adding `GameHistory` support.
- Improved `scripts/get-schema.sh` to support configurable `SERVER_ADDRESS`.
- Cleaned up output in `scripts/generate-api.sh`.

## 0.12.0

- Added `Dockerfile` for containerization.
- Updated `next.config.ts` to support standalone output for Docker.

## 0.11.1

- Fixed build errors in scenario and user pages.
- Removed `output: 'export'` from `next.config.ts`, moving away from static export.

## 0.11.0

- Removed the Team ("Zespol") page and associated components.

## 0.10.2

- Updated the project description and PDF.
- Minor updates to the Documentation page.

## 0.10.1

- Updated the Documentation page layout and content.
- Removed the deprecated "Zestawienie spotkań" PDF.

## 0.10.0

- Integrated `leaflet` and `react-leaflet` for map functionality.
- Added `MapPicker` component for location selection in the Gamebook Creator.
- Updated `StepNode` to support location data and map integration.
- Added `@types/leaflet` for type safety.

## 0.9.1

- Reordered navigation tabs in the header.

## 0.9.0

- Removed the Contact page and associated configurations.

## 0.8.0

- Redesigned and improved the Front Page with better layout and visuals.
- Added `AlertDialog` component from Radix UI for confirmation dialogs.
- Enhanced Gamebook Creator with better step node interactions and UI.
- Improved Scenario and User Profile pages with better data fetching and presentation.

## 0.7.2

- Added Scenario browsing and details pages.
- Refactored User Profile and User Details pages for better interactivity.
- Improved Gamebook Creator logic and UI.
- Added `Sonner` UI component wrapper.
- Added `@types/dagre` for type safety.

## 0.7.1

- Added auto-expanding description fields and error indicators to the gamebook creator's `StepNode`.
- Implemented `AuthProvider` and `axiosInstance` for centralized authentication and API handling.
- Added login modal, user profile, and user details pages.
- Updated documentation page with links to project reports.

## 0.7.0

- Added `@xyflow/react` and `dagre` for diagram/flow visualization.
- Added `sonner` for toast notifications.
- Added `uuid` utility.
- Integrated `@openapitools/openapi-generator-cli` for API client generation.

## 0.6.1

- Removed unused credentials.

## 0.6.0

- Added API client generation scripts (`scripts/get-schema.sh` and `scripts/generate-api.sh`).

## 0.5.0

- Forked the repository from [zesp11/zesp11.github.io](https://github.com/zesp11/zesp11.github.io).
- Add `CHANGELOG.md` file.
- Update `README.md` file.
- Bumped Next.js version to 16.1.1.
- Bumped React version to 19.2.3.
- Bumped Tailwind version to 4.1.18.
- Bumped version of other minor packages.

---
For previous changes, please refer to the original repository: https://github.com/zesp11/zesp11.github.io
