import { useState, useEffect } from 'react';
import { map, split, trim, size, nth } from 'lodash';
import useSWR from 'swr';
import faker from '@faker-js/faker';
import { formatDistanceToNow } from 'date-fns';

import Layout from 'components/Layout';
import Stories from 'components/Stories/Stories';
import FeedItem from 'components/FeedItem/FeedItem';
import MoreModalItems from 'components/MoreModal';
import useUser from 'hooks/useUser';
import { fetcher } from 'utils/fetcher.util';

// Due to the api don't have a standard
const splitQuote = (quote) => {
  const chunk1 = split(quote, '—');
  if (size(chunk1) > 1) return chunk1;
  return split(quote, '-');
};
const useQuotes = () => {
  const { data } = useSWR('/api/star-wars/quotes', fetcher, {
    revalidateOnFocus: false,
  });

  const mappedData = map(data, (item) => ({
    ...item,
    pid: item.id,
    user: {
      username: trim(nth(splitQuote(item.content), 1)),
    },
    likeCount: faker.datatype.number(),
    commentCount: faker.datatype.number(),
    description: trim(nth(splitQuote(item.content), 0)),
    time: formatDistanceToNow(new Date()),
  }));

  return { quotes: mappedData };
};

// popularComments: faker.lorem.text(),

function Home() {
  const { setLoginUser } = useUser();

  const [loginData, setLoginData] = useState(null);
  const [stories, setStories] = useState(null);
  const [feed, setFeed] = useState(null);
  const { quotes } = useQuotes();
  console.log(quotes);

  const updateLoginUser = (data) => {
    setLoginUser(data);
    setLoginData(data);
  };

  useEffect(() => {
    fetch('/api/loginUser')
      .then((response) => response.json())
      .then((data) => updateLoginUser(data));
  }, []);

  useEffect(() => {
    fetch('/api/feed')
      .then((response) => response.json())
      .then((data) => setFeed(data));
  }, []);

  useEffect(() => {
    fetch('/api/stories')
      .then((response) => response.json())
      .then((data) => setStories(data));
  }, []);

  if (!loginData) return null;

  return (
    <Layout user={loginData}>
      <MoreModalItems />
      <div className="homepage-feed lg:mr-8 flex flex-col ">
        <Stories stories={stories} />
        {map(quotes, (item) => (
          <FeedItem data={item} key={item.pid} />
        ))}
        {map(feed, (item) => (
          <FeedItem data={item} key={item.pid} />
        ))}
      </div>
    </Layout>
  );
}
export default Home;
