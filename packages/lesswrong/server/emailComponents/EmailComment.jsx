import React from 'react';
import { Comments } from '../../lib/collections/comments';
import { withStyles } from '@material-ui/core/styles';
import { Components, registerComponent, useSingle } from 'meteor/vulcan:core';
import './EmailFormatDate.jsx';
import './EmailPostAuthors.jsx';

const styles = theme => ({
  comment: {
  },
});

const EmailComment = ({commentId, classes}) => {
  const { EmailUsername, EmailFormatDate } = Components;
  const { document: comment, loading, error } = useSingle({
    documentId: commentId,
    
    collection: Comments,
    fragmentName: "SelectCommentsList",
  });
  
  if (loading) return null;
  if (error) {
    throw error;
  } else if (!comment) {
    throw new Error(`Could not load comment ${commentId} for notification`);
  }
  
  return <div>
    <div className={classes.comment}>
      <EmailUsername user={comment.user}/>
      {" "}
      <a href={Comments.getPageUrl(comment, true)}>
        <EmailFormatDate date={comment.postedAt}/>
      </a>
      {" "}
      <a href={Posts.getPageUrl(comment.post, true)}>
        {comment.post.title}
      </a>
    </div>
    <div dangerouslySetInnerHTML={{
      __html: comment.contents.html
    }} />
  </div>;
}

registerComponent("EmailComment", EmailComment,
  withStyles(styles, {name: "EmailComment"})
);