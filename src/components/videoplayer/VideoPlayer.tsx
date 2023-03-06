import React, { useContext } from 'react'
import { Grid, Typography, Paper, } from '@mui/material';
import { makeStyles } from '@mui/styles'
import { SocketContext } from '../../context/SocketContext';
import { Video } from '../customVideo/CustomVideo';

const useStyles = makeStyles((theme: any) => ({
    video: {
        width: '550px',
        [theme.breakpoints.down('xs')]: {
            width: '300px',
        },
    },
    gridContainer: {
        justifyContent: 'center',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
    paper: {
        padding: '10px',
        border: '2px solid black',
        margin: '10px',
    },
}));

const VideoPlayer = () => {
    const { name, callAccepted, userVideo, callEnded, stream, call, userStream } = useContext(SocketContext);
    const classes = useStyles();

    return (
        <Grid container className={classes.gridContainer}>
            {stream && (
                <Paper className={classes.paper}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
                        {/* <video playsInline muted ref={myVideo} autoPlay={true} className={classes.video} /> */}
                        <Video srcObject={stream} playsInline muted autoPlay className={classes.video} />
                    </Grid>
                </Paper>
            )}
            {callAccepted && !callEnded && userStream && (
                <Paper className={classes.paper}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>{call?.name || 'Name'}</Typography>
                        <Video srcObject={userStream} playsInline autoPlay className={classes.video} />

                    </Grid>
                </Paper>
            )}
        </Grid>
    );
}

export default VideoPlayer