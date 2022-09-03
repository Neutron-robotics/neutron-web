import React, { useEffect, useState } from "react";
import {
    Publisher,
    RosConnection, Subscriber, TopicListProvider, useMsg, useTopicList
} from "rosreact";
import {
    Button
} from "@mui/material"

const Sandbox = () => {
    const [trigger, setTrigger] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    
    useEffect(() => {
        setTimeout(() => {
            setTrigger(!trigger);
        }, 3000);
    }, [trigger])
    
    const handleButton = () => {
        console.log("Button clicked");
        setSubscribed(!subscribed);
    }
    return (
        <div>
            <RosConnection url={"ws://192.168.1.117:9090"} autoConnect>
                <h1>Hello World</h1>
                {subscribed ?
                    <Subscriber
                        topic="/chatter"
                        messageType="std_msgs/msg/String"
                    >
                        <MsgView />
                    </Subscriber>
                    : null}
                {/* <Publisher
                    autoRepeat
                    topic="/talker"
                    throttleRate={10.0}
                    message={{ data: 2 }}
                    messageType="std_msgs/Float32"
                /> */}
                <TopicListProvider
                    trigger={trigger}
                    failedCallback={(e) => { console.log(e) }}
                >
                    <TopicListView />
                </TopicListProvider>
                <Button variant="contained" onClick={handleButton}>Click me</Button>
            </RosConnection>
        </div>
    );
};

const TopicListView = () => {
    const topicList = useTopicList();
    return (
        <>
            <p>{`${topicList.topics}`}</p>
            <p>{`${topicList.types}`}</p>
        </>
    );
}

const MsgView = () => {
    const msg = useMsg();
    console.log(msg)
    return <p> {`${msg}`} </p>
}

export default Sandbox;