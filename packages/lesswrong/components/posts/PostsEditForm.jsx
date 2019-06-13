import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent, getFragment, withMessages, withDocument } from 'meteor/vulcan:core';
import { Posts } from '../../lib/collections/posts';
import { withRouter } from '../../lib/reactRouterWrapper.js'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  formSubmit: {
    display: "flex",
    flexWrap: "wrap",
  }
})

class PostsEditForm extends PureComponent {

  render() {
    const { documentId, document, eventForm, classes, flash, history, match: { params } } = this.props;
    const isDraft = document && document.draft;
    const { WrappedSmartForm, PostSubmit, SubmitToFrontpageCheckbox } = Components
    const EditPostsSubmit = (props) => {
      return <div className={classes.formSubmit}>
        {!eventForm && <SubmitToFrontpageCheckbox {...props} />}
        <PostSubmit
          saveDraftLabel={isDraft ? "Save as draft" : "Move to Drafts"}
          {...props}
        />
      </div>
    }

    return (
      <div className="posts-edit-form">
        <WrappedSmartForm
          collection={Posts}
          documentId={documentId}
          queryFragment={getFragment('PostsEdit')}
          mutationFragment={getFragment('PostsRevision')}
          successCallback={post => {
            flash({ id: 'posts.edit_success', properties: { title: post.title }, type: 'success'});
            history.push({pathname: Posts.getPageUrl(post)});
          }}
          eventForm={eventForm}
          removeSuccessCallback={({ documentId, documentTitle }) => {
            // post edit form is being included from a single post, redirect to index
            // note: this.props.params is in the worst case an empty obj (from react-router)
            if (params._id) {
              history.push('/');
            }

            flash({ id: 'posts.delete_success', properties: { title: documentTitle }, type: 'success'});
            // todo: handle events in collection callbacks
            // this.context.events.track("post deleted", {_id: documentId});
          }}
          showRemove={true}
          submitLabel={isDraft ? "Publish" : "Publish Changes"}
          formComponents={{FormSubmit:EditPostsSubmit}}
          extraVariables={{
            version: 'String'
          }}
          repeatErrors
        />
      </div>
    );

  }
}

PostsEditForm.propTypes = {
  flash: PropTypes.func,
}

const documentQuery = {
  collection: Posts,
  queryName: 'PostsEditFormQuery',
  fragmentName: 'PostsPage',
  ssr: true
};

registerComponent('PostsEditForm', PostsEditForm,
  [withDocument, documentQuery],
  withMessages, withRouter,
  withStyles(styles, { name: "PostsEditForm" })
);
