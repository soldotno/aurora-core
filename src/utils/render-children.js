import React from 'react';

function renderChildren(modules) {
  /**
  * This is the higher order part
  * (just copy/paste this basically)
  */
  let children = modules.map((module, i) => {
    let Module = module ? module.type : false;

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
