const Palette = ({ palette }: { palette: Uint8Array }) => {
  const colors = palette.reduce((acc, _val, i) => {
    return i % 3 === 0
      ? ([...acc, palette.slice(i, i + 3)] as Uint8Array[][])
      : acc;
  }, [] as Uint8Array[][]);
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {colors.map((c, i) => (
        <div
          title={`${i}: rgb(${c[0]}, ${c[1]}, ${c[2]})`}
          key={i}
          style={{
            flex: "0 0 calc(100% / 16)",
            aspectRatio: "1/1",
            background: `rgb(${c[0]},${c[1]},${c[2]})`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default Palette;
