import React, { useState } from "react";

const Panel = ({
  title,
  children,
  height,
  open,
  buttons,
}: {
  title: string;
  children?: React.ReactNode;
  height?: number;
  open?: boolean;
  buttons?: React.ReactNode[];
}) => {
  const [isOpen, setIsOpen] = useState(open);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minHeight: 36 + (isOpen ? height ?? 0 : 0),
      }}
    >
      <div
        style={{
          cursor: "pointer",
          height: 36,
          boxSizing: "border-box",
          background: "#151418",
          color: "#d3d3d3",
          display: "flex",
          borderBottom: "1px solid #070708",
          alignItems: "stretch",
        }}
        onClick={() => {
          setIsOpen((val) => !val);
        }}
      >
        <div style={{ display: "flex", alignItems: "center", padding: 8 }}>
          {title}
        </div>
        {buttons}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            padding: 8,
          }}
        >
          ↴
        </div>
      </div>
      <div
        style={{
          height: isOpen ? height ?? "auto" : 0,
          overflow: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Panel;
