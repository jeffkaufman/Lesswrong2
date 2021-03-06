import { registerComponent, Components, getSetting } from 'meteor/vulcan:core';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

// -- See here for all the tab content --
import menuTabs from './menuTabs'

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width:55,
    backgroundColor: theme.palette.grey[100],
    borderRight: "solid 1px rgba(0,0,0,.1)",
    height:"100%",
    color: theme.palette.grey[600],
  },
  divider: {
    marginTop:theme.spacing.unit,
    marginBottom:theme.spacing.unit
  }
})

const TabNavigationMenuCompressed = ({onClickSection, classes}) => {
  const { TabNavigationCompressedItem } = Components

  return (
    <div className={classes.root}>
      {menuTabs[getSetting('forumType')].map(tab => {
        if (!tab.showOnCompressed) {
          return
        }
        if (tab.divider) {
          return <Divider key={tab.id} className={classes.divider} />
        }
        return <TabNavigationCompressedItem key={tab.id} tab={tab} onClick={onClickSection} />
      })}
    </div>
  )
};

registerComponent(
  'TabNavigationMenuCompressed', TabNavigationMenuCompressed,
  withStyles(styles, { name: 'TabNavigationMenuCompressed'})
);
