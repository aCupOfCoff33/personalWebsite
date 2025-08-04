import clsx from 'clsx';


export default function ContentCard({
  title,
  subtitle,
  dates,
  logo,
  gradient = 'from-cyan-400 to-blue-500', // supply just the colour stops
  href = '#',
  className = '',
  ...props
}) {
  return (
    <div
      className={clsx(
        'group shrink-0 snap-start',
        'relative isolate p-px z-[100]',           // 1-px padding for gradient border and high z-index
        'w-80 md:w-88',                    // 320 / 352 (8-pt)
        'h-[512px]',                       // 8-pt multiple
        'transition-transform duration-300 ease-out hover:scale-[1.02]',
        className,
      )}
    >
      {/* gradient border */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />

      {/* card body */}
      <a
        href={href}
        className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/10 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 p-4 space-y-4"
        {...props}
      >
        {/* hero panel */}
        <div className={`flex-1 min-h-[288px] rounded-2xl bg-gradient-to-r ${gradient}`} />

        {/* meta */}
        <div className="flex items-center gap-4">
          {logo && (
            <img src={logo} alt="" className="h-12 w-12 flex-shrink-0 rounded-lg object-cover" />
          )}
          <h3 className="text-lg font-semibold leading-tight text-white">{title}</h3>
        </div>

        {subtitle && (
          <p className="text-sm font-semibold tracking-wide text-white/90">{subtitle}</p>
        )}

        {dates && <p className="text-xs font-medium text-white/70">{dates}</p>}
      </a>
    </div>
  );
}
