import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import md5 from "md5";
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

export default class Register extends Component {
    state = {
        inputs: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        errors: [],
        loading: false,
        usersRef: firebase.database().ref("users"),
    };

    handleChange = (e) => {
        e.persist();
        this.setState((state) => ({
            inputs: { ...state.inputs, [e.target.name]: e.target.value },
        }));
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.formValidation()) {
            this.setState({ errors: [], loading: true });
            firebase
                .auth()
                .createUserWithEmailAndPassword(
                    this.state.inputs.email,
                    this.state.inputs.password
                )
                .then((createdUser) => {
                    // console.log(createdUser);
                    this.setState({ loading: false });
                    createdUser.user
                        .updateProfile({
                            displayName: this.state.inputs.username,
                            photoURL: `http://gravatar.com/avatar/${md5(
                                createdUser.user.email
                            )}?d=identicon`,
                        })
                        .then(() => {
                            this.saveUser(createdUser).then(() =>
                                console.log("userSaved")
                            );
                        })
                        .catch((err) => {
                            console.log(err);
                            this.setState({
                                errors: this.state.errors.concat(err),
                                loading: false,
                            });
                        });
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        loading: false,
                    });
                });
        }
    };

    saveUser = (createdUser) => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL,
        });
    };

    formValidation = () => {
        let errors = [];
        let error;

        if (this.formEmpty(this.state)) {
            error = { message: "Fill in an fields" };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else if (!this.passwordValidate(this.state)) {
            error = { message: "Password is invalid" };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else {
            return true;
        }
    };

    formEmpty = ({ inputs }) => {
        return (
            !inputs.username.length ||
            !inputs.email.length ||
            !inputs.password.length ||
            !inputs.confirmPassword.length
        );
    };

    passwordValidate = ({ inputs }) => {
        if (inputs.password.length < 6 || inputs.confirmPassword.length < 6) {
            return false;
        } else if (inputs.password !== inputs.confirmPassword) {
            return false;
        } else {
            return true;
        }
    };

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
        const {
            username,
            email,
            password,
            confirmPassword,
        } = this.state.inputs;
        const { errors } = this.state;
        const { loading } = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h1" icon color="orange" textAlign="center">
                        <Icon name="puzzle piece" color="orange" />
                        Register for Messenger
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input
                                fluid
                                name="username"
                                icon="user"
                                iconPosition="left"
                                placeholder="Username"
                                onChange={this.handleChange}
                                type="text"
                                value={username}
                            />
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
                            <Form.Input
                                fluid
                                name="confirmPassword"
                                icon="repeat"
                                iconPosition="left"
                                placeholder="Confirm Password"
                                onChange={this.handleChange}
                                type="password"
                                value={confirmPassword}
                                className={this.handleInputError(
                                    errors,
                                    "password"
                                )}
                            />
                            <Button
                                disabled={loading}
                                color="orange"
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
                        Already a user? <Link to="/login">Login</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}
