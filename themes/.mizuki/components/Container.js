import React from 'react';

export const Container = ({ children, ...rest }) => {
  return (
    <div {...rest}>
      {children}
    </div>
  );
};