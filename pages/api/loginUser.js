import nc from 'next-connect';
import axios from 'axios';

const fetchLuke = async () => {
  const url = 'https://swapi.dev/api/people/1';
  const result = await axios({
    url,
    method: 'GET',
  });
  return result.data;
};

const handler = nc().get(async (req, res) => {
  res.setHeader('Cache-Control', 'max-age=0, s-maxage=84600');

  try {
    const data = await fetchLuke();
    return res.send({
      ...data,
      username: data.name,
      image: `https://starwars-visualguide.com/assets/img/characters/1.jpg`,
    });
  } catch (err) {
    console.log('=========================================');
    console.log(err);
    console.log('=========================================');
    return res.status(500).send({ error: 'Internal server error' });
  }
});

export default handler;
