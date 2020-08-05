import React, { Component } from "react";
import firebase from "../../firebase";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";

class UserPanel extends Component {
    state = {
        user: this.props.currentUser,
    };

    dropdownOptions = () => [
        {
            key: "user",
            text: (
                <span>
                    Sign in as <strong>{this.state.user.displayName}</strong>
                </span>
            ),
            disabled: true,
        },
        {
            key: "avatar",
            text: <span>Change Avatar</span>,
        },
        {
            key: "signout",
            text: <span onClick={this.handleSignOut}>Sign Out</span>,
        },
    ];

    handleSignOut = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log("signOut"));
    };

    render() {
        return (
            <Grid style={{ background: "#4c3c4c" }}>
                <Grid.Column>
                    <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
                        {/* App Header */}
                        <Header inverted floated="left" as="h2">
                            <Icon name="code" />
                            <Header.Content>Messenger</Header.Content>
                        </Header>

                        {/* User Dropdown */}
                        <Header as="h4" inverted style={{ padding: "0.25em" }}>
                            <Dropdown
                                trigger={
                                    <span>
                                        <Image
                                            src={this.state.user.photoURL}
                                            spaced="right"
                                            avatar
                                        />
                                        {this.state.user.displayName}
                                    </span>
                                }
                                options={this.dropdownOptions()}
                            />
                        </Header>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        );
    }
}

export default UserPanel;
