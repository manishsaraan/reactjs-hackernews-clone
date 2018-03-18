import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = "redux";
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = '?query=';

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
    this.setState({result : result});
  }
  //fetch data
  fetchSearchTopStories(query){
    fetch(`${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}${query}`)
         .then( response => response.json())
         .then( result => this.setSearchTopStories(result.hits))
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
    this.fetchSearchTopStories(query);
  }
  render() {   
    const { query, result } = this.state; 
    return (
      <div className="App">
       <div className="page">
        <div className="interactions">
        <Search value={query} onChange={this.onSearchChange} onSubmit={this.onSubmit} >
          Search
        </Search>
       </div>
        { result && <Table list={result}/> }  
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

export default App;
