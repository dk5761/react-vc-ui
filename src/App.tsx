import './App.css'
import { AppBar, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import VideoPlayer from './components/videoplayer/VideoPlayer'
import Options from './components/options/Options'
import Notifications from './components/notifications/Notifications'


const useStyles = makeStyles((theme: any) => ({
  appBar: {
    borderRadius: 15,
    margin: '30px 100px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '600px',
    border: '2px solid black',

    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  image: {
    marginLeft: '15px',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  }
}))

function App() {

  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <AppBar className={classes.appBar} position={"static"} color={"inherit"} >
        <Typography variant="h2" align='center'>Video Chat</Typography>
      </AppBar>
      <VideoPlayer />
      <Options>
        <Notifications />
      </Options >


    </div>
  )
}

export default App
