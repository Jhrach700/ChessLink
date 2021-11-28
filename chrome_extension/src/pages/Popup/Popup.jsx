import React from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Chess from './chess.js-master/';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

function convertToHex(str) {
  var hex = '';
  for (var i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16);
  }
  hex = "0x" + hex
  return hex;
}

async function add(data) {

  const added = await client.add(data);
  const url = `https://ipfs.infura.io/ipfs/${added.path}`
  alert(url)

  let d = JSON.stringify(url);

  const d2 = JSON.stringify({
    ipfs: d,

  })

  const element = document.createElement("a");
  const textFile = new Blob([d2], { type: 'application/json' }); //pass data from localStorage API to blob

  element.href = URL.createObjectURL(textFile);
  element.download = "data.json";
  element.click();

}

function componentDidMount() {

  axios.get(`https://lichess.org/api/user/FentylatingFoodStamp/current-game?literate=true&evals=true`)
    .then(res => {
      let persons = res.data;


      const chess = new Chess()
      //const pgn =
      //  '[Event "Casual Bullet game"]\n[Site "https://lichess.org/xwqmX0Po"]\n[Date "2021.11.16"]\n[White "cosmo74"]\n[Black "edi1991"]\n[Result "0-1"]\n[UTCDate "2021.11.16"]\n[UTCTime "03:10:13"]\n[WhiteElo "2331"]\n[BlackElo "2401"]\n[Variant "Standard"]\n[TimeControl "60+0"]\n[ECO "A56"]\n[Opening "Benoni Defense: Hromádka System"]\n[Termination "Time forfeit"]\n[Annotator "lichess.org"]\n\n1. d4 { [%eval 0.0] } 1... Nf6 { [%eval 0.24] } 2. c4 { [%eval 0.26] } 2... c5 { [%eval 0.56] } 3. d5 { [%eval 0.52] } 3... d6 { [%eval 0.93] } { A56 Benoni Defense: Hromádka System } 4. Nc3 { [%eval 0.7] } 4... e5?! { (0.70 → 1.26) Inaccuracy. e6 was best. } { [%eval 1.26] } (4... e6 5. e4 g6 6. Bf4 Bg7 7. dxe6 Bxe6 8. Qxd6 Nc6 9. Nf3) 5. e4 { [%eval 1.16] } 5... Na6 { [%eval 1.37] } 6. g3 { [%eval 1.4] } 6... Nc7 { [%eval 1.21] } 7. Bg2 { [%eval 1.08] } 7... Bg4 { [%eval 1.48] } 8. Qc2 { [%eval 1.26] } 8... Qd7? { (1.26 → 2.80) Mistake. Be7 was best. } { [%eval 2.8] } (8... Be7) 9. h3 { [%eval 2.72] } 9... Bh5 { [%eval 2.78] } 10. g4 { [%eval 2.57] } 10... Bg6 { [%eval 2.63] } 11. Nge2?! { (2.63 → 1.52) Inaccuracy. g5 was best. } { [%eval 1.52] } (11. g5 Nh5 12. h4 Be7 13. Bf3 h6 14. Qe2 Nf4 15. Bxf4 exf4 16. h5 Bh7 17. g6 fxg6) 11... h6 { [%eval 1.49] } 12. f4 { [%eval 1.0] } 12... exf4 { [%eval 1.28] } 13. Nxf4?! { (1.28 → 0.61) Inaccuracy. Bxf4 was best. } { [%eval 0.61] } (13. Bxf4 Be7) 13... Bh7 { [%eval 0.55] } 14. O-O { [%eval 0.56] } 14... Be7 { [%eval 0.61] } 15. Nd3 { [%eval 0.53] } 15... O-O { [%eval 0.46] } 16. Bf4?! { (0.46 → -0.08) Inaccuracy. a4 was best. } { [%eval -0.08] } (16. a4 Qd8) 16... Rfe8?? { (-0.08 → 1.60) Blunder. b5 was best. } { [%eval 1.6] } (16... b5) 17. Rae1 { [%eval 1.57] } 17... Bg6?! { (1.57 → 2.34) Inaccuracy. b5 was best. } { [%eval 2.34] } (17... b5 18. b3) 18. Qd2 { [%eval 2.43] } 18... Kh7?? { (2.43 → 6.00) Blunder. b5 was best. } { [%eval 6.0] } (18... b5 19. e5) 19. e5 { [%eval 6.13] } 19... dxe5 { [%eval 8.61] } 20. Nxe5 { [%eval 8.23] } 20... Qc8 { [%eval 8.28] } 21. Nxg6 { [%eval 8.0] } 21... fxg6 { [%eval 8.08] } 22. d6 { [%eval 8.15] } 22... Rd8 { [%eval 11.57] } 23. Rxe7 { [%eval 11.63] } 23... Ne6 { [%eval 11.53] } 24. Bxh6 { [%eval 12.31] } 24... Rd7 { [%eval 13.34] } 25. Bxg7 { [%eval 13.58] } 25... Nxg7 { [%eval 13.69] } 26. Rxf6 { [%eval 13.73] } 26... Rxe7 { [%eval 13.88] } 27. dxe7 { [%eval 13.68] } 27... Qe8 { [%eval 16.72] } 28. Nd5 { [%eval 15.46] } 28... Rc8 { [%eval 32.21] } 29. Qg5 { [%eval 37.72] } 29... Rc6 { [%eval 38.39] } { Black wins on time. } 0-1\n\n\n'

      var pgn = persons
      var white_player = pgn.split('White "')[1].split('"')[0]
      var black_player = pgn.split('Black "')[1].split('"')[0]
      //alert(white_player)
      //alert(black_player)
      var white_elo = pgn.split('WhiteElo "')[1].split('"')[0]
      var black_elo = pgn.split('BlackElo "')[1].split('"')[0]
      alert(pgn)
      var st = pgn.split("??")
      var pgns = []
      for (let i = 0; i < st.length - 1; i++) {
        pgns.push(st.slice(0, i + 1).join())
      }
      var fens = []
      for (let i = 0; i < 3; i++) {
        chess.load_pgn([pgns[i]].join('\n'))
        fens.push(chess.fen())
      }
      fens.push(white_player)
      fens.push(black_player)
      fens.push(white_elo)
      fens.push(black_elo)

      persons = fens.join("zzz")
      alert(persons)

      persons = convertToHex(persons);

      const data = JSON.stringify({
        data: persons,
      })

      add(data)

    })

}

const Popup = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          ChessLink Helper Chrome Extension
        </p>

        <button className="App-link" onClick={componentDidMount}>IPFS Upload</button>

      </header>
    </div>
  );
};



export default Popup;
