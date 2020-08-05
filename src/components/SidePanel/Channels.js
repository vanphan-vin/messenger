import React, { Component } from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";

class Channels extends Component {
    state = {
        channels: [],
        channelName: "",
        channelDetails: "",
        channelRef: firebase.database().ref("channels"),
        modal: false,
    };

    componentDidMount() {
        this.addListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelRef.on("child_added", (snap) => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels });
        });
    };

    closeModal = () => this.setState({ modal: false });

    openModal = () => this.setState({ modal: true });

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.formValidation(this.state)) {
            this.addChannel();
        }
    };

    formValidation = ({ channelName, channelDetails }) =>
        channelName && channelDetails;

    addChannel = () => {
        const user = this.props.presentUser;
        const { channelRef, channelName, channelDetails } = this.state;
        const key = channelRef.push().key;
        const newChannel = {
            id: key,
            name: channelName,
            datail: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL,
            },
        };
        channelRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({ channelName: "", channelDetails: "" });
                this.closeModal();
                console.log("channel added");
            })
            .catch((err) => {
                console.error(err);
            });
    };

    changeChannel = (channel) => {
        // this.props.setCurrentChannel(channel)
    }

    displayChannels = (channels) =>
        channels.length > 0 &&
        channels.map((channel) => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
            >
                # {channel.name}
            </Menu.Item>
        ));

    render() {
        const { channels, modal } = this.state;

        return (
            <React.Fragment>
                <Menu.Menu style={{ paddingBottom: "2em" }}>
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" /> CHANNELS
                        </span>{" "}
                        ({channels.length}){" "}
                        <Icon name="add" onClick={this.openModal} />
                    </Menu.Item>
                    {/* Channels */}
                    {this.displayChannels(channels)}
                </Menu.Menu>

                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Add a Channels</Modal.Header>

                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="Name of Channel"
                                    name="channelName"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="About the Channel"
                                    name="channelDetails"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button
                            color="green"
                            inverted
                            onClick={this.handleSubmit}
                        >
                            <Icon name="checkmark" /> Add
                        </Button>
                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    presentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(Channels);
