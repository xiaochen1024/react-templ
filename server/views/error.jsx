import React, { Component } from 'react';

export default class ErrorPage extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.message}</h1>
        <h2>{this.props.error.status}</h2>
        <pre>{this.props.error.stack}</pre>
      </div>
    );
  }
}
