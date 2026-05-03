interface PriceDisplayProps {
  price: { toString(): string } | number | null;
  callForPrice: boolean;
  className?: string;
}

export default function PriceDisplay({ price, callForPrice, className = "" }: PriceDisplayProps) {
  if (callForPrice || price === null) {
    return (
      <span className={`font-semibold text-primary ${className}`}>Call for Price</span>
    );
  }
  return (
    <span className={`font-semibold text-foreground ${className}`}>
      ${Number(price).toLocaleString("en-US", { minimumFractionDigits: 0 })}
    </span>
  );
}
