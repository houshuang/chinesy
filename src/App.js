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
        localStorage.setItem("characters", JSON.stringify(res));
        setCharState(res);
        e.preventDefault();
      }
    }
  };
  React.useEffect(() => {
    const existingRaw = localStorage.getItem("characters");
    const existing = JSON.parse(existingRaw);
    console.log(existing);
    setCharState(existing);
    const base = Object.keys(hanzi)
      .slice(0, 150)
      .filter(x => !existing[x]);
    setChar(sampleSize(base, 50));
  }, []);

  React.useEffect(() => {
    document.onkeydown = onKeyDown;
    document.onkeyup = onKeyUp;
  });

  return (
    <Characters
      char={char}
      charState={charState}
      setCharState={setCharState}
      shift={shift}
      meta={meta}
    />
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
            console.log(e);
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
