
import React from 'react'; 

const Plural =  ({ children, count }) => {
  return <>{children}{count === 1 ? "" : "s"}</>
}

export default Plural;
