import React from "react";
import logo from "./logo.svg";
import "./App.css";
import hanzi from "./hanzi.mjs";
import words from "./words.mjs";
import { sampleSize } from "lodash";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const Character = ({ char, state, setState, shift, meta }) => {
  const ref = React.useRef(null);
  const onClick = e => {
    if (state === 3) {
      setState(0);
    } else {
      setState(state + 1);
    }
    e.preventDefault();
    var selection = window.getSelection();
    selection.removeAllRanges();
  };
  const overlay = props => (
    <Tooltip className="popup" id="button-tooltip" {...props}>
      {words
        .filter(x => x.includes(char))
        .slice(0, 4)
        .map(f => (
          <p>{f}</p>
        ))}
    </Tooltip>
  );
  const overlayShift = props => (
    <Tooltip className="popupShift" id="button-tooltip" {...props}>
      {hanzi[char][4]} - {hanzi[char][5].replace(/\//g, " /")}
    </Tooltip>
  );
  return (
    <div onClick={onClick} className={`character sel-${state}`}>
      {shift || meta ? (
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={shift ? overlayShift : overlay}
        >
          <div ref={ref}>{char}</div>
        </OverlayTrigger>
      ) : (
        <div ref={ref}>{char}</div>
      )}
    </div>
  );
};
const App = () => {
  const [char, setChar] = React.useState([]);
  const [charState, setCharState] = React.useState({});

  const [shift, setShift] = React.useState();
  const [meta, setMeta] = React.useState();

  const [view, setView] = React.useState("new");
  const onKeyUp = e => {
    setShift(false);
    setMeta(false);
  };

  const onKeyDown = e => {
    if (e) {
      if (e.shiftKey) {
        setShift(true);
      }
      if (e.metaKey) {
        setMeta(true);
      }
      if (e.which > 47 && e.which < 52) {
        const newNum = e.which - 48;
        const res = char.reduce((acc, x) => {
          acc[x] = newNum;
          return acc;
        }, charState);
        setCharState({ ...res });
        localStorage.setItem("characters", JSON.stringify(res));
        e.preventDefault();
      }
    }
  };
  React.useEffect(() => {
    if (view === "new") {
      const base = Object.keys(hanzi)
        .slice(0, 1000)
        .filter(x => !charState[x]);
      setChar(sampleSize(base, 50));
    } else {
      setChar(Object.keys(charState));
    }
  }, [view]);

  React.useEffect(() => {
    const existingRaw = localStorage.getItem("characters");
    const existing = JSON.parse(existingRaw) || {};
    setCharState(existing);
    const base = Object.keys(hanzi)
      .slice(0, 1000)
      .filter(x => !existing[x]);
    setChar(sampleSize(base, 50));
  }, []);

  React.useEffect(() => {
    document.onkeydown = onKeyDown;
    document.onkeyup = onKeyUp;
  });

  const ref = React.useRef();
  const popup = props => (
    <Tooltip className="popup" id="button1-tooltip" {...props}>
      <div>
        <p>
          Level 1:{" "}
          {Object.keys(charState).filter(x => charState[x] === 1).length}
        </p>
        <p>
          Level 2:{" "}
          {Object.keys(charState).filter(x => charState[x] === 2).length}
        </p>
        <p>
          Level 3:{" "}
          {Object.keys(charState).filter(x => charState[x] === 3).length}
        </p>
      </div>
    </Tooltip>
  );

  const toggleView = () => {
    if (view === "new") {
      setView("old");
    } else {
      setView("new");
    }
  };

  return (
    <div className="App">
      <h1>Chinesy</h1>
      <p>Systematically test your knowledge of Chinese characters</p>

      <OverlayTrigger
        placement="auto"
        delay={{ show: 250, hide: 400 }}
        overlay={popup}
      >
        <div ref={ref} onClick={toggleView}>
          {view === "new" ? (
            <span>
              {Object.keys(charState).length} characters reviewed (click to see)
            </span>
          ) : (
            <span>Click to review new characters</span>
          )}
        </div>
      </OverlayTrigger>
      <div
        style={{ marginTop: "10px" }}
        onClick={() => {
          if (window.confirm("Are you sure?")) {
            localStorage.setItem("characters", "{}");
            setCharState({});
          }
        }}
      >
        Clear storage and state
      </div>
      <Characters
        char={char}
        charState={charState}
        setCharState={setCharState}
        shift={shift}
        meta={meta}
      />
    </div>
  );
};

const Characters = ({ char, charState, setCharState, shift, meta }) => {
  return (
    <div className="characterMap">
      {char.map(x => (
        <Character
          key={x}
          char={x}
          state={charState[x] || 0}
          shift={shift}
          meta={meta}
          setState={e => {
            localStorage.setItem(
              "characters",
              JSON.stringify({ ...charState, [x]: e })
            );
            setCharState({ ...charState, [x]: e });
          }}
        />
      ))}
    </div>
  );
};

export default App;
