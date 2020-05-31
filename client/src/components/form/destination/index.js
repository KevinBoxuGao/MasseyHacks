import React from "react";
import { TextField, Button } from "@material-ui/core";

class DestinationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { start: null, destination: null };
  }
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.submitFunction(this.state.start, this.state.destination);
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
        <TextField name="start" label="Start" onChange={this.handleChange} />
        <TextField
          color="primary"
          name="destination"
          label="Destination"
          onChange={this.handleChange}
        />
        <Button
          variant="contained"
          color="inherit"
          label="Submit"
          type="submit"
          color="secondary"
          disableElevation
          style={{ marginTop: "16px" }}
        >
          Submit
        </Button>
      </form>
    );
  }
}

export default DestinationForm;
