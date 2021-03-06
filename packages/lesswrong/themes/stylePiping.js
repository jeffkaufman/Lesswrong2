import deepmerge from 'deepmerge';
import isPlainObject from 'is-plain-object';

const hideSpoilers = {
  backgroundColor: 'black',
  color: 'black',
  '& a, & a:hover, & a:focus': {
    color: 'black'
  },
  '& code': {
    backgroundColor: 'black',
  }
}

const spoilerStyles = (theme) => ({
  '& p.spoiler': {
    margin: 0,
  },
  '& .spoiler': {
    padding: 8,
    pointerEvents: 'auto',
    minHeight: theme.typography.commentStyle.fontSize,
    '& .public-DraftStyleDefault-block': {
      margin: 0,
    },
    '&:not(:hover)': { // using ':not(:hover)' means we don't need to manually reset elements with special colors or backgrounds, instead they just automatically stay the same if we're not hovering
      ...hideSpoilers,
    }
  },
  // Note: ".spoiler" is the old class Oli originally used. ".spoilers" is a new class 
  // that is applied in make_editable_callbacks.js to groups of adjaecent spoiler paragraphs.
  // (see the make_editable_callbacks.js file for details)
  '& div.spoilers': {
    margin: '1em 0',
    overflow: 'auto',
    '&:not(:hover)': {
      ...hideSpoilers,
    },
    '&:hover': {
      background: 'rgba(0,0,0,.12)' // This leaves a light grey background over the revealed-spoiler to make it more obvious where it started.
    }
  },
  '& p.spoiler-v2': {
    margin: 0,
    padding: '0.5em 8px'
  },
  '& .spoilers:not(:hover)::selection, & .spoilers:not(:hover) ::selection': {
    backgroundColor: 'transparent'
  },
  '& .spoilers > p:hover ~ p': {
    ...hideSpoilers
  }
})

export const postBodyStyles = (theme) => {
  return {
    ...theme.typography.body1,
    ...theme.typography.postStyle,
    wordBreak: "break-word",
    ...spoilerStyles(theme),
    '& pre': {
      ...theme.typography.codeblock
    },
    '& code': {
      ...theme.typography.code
    },
    '& blockquote': {
      ...theme.typography.blockquote,
      ...theme.typography.body1,
      ...theme.typography.postStyle
    },
    '& li': {
      ...theme.typography.body1,
      ...theme.typography.li,
      ...theme.typography.postStyle
    },
    '& h1': {
      ...theme.typography.display2,
      ...theme.typography.postStyle
    },
    '& h2': {
      ...theme.typography.display1,
      ...theme.typography.postStyle,
    },
    '& h3': {
      ...theme.typography.display1,
      ...theme.typography.postStyle,
    },
    '& h4': {
      ...theme.typography.body1,
      ...theme.typography.postStyle,
      fontWeight:600,
    },
    '& img': {
      maxWidth: "100%"
    },
    '& sup': {
      verticalAlign: 'baseline',
      top: '-0.6em',
      fontSize: '65%',
      position: 'relative'
    },
    // Used for R:A-Z imports as well as markdown-it-footnotes
    '& .footnotes': {
      marginTop: 40,
      fontSize: '0.9em',
      paddingTop: 40,
      borderTop: 'solid 1px rgba(0,0,0,0.2)',
      '& sup': {
        marginRight: 10,
      },
      '& ol': {
        marginBlockStart: '1em',
        paddingInlineStart: 0,
        marginInlineStart: '1em'
      },
      '& li': {
        fontSize: '0.9em' // Overwriting default size setting for list items
      },
    },
    // Hiding the footnote-separator that markdown-it adds by default
    '& .footnotes-sep': {
      display: 'none'
    },
    '& a, & a:hover, & a:active': {
      color: theme.palette.primary.main
    },
  }
}

export const commentBodyStyles = theme => {
  const commentBodyStyles = {
    marginTop: ".5em",
    marginBottom: ".25em",
    wordBreak: "break-word",
    ...theme.typography.body2,
    ...theme.typography.commentStyle,

    ...spoilerStyles(theme),
    '& blockquote': {
      ...theme.typography.commentBlockquote,
      ...theme.typography.body2,
      ...theme.typography.commentStyle
    },
    '& li': {
      ...theme.typography.body2,
      ...theme.typography.commentStyle
    },
    '& h1, & h2, & h3': {
      ...theme.typography.commentHeader,
      ...theme.typography.commentStyle
    },
    // spoiler styles
    // HACK FIXME: Playing with pointer events is a horrible idea in general, and probably also in this context
    // but it's the only way I was able to make this weird stuff work.
    pointerEvents: 'none',
    '& *': {
      pointerEvents: 'auto'
    },
    '& > *:hover ~ .spoiler': {
      color: 'black'
    },
    '& > *:hover ~ .spoiler:before': {
      content: '"spoiler (hover/select to reveal)"',
      color: 'white',
    },
  }
  return deepmerge(postBodyStyles(theme), commentBodyStyles, {isMergeableObject:isPlainObject})
}

export const postHighlightStyles = theme => {
  const postHighlightStyles = {
    ...theme.typography.body2,
    ...theme.typography.postStyle,
    '& blockquote': {
      ...theme.typography.body2,
      ...theme.typography.postStyle,
      '& > p': {
        margin:0
      },
    },
    '& ul': {
      paddingInlineStart: 30
    },
    '& li': {
      ...theme.typography.body2,
      ...theme.typography.postStyle,
    },
    '& h1, & h2, & h3': {
      ...theme.typography.commentHeader,
    },
  }
  return deepmerge(postBodyStyles(theme), postHighlightStyles, {isMergeableObject:isPlainObject})
}

export const pBodyStyle = {
  marginTop: "1em",
  marginBottom: "1em",
  '&:first-of-type': {
    marginTop: 0,
  },
  '&:last-of-type': {
    marginBottom: 0,
  }
}

export const ckEditorStyles = theme => {
  return {
    '& .ck': {
      '& code .public-DraftStyleDefault-block': {
        marginTop: 0,
        marginBottom: 0,  
      },
      '& blockquote .public-DraftStyleDefault-block': {
        marginTop: 0,
        marginBottom: 0,
      },
      '--ck-spacing-standard': `${theme.spacing.unit}px`,
      '&.ck-content': {
        marginLeft: -theme.spacing.unit,
        '--ck-focus-outer-shadow-geometry': "none",
        '--ck-focus-ring': "solid 1px rgba(0,0,0,0)",
        '--ck-focus-outer-shadow': "none",
        '--ck-inner-shadow': "none",
        '& p': pBodyStyle
      },
      '&.ck-sidebar, &.ck-presence-list': { //\u25B6
        '& li': {
          // By default ckEditor elements get the styles from postBodyStyles li elements
          marginBottom: 'unset',
          fontFamily: 'unset',
          fontSize: 'unset',
          fontWeight: 'unset',
          lineHeight: 'unset'
        },
        '& .ck-comment:after': {
          display:"none"
        },
        '& .ck-annotation__info-name, & .ck-annotation__info-time, & .ck-comment__input, & .ck-thread__comment-count, & .ck-annotation__main p, & .ck-annotation__info-name, & .ck-annotation__info-time, & .ck-presence-list__counter, &.ck-presence-list': {
          ...commentBodyStyles(theme),
        },
        '&.ck-presence-list': {
          '--ck-user-avatar-size': '20px',
          '& .ck-user': {
            marginTop: 11
          }
        },
        '& .ck-thread__comment-count': {
          paddingLeft: theme.spacing.unit*2,
          color: theme.palette.grey[600],
          margin: 0,
          paddingBottom: ".5em",
          '&:before': {
            content: '"\\25B6"'
          }
        },
        '& .ck-comment__input': {
          paddingLeft: theme.spacing.unit*2
        },
        '& .ck-annotation__main, & .ck-comment__input, & .ck-thread__input': {
          width : "100%"
        },
        '& .ck-comment__wrapper': {
          borderTop: 'solid 1px rgba(0,0,0,.15)',
        },
        '& .ck-annotation__info-name, & .ck-annotation__info-time': {
          color: theme.palette.grey[600],
          fontSize: "1rem"
        },
        '& .ck-annotation__user, & .ck-thread__user': {
          display: "none"
        },
        '--ck-color-comment-count': theme.palette.primary.main,
      } 
    }
  }
}

export const editorStyles = (theme, styleFunction) => ({
    '& .public-DraftStyleDefault-block': {
      marginTop: '1em',
      marginBottom: '1em',
    },
    '& code .public-DraftStyleDefault-block': {
      marginTop: 0,
      marginBottom: 0,  
    },
    '& blockquote .public-DraftStyleDefault-block': {
      marginTop: 0,
      marginBottom: 0,
    },
    // Using '*' selectors is a bit dangerous, as is using '!important'
    // This is necessary to catch spoiler-selectors on 'code' elemenents, as implemented in draft-js, 
    // which involved nested spans with manually set style attributes, which can't be overwritten except via 'important'
    //
    // This selector isn't necessary on rendered posts/comments, just the draft-js editor.
    // To minimize potential damage from */important it's only applied here.
    '& .spoiler:not(:hover) *': {
      backgroundColor: "black !important"
    },
    ...styleFunction(theme),
    ...ckEditorStyles(theme)
})
