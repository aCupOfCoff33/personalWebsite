import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
const CodeBlock = React.lazy(() => import('./CodeBlock'));

const ResponsiveIframe = React.memo(function ResponsiveIframe({ title, src }) {
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-white/10">
      <iframe
        title={title}
        src={src}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'auto' }}
      />
      {/* Enable scroll-through when hovering over the iframe on desktop by capturing wheel and forwarding to window */}
      <div
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
        onWheel={(e) => {
          // When the iframe cannot scroll further, continue page scroll
          // We just forward the delta to window scroll. This layer doesn't block clicks (pointer-events none), so video controls still work
          window.scrollBy({ top: e.deltaY, behavior: 'auto' });
        }}
      />
    </div>
  );
});

ResponsiveIframe.propTypes = {
  title: PropTypes.string,
  src: PropTypes.string.isRequired,
};

const PhotoHeader = React.memo(function PhotoHeader({ image, overlayText }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <img src={image} alt="section header" className="w-full h-auto object-cover" />
      {overlayText ? (
        <div className="absolute inset-0 bg-black/30 flex items-end">
          <h3 className="p-6 text-2xl md:text-4xl font-semibold text-white">{overlayText}</h3>
        </div>
      ) : null}
    </div>
  );
});

PhotoHeader.propTypes = {
  image: PropTypes.string.isRequired,
  overlayText: PropTypes.string,
};

const ButtonLink = React.memo(function ButtonLink({ label, url }) {
  return (
    <a
      href={url}
      className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white"
      target={url.startsWith('http') ? '_blank' : undefined}
      rel={url.startsWith('http') ? 'noopener' : undefined}
    >
      {label}
    </a>
  );
});

ButtonLink.propTypes = {
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

function TextBlock({ content }) {
  return <p className="text-lg leading-relaxed text-neutral-200">{content}</p>;
}

TextBlock.propTypes = { content: PropTypes.string.isRequired };

const NoteSection = React.memo(function NoteSection({ section }) {
  switch (section.type) {
    case 'heading': {
      const Tag = section.level === 1 ? 'h2' : section.level === 3 ? 'h4' : 'h3';
      return (
        <Tag
          id={section.id}
          className="scroll-mt-32 text-3xl md:text-4xl font-normal font-adamant italic text-white"
        >
          {section.text}
        </Tag>
      );
    }
    case 'text':
      return <TextBlock content={section.content} />;
    case 'image':
      return (
        <figure className="space-y-2">
          <img src={section.src} alt={section.alt || ''} className="w-full h-auto rounded-xl border border-white/10" />
          {section.caption ? <figcaption className="text-sm text-neutral-400">{section.caption}</figcaption> : null}
        </figure>
      );
    case 'button':
      return <ButtonLink label={section.label} url={section.url} />;
    case 'video':
      return <ResponsiveIframe title={section.title} src={section.embedUrl} />;
    case 'photoHeader':
      return <PhotoHeader image={section.image} overlayText={section.overlayText} />;
    case 'code':
      return (
        <Suspense fallback={<pre className="text-sm text-neutral-300 p-4 bg-black/30 rounded-xl overflow-auto">Loading code...</pre>}>
          <CodeBlock language={section.language} code={section.code} />
        </Suspense>
      );
    default:
      return null;
  }
});

NoteSection.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string.isRequired,
    level: PropTypes.number,
    text: PropTypes.string,
    content: PropTypes.string,
    src: PropTypes.string,
    alt: PropTypes.string,
    caption: PropTypes.string,
    label: PropTypes.string,
    url: PropTypes.string,
    image: PropTypes.string,
    overlayText: PropTypes.string,
    language: PropTypes.string,
    code: PropTypes.string,
    embedUrl: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
};

export default NoteSection;


