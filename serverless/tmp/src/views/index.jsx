const React = require("react");
const Layout = require("./layout");

class Index extends React.Component {
  render() {
    return (
      <Layout title={this.props.one}>
        <h1>{this.props.one}</h1>
        <p>Welcome to {this.props.two}</p>
      </Layout>
    );
  }
}

module.exports = Index;
