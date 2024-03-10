import React, { useState } from "react";

const Panel = ({
  title,
  children,
  height,
  open,
}: {
  title: string;
  children?: React.ReactNode;
  height?: number;
  open?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(open);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minHeight: 36 + (isOpen ? height ?? 0 : 0),
        borderBottom: "1px solid #070708",
      }}
    >
      <div
        style={{
          cursor: "pointer",
          padding: 8,
          height: 36,
          boxSizing: "border-box",
          background: "#151418",
          color: "#d3d3d3",
          display: "flex",
        }}
        onClick={() => {
          setIsOpen((val) => !val);
        }}
      >
        <div>{title}</div>
        <div style={{ marginLeft: "auto" }}>↴</div>
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
