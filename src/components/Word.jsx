import React, { Component } from "react";
import "./word.css";

class Word extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { word, definition } = this.props.word;
    const dictionary_href = "https://dictionary.com/browse/" + { word };
    return (
      <div>
        <p className="word">
          <i>
            {word} [<a href={dictionary_href}>definition</a>]
          </i>
          : {definition}
        </p>
      </div>
    );
  }
}

export default Word;
