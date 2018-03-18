import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = "redux";
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = '?query=';
const DEFAULT_PAGE = 0;
const PARAM_PAGE = 'page=';
const DEFAULT_HPP = 25;
const PARAM_HPP = 'hitsPerPage=';

const isSearched = query => item => !query || item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      result : null,
      query : DEFAULT_QUERY
    };
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  //update state with results from api
  setSearchTopStories(result){
    const {hits, page }  = result;
    const oldHits  = page ===0 ? [] : this.state.result.hits;
    const updateHits = [...oldHits, ...hits];

    this.setState({result : {hits : updateHits, page}});
  }
  //fetch data
  fetchSearchTopStories(query, page){
    let searchQuery = `${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}${query}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;    
    fetch(searchQuery)
         .then( response => response.json())
         .then( result => this.setSearchTopStories(result))
         .catch(err => new Error(err));
  }

  onSearchChange(e){
    this.setState({query : e.target.value}); 
    
  }

  onSubmit(e){
    const {query} = this.state;
    this.fetchSearchTopStories(query);
    e.preventDefault();
  }

  componentDidMount(){
    const {query} = this.state;
    this.fetchSearchTopStories(query, DEFAULT_PAGE);
  }
  render() {   
    const { query, result } = this.state; 
    const page = (result && result.page) || 0;
    return (
      <div className="App">
       <div className="page">
        <div className="interactions">
        <Search value={query} onChange={this.onSearchChange} onSubmit={this.onSubmit} >
          Search
        </Search>
       </div>
        { result && <Table list={result.hits}/> }  
        <div className="interactions">
          <Button onClick={ () => this.fetchSearchTopStories(query, page +1) }>
           More..
          </Button>
        </div>
      </div>
      </div>
    );
  }
}

//Search bomponent
const Search = ({value, onChange, onSubmit,children }) => {    
    return (
      <form onSubmit={onSubmit}>           
        <input value={value} type="text" onChange={onChange}/>
        <button type="submit">{ children } </button>
      </form> 
      ); 
}

//Show list table component
const Table = ({list}) =>  {    
    return(
        <div className="table">
          {
           list.map( item =>           
                  <div key={item.objectID} className="table-row">
                    <span style={{width : '40%'}} ><a href={item.url}>{item.title}</a></span>
                    <span style={{width : '30%'}} >{item.author}</span>
                    <span style={{width : '15%'}} >{item.num_comments}</span>
                    <span style={{width : '15%'}} >{item.points}</span>
                  </div>            
           )
          }
        </div>
      );  
}

const Button = ({onClick, children}) => {
 return (<button onClick={onClick}>{children}</button>);
}
export default App;
