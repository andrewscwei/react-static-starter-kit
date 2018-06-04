import React, { PureComponent } from 'react';
import { Redirect, Route } from 'react-router-dom';

class List extends PureComponent {
  render() {
    return (
      <Route render={ () => {
        return <Redirect from='/list' to='/about'/>;
      } }/>
    );
  }
}

export default List;
