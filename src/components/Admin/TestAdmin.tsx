import { Button, FormControlLabel, Switch, TextField } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ConnectionContextType, makeConnectionContext, NeutronConnectionContext } from "@neutron-robotics/neutron-core"
import { useState } from "react"

const useStyles = makeStyles(() => ({

}))

interface TestAdminProps {

}

const TestAdmin = (props: TestAdminProps) => {
    const { } = props
    const classes = useStyles()
    const [hostname, setHostname] = useState("ws.neutron-robotics.com")
    const [port, setPort] = useState(13127)
    const [clientId, setClientId] = useState("toto")
    const [wss, setWss] = useState(true)

    const [isConnected, setIsConnected] = useState(false)
    const [context, setContext] = useState<NeutronConnectionContext>()

    const handleConnectClick = async () => {
        const context = makeConnectionContext(ConnectionContextType.Ros2, {
            hostname,
            port,
            clientId,
            wss: wss
        })

        const connected = await context.connect();

        setIsConnected(connected)
        setContext(context)
    }

    const handleGetInfo = async () => {
        if (!context)
            return

        console.log("Get info")
        const infos = await context.getInfo()
        console.log(infos)
    }

    const handleSubscribeClick = () => {
        if (!context)
            return

        (context as any).subscribe(
            'test_pub',
            'myrobotics_protocol/msg/BaseInfos',
            (data: any) => {
                console.log('Triggered data', data);
            }
        );
    }

    return (
        <div>
            <div style={{
                display: 'flex',
                gap: '10px',
                margin: '0 10px 0 10px'
            }}>
                <TextField
                    value={hostname}
                    label="Hostname"
                    onChange={(e) => setHostname(e.target.value)}
                />
                <TextField
                    value={port}
                    label="Port"
                    type="number"
                    onChange={(e) => setPort(+e.target.value)}
                />

                <TextField
                    value={clientId}
                    label="Client ID"
                    onChange={(e) => setClientId(e.target.value)}
                />
                <FormControlLabel control={<Switch defaultChecked onChange={() => setWss(!wss)} />} label="WSS" />
            </div>

            <Button
                onClick={handleConnectClick}
                variant="contained"
            >
                Connect
            </Button>

            <div>
                isConnected: {isConnected ? 'true' : 'false'}
            </div>

            {isConnected && (
                <div style={{
                    paddingTop: '100px',
                    display: 'flex',
                    gap: '20px'
                }}>
                    <Button
                        onClick={handleGetInfo}
                        variant="contained"
                    >
                        Get Info
                    </Button>

                    <Button
                        onClick={handleSubscribeClick}
                        variant="contained"
                    >
                        Subscribe
                    </Button>

                </div>
            )}
        </div>
    )
}

export default TestAdmin