import React from 'react';
import { CircularProgress } from '@material-ui/core';

const Loading = (props: any) => {
  return (<div {...props}>
    <CircularProgress size={25}/>
    </div>
  );
};

export default Loading;