# Main UI - Shared Component Library (@easycode/main-ui)

## 1. Purpose and Overview

This directory serves as the central repository for shared UI components for the EasyCode platform. Its primary purpose is to provide a consistent, high-quality, and reusable set of UI elements that can be utilized across various frontend applications within the ecosystem.

It is built with Next.js (though primarily exports components, it can also serve as a reference application or host storybooks), TypeScript, and the Mantine UI component library, ensuring a modern and robust foundation for user interfaces.

## 2. Tech Stack

This shared UI library is built with Next.js, TypeScript, and the Mantine UI component library. It leverages Turborepo for monorepo management and is designed to provide a consistent look and feel across all frontend applications in the ecosystem.

## 3. Key Features & Goals

1.  **UI Consistency**:
    *   Provide a unified look, feel, and user experience across all EasyCode applications by offering a single source of truth for common UI patterns and styles.
2.  **Reusability**:
    *   Offer a comprehensive set of common components (e.g., buttons, forms, input fields, layout elements, modals, navigation bars) to avoid duplication of effort and ensure consistency.
3.  **Accelerated Development**:
    *   Speed up frontend development cycles by providing developers with ready-to-use, well-tested, and documented building blocks.
4.  **Accessibility & Theming**:
    *   Strive for adherence to web accessibility standards (WCAG) to ensure applications are usable by as many people as possible.
    *   (Future) Support for tenant-specific theming, potentially integrating with `tenant-service` to fetch theming configurations (e.g., primary colors, logo) to customize the appearance for different client organizations.
5.  **Maintainability**:
    *   Centralizing shared components simplifies updates, bug fixes, and style revisions, ensuring changes are propagated efficiently across all consuming applications.

## 4. How to Consume Components

Components from this library are designed to be easily consumed by other frontend applications within this Turborepo monorepo setup (e.g., the frontend for `services/finance-service/`, or other applications in the `apps/` directory).

-   **Direct Imports**: Components are exported as standard ES modules and can be imported directly into other Next.js applications or TypeScript projects.
    ```typescript
    // Example: In another app (e.g., apps/another-app/pages/somepage.tsx)
    import { Button, Card } from '@easycode/main-ui'; // Assuming @easycode/main-ui is the package name

    const MyPage = () => (
      <Card shadow="sm" padding="lg">
        <Button>Click Me</Button>
      </Card>
    );
    ```
-   **Styling**: Mantine UI's styling system (CSS-in-JS or global styles) should be configured in the consuming application, often by wrapping the application in MantineProvider. This library's components will then adopt the theme and styles defined by the consuming application's Mantine setup.
-   **Build/Packaging**: Within the Turborepo setup, dependencies are managed such that changes in this shared library can be efficiently reflected in consuming applications during development and build processes. No separate packaging or publishing is typically required for local monorepo consumption.

## 5. Contribution Guidelines (Overview)

Developers looking to contribute new shared components or modify existing ones should:
1.  **Follow Standard Development Practices**: Adhere to the established coding standards, naming conventions, and project structure.
2.  **Component Design**: Ensure components are generic, reusable, and configurable through props.
3.  **Documentation**: Provide clear Storybook stories (or equivalent documentation) for each component, detailing its props, usage examples, and any variations.
4.  **Testing**: Write unit tests and/or visual regression tests for components to ensure reliability and prevent regressions.
5.  **Pull Requests**: Submit changes via pull requests for review and approval by the lead frontend developers or architecture team.

## 6. Integration with Services & Applications

This shared UI library plays a crucial role in the frontend architecture of the EasyCode platform:
-   **Component Source**: It provides the building blocks for the user interfaces of various frontend applications. These applications might include:
    -   Dedicated frontends for specific services (e.g., the Next.js frontend for `finance-service`).
    -   Broader applications that aggregate functionality from multiple services.
    -   Administrative interfaces for managing different aspects of the platform.
-   **Data Interaction**: While this library primarily focuses on UI presentation, the components it provides (e.g., forms, data tables, dashboards) are designed to be populated with data. The consuming applications are responsible for fetching this data from the relevant backend microservices (e.g., `crm-service`, `inventory-service`, `user-service`) via their exposed APIs and passing it to the shared UI components as props.
-   **Consistency**: By using these shared components, all frontend touchpoints in the EasyCode ecosystem can maintain a consistent visual identity and user experience.
