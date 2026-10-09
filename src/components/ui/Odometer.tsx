const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * A number set as odometer wheels (tabular figures). The server renders each wheel at
 * its final digit; OdometerMotion rolls them up from zero when the strip comes into view.
 * Screen readers get the plain number once.
 */
export function Odometer({ value }: { value: number }) {
  const digits = String(value).split("").map(Number);
  return (
    <>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="odo" data-odometer>
        {digits.map((digit, i) => (
          <span key={i} className="odo-digit">
            <span className="odo-strip" data-digit={digit} style={{ transform: `translateY(${-digit * 10}%)` }}>
              {DIGITS.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
