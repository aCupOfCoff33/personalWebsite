import React from 'react';

const BearEars = React.memo(({ className = '' }) => (
  <>
    <ellipse cx="94.5444" cy="35.1165" rx="8.10381" ry="7.42849" fill="#8D4C16" className={className} />
    <ellipse cx="33.0905" cy="35.7918" rx="8.10381" ry="7.42849" fill="#8D4C16" className={className} />
  </>
));
BearEars.displayName = 'BearEars';

export default BearEars;
