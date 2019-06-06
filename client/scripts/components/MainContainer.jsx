import React, { Component } from "react";
import { observer, inject } from "mobx-react";

@inject(stores => ({
  testStore: stores.testStore
}))
@observer
class MainContainer extends Component {
  render() {
    const { count, add } = this.props.testStore;
    return (
      <div className="page-main">
        <div>{count}</div>
        <button onClick={add}>add</button>
      </div>
    );
  }
}

export default MainContainer;
