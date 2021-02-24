/*global chrome*/
import React, { Component } from "react";
import LoadingIcon from "./LoadingIcon";
import Word from "./Word";


function getRandomElement(arr) {
  var item = arr[Math.floor(Math.random() * arr.length)];
  return item;
}

async function readPublicDataFile(filename) {
  console.log("Fetching: ", filename);
  const response = await fetch(filename);
  const data = await response.json();
  console.log("Got: ", data);
  return data;
}

async function loadStaticWordList() {
    const metaData = await readPublicDataFile("data/meta.json");
    console.log("meta:", metaData);
    const filename = "data/" + metaData.current_filename;
    console.log("latest filename: ", filename);
    const wordlist = await readPublicDataFile(filename);
    console.log('wordlist:', wordlist);
    return wordlist;
}


class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
        word: null,
        loading: true
    }
    this.handleGetWord = this.handleGetWord.bind(this);
  }

  async handleGetWord() {
    this.setState({loading: true});
    console.log("loading wordlist");
    const wordlist = await loadStaticWordList();
    console.log("wordlist:", wordlist);
    const rand_word = getRandomElement(wordlist);
    console.log("random word:", rand_word);
    this.setState({ word: rand_word, loading: false});
  }

  render() {
    return (
      <React.Fragment>
        <div>{this.state.loading || !this.state.word ? <LoadingIcon/> : <Word word={this.state.word}/>}</div>
        <footer>
          <button id="word btn" onClick={this.handleGetWord} className="btn btn-info btn-sm m-2">
            New word!
          </button>
        </footer>
      </React.Fragment>
    );
  }
}

export default Menu;
