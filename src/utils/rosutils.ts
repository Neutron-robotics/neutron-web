import { Message } from "roslib";
import { getTopic, TopicSettings } from "rosreact";

const publishOnce = (ros: ROSLIB.Ros, topic: string, messageType: string ,message: Message) => {
    const topicSettings: TopicSettings = {
        topic,
        messageType,
    };
    const publisher = getTopic(ros, topicSettings);
    publisher.publish(message);
    publisher.unadvertise();
}

const publishLoop = (ros: ROSLIB.Ros, topic: string, messageType: string ,message: Message, frequency: number) => {
    const topicSettings: TopicSettings = {
        topic,
        messageType,
    };
    const publisher = getTopic(ros, topicSettings);
    const period = Math.round(1000 / frequency);
    const interval = setInterval(() => {
        console.log("publish")
        publisher.publish(message);
    }, period);
    return () => {
        clearInterval(interval);
        publisher.unadvertise();
    };
}

export {
    publishOnce,
    publishLoop
}