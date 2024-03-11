import { useState } from "react";
import styled from "styled-components";

const DropdownContainer = styled.div`
  font-size: 0.8rem;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  position: relative;
  align-items: center;
  display: flex;
`;

const Options = styled.div`
  background: #070707;
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  min-width: 100%;
  padding-top: 1px;
  color: #d3d3d3;
  > * {
    padding: 8px;
    white-space: nowrap;

    &:hover {
      outline: 1px solid rgba(255, 255, 255, 0.4);
    }
  }
`;

export interface Option {
  value: string | number;
  label: string | number;
}

const Dropdown = ({
  options,
  onChange,
  value,
  label,
}: {
  options: Option[];
  onChange: (option: Option) => void;
  value: string | number;
  label: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownContainer
      onClick={() => {
        setIsOpen(true);
      }}
    >
      <span>
        {label}:{" "}
        <span style={{ color: "#d3d3d3" }}>
          {options.find((o) => o.value === value)?.label}
        </span>
      </span>
      {isOpen && (
        <Options>
          {options.map((o) => (
            <div
              key={o.value}
              onClick={(e) => {
                e.stopPropagation();
                onChange(o);
                setIsOpen(false);
              }}
            >
              {o.label}
            </div>
          ))}
        </Options>
      )}
    </DropdownContainer>
  );
};

export default Dropdown;
