import { makeStyles } from "@mui/styles"

const useStyles = makeStyles(() => ({

}))

interface KibanaDashboardProps {

}

const KibanaDashboard = (props: KibanaDashboardProps) => {
    const { } = props
    const classes = useStyles()

    return (
        <div>
            <iframe src="https://kibana.hugosoft.dev/app/dashboards#/view/da0ea105-953e-4e3f-81b1-6ceb5ed71347?embed=true&_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A60000)%2Ctime%3A(from%3A'2024-04-18T18%3A06%3A48.528Z'%2Cto%3A'2024-04-18T19%3A48%3A57.064Z'))" height="600" width="800"></iframe>
        </div>
    )
}

export default KibanaDashboard