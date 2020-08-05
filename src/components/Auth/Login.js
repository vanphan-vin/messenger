import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import Loading from "../../Loading";
import {
    Grid,
    Form,
    Segment,
    Button,
    Header,
    Message,
    Icon,
} from "semantic-ui-react";

export default class Login extends Component {
    state = {
        inputs: {
            email: "",
            password: "",
        },
        errors: [],
        loading: false,
    };

    handleChange = (e) => {
        e.persist();
        this.setState((state) => ({
            inputs: { ...state.inputs, [e.target.name]: e.target.value },
        }));
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.formValidation(this.state)) {
            this.setState({ errors: [], loading: true });
            firebase
                .auth()
                .signInWithEmailAndPassword(
                    this.state.inputs.email,
                    this.state.inputs.password
                )
                /*
                .then((signedInUser) => {
                    console.log(signedInUser);
                })
                */
                .then(() => console.log("signIn"))
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        loading: false,
                    });
                });
        }
    };

    formValidation = ({ inputs }) => inputs.email && inputs.password;

    dErrors = (errors) =>
        errors.map((error, i) => <p key={i}>{error.message}</p>);

    handleInputError = (errors, inputName) => {
        return errors.some((error) =>
            error.message.toLowerCase().includes(inputName)
        )
            ? "error"
            : "";
    };

    render() {
        const { email, password } = this.state.inputs;
        const { errors } = this.state;
        const { loading } = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h1" icon color="violet" textAlign="center">
                        <Icon name="code branch" color="violet" />
                        Login for Messenger
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input
                                fluid
                                name="email"
                                icon="mail"
                                iconPosition="left"
                                placeholder="Email Address"
                                onChange={this.handleChange}
                                type="email"
                                value={email}
                                className={this.handleInputError(
                                    errors,
                                    "email"
                                )}
                            />
                            <Form.Input
                                fluid
                                name="password"
                                icon="lock"
                                iconPosition="left"
                                placeholder="Password"
                                onChange={this.handleChange}
                                type="password"
                                value={password}
                                className={this.handleInputError(
                                    errors,
                                    "password"
                                )}
                            />
                            <Button
                                disabled={loading}
                                color="violet"
                                fluid
                                size="large"
                            >
                                Submit
                            </Button>
                            {loading ? <Loading /> : ""}
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.dErrors(errors)}
                        </Message>
                    )}
                    <Message>
                        Don't have a account? <Link to="/register">Register</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}
