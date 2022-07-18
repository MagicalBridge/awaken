
import React from './react';
import ReactDOM from './react-dom';
import ColorContext from './ColorContext';
const LanguageContext = React.createContext();
const style = { margin: '5px', padding: '5px' };
function Title() {
  return (
    <ColorContext.Consumer>
      {
        (contextValue) => (
          <LanguageContext.Consumer>
            {
              (languageContext) => (
                <div style={{ ...style, border: `5px solid ${contextValue.color}` }}>
                  Title   {languageContext.language}
                </div>
              )
            }
          </LanguageContext.Consumer>
        )
      }
    </ColorContext.Consumer>
  )
}
//类组和和函数组件都可以获取上下文对象中值
class Header extends React.Component {
  static contextType = ColorContext
  render() {
    console.log(ColorContext);
    return (
      <LanguageContext.Consumer>
        {
          (languageContext) => (
            <div style={{ ...style, border: `5px solid ${this.context.color}` }}>
              Header
              {languageContext.language}
              <Title />
            </div>
          )
        }
      </LanguageContext.Consumer>
    )
  }
}
function Content() {
  return (
    <ColorContext.Consumer>
      {
        (contextValue) => (
          <div style={{ ...style, border: `5px solid ${contextValue.color}` }}>
            Content
            <button onClick={() => contextValue.changeColor('red')}>变红</button>
            <button onClick={() => contextValue.changeColor('green')}>变绿</button>
          </div>
        )
      }
    </ColorContext.Consumer>
  )
}
class Main extends React.Component {
  static contextType = ColorContext
  render() {
    return (
      <div style={{ ...style, border: `5px solid ${this.context.color}` }}>
        Main
        <Content />
      </div>
    )
  }
}

class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { color: 'black', language: '中文' };
  }
  changeColor = (color) => {
    this.setState({ color });
  }
  render() {
    const contextValue = { color: this.state.color, changeColor: this.changeColor };
    return (
      <LanguageContext.Provider value={{ language: this.state.language }}>
        <ColorContext.Provider value={contextValue}>
          <div style={{ ...style, width: '250px', border: `5px solid ${this.state.color}` }}>
            Panel
            <Header />
            <Main />
          </div>
        </ColorContext.Provider>
      </LanguageContext.Provider>
    )
  }
}
ReactDOM.render(<Panel />, document.getElementById('root'));
