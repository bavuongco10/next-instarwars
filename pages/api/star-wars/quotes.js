import https from 'https';

import { times } from 'lodash';
import axios from 'axios';
import nc from 'next-connect';

/*
  Example:
  // content: "You've been a good apprentice, Obi-Wan, and you're a much wiser man than I am. I foresee you will become a great Jedi Knight. ? Qui-Gon Jinn"
  // faction: 0
  // id: 4
 */
const fetchQuote = async () => {
  const quoteUrl =
    'http://swquotesapi.digitaljedi.dk/api/SWQuote/RandomStarWarsQuote';
  const result = await axios({
    url: quoteUrl,
    method: 'GET',
    httpsAgent: new https.Agent({
      // Custom agent due to cert error
      rejectUnauthorized: false,
    }),
  });
  return result.data;
};

const handler = nc().get(async (req, res) => {
  try {
    const data = await Promise.all(times(10, fetchQuote));
    console.log(data);
    return res.send(data);
  } catch (err) {
    console.log('=========================================');
    console.log(err);
    console.log('=========================================');
    return res.status(500).send({ error: 'Internal server error' });
  }
});

export default handler;
