"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EasyCodeProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_1 = require("@mantine/core");
const notifications_1 = require("@mantine/notifications");
const easyCodeTheme_1 = require("../theme/easyCodeTheme");
const EasyCodeProvider = ({ children, theme = easyCodeTheme_1.easyCodeTheme }) => {
    return ((0, jsx_runtime_1.jsxs)(core_1.MantineProvider, { theme: theme, children: [(0, jsx_runtime_1.jsx)(notifications_1.Notifications, {}), children] }));
};
exports.EasyCodeProvider = EasyCodeProvider;
