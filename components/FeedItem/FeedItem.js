import React from 'react';
import Router from 'next/router';
import { map } from 'lodash';

import Box from '../Box';
import AddComment from '../AddComment';

import FeedItemHeader from './FeedItemHeader';
import FeedItemButtons from './FeedItemButtons';
import FeedItemComment from './FeedItemComment';
import FeedItemPhotos from './FeedItemPhotos';

import useModalState from 'hooks/useModalState';

export default function FeedItem({ data }) {
  const { setModal } = useModalState();

  const moreClickEvent = () => {
    setModal(true, data);
  };
  return (
    <Box className="feed-item-container flex flex-col">
      <FeedItemHeader
        image={data.user.image}
        username={data.user.username}
        data={data}
        moreClickEvent={moreClickEvent}
      />
      <FeedItemPhotos photos={data.photos} />
      <FeedItemButtons className="feed-item-buttons-container w-full h-10 pl-2 pr-2 mt-2 flex items-center" />
      <a href="#" className="feed-item-text text-14-bold mr-1 ml-4">
        {data?.likeCount || '0'} likes
      </a>
      <FeedItemComment
        data={{ username: data.user.username, description: data.description }}
      />
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
