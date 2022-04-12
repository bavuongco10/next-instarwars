import axios from 'axios';
import nc from 'next-connect';
import { nth, isEmpty, map } from 'lodash';

const fetchPeople = async ({ search }) => {
  const url = 'https://swapi.dev/api/people';
  const result = await axios({
    url,
    method: 'GET',
    params: {
      search,
    },
  });
  return result.data;
};

const handler = nc().get(async (req, res) => {
  res.setHeader('Cache-Control', 'max-age=0, s-maxage=84600');

  try {
    const {
      query: { search },
    } = req;

    const data = await fetchPeople({ search });
    const people = nth(data.results, 0);
    if (isEmpty(people)) return res.send({});

    const peopleId = people.url.match(/\d+/g);
    const filmUrls = map(people.films, (item) => {
      const filmId = item.match(/\d+/g);
      return `https://starwars-visualguide.com/assets/img/films/${filmId}.jpg`;
    });

    return res.send({
      ...people,
      userImage: `https://starwars-visualguide.com/assets/img/characters/${peopleId}.jpg`,
      photos: [
        `https://starwars-visualguide.com/assets/img/characters/${peopleId}.jpg`,
        ...filmUrls,
      ],
    });
  } catch (err) {
    console.log('=========================================');
    console.log(err);
    console.log('=========================================');
    return res.status(500).send({ error: 'Internal server error' });
  }
});

export default handler;
