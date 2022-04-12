import { times } from 'lodash';
import axios from 'axios';
import nc from 'next-connect';

const fetchPeople = async (index) => {
  const peopleIndex = index + 1;
  const url = `https://swapi.dev/api/people/${peopleIndex}`;
  const result = await axios({
    url,
    method: 'GET',
  });
  return {
    ...result.data,
    image: `https://starwars-visualguide.com/assets/img/characters/${peopleIndex}.jpg`,
  };
};

const handler = nc().get(async (req, res) => {
  res.setHeader('Cache-Control', 'max-age=0, s-maxage=60');

  try {
    const data = await Promise.all(times(10, (index) => fetchPeople(index)));
    return res.send(data);
  } catch (err) {
    console.log('=========================================');
    console.log(err);
    console.log('=========================================');
    return res.status(500).send({ error: 'Internal server error' });
  }
});

export default handler;
