import React from 'react';

function renderChildren(modules) {
  /**
  * This is the higher order part
  * (just copy/paste this basically)
  */
  const children = modules.map((module, i) => {
    const Module = module ? module.type : false;

    return Module ?
      (
        <Module
          key={i}
          {...module.options}
        />
      ) :
      null;
  });

  return children;
}

export default renderChildren;
