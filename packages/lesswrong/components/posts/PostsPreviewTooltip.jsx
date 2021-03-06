import { registerComponent, Components, getSetting } from 'meteor/vulcan:core';
import React from 'react';
import { withStyles } from '@material-ui/core/styles'
import { truncate } from '../../lib/editor/ellipsize';
import withUser from "../common/withUser";
import { postHighlightStyles, commentBodyStyles } from '../../themes/stylePiping'
import classNames from 'classnames';
import { Posts } from '../../lib/collections/posts';
import CommentIcon from '@material-ui/icons/ModeComment';
import Card from '@material-ui/core/Card';

const styles = theme => ({
  root: {
    width: 290,
    position: "relative",
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
    },
    padding: theme.spacing.unit*1.5,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    '& img': {
      maxHeight: "200px"
    },
    [theme.breakpoints.down('xs')]: {
      display: "none"
    },
  },
  hideOnMedium: {
    // TODO: figure out more elegant way of handling this breakpoint
    // 
    // This collection of breakpoints attempts to keep the preview fitting on the page even on 13" monitors and half-screen pages, until it starts looking just silly
    '@media only screen and (max-width: 1350px)': {
      width: 280,
    },
    '@media only screen and (max-width: 1330px)': {
      width: 260,
    },
    '@media only screen and (max-width: 1300px)': {
      width: 240,
    },
    '@media only screen and (max-width: 1270px)': {
      display: "none"
    }
  },
  wide: {
    [theme.breakpoints.down('xs')]: {
      width: `calc(100% - ${theme.spacing.unit*4}px)`,
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit
    },
    [theme.breakpoints.up('sm')]: {
      width: 450,
    },
    [theme.breakpoints.up('md')]: {
      width: 550,
    },
  },
  title: {
    marginBottom: -6
  },
  tooltipInfo: {
    fontStyle: "italic",
    ...commentBodyStyles(theme),
    color: theme.palette.grey[600]
  },
  highlight: {
    ...postHighlightStyles(theme),
    marginTop: theme.spacing.unit*3,
    marginBottom: theme.spacing.unit*2.5,
    wordBreak: 'break-word',
    fontSize: "1.1rem",
    '& img': {
      display:"none"
    },
    '& h1': {
      fontSize: "1.2rem"
    },
    '& h2': {
      fontSize: "1.2rem"
    },
    '& h3': {
      fontSize: "1.1rem"
    },
    '& hr': {
      display: "none"
    }
  },
  commentIcon: {
    height: 15,
    width: 15,
    color: theme.palette.grey[400],
    position: "relative",
    top: 3,
    marginRight: 6,
    marginLeft: 12
  },
  comments: {
    [theme.breakpoints.up('sm')]: {
      float: "right"
    },
    [theme.breakpoints.down('xs')]: {
      display: "inline-block",
      marginRight: theme.spacing.unit*2,
    },
  },
  karma: {
    [theme.breakpoints.up('sm')]: {
      float: "right"
    },
    [theme.breakpoints.down('xs')]: {
      display: "inline-block",
      float: "left"
    },
  },
  comment: {
    marginTop: theme.spacing.unit*1.5
  }
})

const metaName = getSetting('forumType') === 'EAForum' ? 'Community' : 'Meta'

const getPostCategory = (post) => {
  const categories = [];
  const postOrQuestion = post.question ? "Question" : "Post"

  if (post.isEvent) categories.push(`Event`)
  if (post.curatedDate) categories.push(`Curated ${postOrQuestion}`)
  if (post.af) categories.push(`AI Alignment Forum ${postOrQuestion}`);
  if (post.meta) categories.push(`${metaName} ${postOrQuestion}`)
  if (post.frontpageDate && !post.curatedDate && !post.af) categories.push(`Frontpage ${postOrQuestion}`)

  if (categories.length > 0)
    return categories.join(', ');
  else
    return post.question ? `Question` : `Personal Blogpost`
}

const PostsPreviewTooltip = ({ showAllinfo, post, classes, wide=false, hideOnMedium=true, truncateLimit=600, comment }) => {
  const { PostsUserAndCoauthors, PostsTitle, ContentItemBody, CommentsNode } = Components
  const { wordCount = 0, htmlHighlight = "" } = post.contents || {}

  const highlight = truncate(htmlHighlight, truncateLimit)
  const renderCommentCount = showAllinfo && (Posts.getCommentCount(post) > 0)
  const renderWordCount = !comment && (wordCount > 0)
  return <Card className={classNames(classes.root, {[classes.wide]: wide, [classes.hideOnMedium]: hideOnMedium})}>
      <div className={classes.title}>
        <PostsTitle post={post} tooltip={false} wrap/>
      </div>
      <div className={classes.tooltipInfo}>
        { getPostCategory(post)}
        { showAllinfo && post.user && <span> by <PostsUserAndCoauthors post={post} simple/></span>}
        { renderCommentCount && <span className={classes.comments}>
          <CommentIcon className={classes.commentIcon}/>
            {Posts.getCommentCountStr(post)}
        </span>}
        { showAllinfo && <span className={classes.karma}>{Posts.getKarma(post)} karma</span>}
      </div>
      {comment ? 
          <div className={classes.comment}>
            <CommentsNode
            truncated
            comment={comment}
            post={post}
            hoverPreview
            forceNotSingleLine
          /></div> :
          <ContentItemBody className={classes.highlight} dangerouslySetInnerHTML={{__html:highlight}} />
          }
      {renderWordCount && <div className={classes.tooltipInfo}>
        {wordCount} words (approx. {Math.ceil(wordCount/300)} min read)
      </div>}
  </Card>

}

registerComponent('PostsPreviewTooltip', PostsPreviewTooltip, withUser,
  withStyles(styles, { name: "PostsPreviewTooltip" })
);
