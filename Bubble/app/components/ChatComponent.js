import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Button } from 'native-base';
import { Styles } from '../styles/Styles';
import { Actions } from 'react-native-router-flux';
import { connect as connectRedux } from 'react-redux';
import { generateName } from '../utils/ProfileHasher';

var _ = require('lodash');
var adjectives = require('../utils/adjectives');
var animals = require('../utils/animals');
var numAvatars = 160;

export default class ChatComponent extends Component {

    // Initialise
    constructor(props, context) {
        super(props, context);
        this.onSend = this.onSend.bind(this);
        this.parseMessages = this.parseMessages.bind(this);
    }

    // For converting API form to GiftedChat form
    parseMessages(messages) {
        var parsed = [];

        // Only parse when messages are valid
        if (messages) {
            for (var i = 0; i < messages.length; ++i) {
                var messageOrg = messages[i];
                var avatar = 'http://flathash.com/' + messageOrg.userId;
                // var avatar = 'http://api.adorable.io/avatar/' + messageOrg.userId;

                var messageParsed = {
                    _id: messageOrg.id,
                    text: messageOrg.content,
                    createdAt: messageOrg.createdAt,
                    type: messageOrg.messageType,
                    sent: messageOrg.messageType != "OPTIMISTIC-MESSAGE",
                    received: false,
                    target: messageOrg.targetUser,
                    user: {
                        _id: messageOrg.userId,
                        name: generateName(messageOrg.userId),
                        avatar: avatar,
                    },
                };
                parsed.push(messageParsed);
            }
        }
        return parsed;
    }

    // Use parent callback to send message
    onSend(messages = []) {
        var message = messages[0];
        var parsedMessage = {
            roomId: this.props.roomId,
            user: this.props.user,
            message: message.text
        };
        this.props.onSend(parsedMessage);
    }

    render() {
        return (
            <GiftedChat
                messages={this.parseMessages(this.props.messages)}
                onSend={this.onSend}
                user={{ _id: this.props.user }}
                isAnimated={true}
                onType={this.props.onTyping}
                onAvatarPress={(otherUserId, otherUserName) => { this.props.onTriggerModal(this.props.user, otherUserId, this.props.roomId, otherUserName) } }
                />
        );
    }
}
