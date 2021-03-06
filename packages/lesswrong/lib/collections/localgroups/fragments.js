import { registerFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment localGroupsBase on Localgroup {
    _id
    createdAt
    organizerIds
    organizers {
      ...UsersMinimumInfo
    }
    lastActivity
    name
    location
    googleLocation
    mongoLocation
    types
    contactInfo
    facebookLink
    website
    inactive
  }
`);

registerFragment(`
  fragment localGroupsHomeFragment on Localgroup {
    ...localGroupsBase
    contents {
      ...RevisionDisplay
    }
  }
`);

registerFragment(`
  fragment localGroupsEdit on Localgroup {
    ...localGroupsBase
    contents {
      ...RevisionEdit
    }
  }
`);

