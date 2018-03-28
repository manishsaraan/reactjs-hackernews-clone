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
      results : null,
      query : DEFAULT_QUERY,
      isAjax : false,
      searchKey : ''
    };
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  }
  
  //check if data is present is cache or not
  needsToSearchTopStories(query){
    return !this.state.results[query];
  }

  //update state with results from api
  setSearchTopStories(result){
    const {hits, page }  = result;
    const {query, searchKey} = this.state;
    const oldHits  = page ===0 ? [] : this.state.results[searchKey].hits;
    const updateHits = [...oldHits, ...hits];

    this.setState({
      results : { ...this.state.results, [searchKey] : {hits : updateHits, page}}
    });
  }

  //fetch data
  fetchSearchTopStories(query, page){
    let searchQuery = `${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}${query}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;
    this.setState({isAjax : true});   
    fetch(searchQuery)
         .then( response => response.json())
         .then( result => {
          this.setSearchTopStories(result);
          this.setState({isAjax : false});  

         })
         .catch(err => { 
          alert('Somethig went wrong!!');
          this.setState({isAjax : false});
         });
  }

  onSearchChange(e){
    this.setState({query : e.target.value}); 
    
  }

  onSubmit(e){    
    const {query} = this.state;
    this.setState({searchKey : query});
    if(this.needsToSearchTopStories(query)){
      this.fetchSearchTopStories(query, DEFAULT_PAGE);
    }
    e.preventDefault();
  }

  componentDidMount(){
    const {query} = this.state;
    this.setState({searchKey : query});
    this.fetchSearchTopStories(query, DEFAULT_PAGE);
  }
  render() {   
    const { query, results, isAjax, searchKey} = this.state; 
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    return (
      <div className="App">
       <div className="page">
        <div className="interactions">
        <Search isAjax={isAjax} value={query} onChange={this.onSearchChange} onSubmit={this.onSubmit} >
          Search
        </Search>
       </div>
        {<Table list={list}/> }  
        <div className="interactions">
          <Button onClick={ () => this.fetchSearchTopStories(searchKey, page +1) } isAjax={isAjax}>
           {isAjax === true ? "Loading...." : "More..."}
          </Button>
        </div>
      </div>
      </div>
    );
  }
}

//Search bomponent
const Search = ({value, onChange, onSubmit, isAjax, children }) => {    
    return (
      <form onSubmit={onSubmit}>           
        <input value={value} type="text" onChange={onChange}/>
        <button type="submit" disabled={isAjax === true ? "disabled" : ""}>{ children } </button>
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

const Button = ({onClick, isAjax, children}) => {
 return (<button disabled={isAjax === true ? "disabled" : ""} onClick={onClick}>{children}</button>);
}
export default App;
export{
  Button,
  Search,
  Table
}
