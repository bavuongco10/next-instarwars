import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { map, nth, split } from 'lodash';
import axios from 'axios';

import Box from '../Box';
import AddComment from '../AddComment';

import FeedItemHeader from './FeedItemHeader';
import FeedItemButtons from './FeedItemButtons';
import FeedItemComment from './FeedItemComment';
import FeedItemPhotos from './FeedItemPhotos';

import useModalState from 'hooks/useModalState';

export default function FeedItem({ data }) {
  const { setModal } = useModalState();
  const [starWarPeople, setStarWarPeople] = useState();
  const { image } = data.user;
  const { username } = data.user;
  const { isStarWars, photos } = data;
  const currentUserImage = starWarPeople?.userImage || image;
  const currentPhotos = starWarPeople?.photos || photos;

  useEffect(() => {
    if (isStarWars)
      axios({
        url: '/api/star-wars/people',
        method: 'GET',
        params: {
          // Only search by surename due to the api
          search: nth(split(username, ' '), 1) || nth(split(username, ' '), 0),
        },
      }).then((res) => setStarWarPeople(res.data));
  }, [isStarWars, username]);

  const moreClickEvent = () => {
    setModal(true, data);
  };

  return (
    <Box className="feed-item-container flex flex-col">
      <FeedItemHeader
        image={currentUserImage}
        username={username}
        moreClickEvent={moreClickEvent}
      />
      <FeedItemPhotos photos={currentPhotos} />
      <FeedItemButtons className="feed-item-buttons-container w-full h-10 pl-2 pr-2 mt-2 flex items-center" />
      <a href="#" className="feed-item-text text-14-bold mr-1 ml-4">
        {data?.likeCount || '0'} likes
      </a>
      <FeedItemComment data={{ username, description: data.description }} />
      <a
        className="overflow-hidden mx-4 text-14-light cursor-pointer"
        style={{ color: '#9a9a9a', display: 'flex' }}
        onClick={() =>
          Router.push('/post/[pid]', `/post/${data?.pid || 'post-test'}`)
        }>
        Wiew all {data?.commentCount || '0'} comment
      </a>
      {map(data.popularComments, (item) => (
        <FeedItemComment
          key={item.username}
          data={{ username: item.username, description: item.description }}
        />
      ))}

      <a
        className="feed-item-date-text cursor-pointer uppercase"
        onClick={() =>
          Router.push('/post/[pid]', `/post/${data?.pid || 'post-test'}`)
        }>
        {data.time}
      </a>
      <AddComment />
    </Box>
  );
}
