const Input = ({
  label,
  value,
  onChange,
  width = 100,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  width?: number;
}) => {
  return (
    <div style={{ fontSize: "0.8rem" }}>
      <span>{label}:</span>{" "}
      <input
        value={value}
        type="text"
        style={{ width }}
        onChange={(e) => {
          onChange(e.currentTarget.value);
        }}
      />
    </div>
  );
};

export default Input;
