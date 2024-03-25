import { Button, Divider } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { useEffect, useState } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"


const useStyles = makeStyles(() => ({
    root: {
        height: '100%',
        overflowY: 'auto',
    },
    layout: {
        display: 'flex'
    },
    selection: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '20%',
        maxWidth: '150px'
    },
    markdownContainer: {
        width: '70%',
        marginLeft: 'auto',
        marginRight: 'auto',

    },
    selected: {
        fontWeight: 'bold !important',
        textDecoration: 'underline !important'
    }
}))

interface MyComponentProps {

}

const MyComponent = (props: MyComponentProps) => {
    const { } = props
    const classes = useStyles()
    const [selectedCategory, setSelectedCategory] = useState('cgu')
    const [markdownContent, setMarkdownContent] = useState('');

    const fetchCGU = async (category: string) => {
        try {
            const response = await fetch(`/assets/cgu/${category}.md`);
            const text = await response.text();
            if (text.includes('DOCTYPE')) // invalid
                setMarkdownContent('')
            else
                setMarkdownContent(text);
        } catch (error) {
            console.error('Erreur while loading Markdown :', error);
            setMarkdownContent('')
        }
    }

    useEffect(() => {
        fetchCGU(selectedCategory)
    }, [selectedCategory])

    return (
        <div className={classes.root}>
            <h1>Neutron Robotic</h1>
            <div className={classes.layout}>
                <div className={classes.selection}>
                    <Divider />
                    <Button
                        className={selectedCategory === 'cgu' ? classes.selected : ''}
                        variant="text"
                        onClick={() => setSelectedCategory('cgu')}
                    >
                        CGU
                    </Button>
                    <Divider />
                    <Button
                        className={selectedCategory === 'privacy' ? classes.selected : ''}
                        variant="text"
                        onClick={() => setSelectedCategory('privacy')}
                    >
                        Privacy Policy
                    </Button>
                    <Divider />
                </div>
                <div className={classes.markdownContainer}>
                    <Markdown remarkPlugins={[remarkGfm]}>
                        {markdownContent}
                    </Markdown>
                </div>
            </div>
        </div>
    )
}

export default MyComponent