export default function Barcode() {
  return (
    <div 
      className="h-8 w-full bg-black"
      style={{
        backgroundImage: `repeating-linear-gradient(
          90deg,
          transparent,
          transparent 2px,
          white 2px,
          white 4px
        )`,
      }}
      aria-label="Barcode pattern"
    />
  )
}
