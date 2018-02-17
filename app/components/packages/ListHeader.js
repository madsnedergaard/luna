import { ipcRenderer } from "electron";
import { connect } from "react-redux";
import { compose } from "redux";
import { APP_MODES } from "constants/AppConstants";
import { withStyles } from "material-ui/styles";
import * as packagesActions from "actions/packagesActions";
import { packagesListStyles } from "../styles";
import { autoBind } from "../../utils";
import React from "react";
import Divider from "material-ui/Divider";
import Avatar from "material-ui/Avatar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import Chip from "material-ui/Chip";
import Menu, { MenuItem } from "material-ui/Menu";
import MoreVertIcon from "material-ui-icons/MoreVert";

const ITEM_HEIGHT = 48;

class ListHeader extends React.Component {
  constructor() {
    super();
    this._anchorEl = null;
    autoBind(["handleClick", "handleClose"], this);
  }
  handleClick(e) {
    this._anchorEl = e.currentTarget;
    this.forceUpdate();
  }
  handleClose() {
    this._anchorEl = null;
    this.forceUpdate();
  }
  render() {
    const { classes, total, mode, directory, title } = this.props;
    const anchorEl = this._anchorEl;

    return (
      <section className={classes.flexColumn}>
        <div className={classes.flexRow}>
          <h3 className={classes.heading}>{title}</h3>
          <Avatar className={classes.avatar} color="secondary">
            {total}
          </Avatar>
          <div style={{ marginLeft: "auto" }}>
            <IconButton
              aria-label="More"
              aria-owns={anchorEl ? "long-menu" : null}
              aria-haspopup="true"
              onClick={this.handleClick}
              className={classes.iconbutton}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: 200
                }
              }}
            >
              <MenuItem key="sort-a" onClick={(e) => console.log(e)}>
                Sort by outdated
              </MenuItem>
            </Menu>
          </div>
          <Divider />
        </div>
        <div className={classes.flexRow} style={{ display: "none" }}>
          <Chip label={mode} className={classes.chip} />
          <Typography align="right" paragraph type="subheading" className={classes.directory}>
            {directory}
          </Typography>
        </div>
        <Divider />
      </section>
    );
  }
}

export default withStyles(packagesListStyles)(ListHeader);