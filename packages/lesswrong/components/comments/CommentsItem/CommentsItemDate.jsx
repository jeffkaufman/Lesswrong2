import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';
import { withStyles } from '@material-ui/core/styles'
import { Link } from '../../../lib/reactRouterWrapper.js';
import Icon from '@material-ui/core/Icon';
import { Comments } from "../../../lib/collections/comments";
import classNames from 'classnames';
import { useNavigation, useLocation } from '../../../lib/routeUtil';

const styles = theme => ({
  root: {
    "& a:hover, & a:active": {
      "& $icon": {
        color: "rgba(0,0,0,0.3) !important",
      },
    },
  },
  answerDate: {},
  date: {
    color: "rgba(0,0,0,0.5)",
  },
  postTitle: {
    marginRight: 5,
  },
  link: {
  },
  icon: {
    fontSize: "0.9rem !important",
    transform: "rotate(-45deg)",
    verticalAlign: "middle",
    color: "rgba(0,0,0,0.5) !important",
    margin: "0 3px",
    paddingBottom: 2,
  },
});

const CommentsItemDate = ({comment, post, showPostTitle, classes, scrollOnClick, scrollIntoView }) => {
  const { history } = useNavigation();
  const { location } = useLocation();

   const handleLinkClick = (event) => {
    event.preventDefault()
    history.replace({...location, hash: "#" + comment._id})
    scrollIntoView();
  };

  const url = Comments.getPageUrlFromIds({postId: post._id, postSlug: post.slug, commentId: comment._id, permalink: false})

  const date = <span>
    <Components.FormatDate date={comment.postedAt} format={comment.answer && "MMM DD, YYYY"}/>
    <Icon className={classNames("material-icons", classes.icon)}> link </Icon>
    {showPostTitle && post.title && <span className={classes.postTitle}> {post.draft && "[Draft]"} {post.title}</span>}
  </span>

  return (
    <div className={classNames(classes.root, {
      [classes.date]: !comment.answer,
      [classes.answerDate]: comment.answer,
    })}>
      {scrollOnClick ? <a href={url} onClick={handleLinkClick}>{ date } </a>
        : <Link to={url}>{ date }</Link>
      }
    </div>
  );
}

registerComponent('CommentsItemDate', CommentsItemDate,
  withStyles(styles, {name: "CommentsItemDate"}));
