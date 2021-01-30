import { makeStyles } from '@material-ui/core/styles';
import { Accordion, AccordionDetails, AccordionSummary, Button, CircularProgress, TextField } from '@material-ui/core';
import React, { useEffect } from 'react';
import logo from './logo.png';
import './App.css';
import { ExpandMore } from '@material-ui/icons';
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:4200"

const useStyles = makeStyles(() => ({
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center'
  },
  app: {
    width: '25vw',
    margin: 'auto',
    'background-color': 'rgba(255,255,255,0.5)',
    'border-radius': '20px',
    padding: '20px'
  },
  form: {
    display: 'flex',
    alignItems: 'flex-start',
    'flex-wrap': 'wrap',
    '& > *': {
      margin: '8px',
      'flex-basis': '100%'
    }
  }
}));

function App() {
  const classes = useStyles();
  const [viewingPosts, setViewingPosts] = React.useState(true);
  const [loading, setLoading] = React.useState(true);

  const [subjectValue, setSubjectValue] = React.useState('');
  const [descriptionValue, setDescriptionValue] = React.useState('');
  const [posts, updatePosts] = React.useState([]);

  useEffect(() => {
    setLoading(true)
    axios.get("/posts").then(posts => {
       updatePosts(posts.data)
       setLoading(false)
    });
  }, []);



  const handleSubjectChange = (event) => {
    setSubjectValue(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescriptionValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const [ subject, description ] = [ subjectValue, descriptionValue ]
    axios
      .post("/posts", { subject, description })
      .then(postResponse => {
        if (postResponse.status === 201) {
          const { _id, subject, description } = postResponse.data
          updatePosts([
            ...posts,
            { _id, subject, description }
          ])
        } else {
          throw Error('Post failed!')
        }
      })
  }

  const handleDeletePost = (index, postId) => {
    axios
      .delete("/posts/" + postId)
      .then(deleteResponse => {
        if (deleteResponse.status === 204) {
          const updatedPosts = posts.filter(p => p._id != postId)
          updatePosts(updatedPosts)
        } else {
          throw Error('Delete failed!')
        }
      })
  }

  const handleViewingPostsChange = (event) => {
    event.preventDefault();
    setViewingPosts(!viewingPosts);
  }

  const viewPostsToggleButton = (description) =>  ( 
    <Button 
      color="primary" 
      variant="contained"
      fullWidth 
      style={{ margin: '16px 8px', width: 'calc(100% - 16px)' }}
      onClick={handleViewingPostsChange}>{ description }
    </Button> 
  )

  let postAccordions = []
  if (loading) {
    postAccordions = (<div style={{ margin: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}><CircularProgress /></div>)
  } else if (posts.length > 0) {
    for (const [index, value] of posts.entries()) {
      postAccordions.push(
        <Accordion 
          key={index}
          style={{ margin: '16px 8px', width: 'calc(100% - 16px)' }}
          >
          <AccordionSummary 
            expandIcon={<ExpandMore />}
          > { value['subject'] }
          </AccordionSummary>
          <AccordionDetails>
            { value['description'] }
            <Button
              color="secondary"
              style={{ position: 'absolute', right: 0, padding: 0, margin: '5px' }} 
              value="Delete"
              onClick={() => handleDeletePost(index, value._id)}
            > Delete
            </Button>
          </AccordionDetails>
        </Accordion>
      )
    } 
  } else {
    postAccordions = (<h3 style={{ 'textAlign': 'center' }}>There are no posts!</h3>)
  }
  

  return (
    <div className={classes.container}>
      <div className={classes.app}>
        <img src={logo} style={{ display: 'block', margin: 'auto', width: '50%', opacity: '1' }} className="App-logo" alt="logo" />
        <h1 style={{ 'textAlign': 'center', color: 'cadetblue' }}>MERN Stack App</h1>
        { viewingPosts ? 
            viewPostsToggleButton("Create a post") : 
            viewPostsToggleButton("View Posts") 
        }
        {
          viewingPosts ?
            postAccordions :
            (<form className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit}>
              <TextField label="Subject" multiline rowsMax={1} value={subjectValue} onChange={handleSubjectChange}/>
              <TextField label="Description" multiline rowsMax={5} value={descriptionValue} onChange={handleDescriptionChange}/>
              <Button color="primary" variant="contained" type="submit" value="Submit">Submit</Button>
            </form>)
        }
      </div>
    </div>
    
  )
  
}

export default App;
