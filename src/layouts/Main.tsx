import React, { CSSProperties } from "react";

const Main = ({ children }: { children?: React.ReactNode }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

export const TopBar = ({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: CSSProperties;
}) => (
  <div
    style={{
      height: 50,
      display: "flex",
      background: "#070708",
      alignItems: "stretch",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Content = ({ children }: { children?: React.ReactNode }) => (
  <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>{children}</div>
);

export const SideBar = ({ children }: { children?: React.ReactNode }) => (
  <div
    style={{
      flex: "0 0 300px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      background: "#2c2a34",
      borderRight: "1px solid #070708",
    }}
  >
    {children}
  </div>
);

export const View = ({ children }: { children?: React.ReactNode }) => (
  <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>{children}</div>
);

export default Main;
