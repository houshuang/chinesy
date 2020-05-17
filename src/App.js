import React from "react";
import logo from "./logo.svg";
import "./App.css";
import hanzi from "./hanzi.mjs";
import words from "./words.mjs";
import { sampleSize } from "lodash";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import FormControl from "react-bootstrap/FormControl";
import FileSaver from "file-saver";

const download = data => {
  const text =
    `character\tknowledgeState\tfrequencyOrder\tpinyin\ttranslation\texampleNgrams\n` +
    Object.keys(data)
      .map(char => {
        const relWords = words
          .filter(x => x.includes(char))
          .slice(0, 4)
          .join(",");
        return `${char}\t${data[char]}\t${hanzi[char][0]}\t${hanzi[char][4]}\t${hanzi[char][5]}\t${relWords}`;
      })
      .join("\n");
  const blob = new Blob([text], {
    type: "text/plain;charset=utf-8"
  });
  const fname = "chinesy.tsv";
  FileSaver.saveAs(blob, fname, true);
};

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
  const [redraw, setRedraw] = React.useState();
  const [max, setMax] = React.useState(1000);
  const [min, setMin] = React.useState(0);
  const [nchar, setN] = React.useState(50);
  const [char, setChar] = React.useState([]);
  const [charState, setCharState] = React.useState({});

  const [shift, setShift] = React.useState();
  const [meta, setMeta] = React.useState();

  const [view, setView] = React.useState("new");
  const [ready, setReady] = React.useState();
  const onKeyUp = e => {
    setShift(false);
    setMeta(false);
  };

  const onKeyDown = e => {
    if (e) {
      if (e.shiftKey) {
        setShift(true);
        if (e.which > 47 && e.which < 52) {
          const newNum = e.which - 48;
          const res = char.reduce((acc, x) => {
            acc[x] = newNum;
            return acc;
          }, charState);
          setCharState({ ...res });
          localStorage.setItem("chinesy.characters", JSON.stringify(res));
          e.preventDefault();
        }
      }
      if (e.metaKey) {
        setMeta(true);
      }
    }
  };
  React.useEffect(() => {
    if (view === "new") {
      const base = Object.keys(hanzi)
        .slice(min, max)
        .filter(x => !charState[x]);
      setChar(sampleSize(base, nchar));
    } else {
      setChar(Object.keys(charState).filter(x => charState[x] !== 0));
    }
  }, [view, max, min, redraw]);

  React.useEffect(() => {
    const existingMax =
      parseInt(localStorage.getItem("chinesy.max"), 10) || 1000;
    const existingMin = parseInt(localStorage.getItem("chinesy.min"), 10) || 0;
    const existingN = parseInt(localStorage.getItem("chinesy.n"), 10) || 0;
    if (existingMax !== max) {
      setMax(existingMax);
    }
    if (existingMin !== min) {
      setMin(existingMin);
    }
    if (existingN !== nchar) {
      setN(existingN);
    }
    const existingRaw = localStorage.getItem("chinesy.characters");
    const existing = JSON.parse(existingRaw) || {};
    setCharState(existing);
    const base = Object.keys(hanzi)
      .slice(0, 1000)
      .filter(x => !existing[x]);
    setChar(sampleSize(base, 50));
    setReady(true);
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

  const textInput = React.useRef();
  const textInputMin = React.useRef();
  const textInputnchar = React.useRef();

  const handleChange = () => {
    let newMax = parseInt(textInput.current.value, 10);
    let newMin = parseInt(textInputMin.current.value, 10);
    let newn = parseInt(textInputnchar.current.value, 10);
    if (newMax < newMin) {
      newMax = newMin + 1000;
    }
    if (newMin > newMax) {
      newMin = 0;
    }
    localStorage.setItem("chinesy.max", newMax);
    localStorage.setItem("chinesy.min", newMin);
    localStorage.setItem("chinesy.n", newn);
    setMax(newMax);
    setMin(newMin);
    setN(newn);

    setRedraw(new Date());
  };

  return ready ? (
    <>
      <div style={{ position: "absolute", top: "0px", left: "0px" }}>
        <a href="https://github.com/houshuang/chinesy">
          <img
            width="149"
            height="149"
            src="https://github.blog/wp-content/uploads/2008/12/forkme_left_white_ffffff.png?resize=149%2C149"
            class="attachment-full size-full"
            alt="Fork me on GitHub"
            data-recalc-dims="1"
          />
        </a>
      </div>
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
              <span className="buttonLike">
                {Object.keys(charState).filter(x => charState[x] !== 0).length}{" "}
                characters reviewed (click to see)
              </span>
            ) : (
              <span>Click to review new characters</span>
            )}
          </div>
        </OverlayTrigger>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "30px"
          }}
        >
          <div>
            <div
              className="buttonLike"
              style={{ marginTop: "10px" }}
              onClick={() => {
                if (window.confirm("Are you sure?")) {
                  localStorage.setItem("chinesy.characters", "{}");
                  setCharState({});
                }
              }}
            >
              Clear storage and state
            </div>
            <div
              className="buttonLike"
              style={{ marginTop: "20px" }}
              onClick={() => download(charState)}
            >
              Download data
            </div>
          </div>
          <div className="maxmin">
            <div>
              Start with nth most frequent{" "}
              <FormControl ref={textInputMin} type="text" defaultValue={min} />
            </div>
            <div>
              Until nth most frequent{" "}
              <FormControl ref={textInput} type="text" defaultValue={max} />
            </div>
            <div>
              Show n characters at a time{" "}
              <FormControl
                ref={textInputnchar}
                type="text"
                defaultValue={nchar}
              />
            </div>
            <span className="buttonLike" onClick={handleChange}>
              Shuffle
            </span>
          </div>
        </div>
        <Characters
          char={char}
          charState={charState}
          setCharState={setCharState}
          shift={shift}
          meta={meta}
        />
      </div>
    </>
  ) : null;
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
              "chinesy.characters",
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
