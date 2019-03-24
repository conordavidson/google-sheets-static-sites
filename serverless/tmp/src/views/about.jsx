const React = require("react");
const Layout = require("./layout");

class About extends React.Component {
  render() {
    return (
      <Layout title={this.props.one}>
        <h1>{this.props.about}</h1>
      </Layout>
    );
  }
}

module.exports = About;
