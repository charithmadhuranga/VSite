export default function Marquee({ items = [], speed = 30, reverse = false, className = '' }) {
  const content = items.join(' \u00A0\u00A0\u2022\u00A0\u00A0 ');
  const duplicated = `${content} \u00A0\u00A0\u2022\u00A0\u00A0 ${content} \u00A0\u00A0\u2022\u00A0\u00A0 ${content}`;

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className="inline-block marquee-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        <span className="inline-block pr-8">{duplicated}</span>
      </div>
    </div>
  );
}
